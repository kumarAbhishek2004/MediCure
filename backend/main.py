from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import torch
import joblib
from transformers import BertTokenizer, BertForSequenceClassification
import google.generativeai as genai
import os
from typing import Optional, List

app = FastAPI(title="MediCure API", version="1.0.0")

# --- CORS CONFIGURATION (Allow all origins for debugging) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL CACHE FOR MODELS ---
models_cache = {}

# --- Pydantic Models ---
class MedicineRequest(BaseModel):
    medicine_name: str

class RemedyRequest(BaseModel):
    disease: str

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[dict]] = []

class RemedyItem(BaseModel):
    remedy: str
    yoga_link: Optional[str] = None

# --- STARTUP: LOAD MODELS & DATA ---
@app.on_event("startup")
async def load_models():
    print("🚀 Loading models and data...")

    try:
        # Load tokenizer
        tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        models_cache["tokenizer"] = tokenizer
        print("✓ Tokenizer loaded")

        # --- Load Fine-tuned Models ---
        def load_model(model_name, num_labels, path):
            try:
                model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=num_labels)
                model.load_state_dict(torch.load(path, map_location="cpu"))
                model.eval()
                return model
            except Exception as e:
                print(f"⚠ Warning: Could not load {model_name} model: {e}")
                return None

        models_cache["pred_model"] = load_model("prediction", 583, "bert_finetuned_model_prediction.pkl")
        models_cache["side_model"] = load_model("side_effects", 1271, "bert_finetuned_model_sideffects.pkl")
        models_cache["sub_model"] = load_model("substitute", 43297, "bert_finetuned_model_substitute.pkl")

        # --- Load Label Encoders ---
        try:
            models_cache["le_pred"] = joblib.load("label_encoder_prediction.pkl")
            models_cache["le_side"] = joblib.load("label_encoder_sideeffects.pkl")
            models_cache["le_sub"] = joblib.load("label_encoder_substitute.pkl")
            print("✓ Label encoders loaded")
        except Exception as e:
            print(f"⚠ Warning: Could not load label encoders: {e}")

        # --- Load Home Remedies Data ---
        try:
            # Try different encodings
            for encoding in ["utf-8", "latin-1", "ISO-8859-1", "cp1252"]:
                try:
                    df = pd.read_csv("Home Remedies.csv", encoding=encoding)
                    print(f"✓ Home Remedies loaded with {encoding} encoding")
                    break
                except UnicodeDecodeError:
                    continue
            
            # Clean and normalize data
            df["Health Issue"] = df["Health Issue"].str.strip().str.lower()
            df["Home Remedy"] = df["Home Remedy"].str.strip()
            df["Yogasan"] = df["Yogasan"].fillna("")
            
            models_cache["remedy_df"] = df
            print(f"✓ Home Remedies loaded ({len(df)} rows)")
            print(f"📋 Sample health issues: {df['Health Issue'].head(10).tolist()}")
            
        except Exception as e:
            print(f"❌ Error loading Home Remedies CSV: {e}")
            # Create empty dataframe as fallback
            models_cache["remedy_df"] = pd.DataFrame(columns=["Health Issue", "Home Remedy", "Yogasan"])

        # --- Configure Gemini AI ---
        api_key = os.getenv("GEMINI_API_KEY", "AIzaSyCy9Y1YAyVmRTMhk8shMrT_3bw6so67Yok")
        try:
            genai.configure(api_key=api_key)
            models_cache["gemini_model"] = genai.GenerativeModel("gemini-2.0-flash-exp")
            print("✓ Gemini AI configured")
        except Exception as e:
            print(f"⚠ Warning: Gemini AI configuration failed: {e}")

        print("✅ All models and data loaded successfully!\n")

    except Exception as e:
        print(f"❌ Error during startup: {e}")
        # Don't raise - allow API to start even if some models fail

# --- UTILITY FUNCTIONS ---
def classify_text(model, tokenizer, label_encoder, text):
    if model is None or tokenizer is None or label_encoder is None:
        return "Model not available"
    
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = logits.argmax(dim=1).item()
    return label_encoder.inverse_transform([predicted_class])[0]

def simplify_remedies_with_gemini(disease: str, remedies: List[str], yoga_links: List[str]) -> List[dict]:
    """Simplify and format database remedies using Gemini AI"""
    try:
        if "gemini_model" not in models_cache or models_cache["gemini_model"] is None:
            print("⚠ Gemini model not available, returning original remedies")
            return [{"remedy": r, "yoga_link": y} for r, y in zip(remedies, yoga_links)]

        # Prepare remedies text
        remedies_text = "\n".join([f"{i+1}. {r}" for i, r in enumerate(remedies)])

        context = f"""
You are a medical content simplifier. I have some home remedies from a traditional database for '{disease}'.
Your task: Rewrite these remedies to be:
- Clear and concise (one sentence each)
- Easy to understand
- Action-oriented (start with verbs like "Drink", "Apply", "Mix", etc.)
- Keep the same meaning and ingredients

Original remedies:
{remedies_text}

Return EXACTLY {len(remedies)} simplified remedies in this format:
1. [simplified remedy 1]
2. [simplified remedy 2]
3. [simplified remedy 3]
...

DO NOT add extra remedies. DO NOT add explanations. Just the numbered list.
"""
        response = models_cache["gemini_model"].generate_content(context)
        text = response.text.strip()
        
        simplified = []
        for line in text.split("\n"):
            clean = line.strip()
            # Remove numbering
            for prefix in ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "1)", "2)", "3)", "4)", "5)", "-", "•", "*"]:
                if clean.startswith(prefix):
                    clean = clean[len(prefix):].strip()
                    break
            
            if len(clean) > 10:
                simplified.append(clean)

        # Match simplified remedies with yoga links
        result = []
        for i, remedy in enumerate(simplified[:len(remedies)]):
            result.append({
                "remedy": remedy,
                "yoga_link": yoga_links[i] if i < len(yoga_links) else None
            })

        # If AI didn't return enough, fill with originals
        while len(result) < len(remedies):
            idx = len(result)
            result.append({
                "remedy": remedies[idx],
                "yoga_link": yoga_links[idx] if idx < len(yoga_links) else None
            })

        print(f"✅ Simplified {len(result)} database remedies using AI")
        return result

    except Exception as e:
        print(f"❌ Error simplifying remedies: {e}")
        # Return original remedies if AI fails
        return [{"remedy": r, "yoga_link": y} for r, y in zip(remedies, yoga_links)]


def get_remedies_from_gemini(disease: str, df: pd.DataFrame) -> List[dict]:
    """Generate AI-based remedies using Gemini (only when no database match)"""
    try:
        if "gemini_model" not in models_cache or models_cache["gemini_model"] is None:
            print("⚠ Gemini model not available, returning default remedies")
            return [{
                "remedy": f"Please consult a healthcare professional for {disease} treatment.",
                "yoga_link": None
            }]

        sample_remedies = df["Home Remedy"].head(5).tolist() if not df.empty else []

        context = f"""
You are a traditional medicine expert.
Here are some example remedies from our database:
{chr(10).join([f"- {r}" for r in sample_remedies[:5]])}

Now, generate exactly 5 practical home remedies for '{disease}' using natural ingredients.
Each remedy should be:
- One clear sentence
- Action-oriented (start with "Drink", "Apply", "Mix", etc.)
- Use common household items
- Be safe and traditional

Format: Just list the remedies numbered 1-5, one per line.
"""
        response = models_cache["gemini_model"].generate_content(context)
        text = response.text.strip()
        
        remedies = []
        for line in text.split("\n"):
            clean = line.strip()
            # Remove numbering
            for prefix in ["1.", "2.", "3.", "4.", "5.", "1)", "2)", "3)", "4)", "5)", "-", "•", "*"]:
                if clean.startswith(prefix):
                    clean = clean[len(prefix):].strip()
                    break
            
            if len(clean) > 10:
                remedies.append({
                    "remedy": clean,
                    "yoga_link": None
                })

        # Ensure exactly 5 remedies
        if len(remedies) < 5:
            remedies.append({
                "remedy": f"Drink plenty of water and rest to help your body recover from {disease}.",
                "yoga_link": None
            })

        return remedies[:5]

    except Exception as e:
        print(f"❌ Error generating AI remedies: {e}")
        return [{
            "remedy": f"Unable to generate remedies. Please consult a healthcare professional for {disease}.",
            "yoga_link": None
        }]

# --- ROUTES ---
@app.get("/")
async def root():
    return {"message": "MediCure API is running", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    remedy_count = len(models_cache.get("remedy_df", [])) if "remedy_df" in models_cache else 0
    return {
        "status": "healthy",
        "models_loaded": len(models_cache) > 0,
        "available_models": list(models_cache.keys()),
        "remedy_count": remedy_count,
    }

# --- Medicine Prediction APIs ---
@app.post("/api/medicine/usage")
async def predict_usage(request: MedicineRequest):
    try:
        if models_cache.get("pred_model") is None:
            raise HTTPException(status_code=503, detail="Prediction model not loaded")
        
        result = classify_text(
            models_cache["pred_model"],
            models_cache["tokenizer"],
            models_cache["le_pred"],
            request.medicine_name,
        )
        return {"usage": result}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in predict_usage: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/medicine/side-effects")
async def predict_side_effects(request: MedicineRequest):
    try:
        if models_cache.get("side_model") is None:
            raise HTTPException(status_code=503, detail="Side effects model not loaded")
        
        effects = classify_text(
            models_cache["side_model"],
            models_cache["tokenizer"],
            models_cache["le_side"],
            request.medicine_name,
        )
        return {"side_effects": [e.strip() for e in effects.split(",")]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in predict_side_effects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/medicine/substitutes")
async def predict_substitutes(request: MedicineRequest):
    try:
        if models_cache.get("sub_model") is None:
            raise HTTPException(status_code=503, detail="Substitute model not loaded")
        
        subs = classify_text(
            models_cache["sub_model"],
            models_cache["tokenizer"],
            models_cache["le_sub"],
            request.medicine_name,
        )
        return {"substitutes": [s.strip() for s in subs.split(",")]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in predict_substitutes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Home Remedies Endpoint ---
@app.post("/api/remedies/search")
async def search_remedies(request: RemedyRequest):
    try:
        print(f"\n{'='*50}")
        print(f"🔍 NEW SEARCH REQUEST")
        print(f"Disease input: '{request.disease}'")
        print(f"{'='*50}")
        
        if "remedy_df" not in models_cache:
            raise HTTPException(status_code=500, detail="Remedies database not loaded")

        df = models_cache["remedy_df"]
        term = request.disease.strip().lower()
        print(f"📝 Normalized search term: '{term}'")
        print(f"📊 Total rows in database: {len(df)}")

        # Strategy 1: Exact match
        filtered = df[df["Health Issue"] == term]
        print(f"Strategy 1 (Exact): Found {len(filtered)} matches")

        # Strategy 2: Contains
        if filtered.empty:
            filtered = df[df["Health Issue"].str.contains(term, case=False, na=False, regex=False)]
            print(f"Strategy 2 (Contains): Found {len(filtered)} matches")

        # Strategy 3: Word-based search
        if filtered.empty:
            words = term.split()
            print(f"Strategy 3 (Words): Searching for words: {words}")
            for w in words:
                if len(w) > 2:
                    m = df[df["Health Issue"].str.contains(w, case=False, na=False, regex=False)]
                    if not m.empty:
                        filtered = m
                        print(f"  Found {len(m)} matches for word '{w}'")
                        break

        # --- Return database remedies if found ---
        if not filtered.empty:
            print(f"✅ SUCCESS: Found {len(filtered)} database remedies")
            
            # Extract remedies and yoga links
            original_remedies = []
            yoga_links = []
            
            for idx, row in filtered.iterrows():
                remedy_text = str(row["Home Remedy"]).strip()
                original_remedies.append(remedy_text)
                
                yoga_link = str(row["Yogasan"]) if pd.notna(row["Yogasan"]) and str(row["Yogasan"]).strip() else None
                yoga_links.append(yoga_link)
                
                print(f"  Original remedy {len(original_remedies)}: {remedy_text[:50]}...")

            # Simplify remedies using Gemini AI
            print("🤖 Sending database remedies to Gemini for simplification...")
            simplified_remedies = simplify_remedies_with_gemini(request.disease, original_remedies, yoga_links)

            response = {
                "disease": request.disease,
                "source": "database",
                "remedies": simplified_remedies,
                "total_count": len(simplified_remedies),
            }
            print(f"📤 Sending response with {len(simplified_remedies)} simplified remedies")
            return response

        # --- Otherwise use AI ---
        print("⚠️  No database match found, generating AI remedies...")
        ai_remedies = get_remedies_from_gemini(request.disease, df)
        print(f"🤖 Generated {len(ai_remedies)} AI remedies")

        response = {
            "disease": request.disease,
            "source": "ai_generated",
            "remedies": ai_remedies,
            "total_count": len(ai_remedies),
        }
        print(f"📤 Sending AI response")
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ ERROR in search_remedies: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- Chat with Gemini AI ---
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if "gemini_model" not in models_cache or models_cache["gemini_model"] is None:
            raise HTTPException(status_code=503, detail="Gemini AI not configured")

        context = """
        You are an AI medical assistant (not a doctor).
        Provide:
        - Likely diseases (max 2)
        - Suggested diet
        - Recommended workouts
        - Precautions
        End with: "Consult a doctor for professional advice."
        """

        prompt = f"{context}\n\nUser's query: {request.message}"
        response = models_cache["gemini_model"].generate_content(prompt)
        return {"response": response.text.strip()}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Run the API ---
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MediCure API on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)