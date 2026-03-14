# Instructions to Push to GitHub

Due to system restrictions, please run these commands manually in your terminal.

## Step 1: Fix Xcode License (if needed)
If you see Xcode license errors, run:
```bash
sudo xcodebuild -license
```
Follow the prompts to accept the license.

## Step 2: Initialize Git and Create Initial Commit

```bash
cd /Users/mohit/Desktop/instagram-creator-tool

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Instagram Creator Tool MVP with video generation, captions, and AI content planning"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `instagram-creator-tool` (or your preferred name)
3. Description: "AI-powered Instagram creator tool with video generation, captions, and content planning"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 4: Connect Local Repo to GitHub and Push

After creating the repo, GitHub will show you commands. Use these:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/instagram-creator-tool.git

# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/instagram-creator-tool.git
git branch -M main
git push -u origin main
```

## Step 5: Verify

1. Go to your GitHub repository page
2. You should see all your files uploaded
3. The README.md should be visible on the main page

## Troubleshooting

### If you get authentication errors:
- For HTTPS: Use a Personal Access Token instead of password
- For SSH: Set up SSH keys in GitHub Settings

### If you need to update later:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

**Note:** Make sure your `.env` files are NOT committed (they're in .gitignore for security).

