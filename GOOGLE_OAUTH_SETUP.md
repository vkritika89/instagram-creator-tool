# 🔐 Google OAuth Setup Guide

## ✅ Current Implementation

Google login is **already implemented** in the code:
- ✅ `signInWithGoogle()` function in AuthContext
- ✅ "Continue with Google" buttons on Login and Signup pages
- ✅ OAuth callback handling
- ✅ Automatic redirect after Google login

## 🚀 How It Works

1. User clicks "Continue with Google"
2. Redirects to Google login page
3. User authorizes the app
4. Google redirects back to your app
5. Supabase handles the OAuth callback
6. User is automatically logged in
7. Redirected to `/dashboard` (or `/onboarding` if no profile)

## ⚙️ Setup Required in Supabase

### Step 1: Enable Google Provider

1. Go to: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle **Enable Google provider** ON

### Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: CreatorCanvas
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
     - This is your Supabase OAuth callback URL
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 3: Add Credentials to Supabase

1. Back in Supabase, go to **Authentication** → **Providers** → **Google**
2. Enter:
   - **Client ID (for OAuth)**: Your Google Client ID
   - **Client Secret (for OAuth)**: Your Google Client Secret
3. Click **Save**

### Step 4: Configure Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:5173` (or your production URL)
   - **Redirect URLs**: Add:
     - `http://localhost:5173/dashboard`
     - `http://localhost:5173/**`
     - Your production URLs if deploying

## ✅ Testing Google Login

### Test Flow:

1. **Start your frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Go to login page**: `http://localhost:5173/login`

3. **Click "Continue with Google"**

4. **Expected behavior**:
   - Redirects to Google login
   - After authorizing, redirects back to your app
   - Automatically logged in
   - Redirected to `/dashboard` or `/onboarding`

## 🐛 Troubleshooting

### "Google OAuth not configured" error?
- Make sure Google provider is enabled in Supabase
- Check that Client ID and Secret are entered correctly

### Redirect loop or "redirect_uri_mismatch"?
- Verify redirect URI in Google Console matches exactly:
  - `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
- Check Supabase URL Configuration has your site URL

### User not being logged in after Google auth?
- Check browser console for errors
- Verify `onAuthStateChange` is handling the callback
- Check Supabase logs in Dashboard → Logs

### "Provider not enabled" error?
- Go to Supabase → Authentication → Providers
- Make sure Google is toggled ON

## 📋 Quick Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Redirect URI added: `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs added in Supabase

## 🎉 Once Configured

Google login will work automatically! Users can:
- ✅ Click "Continue with Google" on login page
- ✅ Click "Continue with Google" on signup page
- ✅ Be automatically logged in after Google authorization
- ✅ Complete onboarding if first time user
- ✅ Access dashboard immediately

---

**The code is ready!** Just need to configure Google OAuth in Supabase and Google Cloud Console.

