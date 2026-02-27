# 🚀 OneGov Portal - Deployment Guide

## Vercel Deployment (Frontend Only)

### Prerequisites
- GitHub account
- Vercel account (free tier works)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "chore: Add Vercel deployment configuration"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `Keldekuldeep/OneGov`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Step 3: Configure Environment Variables (If needed)
In Vercel Dashboard → Settings → Environment Variables:
- Add any required environment variables
- Redeploy after adding variables

---

## Important Notes

### ⚠️ Backend Limitation
- Vercel deployment only includes the **frontend** (Next.js)
- The **backend** (Spring Boot) will NOT be deployed
- Backend features requiring API calls will not work on Vercel

### What Will Work on Vercel:
✅ All UI pages and navigation
✅ Static content and forms
✅ Client-side routing
✅ State-based redirects (Transport, Revenue, Utility services)

### What Will NOT Work on Vercel:
❌ User authentication (login/register)
❌ Data submission to backend
❌ Document upload
❌ Application tracking
❌ Real-time data from Firestore
❌ Officer/Admin portals (require backend)

---

## Full Stack Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend on Railway:
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub (select backend folder)
4. Add environment variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - Firebase credentials
5. Get Railway backend URL
6. Update frontend API URL in `lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-railway-app.railway.app/api'
   ```

### Option 2: Render (Full Stack)

#### Deploy Frontend:
1. Go to [render.com](https://render.com)
2. New → Static Site
3. Connect GitHub repo
4. Build Command: `npm run build`
5. Publish Directory: `.next`

#### Deploy Backend:
1. New → Web Service
2. Connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `mvn clean install`
5. Start Command: `java -jar target/onegov-backend-0.0.1-SNAPSHOT.jar`
6. Add environment variables

### Option 3: AWS/Azure/GCP (Production)
- Use EC2/App Service/Compute Engine for backend
- Use S3/Blob Storage/Cloud Storage for frontend
- Configure load balancers and auto-scaling

---

## Post-Deployment Checklist

### Frontend Deployment:
- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Navigation works
- [ ] Responsive design works on mobile
- [ ] No console errors

### Backend Deployment (if applicable):
- [ ] API endpoints are accessible
- [ ] CORS is configured for production domain
- [ ] Database connection works
- [ ] Authentication works
- [ ] File uploads work

### Security:
- [ ] Environment variables are set
- [ ] API keys are not exposed
- [ ] HTTPS is enabled
- [ ] Firebase security rules are configured

---

## Vercel Deployment URLs

After deployment, you'll get:
- **Preview URL**: `https://one-gov-xxx.vercel.app` (for each commit)
- **Production URL**: `https://one-gov.vercel.app` (custom domain possible)

---

## Custom Domain Setup

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (5-30 minutes)

---

## Troubleshooting

### Build Fails:
- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### 404 Errors:
- Ensure all pages have proper file structure
- Check `next.config.mjs` for redirects

### API Errors:
- Update API_BASE_URL to production backend
- Check CORS configuration
- Verify environment variables

---

## Monitoring & Analytics

### Vercel Analytics:
- Enable in Vercel Dashboard → Analytics
- Track page views, performance, etc.

### Error Tracking:
- Integrate Sentry or similar service
- Add error boundaries in React components

---

## Rollback

If deployment fails:
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Vercel Dashboard
# Deployments → Select previous deployment → Promote to Production
```

---

## Cost Estimation

### Vercel (Frontend):
- **Free Tier**: 100GB bandwidth, unlimited deployments
- **Pro**: $20/month for team features

### Railway (Backend):
- **Free Tier**: $5 credit/month
- **Pay as you go**: ~$10-20/month for small apps

### Render (Full Stack):
- **Free Tier**: Available with limitations
- **Starter**: $7/month per service

---

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Developed by Team CodeSphere** 🚀
