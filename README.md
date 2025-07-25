# Multi-AI Viewer

A full-stack app that queries multiple free AI models using Hugging Face and Ollama.

## 🔧 Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
node server.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Ollama

```bash
ollama run llama3
```

## 🌐 Local URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Ollama: http://localhost:11434

## 📦 Built With

- React + Vite
- Tailwind CSS
- Node.js + Express
- Hugging Face Inference API
- Ollama (for local LLMs)
