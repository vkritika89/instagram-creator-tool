# 🔧 Fix: Google OAuth Redirect URI Error

## ❌ Error You're Seeing

```
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
redirect_uri=https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback
```

This means the redirect URI is **not registered** in Google Cloud Console.

## ✅ Quick Fix (5 Steps)

### Step 1: Open Google Cloud Console

Go to: https://console.cloud.google.com/

### Step 2: Select Your Project

1. Click the project dropdown at the top
2. Select your project (or create one if needed)

### Step 3: Go to OAuth Credentials

1. Click **"APIs & Services"** in the left menu
2. Click **"Credentials"**
3. Find your **OAuth 2.0 Client ID** (or create one if you don't have it)
4. Click on it to edit

### Step 4: Add Redirect URI

1. Scroll down to **"Authorized redirect URIs"**
2. Click **"+ ADD URI"**
3. Enter this **EXACT** URI:
   ```
   https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback
   ```
4. **Important**: 
   - Must be **exactly** this URL
   - No trailing slashes
   - Must be `https://` (not `http://`)
   - Must match exactly as shown above

### Step 5: Save

1. Click **"SAVE"** at the bottom
2. Wait a few seconds for changes to propagate

## 🎯 Complete Setup (If Creating New OAuth Client)

If you don't have OAuth credentials yet:

### 1. Create OAuth Client ID

1. Google Cloud Console → APIs & Services → Credentials
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen first:
   - User Type: **External** (for testing)
   - App name: **CreatorCanvas**
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Scopes: Click **Save and Continue**
   - Test users: Add your email, click **Save and Continue**

### 2. Create OAuth Client

1. Application type: **Web application**
2. Name: **CreatorCanvas** (or any name)
3. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   ```
   (Add your production URL later if needed)

4. **Authorized redirect URIs**:
   ```
   https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback
   ```

5. Click **"Create"**

### 3. Copy Credentials

1. Copy the **Client ID**
2. Copy the **Client Secret**
3. Keep these safe!

### 4. Add to Supabase

1. Go to: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. **Authentication** → **Providers** → **Google**
3. Toggle **"Enable Google provider"** ON
4. Paste **Client ID**
5. Paste **Client Secret**
6. Click **Save**

## ✅ Test After Fix

1. Wait 1-2 minutes for Google to update
2. Go to your app: `http://localhost:5173/login`
3. Click **"Continue with Google"**
4. Should redirect to Google login (not show error)

## 🐛 Still Not Working?

### Check These:

1. **Redirect URI matches EXACTLY**
   - Must be: `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
   - No extra characters, spaces, or slashes

2. **OAuth Consent Screen configured**
   - Google Cloud Console → APIs & Services → OAuth consent screen
   - Must be configured before creating OAuth client

3. **Client ID and Secret correct**
   - Check in Supabase → Authentication → Providers → Google
   - Should match Google Cloud Console

4. **Wait a few minutes**
   - Google changes can take 1-2 minutes to propagate

## 📋 Quick Checklist

- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Redirect URI added: `https://ayfbwefxykfxucfxkowi.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret added to Supabase
- [ ] Google provider enabled in Supabase
- [ ] Waited 1-2 minutes after changes

---

**The redirect URI must be added to Google Cloud Console!**

