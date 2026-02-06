#!/bin/bash
echo "🚀 SafeRent GitHub Helper"
echo "--------------------------------"
echo "Please paste your GitHub Repository URL (e.g. https://github.com/user/repo.git):"
read REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ Error: No URL provided."
  exit 1
fi

echo "Adding remote origin..."
git remote add origin "$REPO_URL"

echo "Renaming branch to main..."
git branch -M main

echo "Pushing code..."
git push -u origin main

echo "--------------------------------"
echo "✅ Done! Your code is now on GitHub."
