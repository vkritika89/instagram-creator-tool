# 🔐 Password Reset - Rate Limit Exceeded

## ❌ Error: "Email rate limit exceeded"

Supabase has rate limits on sending emails. You've hit the limit.

## ✅ Alternative Solutions

### Option 1: Wait and Retry (Easiest)

**Wait 1 hour** and try again. Supabase rate limits reset after some time.

### Option 2: Manually Set Password in Supabase (Fastest)

1. Go to: https://app.supabase.com/project/ayfbwefxykfxucfxkowi
2. Click **Authentication** → **Users**
3. Click on the user you want to reset
4. Click **"Reset password"** or **"Send password reset email"** button
   - This might work even if frontend doesn't
5. OR manually set password:
   - Click **"Edit user"** or **"Update user"**
   - Set a temporary password
   - User can login with this password
   - User can change it later in settings

### Option 3: Use Supabase SQL Editor (Advanced)

Run this SQL to set a password directly:

```sql
-- Replace 'user@example.com' with actual email
-- Replace 'newpassword123' with desired password
UPDATE auth.users 
SET encrypted_password = crypt('newpassword123', gen_salt('bf'))
WHERE email = 'user@example.com';
```

**Note:** This requires the password to be hashed. Better to use Supabase UI.

### Option 4: Create New User via Signup

1. Go to `/signup`
2. Create new account with email/password
3. This will work immediately (no email needed)
4. User can login right away

### Option 5: Upgrade Supabase Plan (If Needed)

- Free tier has email rate limits
- Paid plans have higher limits
- For production, consider custom SMTP

## 🚀 Recommended: Manual Password Reset in Supabase

**Best approach for now:**

1. **Supabase Dashboard** → Authentication → Users
2. Click on the user
3. Look for **"Reset password"** or **"Send password reset email"** button
4. Click it (might work even if frontend doesn't)
5. OR set password directly if option available

## ⏱️ Rate Limit Info

Supabase free tier:
- Limited emails per hour
- Resets after some time (usually 1 hour)
- For testing, use manual methods above

## 💡 For Production

Consider:
- Custom SMTP (SendGrid, Mailgun, etc.)
- Higher Supabase plan
- Or implement your own email service

---

**Quick fix:** Use Supabase dashboard to manually reset passwords or wait 1 hour.

