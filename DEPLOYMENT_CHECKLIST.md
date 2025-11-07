# 🚀 Quick Deployment Checklist

## Before Deployment

### Backend Preparation

- [ ] All environment variables documented
- [ ] MongoDB Atlas database created (production)
- [ ] MongoDB IP whitelist: `0.0.0.0/0` added
- [ ] Stripe live keys ready
- [ ] Cloudinary account configured
- [ ] Resend API key ready
- [ ] Code pushed to GitHub repository

### Frontend Preparation

- [ ] API URL configured to use environment variable
- [ ] Stripe public key (live mode) ready
- [ ] Code pushed to GitHub repository

## Backend Deployment (Vercel)

- [ ] Backend repository imported to Vercel
- [ ] All environment variables added:
  - [ ] `MONGODB_URI`
  - [ ] `SECRET_KEY_ACCESS_TOKEN`
  - [ ] `SECRET_KEY_REFRESH_TOKEN`
  - [ ] `STRIPE_SECRET_KEY` (live)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `RESEND_API`
  - [ ] `FRONTEND_URL` (temporary, will update)
  - [ ] `PORT=8080`
- [ ] Deployment successful
- [ ] Backend URL copied (e.g., `https://your-api.vercel.app`)
- [ ] Test endpoint: Visit backend URL, should show JSON message

## Frontend Deployment (Vercel)

- [ ] Frontend repository imported to Vercel
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` (your backend URL)
  - [ ] `VITE_STRIPE_PUBLIC_KEY` (live)
- [ ] Deployment successful
- [ ] Frontend URL copied (e.g., `https://grocart.vercel.app`)

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` to actual frontend URL
- [ ] Redeploy backend after updating `FRONTEND_URL`
- [ ] Configure Stripe webhook (live mode):
  - [ ] URL: `https://your-api.vercel.app/api/order/webhook`
  - [ ] Event: `checkout.session.completed`
  - [ ] Webhook secret copied
- [ ] Update backend `STRIPE_ENPOINT_WEBHOOK_SECRET_KEY`
- [ ] Redeploy backend with webhook secret

## Testing Production

### Basic Tests

- [ ] Frontend loads correctly
- [ ] Products display (data from backend)
- [ ] Images load from Cloudinary
- [ ] Browser console: No CORS errors
- [ ] Browser console: No 404 errors

### Authentication Tests

- [ ] User registration works
- [ ] Email verification received (optional)
- [ ] User login works
- [ ] User profile loads
- [ ] Logout works

### Shopping Flow Tests

- [ ] Can browse categories
- [ ] Can search products
- [ ] Can add items to cart
- [ ] Cart updates correctly
- [ ] Cart persists on refresh

### Payment Tests

- [ ] Cash on Delivery:
  - [ ] Order created successfully
  - [ ] Cart cleared after order
  - [ ] Order appears in "My Orders"
  - [ ] Order saved in MongoDB
- [ ] Stripe Payment:
  - [ ] Redirects to Stripe checkout
  - [ ] Payment page loads
  - [ ] Test payment successful (use test card if in test mode)
  - [ ] Returns to success page
  - [ ] Order created in database
  - [ ] Cart cleared
  - [ ] Order appears in "My Orders"

### Admin Tests (if applicable)

- [ ] Can access admin dashboard
- [ ] Can add products
- [ ] Can upload images
- [ ] Can manage categories
- [ ] Can view orders

## Common Issues to Check

- [ ] No CORS errors (check browser console)
- [ ] All images loading (not broken image icons)
- [ ] Database connected (check Vercel backend logs)
- [ ] Authentication working (can stay logged in)
- [ ] Payments processing (check Stripe dashboard)
- [ ] Cart functionality working
- [ ] Orders saving to database

## If Something Doesn't Work

1. **Check Browser Console**

   - Look for error messages
   - Check network tab for failed requests

2. **Check Vercel Backend Logs**

   - Go to backend deployment
   - View Function Logs
   - Look for errors

3. **Verify Environment Variables**

   - All variables set in Vercel
   - No typos in variable names
   - Values are correct

4. **Check CORS**

   - `FRONTEND_URL` in backend matches frontend URL exactly
   - No trailing slash
   - Includes `https://`

5. **Redeploy**
   - After changing environment variables
   - Always redeploy both frontend and backend

## Success Criteria

✅ **All checks above should pass**

Your application is successfully deployed when:

- Frontend loads without errors
- Products display correctly
- Users can register and login
- Cart functionality works
- Both payment methods work
- Orders are created and saved
- No console errors

## Next Steps After Successful Deployment

- [ ] Add custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups
- [ ] Add analytics tracking
- [ ] Create documentation for users
- [ ] Plan for scaling and optimization

---

**Deployment Date:** ****\_\_\_****

**URLs:**

- Frontend: ************\_\_\_************
- Backend: ************\_\_\_************

**Notes:**

---

---

---
