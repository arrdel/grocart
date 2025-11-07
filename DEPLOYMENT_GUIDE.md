# 🚀 GroCart Deployment Guide - Vercel

This guide will help you deploy both the frontend and backend of GroCart to Vercel.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account ([Sign up free](https://vercel.com/signup))
- ✅ MongoDB Atlas database (production)
- ✅ Stripe account with live keys
- ✅ Cloudinary account
- ✅ Resend account

## 🔧 Part 1: Backend Deployment

### Step 1: Prepare Backend for Deployment

The backend has been configured with:

- ✅ Updated CORS to accept multiple origins
- ✅ Vercel serverless function export
- ✅ Optimized `vercel.json` configuration

### Step 2: Push Backend to GitHub

```bash
cd server
git init
git add .
git commit -m "Initial backend commit"
git remote add origin <your-backend-repo-url>
git push -u origin main
```

### Step 3: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**

   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"

2. **Import Repository**

   - Select your backend repository
   - Click "Import"

3. **Configure Project**

   - **Framework Preset:** Other
   - **Root Directory:** `./` (or leave blank if server is root)
   - **Build Command:** Leave blank
   - **Output Directory:** Leave blank

4. **Add Environment Variables**

   Click "Environment Variables" and add ALL of these:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/grocart

   # JWT Secrets
   SECRET_KEY_ACCESS_TOKEN=your_production_access_token_secret
   SECRET_KEY_REFRESH_TOKEN=your_production_refresh_token_secret

   # Stripe (USE LIVE KEYS FOR PRODUCTION)
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=whsec_your_webhook_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email
   RESEND_API=your_resend_api_key

   # Frontend URL (will update after frontend deployment)
   FRONTEND_URL=https://your-frontend-url.vercel.app

   # Port
   PORT=8080
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-api.vercel.app`)

### Step 4: Test Backend Deployment

Visit: `https://your-api.vercel.app`

You should see:

```json
{
  "message": "Server is online at 8080"
}
```

## 🎨 Part 2: Frontend Deployment

### Step 1: Update Frontend Configuration

1. **Update `.env` in your local frontend:**

   ```env
   VITE_API_URL=https://your-api.vercel.app
   VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
   ```

2. **Verify SummaryApi.js:**

   Make sure this line is UNCOMMENTED:

   ```javascript
   export const baseURL = import.meta.env.VITE_API_URL;
   ```

   And this line is COMMENTED:

   ```javascript
   // export const baseURL = "http://localhost:8080";
   ```

### Step 2: Push Frontend to GitHub

```bash
cd client
git init
git add .
git commit -m "Initial frontend commit"
git remote add origin <your-frontend-repo-url>
git push -u origin main
```

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**

   - Click "Add New" → "Project"

2. **Import Frontend Repository**

   - Select your frontend repository
   - Click "Import"

3. **Configure Project**

   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or leave blank if client is root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variables**

   ```env
   VITE_API_URL=https://your-api.vercel.app
   VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://grocart.vercel.app`)

### Step 4: Update Backend with Frontend URL

1. Go back to your backend project in Vercel
2. Navigate to Settings → Environment Variables
3. Update `FRONTEND_URL` to your actual frontend URL:
   ```
   FRONTEND_URL=https://grocart.vercel.app
   ```
4. Go to Deployments tab
5. Click "..." on latest deployment → "Redeploy"

## 🔐 Part 3: Configure Stripe Webhooks for Production

### Step 1: Create Production Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Switch to "Live mode" (toggle in top right)
3. Click "Add endpoint"
4. Enter webhook URL: `https://your-api.vercel.app/api/order/webhook`
5. Select events:
   - `checkout.session.completed`
6. Click "Add endpoint"

### Step 2: Get Webhook Secret

1. Click on your newly created endpoint
2. Click "Reveal" under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### Step 3: Update Backend Environment Variable

1. Go to Vercel backend project → Settings → Environment Variables
2. Update `STRIPE_ENPOINT_WEBHOOK_SECRET_KEY` with the new webhook secret
3. Redeploy the backend

## ✅ Part 4: Verification Checklist

### Backend Verification

- [ ] Backend URL accessible: `https://your-api.vercel.app`
- [ ] Returns JSON message when accessed directly
- [ ] All environment variables set in Vercel
- [ ] MongoDB connection successful (check logs)
- [ ] Stripe keys configured (test with payment)

### Frontend Verification

- [ ] Frontend loads correctly
- [ ] Can see products (data from backend)
- [ ] Can register/login
- [ ] Can add items to cart
- [ ] Can place orders
- [ ] Stripe payment works
- [ ] Orders appear in order history

### Test Complete Flow

1. **Register a new user**

   - Should receive verification email
   - Can login successfully

2. **Browse products**

   - Products load from backend
   - Images display correctly

3. **Add to cart**

   - Cart updates in real-time
   - Cart persists on page refresh

4. **Place order with Cash on Delivery**

   - Order created successfully
   - Cart cleared
   - Order appears in "My Orders"

5. **Place order with Stripe**
   - Redirects to Stripe checkout
   - Payment processes successfully
   - Returns to success page
   - Order created in database
   - Cart cleared
   - Order appears in "My Orders"

## 🐛 Troubleshooting

### Issue: Frontend shows but no data loads

**Symptoms:**

- Frontend loads but products don't show
- "Network Error" or CORS errors in console

**Solutions:**

1. **Check CORS Configuration**

   - Verify `FRONTEND_URL` in backend matches your frontend URL EXACTLY
   - Include protocol (`https://`) and no trailing slash
   - Redeploy backend after changing

2. **Check API URL**

   - Open browser console on frontend
   - Look for network requests to your API
   - Verify they're going to correct backend URL
   - Check `VITE_API_URL` in Vercel frontend settings

3. **Check Backend Logs**
   ```bash
   # In Vercel backend project
   # Go to Deployments → Click on deployment → View Function Logs
   ```
   Look for:
   - Database connection errors
   - CORS errors
   - Missing environment variables

### Issue: CORS Error

**Error in Console:**

```
Access to fetch at 'https://your-api.vercel.app/api/...' from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```

**Solution:**

1. Check backend `FRONTEND_URL` environment variable
2. Make sure it matches your frontend URL exactly
3. Redeploy backend
4. Clear browser cache and refresh

### Issue: Authentication Not Working

**Symptoms:**

- Can't login
- Token errors
- Redirected to login repeatedly

**Solutions:**

1. **Check JWT Secrets**

   - Verify `SECRET_KEY_ACCESS_TOKEN` is set in backend
   - Verify `SECRET_KEY_REFRESH_TOKEN` is set in backend

2. **Check Cookie Settings**

   - Ensure frontend and backend are both on HTTPS
   - Cookies don't work cross-domain with different protocols

3. **Check Browser Console**
   - Look for localStorage token errors
   - Check if tokens are being saved

### Issue: Images Not Displaying

**Symptoms:**

- Product images show broken image icon
- Upload fails

**Solutions:**

1. **Check Cloudinary Configuration**

   - Verify all 3 Cloudinary variables are set:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
   - Check Vercel backend logs for Cloudinary errors

2. **Check Image URLs**
   - Open browser console
   - Check image URLs - should be Cloudinary URLs
   - If local URLs, images weren't uploaded to Cloudinary

### Issue: Stripe Payment Not Working

**Symptoms:**

- Payment page doesn't load
- Orders not created after payment
- Cart not cleared after payment

**Solutions:**

1. **Check Stripe Keys**

   - Backend: Use LIVE keys (`sk_live_...`)
   - Frontend: Use LIVE public key (`pk_live_...`)
   - Test mode keys won't work in production

2. **Check Webhook Configuration**

   - Webhook URL must point to deployed backend
   - Webhook secret must be from live mode
   - Check Stripe Dashboard → Webhooks for failed events

3. **Test Payment Flow**
   - Use real card or Stripe test cards
   - Check browser console for errors
   - Check backend logs for webhook errors

### Issue: Database Connection Failed

**Error in Logs:**

```
MongoServerError: Authentication failed
```

**Solutions:**

1. **Check MongoDB URI**

   - Verify credentials are correct
   - Ensure database user has proper permissions
   - Check IP whitelist (allow all: `0.0.0.0/0` for Vercel)

2. **MongoDB Atlas Configuration**
   - Go to MongoDB Atlas
   - Navigate to Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - This is needed because Vercel uses dynamic IPs

### Issue: Environment Variables Not Working

**Symptoms:**

- `undefined` values in code
- Features not working despite correct config

**Solutions:**

1. **Redeploy After Adding Variables**

   - Environment variables require redeployment
   - Go to Deployments → Redeploy

2. **Check Variable Names**

   - Frontend: Must start with `VITE_`
   - Backend: No special prefix needed
   - Names are case-sensitive

3. **Check Scopes**
   - In Vercel, select "Production", "Preview", and "Development"
   - All three should be checked

## 📱 Part 5: Custom Domain (Optional)

### Add Custom Domain to Frontend

1. Go to frontend project in Vercel
2. Settings → Domains
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take 24-48 hours)

### Add Custom Domain to Backend

1. Go to backend project in Vercel
2. Settings → Domains
3. Add API subdomain (e.g., `api.yourdomain.com`)
4. Update `FRONTEND_URL` in frontend to use custom domain
5. Update Stripe webhook URL to new API domain

## 🔄 Part 6: Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

1. **Push changes:**

   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Vercel automatically:**
   - Detects the push
   - Builds the project
   - Deploys to production
   - Provides deployment URL

### Manual Deployments

1. Go to Vercel Dashboard
2. Select project
3. Go to Deployments
4. Click "..." → "Redeploy"

## 📊 Monitoring & Logs

### View Backend Logs

1. Go to backend project in Vercel
2. Click on latest deployment
3. Click "View Function Logs"
4. See real-time logs and errors

### View Frontend Build Logs

1. Go to frontend project in Vercel
2. Click on deployment
3. See build output and errors

### Check Performance

1. Vercel Dashboard → Analytics
2. View page load times
3. Monitor error rates
4. Track user traffic

## 🎯 Production Best Practices

### Security

- ✅ Use HTTPS for everything
- ✅ Use live Stripe keys (not test)
- ✅ Strong JWT secrets (long random strings)
- ✅ MongoDB: Restrict IPs or use proper authentication
- ✅ Never commit `.env` files to Git

### Performance

- ✅ Enable Vercel Edge Network
- ✅ Optimize images (use Cloudinary transformations)
- ✅ Enable gzip compression
- ✅ Use MongoDB indexes for faster queries

### Monitoring

- ✅ Set up Vercel Analytics
- ✅ Monitor Stripe Dashboard for failed payments
- ✅ Check MongoDB Atlas metrics
- ✅ Set up error alerts

### Backup

- ✅ Regular MongoDB backups (Atlas does this automatically)
- ✅ Keep environment variables documented
- ✅ Tag production releases in Git

## 📞 Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Vercel Discord:** https://vercel.com/discord
- **MongoDB Atlas Support:** https://www.mongodb.com/support
- **Stripe Support:** https://support.stripe.com/

## 🎉 Success!

If all checks pass, your GroCart application is now live in production! 🚀

**Your URLs:**

- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-api.vercel.app`

Share your deployed application and start serving customers! 🛒✨

---

**Need Help?** Check the troubleshooting section or open an issue in the GitHub repository.
