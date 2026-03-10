# Quick Deployment Steps

## 1. Prepare for Deployment

```bash
# Make sure everything works locally first
npm run build
npm start
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 3. Deploy to Render

1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Settings:
   - **Name**: mern-ecommerce
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Click "Advanced" → Add Environment Variables (copy from .env)
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment

## 4. Update MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 5. Test Your Live App

Your app will be at: `https://YOUR_APP_NAME.onrender.com`

Test:
- [ ] Homepage loads
- [ ] Signup works
- [ ] Login works
- [ ] Products display
- [ ] Cart works
- [ ] Checkout works

## Important Notes

- **Free tier**: App sleeps after 15 min inactivity
- **First load**: May take 30-60 seconds (cold start)
- **Stripe**: Use test keys for testing, live keys for production
- **CLIENT_URL**: Update in Render to your actual URL

## Troubleshooting

If deployment fails:
1. Check Render logs
2. Verify all environment variables are set
3. Ensure MongoDB IP is whitelisted
4. Check that build command completed successfully
