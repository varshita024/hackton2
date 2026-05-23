# Fraud Shield AI - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Build Process](#build-process)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Testing and Verification](#testing-and-verification)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance and Updates](#maintenance-and-updates)

---

## Prerequisites

### Required Software
- **Node.js:** Version 18.x or higher (recommended: 20.x)
- **npm:** Version 9.x or higher (comes with Node.js)
- **Git:** For version control
- **Code Editor:** VS Code (recommended) or any preferred editor

### Required Accounts
- **Firebase Account:** Free tier is sufficient for development
- **Vercel Account:** For deployment (free tier available)
- **GitHub Account:** For code hosting (optional but recommended)

### System Requirements
- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** Minimum 10GB free space
- **OS:** Windows, macOS, or Linux

---

## Environment Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>
cd hackton2

# Or if you already have the project locally
cd c:\Users\Varshi\Desktop\varshi\hackton2
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create environment file
touch .env.local
```

Add the following environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Environment
NODE_ENV=production
```

### Step 4: Verify Local Setup

```bash
# Run development server to verify setup
npm run dev

# Open browser to http://localhost:3000
# Verify all pages load correctly
```

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "fraud-shield-ai")
4. Accept Firebase terms
5. Select or create Google Analytics account (optional)
6. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Click **Save**
5. (Optional) Enable other providers as needed

### Step 3: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Select location (choose closest to your users)
4. Start in **Test mode** (for development)
5. Click **Enable**

### Step 4: Configure Firestore Security Rules

Go to **Firestore Database** → **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Alerts collection
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **</>** (Web app icon)
4. Register app (nickname: "Fraud Shield AI")
5. Copy the firebaseConfig object
6. Update your `.env.local` file with these values

### Step 6: Initialize Sample Data (Optional)

Run the setup script to populate sample data:

```bash
# This will create sample users, transactions, and alerts
# You can modify src/lib/setupDashboardData.ts to customize
npm run dev
# Navigate to /dashboard-dynamic to trigger data setup
```

---

## Build Process

### Step 1: Build for Production

```bash
# Create production build
npm run build

# This will:
# - Optimize all assets
# - Minify JavaScript and CSS
# - Generate static pages where possible
# - Create .next folder with build output
```

### Step 2: Test Production Build Locally

```bash
# Run production build locally
npm start

# Open http://localhost:3000
# Verify all functionality works
```

### Step 3: Build Output Verification

After building, verify the following:

```bash
# Check if .next folder was created
ls -la .next

# Check build size
du -sh .next

# Verify no build errors
# Check terminal output for any warnings or errors
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

#### Why Vercel?
- Built by the creators of Next.js
- Zero-configuration deployment
- Automatic HTTPS
- Global CDN
- Free tier available
- Preview deployments

#### Step-by-Step Deployment to Vercel

**Step 1: Install Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Or use npx (no installation needed)
npx vercel
```

**Step 2: Login to Vercel**

```bash
# Login to your Vercel account
vercel login

# This will open a browser for authentication
```

**Step 3: Deploy**

```bash
# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Link to existing project? → No
# - Project name? → fraud-shield-ai (or your choice)
# - Directory? → ./
# - Override settings? → No

# Vercel will detect Next.js and configure automatically
```

**Step 4: Add Environment Variables in Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from your `.env.local` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

**Step 5: Redeploy with Environment Variables**

```bash
# Redeploy to apply environment variables
vercel --prod
```

**Step 6: Verify Deployment**

1. Vercel will provide a deployment URL
2. Open the URL in your browser
3. Test all features:
   - Sign up/login
   - Dashboard
   - All feature pages
   - Navigation

**Step 7: Set Up Custom Domain (Optional)**

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

### Option 2: Netlify

#### Step-by-Step Deployment to Netlify

**Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**

```bash
netlify login
```

**Step 3: Initialize Netlify**

```bash
netlify init

# Follow the prompts:
# - Create new site? → Yes
# - Team? → Your team
# - Site name? → fraud-shield-ai
```

**Step 4: Configure Build Settings**

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

**Step 5: Deploy**

```bash
netlify deploy --prod
```

**Step 6: Add Environment Variables**

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site Settings** → **Environment Variables**
4. Add all Firebase environment variables

---

### Option 3: Self-Hosted (VPS/Cloud)

#### Step-by-Step Self-Hosted Deployment

**Step 1: Prepare Server**

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

**Step 2: Clone Repository**

```bash
# Clone repository on server
git clone <your-repository-url>
cd hackton2

# Install dependencies
npm install --production
```

**Step 3: Build Application**

```bash
# Build for production
npm run build
```

**Step 4: Set Up Environment Variables**

```bash
# Create .env file
nano .env

# Add all environment variables
# Save and exit
```

**Step 5: Start with PM2**

```bash
# Start application with PM2
pm2 start npm --name "fraud-shield-ai" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
```

**Step 6: Configure Nginx**

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/fraud-shield-ai
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/fraud-shield-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 7: Set Up SSL with Let's Encrypt**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

### Option 4: Docker Deployment

#### Step-by-Step Docker Deployment

**Step 1: Create Dockerfile**

Create `Dockerfile` in project root:

```dockerfile
# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Step 2: Create .dockerignore**

```
node_modules
.next
.git
.env.local
.env.development
```

**Step 3: Build Docker Image**

```bash
docker build -t fraud-shield-ai .
```

**Step 4: Run Docker Container**

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  fraud-shield-ai
```

**Step 5: Deploy to Docker Hub (Optional)**

```bash
# Tag image
docker tag fraud-shield-ai yourusername/fraud-shield-ai:latest

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push yourusername/fraud-shield-ai:latest
```

---

## Post-Deployment Configuration

### Step 1: Firebase Firestore Rules Update

After deployment, update Firestore rules from Test mode to Production mode:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only user can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection - authenticated users can read
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Alerts collection - authenticated users can read
    match /alerts/{alertId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 2: Enable Firebase Analytics (Optional)

1. In Firebase Console, go to **Analytics**
2. Enable analytics for your project
3. Add analytics SDK to your app (if not already added)

### Step 3: Set Up Monitoring

**Vercel Analytics:**
1. In Vercel Dashboard, go to **Analytics**
2. Enable Vercel Analytics
3. Add analytics script to your app

**Firebase Analytics:**
1. Already configured in Firebase
2. View analytics in Firebase Console

### Step 4: Configure Error Tracking

**Sentry (Optional):**

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

### Step 5: Set Up Backups

**Firebase Automatic Backups:**
1. In Firebase Console, go to **Firestore Database**
2. Go to **Backups** tab
3. Enable scheduled backups
4. Configure backup frequency and retention

---

## Testing and Verification

### Step 1: Functional Testing

Test all core features:

```bash
# Test Authentication
- Sign up new user
- Login with existing user
- Logout
- Password reset (if configured)

# Test Dashboard
- Load dashboard
- Verify stats display
- Check charts render
- Test filters

# Test Features
- Navigate to all feature pages
- Test each feature functionality
- Verify data loads correctly
- Test interactive elements

# Test Navigation
- Sidebar navigation
- Mobile menu
- Direct URL access
- Back/forward browser buttons
```

### Step 2: Performance Testing

```bash
# Use Lighthouse for performance audit
# Open Chrome DevTools
# Go to Lighthouse tab
# Run performance audit

# Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90
```

### Step 3: Security Testing

```bash
# Test security features
- Verify HTTPS is enabled
- Check for exposed API keys
- Test authentication on protected routes
- Verify input validation
- Check CORS settings
```

### Step 4: Mobile Testing

```bash
# Test on different devices
- Mobile phone (iOS/Android)
- Tablet
- Desktop
- Different screen sizes

# Test responsive design
- Sidebar collapse/expand
- Mobile menu
- Touch interactions
```

### Step 5: Cross-Browser Testing

Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Build Fails

**Symptoms:**
- `npm run build` fails with errors
- TypeScript errors
- Missing dependencies

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install

# Check TypeScript errors
npm run lint

# Update dependencies
npm update
```

#### Issue 2: Environment Variables Not Loading

**Symptoms:**
- Firebase connection errors
- Missing configuration
- API key errors

**Solutions:**
```bash
# Verify .env.local exists
ls -la .env.local

# Check variable names match exactly
# Ensure NEXT_PUBLIC_ prefix for client-side variables

# Restart development server
npm run dev
```

#### Issue 3: Firebase Authentication Errors

**Symptoms:**
- Login/signup fails
- Authentication errors in console
- Session issues

**Solutions:**
```bash
# Verify Firebase configuration
# Check all config values are correct
# Ensure Authentication is enabled in Firebase Console

# Check Firestore rules
# Verify rules allow read/write for authenticated users
```

#### Issue 4: Deployment Fails

**Symptoms:**
- Vercel deployment fails
- Build errors on deployment
- Runtime errors

**Solutions:**
```bash
# Check build logs in Vercel Dashboard
# Ensure all environment variables are set
# Verify Node.js version compatibility

# Test build locally first
npm run build
npm start
```

#### Issue 5: Performance Issues

**Symptoms:**
- Slow page load times
- High memory usage
- Laggy interactions

**Solutions:**
```bash
# Enable Next.js optimizations
# Check for large bundle sizes
# Optimize images
# Implement lazy loading

# Use Next.js Image component
# Implement code splitting
# Use React.memo for expensive components
```

---

## Maintenance and Updates

### Regular Maintenance Tasks

#### Weekly
- Check error logs
- Monitor performance metrics
- Review Firebase usage and costs
- Check for security updates

#### Monthly
- Update dependencies
- Review and update Firestore rules
- Backup database
- Review analytics data

#### Quarterly
- Security audit
- Performance optimization review
- Feature planning
- User feedback review

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update Next.js specifically
npm install next@latest

# Test after updates
npm run build
npm run dev
```

### Database Maintenance

```bash
# Clean up old data
# Implement data retention policies
# Archive old transactions
# Remove unused user accounts
```

### Monitoring

Set up monitoring for:
- Application uptime
- Error rates
- Performance metrics
- User activity
- Firebase usage

### Backup Strategy

- **Daily:** Automated Firebase backups
- **Weekly:** Export critical data
- **Monthly:** Full database export
- **Off-site:** Store backups in multiple locations

---

## Security Best Practices

### 1. Keep Dependencies Updated
```bash
# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

### 2. Environment Variables
- Never commit `.env.local` to Git
- Use different keys for development and production
- Rotate API keys regularly
- Use secrets management in production

### 3. Firebase Security
- Keep Firestore rules updated
- Use Firebase Security Rules for data access
- Enable App Check for additional security
- Monitor Firebase usage for anomalies

### 4. HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Enable HSTS
- Use secure cookies

### 5. Authentication
- Implement rate limiting
- Use strong password policies
- Enable multi-factor authentication
- Monitor for suspicious activity

---

## Cost Optimization

### Firebase Free Tier Limits
- Authentication: 10,000 verifications/month
- Firestore: 50,000 reads, 20,000 writes/day
- Storage: 5GB
- Hosting: 10GB/month

### Vercel Free Tier Limits
- 100GB bandwidth/month
- Unlimited deployments
- 6 team members
- 1000 edge functions invocations/day

### Cost Reduction Tips
- Implement data pagination
- Use Firebase indexes efficiently
- Optimize image sizes
- Implement caching
- Use CDN for static assets

---

## Support and Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)

### Community
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Firebase Community](https://firebase.google.com/support/community)
- [Stack Overflow](https://stackoverflow.com)

### Troubleshooting
- Check browser console for errors
- Review server logs
- Test in incognito mode
- Clear browser cache
- Check network tab in DevTools

---

## Conclusion

This deployment guide provides comprehensive steps to deploy Fraud Shield AI using various methods. Vercel is recommended for its simplicity and Next.js optimization, but other options are available based on your requirements.

**Key Takeaways:**
- Always test locally before deploying
- Keep environment variables secure
- Monitor performance and errors
- Keep dependencies updated
- Implement proper security measures
- Have a backup strategy

For additional support, refer to the official documentation or community forums.

---

**Deployment Guide Version:** 1.0  
**Last Updated:** May 23, 2026  
**Maintained By:** Fraud Shield AI Development Team
