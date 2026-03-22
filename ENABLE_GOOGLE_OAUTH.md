# 🔧 Fix: Enable Google OAuth in Supabase

## ❌ Error You're Seeing

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means **Google provider is not enabled** in your Supabase project.

## ✅ Quick Fix (3 Steps)

### Step 1: Go to Supabase Dashboard

1. Open: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. In the left sidebar, click **Authentication**
3. Click **Providers** (under Authentication)

### Step 2: Enable Google Provider

1. Scroll down to find **Google** in the list of providers
2. Click on **Google** to expand it
3. Toggle the switch to **Enable Google provider** (turn it ON)
4. You'll see fields appear for Client ID and Client Secret

### Step 3: Add Google Credentials (If You Have Them)

If you already have Google OAuth credentials:
1. Enter your **Client ID** (from Google Cloud Console)
2. Enter your **Client Secret** (from Google Cloud Console)
3. Click **Save**

**If you don't have credentials yet**, you can:
- Option A: Enable Google provider first (leave credentials empty for now)
- Option B: Get credentials first (see below)

## 🚀 Getting Google OAuth Credentials (If Needed)

### Quick Setup:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create/Select Project**
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - **Authorized redirect URIs**: 
     ```
     https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback
     ```
   - Click "Create"
5. **Copy Client ID and Client Secret**

### Add to Supabase:

1. Back in Supabase → Authentication → Providers → Google
2. Paste **Client ID** and **Client Secret**
3. Click **Save**

## ✅ Test After Enabling

1. Refresh your app: `http://localhost:5173/login`
2. Click "Continue with Google"
3. Should redirect to Google login (not show error)

## 🐛 Still Not Working?

### Check These:

1. **Provider enabled?**
   - Supabase → Authentication → Providers → Google
   - Toggle should be ON (green/enabled)

2. **Credentials correct?**
   - Client ID and Secret should be from Google Cloud Console
   - No extra spaces or characters

3. **Redirect URI matches?**
   - In Google Console, redirect URI must be exactly:
   - `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`

4. **Site URL configured?**
   - Supabase → Authentication → URL Configuration
   - Site URL should be: `http://localhost:5173`

## 📋 Quick Checklist

- [ ] Google provider toggled ON in Supabase
- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Redirect URI added: `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret added to Supabase
- [ ] Site URL configured in Supabase

---

**The error will go away once you enable the Google provider in Supabase!**

