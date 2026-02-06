# How to Push Your SafeRent App to GitHub

Your code is currently stored **locally** on your computer. To put it on the cloud (GitHub):

## Step 1: Create a Repository
1.  Log in to [GitHub.com](https://github.com).
2.  Click the **+** icon in the top right and select **New repository**.
3.  **Repository name**: `saferent-ibadan` (or whatever you like).
4.  **Public/Private**: Choose Public if you want everyone to see it, Private if you want it secret.
5.  **Initialize this repository with:** UNCHECK everything (No README, No .gitignore).
6.  Click **Create repository**.

## Step 2: Push Your Code
You will see a screen with a link that looks like:
`https://github.com/YOUR_USERNAME/saferent-ibadan.git`

Copy that link.

## Step 3: Run the Helper Script
I have created a script to make this easy.
1.  Open your terminal.
2.  Run: `./git_push_helper.sh`
3.  Paste the link when asked.

## Manual Commands (If script fails)
```bash
git remote add origin https://github.com/YOUR_USERNAME/saferent-ibadan.git
git branch -M main
git push -u origin main
```
