# Supabase Setup Guide for CreatorCanvas

This guide will help you set up Supabase authentication (email/password and Google OAuth) for CreatorCanvas.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Google Cloud project (for Google OAuth)

## 🚀 Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: CreatorCanvas (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project" (takes 1-2 minutes)

## 🔑 Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

3. Copy these values - you'll need them for your `.env` files

## 🗄️ Step 3: Set Up Database Tables

1. In your Supabase project, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" (or press `Cmd/Ctrl + Enter`)
5. Verify the tables were created by going to **Table Editor** - you should see:
   - `creator_profiles`
   - `weekly_plans`
   - `reel_scripts`
   - `captions`

## 🔐 Step 4: Configure Email Authentication

1. Go to **Authentication** → **Providers**
2. Under **Email**, make sure it's enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize the "Confirm signup" and "Reset password" templates if desired

### Email Confirmation Settings

- **Confirm email**: You can enable/disable this in **Authentication** → **Settings**
  - If enabled: Users must confirm email before logging in
  - If disabled: Users can log in immediately after signup

## 🌐 Step 5: Set Up Google OAuth

### 5.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: CreatorCanvas (or your app name)
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for local development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback`
     - Replace `YOUR_SUPABASE_PROJECT_ID` with your actual Supabase project ID (found in your project URL)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### 5.2 Configure Google OAuth in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Google provider**
4. Enter:
   - **Client ID (for OAuth)**: Your Google Client ID
   - **Client Secret (for OAuth)**: Your Google Client Secret
5. Click **Save**

### 5.3 Add Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:5173` (for dev) or your production URL
   - **Redirect URLs**: Add:
     - `http://localhost:5173/dashboard`
     - `http://localhost:5173/**` (for all routes)
     - Your production URLs if deploying

## 📝 Step 6: Configure Environment Variables

### Frontend (`.env` file in `frontend/` directory)

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:3000
```

### Backend (`.env` file in `backend/` directory)

Create `backend/.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=your-openai-api-key-here
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Important**: Never commit `.env` files to Git! They're already in `.gitignore`.

## ✅ Step 7: Test the Integration

1. **Start your development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Test Email Signup**:
   - Go to `http://localhost:5173/signup`
   - Create an account with email/password
   - Check your email for confirmation (if enabled)
   - Try logging in

3. **Test Google OAuth**:
   - Go to `http://localhost:5173/login`
   - Click "Continue with Google"
   - You should be redirected to Google login
   - After authorizing, you'll be redirected back to `/dashboard`

4. **Test Forgot Password**:
   - On login page, click "Forgot password?"
   - Enter your email
   - Check your email for reset link

## 🔒 Security Best Practices

1. **Never expose your service_role key** in frontend code
2. **Use Row Level Security (RLS)** in Supabase:
   - Go to **Authentication** → **Policies**
   - Create policies to restrict data access by user
3. **Enable email confirmation** in production
4. **Use HTTPS** in production (required for OAuth)

## 🐛 Troubleshooting

### Google OAuth not working?

1. **Check redirect URI**: Must match exactly in Google Console
2. **Check Supabase redirect URL**: Must include your domain
3. **Check browser console** for errors
4. **Verify Client ID/Secret** are correct in Supabase

### Email not sending?

1. Check **Authentication** → **Settings** → **SMTP Settings**
2. Supabase uses their own SMTP by default (limited)
3. For production, configure custom SMTP (SendGrid, Mailgun, etc.)

### Database errors?

1. Verify tables exist in **Table Editor**
2. Check **SQL Editor** for any errors
3. Ensure RLS policies allow access (or disable RLS for testing)

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 You're Done!

Your Supabase authentication is now set up. Users can:
- ✅ Sign up with email/password
- ✅ Sign in with email/password
- ✅ Sign in with Google
- ✅ Reset forgotten passwords
- ✅ Access protected routes

Happy coding! 🚀

