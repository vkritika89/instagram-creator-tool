# 🔧 Backend Requirements - What Needs Backend vs Supabase

## ✅ Works WITHOUT Backend (Saves to Supabase directly)

These features work even if backend is not running:

- ✅ **Login/Signup** - Uses Supabase Auth directly
- ✅ **Onboarding** - Saves profile to Supabase directly
- ✅ **Settings** - Updates profile in Supabase directly
- ✅ **Viewing dashboard** - Works (stats may show 0)

## ❌ NEEDS Backend Running

These features require the backend to be running:

- ❌ **Weekly Plan Generation** - Calls `/api/weekly-plan/generate`
- ❌ **Reel Script Generation** - Calls `/api/reel-script/generate`
- ❌ **Caption Generation** - Calls `/api/captions/generate`
- ❌ **Video Generation** - Calls `/api/video/generate` (when implemented)
- ❌ **Dashboard Stats** - Calls `/api/stats`

## 🐛 Issue: Continuous Loading

**Problem:** When backend is not running, API calls hang forever.

**Fixed:** Added 10-second timeout to all API calls. Now you'll see:
- Error message: "Request timeout - backend may not be running"
- Loading stops after 10 seconds

## 🚀 How to Start Backend

```bash
cd backend
npm run dev
```

Should see:
```
🚀 Backend server running on http://localhost:3000
```

## ✅ Check if Backend is Running

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2026-..."}
```

## 📋 Quick Checklist

- [ ] Backend running on port 3000?
- [ ] `VITE_API_URL` set in `frontend/.env`?
- [ ] Backend `.env` has Supabase keys?
- [ ] Backend `.env` has OpenAI key (for AI features)?

---

**If you see "Request timeout" errors, start the backend!**

