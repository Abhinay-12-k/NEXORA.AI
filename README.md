# Nexora AI - Smart Internship Performance Analyzer

Nexora AI is a comprehensive full-stack solution for monitoring, evaluating, and improving internship performance using AI-driven insights and predictive analytics (HireIndex™).

## 🚀 Features

- **Intern Dashboard**: Real-time tracking of tasks, performance metrics, and AI coaching.
- **Admin/Mentor Dashboard**: Resource management, task assignment, and hiring analytics.
- **HireIndex™**: Predictive engine for engineering readiness and full-time conversion.
- **AI Coach**: Automated feedback generation using Groq/Llama 3.1.
- **Learning Hub**: Resource management for intern growth.
- **Leaderboard**: Gamified performance tracking.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI**: Groq API (Llama 3.1), OpenAI.
- **Deployment**: Optimized for Render/Vercel/DigitalOcean.

## 📦 Project Structure

```text
NexoraAI/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── api.js     # Centralized API configuration
│   │   └── ...
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── modules/   # Feature-based modular structure
│   │   └── ...
│   └── server.js      # Main entry point
└── .gitignore         # Production-ready git ignores
```

## 🌐 Production Deployment (Render)

### 1. Backend Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Environment Variables**:
  - `PORT`: 5000 (standard)
  - `MONGO_URI`: Your MongoDB connection string
  - `JWT_SECRET`: A strong secret key
  - `GROQ_API_KEY`: Your Groq API key (for AI Coach)

### 2. Frontend Service (Static Site)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your backend service URL (e.g., `https://your-backend.onrender.com/api`)

## 🔧 Local Development

1. Clone the repository.
2. **Backend**:
   - `cd backend`
   - Create `.env` with `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`.
   - `npm install`
   - `npm run dev`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## 🛡️ Security
- Environment-based configuration (no secrets in code).
- Centralized API URL management.
- Proper CORS handling.
- Production-grade `.gitignore`.

---
Built with ❤️ by [Your Name/Team]
