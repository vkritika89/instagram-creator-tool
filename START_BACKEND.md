# 🚀 How to Start the Backend

## Current Status

❌ **Backend is NOT running**

## Quick Start

### Option 1: Start Backend (Terminal 1)

```bash
cd backend
npm install  # if not done already
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:3000
```

### Option 2: Check if Backend is Running

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-..."}
```

## 📋 What Backend Does

The backend is needed for:
- ✅ Reel script generation (AI)
- ✅ Caption generation (AI)
- ✅ Video generation (when implemented)
- ✅ Weekly plan generation (AI)
- ✅ Dashboard stats API

**Note:** Login/Signup works WITHOUT backend (uses Supabase directly)

## 🔧 Troubleshooting

### "Port 3000 already in use"
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process or change PORT in backend/.env
```

### "Cannot find module" errors
```bash
cd backend
npm install
```

### "OPENAI_API_KEY not found"
- Backend will start but AI features won't work
- Add your OpenAI key to `backend/.env`

## ✅ Quick Checklist

- [ ] Backend directory exists
- [ ] `backend/.env` file exists with Supabase keys
- [ ] `npm install` completed in backend
- [ ] `npm run dev` started
- [ ] Server shows "running on http://localhost:3000"

---

**To start:** Run `cd backend && npm run dev` in a terminal!

