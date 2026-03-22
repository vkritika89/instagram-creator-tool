# 🔍 Debugging Login Issues - Email Confirmed But Can't Login

## ✅ Email is Confirmed - What Else Could Be Wrong?

### Issue 1: Password Not Set (Most Common)

If users were **manually added** in Supabase, they might not have passwords set.

**Check:**
1. Go to Supabase → Authentication → Users
2. Click on the user
3. Check if there's a password hash
4. If no password, you need to set one

**Fix:**
- Option A: Use "Send password reset email" in Supabase
- Option B: User should use "Forgot password" on login page
- Option C: Create new user via signup (they'll have password)

### Issue 2: Wrong Password

**Test:**
1. Try "Forgot password" on login page
2. Enter the user's email
3. Check email for reset link
4. Set new password
5. Try login with new password

### Issue 3: Check Exact Error Message

**Important:** Check browser console for exact error:

1. Open browser console (F12)
2. Go to Console tab
3. Try to login
4. Look for error message

Common errors:
- `"Invalid login credentials"` → Wrong password
- `"Email not confirmed"` → Even if confirmed, might be cached
- `"User not found"` → User doesn't exist
- `"Too many requests"` → Rate limited

### Issue 4: User Created Manually Without Password

If users were added directly in Supabase dashboard:
- They might not have passwords
- Need to send password reset email

**Solution:**
1. Supabase → Authentication → Users
2. Click on user
3. Click "Send password reset email"
4. User checks email and sets password
5. Then they can login

### Issue 5: Email Case Sensitivity

Supabase email matching might be case-sensitive in some cases.

**Test:**
- Try email in all lowercase
- Try exact case as stored in Supabase

## 🧪 Quick Test

### Test 1: Create Fresh User
1. Go to `/signup`
2. Create new account with email/password
3. Try logging in immediately
4. Does this work? → If yes, issue is with existing users

### Test 2: Reset Password
1. On login page, click "Forgot password?"
2. Enter user's email
3. Check email for reset link
4. Set new password
5. Try login

### Test 3: Check Supabase User Details
1. Supabase → Authentication → Users
2. Click on the user
3. Check:
   - Email: Is it correct?
   - Email confirmed: ✅ (you said yes)
   - Last sign in: When did they last login?
   - Created at: When was account created?
   - Password hash: Does it exist?

## 🔧 Most Likely Fix

**If users were manually added in Supabase:**

1. Go to Supabase → Authentication → Users
2. Click on each user
3. Click **"Send password reset email"** or **"Reset password"**
4. User receives email
5. User sets password via email link
6. User can now login

**OR**

1. User goes to login page
2. Clicks "Forgot password?"
3. Enters email
4. Receives reset email
5. Sets password
6. Can login

## 📋 Checklist

- [ ] Email is confirmed ✅ (you confirmed this)
- [ ] Password is set (check in Supabase)
- [ ] Password is correct (try reset)
- [ ] No errors in browser console
- [ ] User exists in Supabase
- [ ] Email matches exactly (case-sensitive)

## 🚨 Next Step

**Check browser console (F12) when trying to login and share the exact error message!**

This will tell us exactly what's wrong.

