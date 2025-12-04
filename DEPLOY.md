# Vercel Deployment Guide

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Vercel CLI installed (optional, but recommended)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import project in Vercel**
   - Go to https://vercel.com/new
   - Import your Git repository
   - Vercel will auto-detect the settings
   - Click "Deploy"

3. **That's it!** Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default)
   - Directory? (Press Enter for current directory)
   - Override settings? **No**

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Project Structure

- `hre.html` - Main form page (served as static file)
- `api/submit.js` - Serverless function that handles form submissions
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies

## Important Notes

- The form submits to `/submit` which routes to `/api/submit.js`
- Static files (like `hre.html`) are automatically served from the root
- File uploads are handled by the serverless function
- SMTP credentials are hardcoded in `api/submit.js` (consider using environment variables for production)

## Environment Variables (Optional)

If you want to use environment variables for SMTP credentials:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add variables like:
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `RECIPIENT_EMAIL`

Then update `api/submit.js` to use `process.env.SMTP_USER`, etc.

## Testing

After deployment, visit:
- `https://your-project.vercel.app/hre.html` - The form
- Submit the form and check the recipient email for the submission

