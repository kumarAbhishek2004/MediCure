# MediCure Quick Reference Guide

## 🚀 Quick Start Commands

### First Time Setup (Windows)
```bash
setup.bat
```

### First Time Setup (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh
```

### Start Application (Windows)
```bash
start.bat
```

### Start Backend Only
```bash
cd backend
venv\Scripts\activate    # Windows
source venv/bin/activate  # Linux/Mac
python main.py
```

### Start Frontend Only
```bash
cd frontend
npm run dev
```

---

## 📦 Installation Commands

### Backend Dependencies
```bash
pip install fastapi uvicorn torch transformers google-generativeai pandas joblib
```

### Frontend Dependencies
```bash
npm install react react-dom react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer vite
```

---

## 🔧 Development Commands

### Backend
```bash
# Run development server
uvicorn main:app --reload

# Run on custom port
uvicorn main:app --port 8080

# Run with more workers
uvicorn main:app --workers 4
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

---

## 📡 API Endpoints

```
GET  /                          # API status
GET  /api/health                # Health check
POST /api/medicine/usage        # Predict usage
POST /api/medicine/side-effects # Get side effects
POST /api/medicine/substitutes  # Get substitutes
POST /api/remedies/search       # Search remedies
POST /api/chat                  # Chat with AI
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📂 Important File Locations

```
Models:         backend/*.pkl
Remedies Data:  backend/Home Remedies.csv
API Routes:     backend/main.py
Frontend Pages: frontend/src/pages/
Components:     frontend/src/components/
API Service:    frontend/src/services/api.js
```

---

## 🐛 Common Issues & Solutions

### Issue: Port already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Issue: CORS errors
Update `main.py`:
```python
allow_origins=["http://localhost:3000"]
```

### Issue: Models not loading
- Check file paths in `main.py`
- Ensure .pkl files are in backend directory
- Verify sufficient RAM (models are large)

### Issue: Gemini API not working
- Verify API key in `.env`
- Check API quota/limits
- Ensure internet connection

---

## 🧪 Testing API with curl

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Predict Usage
```bash
curl -X POST http://localhost:8000/api/medicine/usage \
  -H "Content-Type: application/json" \
  -d '{"medicine_name": "Aspirin"}'
```

### Search Remedies
```bash
curl -X POST http://localhost:8000/api/remedies/search \
  -H "Content-Type: application/json" \
  -d '{"disease": "cold"}'
```

### Chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache", "chat_history": []}'
```

---

## 📦 Dependencies Overview

### Backend Core
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `torch` - Deep learning
- `transformers` - BERT models
- `google-generativeai` - Gemini AI

### Frontend Core
- `react` - UI library
- `vite` - Build tool
- `tailwindcss` - Styling
- `axios` - HTTP client
- `react-router-dom` - Routing

---

## 🔄 Update Dependencies

### Backend
```bash
pip install --upgrade -r requirements.txt
```

### Frontend
```bash
npm update
```

---

## 🗂️ Project Structure (Simple View)

```
medicure-fullstack/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── *.pkl                # ML models
│   └── Home Remedies.csv    # Data
│
└── frontend/
    ├── src/
    │   ├── pages/           # React pages
    │   ├── components/      # React components
    │   └── services/        # API calls
    └── package.json         # Dependencies
```

---

## 💡 Tips & Best Practices

1. **Always activate virtual environment** before running backend
2. **Keep API key secure** - never commit .env files
3. **Use environment variables** for configuration
4. **Check API docs** at `/docs` for testing
5. **Clear browser cache** if seeing old frontend
6. **Monitor console** for errors during development
7. **Test API endpoints** before frontend integration
8. **Use React DevTools** for debugging components

---

## 📞 Getting Help

1. Check `README.md` for detailed setup
2. See `API_DOCUMENTATION.md` for API details
3. Read `DEPLOYMENT.md` for deployment help
4. Review `PROJECT_STRUCTURE.md` for architecture

---

## 🎯 Quick Checklist

Before starting development:
- [ ] Models copied to backend folder
- [ ] Virtual environment created
- [ ] Dependencies installed (backend & frontend)
- [ ] .env file created with API key
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] No CORS errors in browser console

---

## 🚀 Deployment Checklist

- [ ] Update CORS origins for production
- [ ] Set production environment variables
- [ ] Build frontend (`npm run build`)
- [ ] Test all API endpoints
- [ ] Set up SSL/HTTPS
- [ ] Configure domain names
- [ ] Set up monitoring
- [ ] Create backups of models
- [ ] Document production URLs

---

## 📊 Performance Tips

### Backend
- Use model caching (already implemented)
- Consider model quantization
- Implement request queuing
- Add response caching

### Frontend
- Use React.memo for heavy components
- Implement code splitting
- Lazy load routes
- Optimize images

---

## 🔐 Security Checklist

- [ ] API keys in environment variables
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] HTTPS enabled
- [ ] Dependencies up to date
- [ ] Error messages don't leak sensitive info

---

## 📈 Monitoring

### What to Monitor
- API response times
- Model inference times
- Error rates
- Server CPU/Memory usage
- API call counts
- User activity

### Tools
- Backend: Sentry, New Relic
- Frontend: Google Analytics, LogRocket
- Uptime: UptimeRobot

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Change API URL
Update `frontend/.env`:
```env
VITE_API_URL=https://your-api-url.com
```

### Add New Model
1. Add model loading in `main.py`
2. Create new endpoint
3. Update frontend API service
4. Create UI component

---

This quick reference should help you get started and troubleshoot common issues!
