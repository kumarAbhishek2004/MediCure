# MediCure Project Structure

```
medicure-fullstack/
│
├── backend/                          # FastAPI Backend
│   ├── main.py                       # Main FastAPI application
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .env                          # Actual environment variables (gitignored)
│   ├── .gitignore                    # Backend gitignore
│   │
│   ├── bert_finetuned_model_prediction.pkl      # Medicine usage prediction model
│   ├── bert_finetuned_model_sideffects.pkl      # Side effects prediction model
│   ├── bert_finetuned_model_substitute.pkl      # Substitutes prediction model
│   ├── label_encoder_prediction.pkl             # Label encoder for predictions
│   ├── label_encoder_sideeffects.pkl            # Label encoder for side effects
│   ├── label_encoder_substitute.pkl             # Label encoder for substitutes
│   ├── Home Remedies.csv                        # Home remedies database
│   │
│   └── venv/                         # Python virtual environment (gitignored)
│
├── frontend/                         # React Frontend
│   ├── public/                       # Public assets
│   │
│   ├── src/                          # Source code
│   │   ├── components/               # React components
│   │   │   └── Layout.jsx            # Main layout component with navigation
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.jsx              # Home page
│   │   │   ├── MedicinePrediction.jsx # Medicine prediction page
│   │   │   ├── HomeRemedies.jsx      # Home remedies page
│   │   │   └── Chatbot.jsx           # AI chatbot page
│   │   │
│   │   ├── services/                 # API services
│   │   │   └── api.js                # API client and endpoints
│   │   │
│   │   ├── App.jsx                   # Main App component with routing
│   │   ├── main.jsx                  # Application entry point
│   │   └── index.css                 # Global styles with Tailwind
│   │
│   ├── index.html                    # HTML template
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Frontend gitignore
│   │
│   └── node_modules/                 # Node modules (gitignored)
│
├── README.md                         # Main project documentation
├── API_DOCUMENTATION.md              # API endpoint documentation
├── DEPLOYMENT.md                     # Deployment guide
├── PROJECT_STRUCTURE.md              # This file
│
├── setup.bat                         # Windows setup script
├── setup.sh                          # Linux/Mac setup script
└── start.bat                         # Windows start script

```

## File Descriptions

### Backend Files

#### `main.py`
- FastAPI application with CORS middleware
- Model loading and caching
- API endpoints for medicine prediction, remedies, and chatbot
- Integrates BERT models and Google Gemini AI

#### `requirements.txt`
- FastAPI, Uvicorn for web server
- PyTorch, Transformers for ML models
- Google Generative AI for chatbot
- Pandas for data processing

#### Model Files (`.pkl`)
- Pre-trained BERT models fine-tuned for healthcare predictions
- Label encoders for decoding model outputs
- Large files (100MB+) - may need Git LFS

#### `Home Remedies.csv`
- Database of 144+ traditional remedies
- Includes health issues, remedies, and yoga pose links

---

### Frontend Files

#### Components

**`Layout.jsx`**
- Navigation bar with routing
- Responsive design
- Active link highlighting

#### Pages

**`Home.jsx`**
- Landing page with feature cards
- Overview of application capabilities
- Links to main features

**`MedicinePrediction.jsx`**
- Input for medicine name
- Three prediction buttons (usage, side effects, substitutes)
- Results display with color-coded sections

**`HomeRemedies.jsx`**
- Search interface for health conditions
- Display remedies with yoga pose links
- Responsive grid layout

**`Chatbot.jsx`**
- Chat interface with message history
- Real-time AI responses
- Scrollable message container
- User and assistant message styling

#### Services

**`api.js`**
- Axios client configuration
- API endpoint functions
- Centralized error handling
- Type-safe API calls

---

### Configuration Files

#### Backend

**`.env`**
```
GEMINI_API_KEY=your_api_key_here
```

#### Frontend

**`vite.config.js`**
- Development server configuration
- Proxy setup for API calls
- Port configuration

**`tailwind.config.js`**
- Custom color scheme
- Content paths for purging
- Theme extensions

---

### Setup Scripts

#### `setup.bat` (Windows)
1. Copies model files from parent directory
2. Creates Python virtual environment
3. Installs backend dependencies
4. Installs frontend dependencies
5. Creates `.env` files

#### `setup.sh` (Linux/Mac)
- Same functionality as `setup.bat`
- Bash script for Unix systems

#### `start.bat` (Windows)
- Starts backend in new terminal
- Starts frontend in new terminal
- Automated dual-server launch

---

## Technology Stack

### Backend
- **Framework**: FastAPI 0.115.6
- **ML Models**: PyTorch 2.7.0, Transformers 4.52.3
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **Data Processing**: Pandas 2.2.3
- **Server**: Uvicorn with ASGI

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.3
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router 6.28.0
- **HTTP Client**: Axios 1.7.9
- **Icons**: Lucide React 0.263.1

---

## Data Flow

```
User Input (Frontend)
    ↓
React Component
    ↓
API Service (axios)
    ↓
FastAPI Endpoint
    ↓
BERT Model / Gemini AI
    ↓
Process & Format Response
    ↓
Return to Frontend
    ↓
Display to User
```

---

## Key Features

1. **Medicine Prediction**
   - BERT-based classification
   - 583 usage categories
   - 1,271 side effect categories
   - 43,297 substitute categories

2. **Home Remedies**
   - CSV-based database
   - Text search functionality
   - Yoga pose recommendations

3. **AI Chatbot**
   - Powered by Gemini 2.0 Flash
   - Context-aware responses
   - Medical disclaimer
   - Chat history tracking

---

## Development Workflow

### Adding New Features

1. **Backend**
   - Add endpoint in `main.py`
   - Update API documentation
   - Test with Postman/curl

2. **Frontend**
   - Create/update component in `src/pages/`
   - Add API call in `src/services/api.js`
   - Update routing in `App.jsx`
   - Style with Tailwind classes

### Testing

**Backend**
```bash
cd backend
pytest  # (if tests are added)
```

**Frontend**
```bash
cd frontend
npm test  # (if tests are added)
```

---

## Future Enhancements

1. User authentication system
2. Save chat history to database
3. Medicine interaction checker
4. Image-based symptom analysis
5. Multi-language support
6. Mobile app (React Native)
7. Doctor appointment booking
8. Prescription management
9. Health tracking dashboard
10. Integration with health APIs

---

## Notes

- Model files are large (100MB+)
- First API call after startup may be slow (model loading)
- Requires active internet for Gemini API
- Not a substitute for professional medical advice
