# Deployment Guide

## Option 1: Deploy to Render (Recommended - Easiest)

### Steps:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: mern-ecommerce
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   
3. **Add Environment Variables in Render Dashboard**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_uri
   UPSTASH_REDIS_URL=your_redis_url
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CLIENT_URL=https://YOUR_RENDER_URL.onrender.com
   ```

4. **Update MongoDB Atlas**
   - Go to Network Access
   - Add IP: 0.0.0.0/0 (allow all) for production

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your app will be live at: https://YOUR_APP_NAME.onrender.com

---

## Option 2: Deploy to Vercel (Frontend) + Render (Backend)

### Backend (Render):
- Follow steps above but only deploy backend
- Set CLIENT_URL to your Vercel URL

### Frontend (Vercel):
1. Go to https://vercel.com
2. Import your GitHub repo
3. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist
4. Add environment variable:
   ```
   VITE_API_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com
   ```
5. Update frontend axios config to use VITE_API_URL

---

## Option 3: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as Render)
5. Railway will auto-detect and deploy

---

## Important: Update Frontend API URL

Before deploying, update the frontend axios configuration:

**frontend/src/lib/axios.js** - Add production URL:
```javascript
const API_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api" 
  : "/api";
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas IP whitelist updated
- [ ] All environment variables set
- [ ] Stripe webhook configured (if using)
- [ ] Test signup/login
- [ ] Test product creation (admin)
- [ ] Test checkout flow
- [ ] Update Stripe to live keys for production

---

## Free Tier Limits

**Render Free Tier:**
- Spins down after 15 min of inactivity
- First request may be slow (cold start)

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments

**Railway Free Tier:**
- $5 credit/month
- No sleep mode
