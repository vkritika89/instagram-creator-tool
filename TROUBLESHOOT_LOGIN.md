# 🔍 Troubleshooting Login Issues

## Issue: Users can't login even though they're in Supabase

### Common Causes:

1. **Email Confirmation Required**
   - Supabase might require email confirmation before login
   - Users need to click confirmation link in email

2. **Password Mismatch**
   - Password might be different than expected
   - Try resetting password

3. **Email Format Issues**
   - Check if email is stored correctly in Supabase
   - Verify email matches exactly (case-sensitive)

4. **User Status in Supabase**
   - Check if user is "confirmed" in Supabase
   - Check if user is "active"

## 🔧 Quick Fixes

### Fix 1: Disable Email Confirmation (for testing)

1. Go to: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. Click **Authentication** → **Settings**
3. Find **"Enable email confirmations"**
4. **Toggle it OFF** (for testing)
5. Click **Save**

This allows users to login immediately after signup.

### Fix 2: Check User Status in Supabase

1. Go to: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. Click **Authentication** → **Users**
3. Find your test users
4. Check:
   - **Email confirmed?** (should be green checkmark)
   - **User status** (should be "Active")
   - **Email address** (verify it's correct)

### Fix 3: Reset User Password

If password is wrong:

1. In Supabase → Authentication → Users
2. Click on the user
3. Click **"Reset password"** or **"Send password reset email"**
4. User will get email to reset password

### Fix 4: Check Browser Console

1. Open browser console (F12)
2. Try to login
3. Look for error messages
4. Common errors:
   - "Invalid login credentials" - wrong email/password
   - "Email not confirmed" - need to confirm email
   - "User not found" - user doesn't exist

## 🧪 Test Login Flow

### Step 1: Create New Test User

1. Go to `/signup`
2. Use a fresh email (e.g., `test@example.com`)
3. Create account
4. Try logging in immediately

### Step 2: Check Supabase Users Table

1. Supabase → Authentication → Users
2. Verify user appears
3. Check if "Email confirmed" is checked

### Step 3: Try Login

1. Go to `/login`
2. Enter email and password
3. Check console for errors

## 🔐 Common Login Errors

### "Invalid login credentials"
- **Cause**: Wrong email or password
- **Fix**: Reset password or check credentials

### "Email not confirmed"
- **Cause**: Email confirmation required
- **Fix**: 
  - Disable email confirmation in Supabase settings, OR
  - User needs to click confirmation link in email

### "User not found"
- **Cause**: User doesn't exist in Supabase
- **Fix**: Create account first via signup

### "Too many requests"
- **Cause**: Too many failed login attempts
- **Fix**: Wait a few minutes, then try again

## ✅ Quick Checklist

- [ ] Email confirmation disabled (for testing)
- [ ] User exists in Supabase → Authentication → Users
- [ ] User email is confirmed (green checkmark)
- [ ] User status is "Active"
- [ ] Password is correct
- [ ] No errors in browser console
- [ ] Supabase URL and keys are correct in `.env`

## 🚀 Recommended: Disable Email Confirmation for Testing

**For development/testing**, disable email confirmation:

1. Supabase → Authentication → Settings
2. Toggle **"Enable email confirmations"** OFF
3. Save

This allows immediate login after signup.

---

**Check the browser console (F12) for specific error messages!**

