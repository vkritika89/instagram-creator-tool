# 🔑 OpenAI API Key Setup

## ✅ Yes, You Need an OpenAI API Key!

To generate Reel scripts, captions, and weekly plans, you need an OpenAI API key.

## 🚀 Quick Setup

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/
2. Sign up or log in
3. Go to **API Keys**: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Give it a name (e.g., "CreatorCanvas")
6. **Copy the key immediately** (you won't see it again!)

### Step 2: Add to Backend .env

1. Open `backend/.env` file
2. Add or update:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Replace `sk-...` with your actual API key
4. Save the file

### Step 3: Restart Backend

```bash
# Stop the backend (Ctrl+C)
# Then restart
cd backend
npm run dev
```

## 📋 Current .env Structure

Your `backend/.env` should have:

```env
PORT=3000
SUPABASE_URL=https://ayfbwefxykfxucfxkowi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-api-key-here
CORS_ORIGIN=http://localhost:5173
```

## ✅ Test It

After adding the key and restarting:

1. Go to Reel Scripts page
2. Enter an idea
3. Click "Generate script"
4. Should work! (If not, check backend logs)

## 💰 Pricing

OpenAI charges per token used:
- **GPT-4o-mini** (what we use): Very affordable
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens
- A typical Reel script generation costs **~$0.001-0.01** (less than 1 cent)

## 🐛 Troubleshooting

### "API key not found" error
- Check `backend/.env` has `OPENAI_API_KEY=sk-...`
- Make sure no spaces around the `=`
- Restart backend after adding key

### "Invalid API key" error
- Key might be wrong or expired
- Generate a new key from OpenAI dashboard
- Update `.env` and restart

### "Rate limit exceeded"
- You've hit your usage limit
- Check OpenAI dashboard for usage
- Upgrade plan if needed

## 🔒 Security

**Important:**
- Never commit `.env` to git (it's in `.gitignore`)
- Don't share your API key
- Each team member needs their own key for local dev
- For production, use environment variables on your hosting platform

---

**Once you add the API key, all AI features will work!**

