# 📋 How to Run the Database Schema in Supabase

## Step-by-Step Instructions

### Step 1: Open Your Supabase Project
1. Go to: **https://app.supabase.com**
2. Sign in to your account
3. Click on your project: **ayfbwefxykfxucfxkowi**

### Step 2: Navigate to SQL Editor
1. In the left sidebar, look for **"SQL Editor"** (it has a `</>` icon)
2. Click on **"SQL Editor"**
3. You'll see a list of queries or an empty editor

### Step 3: Create a New Query
1. Click the **"New query"** button (usually at the top right or in the query list)
2. A new query tab/editor will open

### Step 4: Copy the SQL Schema
1. Open the file `supabase/schema.sql` in this project
2. **Select ALL** the content (Cmd+A / Ctrl+A)
3. **Copy** it (Cmd+C / Ctrl+C)

### Step 5: Paste and Run
1. **Paste** the SQL code into the Supabase SQL Editor
2. Review the code (it should show all the CREATE TABLE statements)
3. Click the **"Run"** button (usually at the bottom right)
   - OR press **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows/Linux)

### Step 6: Verify Success
1. You should see a success message: "Success. No rows returned"
2. Go to **"Table Editor"** in the left sidebar
3. You should see these tables:
   - ✅ `creator_profiles`
   - ✅ `reel_scripts`
   - ✅ `captions`
   - ✅ `videos`

## 🎯 Quick Visual Guide

```
Supabase Dashboard
  └── Left Sidebar
      ├── Table Editor
      ├── SQL Editor ← Click here
      │   └── New Query ← Click this
      │       └── Paste schema.sql
      │           └── Click "Run"
      └── Settings
```

## 📸 Alternative: Using Table Editor (Manual)

If you prefer to create tables manually:

1. Go to **Table Editor** → **New Table**
2. Create each table one by one with the columns from the schema
3. **Not recommended** - Running the SQL is much faster!

## ✅ What Happens When You Run It?

The SQL will:
- ✅ Create 4 tables: `creator_profiles`, `reel_scripts`, `captions`, `videos`
- ✅ Add indexes for faster queries
- ✅ Set up Row Level Security (RLS) policies
- ✅ Ensure users can only access their own data

## 🐛 Troubleshooting

### "Table already exists" error?
- The tables might already be created
- Check **Table Editor** to see if they exist
- If they exist, you can skip this step

### "Permission denied" error?
- Make sure you're logged in as the project owner
- Check that you have the correct project selected

### Can't find SQL Editor?
- Make sure you're in the correct Supabase project
- Try refreshing the page
- SQL Editor should be in the left sidebar menu

## 🎉 After Running

Once the schema is run successfully:
1. Your database is ready!
2. Users can sign up and create profiles
3. Users can generate videos, captions, and reel scripts
4. All data will be securely stored with RLS policies

---

**Need help?** The SQL file is located at: `supabase/schema.sql` in your project folder.

