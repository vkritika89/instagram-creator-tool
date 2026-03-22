# 🧪 Testing Guide - Login & Signup

## ✅ What's Ready

- ✅ Supabase configured
- ✅ Database tables created
- ✅ Frontend environment variables set
- ✅ Authentication code ready

## 🚀 How to Test

### Step 1: Start the Frontend Server

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 2: Open Your Browser

Visit: **http://localhost:5173**

### Step 3: Test Signup

1. Click **"Sign up free"** or navigate to `/signup`
2. Fill in:
   - **Email**: Use a real email (e.g., `test@example.com`)
   - **Password**: At least 6 characters
3. Click **"Create free account"**
4. **Expected Result**:
   - ✅ Success message: "Account created!"
   - ✅ Redirected to `/onboarding` (if email confirmation is disabled)
   - OR
   - ✅ Message: "Check your email to confirm" (if email confirmation is enabled)

### Step 4: Complete Onboarding

After signup, you'll be redirected to onboarding:

1. **Step 1**: Select your niche, goal, and posting style
2. **Step 2**: Enter target audience details (optional)
3. Click **"Complete Setup"**
4. **Expected Result**:
   - ✅ Success message
   - ✅ Redirected to `/dashboard`

### Step 5: Test Login

1. Click **"Logout"** (if logged in) or go to `/login`
2. Enter your email and password
3. Click **"Sign in"**
4. **Expected Result**:
   - ✅ Success message: "Welcome back!"
   - ✅ Redirected to `/dashboard`

### Step 6: Test Google OAuth (Optional)

1. On login page, click **"Continue with Google"**
2. **Expected Result**:
   - ✅ Redirected to Google login
   - ✅ After authorizing, redirected back to `/dashboard`

**Note**: Google OAuth requires additional setup in Supabase (see `SUPABASE_SETUP.md`)

## 🐛 Troubleshooting

### "Supabase not configured" error?
- Check that `frontend/.env` exists and has correct values
- Restart the dev server after creating `.env`

### "Table doesn't exist" error?
- Verify tables were created in Supabase Table Editor
- Check that you ran the schema.sql successfully

### "Email confirmation required"?
- Go to Supabase Dashboard → Authentication → Settings
- Toggle "Enable email confirmations" OFF (for testing)
- OR check your email for confirmation link

### Can't see onboarding?
- Make sure you completed signup
- Check browser console for errors
- Verify `creator_profiles` table exists

### Login not working?
- Verify email/password are correct
- Check if email confirmation is required
- Look at browser console for error messages

## ✅ Success Checklist

- [ ] Frontend server starts without errors
- [ ] Can access login page at `/login`
- [ ] Can access signup page at `/signup`
- [ ] Can create account with email/password
- [ ] Can complete onboarding
- [ ] Can log in with created account
- [ ] Can access dashboard after login
- [ ] Can log out

## 🎉 What You Can Do After Login

Once logged in, you can:
- ✅ Generate Reel Scripts
- ✅ Generate Captions & Hashtags
- ✅ Generate Videos (when backend is set up)
- ✅ View your profile in Settings
- ✅ Edit your creator profile

---

**Ready to test?** Start the frontend server and visit `http://localhost:5173`!

