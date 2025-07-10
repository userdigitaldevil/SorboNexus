# 🚀 SorboNexus Deployment Guide

## Overview

This comprehensive guide will walk you through deploying your SorboNexus full-stack application (React/Vite frontend + Node.js/Express/Prisma backend) on **Railway**, using Railway's managed PostgreSQL database and Cloudflare R2 for file storage.

**SorboNexus** is a modern platform connecting Sorbonne University students with alumni and resources, featuring:

- Alumni networking and profiles with customizable avatars and social links
- Resource sharing with file uploads to Cloudflare R2
- Advice system from alumni with rich text formatting
- Bookmarking functionality for users to save favorite content
- Apple-style design with micro-interactions and smooth animations
- Typewriter animations and dynamic content loading
- Responsive design optimized for all devices
- Admin panel for content management and user administration
- Secure JWT-based authentication and role-based authorization

---

## Prerequisites

Before starting the deployment process, ensure you have:

### Required Accounts

- **GitHub account** - for code repository hosting
- **Railway account** - for application hosting ([railway.app](https://railway.app/))
- **Cloudflare R2 account** - for file storage (free tier available)

### Technical Requirements

- **Node.js 18+** installed locally for development
- **Git** installed and configured
- **Code editor** (VS Code recommended)
- **Your SorboNexus codebase** pushed to GitHub

### Knowledge Requirements

- Basic understanding of Git commands
- Familiarity with environment variables
- Understanding of web development concepts
- Basic knowledge of databases and APIs

---

## Step 1: Prepare Your Code

### 1.1 Verify Local Development Setup

First, ensure your application works locally:

```bash
# Navigate to your project directory
cd /path/to/your/SorboNexus

# Check if you have any uncommitted changes
git status

# If you have changes, review them
git diff

# Test local development
./start-all.sh
```

**Expected output:**

- Backend should start on port 8080
- Frontend should start on port 5173 (or next available)
- Database should be seeded with sample data
- No error messages in console

### 1.2 Prepare for Deployment

```bash
# Add all changes to staging
git add .

# Create a meaningful commit message
git commit -m "Prepare for Railway deployment - [describe your changes]"

# Push to your main branch
git push origin main

# Verify the push was successful
git log --oneline -5
```

### 1.3 Verify Environment Files

**Backend Environment (`backend/.env`):**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/sorbonexus"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here"

# API Configuration
VITE_API_URL="http://localhost:8080"

# Cloudflare R2 Configuration
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="sorbonexus"
R2_CUSTOM_DOMAIN="https://ressources.sorbonexus.com"
```

**Frontend Environment (`.env`):**

```env
VITE_API_URL="http://localhost:8080"
```

**Important Notes:**

- Never commit `.env` files to GitHub
- Ensure `.gitignore` includes `.env` files
- Keep your JWT_SECRET secure and unique
- Use strong, randomly generated secrets

---

## Step 2: Set Up Cloudflare R2

### 2.1 Create Cloudflare Account

1. **Visit Cloudflare Dashboard:**

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click "Sign Up" if you don't have an account
   - Use your email address and create a strong password

2. **Verify Your Email:**

   - Check your email for verification link
   - Click the link to activate your account
   - Complete any additional verification steps

3. **Complete Account Setup:**
   - Add a domain (you can use a subdomain or existing domain)
   - Choose the free plan to start
   - Complete the onboarding process

### 2.2 Access R2 Object Storage

1. **Navigate to R2:**

   - In your Cloudflare dashboard, look for "R2 Object Storage"
   - Click on it to access the R2 interface
   - If you don't see R2, you may need to upgrade your plan

2. **Enable R2 (if needed):**
   - Some plans require explicit R2 activation
   - Follow the prompts to enable R2 storage
   - This may require plan upgrade (check current pricing)

### 2.3 Create R2 Bucket

1. **Create New Bucket:**

   - Click "Create bucket" button
   - Enter bucket name: `sorbonexus`
   - Choose a region close to your target users:
     - **Europe:** Frankfurt, London, or Amsterdam
     - **North America:** New York, Los Angeles, or Toronto
     - **Asia:** Tokyo, Singapore, or Mumbai

2. **Configure Bucket Settings:**

   - **Public bucket:** Enable if you want direct file access
   - **Versioning:** Disable for simplicity (can enable later)
   - **Encryption:** Leave as default (Cloudflare handles this)

3. **Verify Bucket Creation:**
   - You should see your `sorbonexus` bucket in the list
   - Note the bucket URL format: `https://your-account-id.r2.cloudflarestorage.com`

### 2.4 Create API Tokens

1. **Navigate to API Tokens:**

   - In your Cloudflare dashboard, go to "My Profile"
   - Click "API Tokens" in the sidebar
   - Click "Create Token"

2. **Configure Token:**

   - **Token name:** `SorboNexus R2 Access`
   - **Permissions:**
     - **Zone:** None (not needed for R2)
     - **Account:** Object Read & Write
     - **R2 Object Storage:** Object Read & Write
   - **Account Resources:** Include - All accounts
   - **Zone Resources:** None

3. **Create and Save Token:**

   - Click "Continue to summary"
   - Review the permissions
   - Click "Create Token"
   - **IMPORTANT:** Copy the token immediately - you won't see it again!

4. **Get Account ID:**
   - In your Cloudflare dashboard, look at the URL
   - It should be: `https://dash.cloudflare.com/[account-id]`
   - Copy this account ID

### 2.5 Configure R2 Bucket Settings

1. **Set Up CORS Policy:**
   - Go to your `sorbonexus` bucket
   - Click "Settings" tab
   - Find "CORS" section
   - Click "Add CORS rule"
   - Use this configuration:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

2. **Configure Public Access (Optional):**

   - If you want direct file access, enable public bucket
   - This allows files to be accessed via direct URLs
   - Useful for images and public documents

3. **Set Up Custom Domain (Optional):**
   - In bucket settings, find "Custom Domains"
   - Add: `https://ressources.sorbonexus.com`
   - Configure DNS records as instructed
   - This provides a cleaner URL for file access

### 2.6 Test R2 Configuration

1. **Create Test File:**

   - In your R2 bucket, click "Upload"
   - Upload a small test file (e.g., `test.txt`)
   - Verify it appears in the bucket

2. **Test Access:**
   - Click on the uploaded file
   - Copy the URL
   - Try accessing it in a browser
   - Verify the file downloads correctly

---

## Step 3: Create a Railway Project

### 3.1 Sign Up for Railway

1. **Visit Railway:**

   - Go to [railway.app](https://railway.app/)
   - Click "Start a New Project"

2. **Sign Up with GitHub:**

   - Click "Deploy from GitHub repo"
   - You'll be redirected to GitHub
   - Authorize Railway to access your repositories
   - Grant necessary permissions

3. **Complete Verification:**
   - Verify your email address
   - Complete any additional verification steps
   - Set up your Railway account profile

### 3.2 Create New Project

1. **Initialize Project:**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Search for your SorboNexus repository
   - Click on your repository

2. **Configure Project:**

   - **Project name:** `SorboNexus` (or your preferred name)
   - **Description:** `SorboNexus - Alumni networking platform`
   - Click "Deploy from GitHub"

3. **Wait for Initial Setup:**
   - Railway will clone your repository
   - This may take a few minutes
   - You'll see a progress indicator

---

## Step 4: Set Up Railway PostgreSQL Database

### 4.1 Add PostgreSQL Plugin

1. **Navigate to Your Project:**

   - In your Railway project dashboard
   - Click "New" button
   - Select "Database" from the dropdown

2. **Choose PostgreSQL:**

   - Click "PostgreSQL"
   - Select a plan:
     - **Hobby:** Free, 1GB storage, suitable for development
     - **Pro:** $5/month, 10GB storage, recommended for production
   - Click "Add Database"

3. **Wait for Database Creation:**
   - Railway will provision your PostgreSQL instance
   - This typically takes 1-2 minutes
   - You'll see a green checkmark when ready

### 4.2 Get Database Connection Details

1. **Access Database Settings:**

   - Click on your PostgreSQL service in the project
   - Go to "Connect" tab
   - You'll see connection details

2. **Copy Connection URL:**

   - Find "Postgres Connection URL"
   - It looks like: `postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway`
   - Copy this entire URL - this is your `DATABASE_URL`

3. **Test Connection (Optional):**
   - You can use the "Connect" button to open a web-based SQL editor
   - This helps verify the database is working correctly

### 4.3 Verify Database Access

1. **Check Database Status:**

   - In the PostgreSQL service dashboard
   - Verify status shows "Running"
   - Check that there are no error messages

2. **Note Database Details:**
   - **Host:** `containers-us-west-XX.railway.app`
   - **Port:** `XXXX` (usually 5432)
   - **Database:** `railway`
   - **Username:** `postgres`
   - **Password:** (auto-generated, part of the connection URL)

---

## Step 5: Deploy the Backend Service

### 5.1 Add Backend Service

1. **Create New Service:**

   - In your Railway project, click "New"
   - Select "Deploy from GitHub"
   - Choose your SorboNexus repository again

2. **Configure Service Settings:**
   - **Service name:** `SorboNexus Backend`
   - **Root Directory:** `backend/`
   - **Branch:** `main` (or your default branch)

### 5.2 Configure Build Settings

1. **Set Build Commands:**

   - **Install Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Health Check Path:** `/health` (if you have a health endpoint)

2. **Configure Environment:**
   - **Node.js Version:** 18 (or latest LTS)
   - **Build Command:** Leave empty (not needed for Node.js)
   - **Output Directory:** Leave empty (not applicable)

### 5.3 Set Environment Variables

1. **Access Variables Tab:**

   - Click on your backend service
   - Go to "Variables" tab
   - Click "New Variable" for each environment variable

2. **Add Required Variables:**

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# API Configuration
VITE_API_URL=https://your-backend-service-name.up.railway.app

# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=sorbonexus
R2_CUSTOM_DOMAIN=https://ressources.sorbonexus.com
```

3. **Generate JWT Secret:**

   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Verify Variables:**
   - Double-check all variable names and values
   - Ensure no extra spaces or quotes
   - Verify the DATABASE_URL is correct

### 5.4 Deploy Backend Service

1. **Trigger Deployment:**

   - Click "Deploy Now" button
   - Railway will start the build process
   - You'll see build logs in real-time

2. **Monitor Build Process:**

   - Watch the build logs for any errors
   - Common issues to watch for:
     - Missing dependencies
     - Environment variable errors
     - Port configuration issues

3. **Verify Deployment:**
   - Wait for "Deploy successful" message
   - Note the generated URL (e.g., `https://sorbonexus-backend-production.up.railway.app`)
   - This is your backend API URL

### 5.5 Test Backend Deployment

1. **Check Service Status:**

   - Verify the service shows "Running" status
   - Check that there are no error indicators

2. **Test API Endpoints:**

   - Visit your backend URL in browser
   - You should see a response (even if it's an error page)
   - Test specific endpoints if you have them

3. **Check Logs:**
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Check "Logs" tab for any error messages

---

## Step 6: Deploy the Frontend Service

### 6.1 Add Frontend Service

1. **Create Another Service:**

   - In your Railway project, click "New"
   - Select "Deploy from GitHub"
   - Choose your SorboNexus repository again

2. **Configure Service Settings:**
   - **Service name:** `SorboNexus Frontend`
   - **Root Directory:** `/` (root directory)
   - **Branch:** `main` (or your default branch)

### 6.2 Configure Build Settings

1. **Set Build Commands:**

   - **Install Command:** `npm install`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run preview`
   - **Output Directory:** `dist`

2. **Configure Environment:**
   - **Node.js Version:** 18 (or latest LTS)
   - **Build Timeout:** 600 seconds (10 minutes)
   - **Health Check Path:** `/` (root path)

### 6.3 Set Environment Variables

1. **Add Frontend Variables:**
   - Go to "Variables" tab
   - Add the following variable:

```env
VITE_API_URL=https://your-backend-service-name.up.railway.app
```

2. **Verify Backend URL:**
   - Make sure the backend URL is correct
   - Test the backend URL in browser to ensure it's accessible
   - The URL should end with `.up.railway.app`

### 6.4 Deploy Frontend Service

1. **Trigger Deployment:**

   - Click "Deploy Now" button
   - Railway will install dependencies and build the project
   - This process may take 3-5 minutes

2. **Monitor Build Process:**

   - Watch for any build errors
   - Common issues:
     - Missing environment variables
     - Build script errors
     - Dependency conflicts

3. **Verify Deployment:**
   - Wait for "Deploy successful" message
   - Note the generated URL (e.g., `https://sorbonexus-frontend-production.up.railway.app`)
   - This is your frontend application URL

### 6.5 Test Frontend Deployment

1. **Visit Your Application:**

   - Open the frontend URL in your browser
   - You should see the SorboNexus homepage
   - Verify all pages load correctly

2. **Check for Errors:**

   - Open browser developer tools (F12)
   - Check Console tab for any JavaScript errors
   - Check Network tab for failed API requests

3. **Test Navigation:**
   - Click through all main pages
   - Verify routing works correctly
   - Check that all components render properly

---

## Step 7: Run Prisma Migrations

### 7.1 Access Backend Shell

1. **Navigate to Backend Service:**

   - Go to your backend service in Railway
   - Click on "Deployments" tab
   - Click on the latest successful deployment

2. **Open Shell:**
   - Click "Shell" tab
   - Wait for the shell to initialize
   - You should see a command prompt

### 7.2 Run Database Migrations

1. **Deploy Prisma Migrations:**

   ```bash
   npx prisma migrate deploy
   ```

   **Expected output:**

   ```
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database "railway", schema "public" at "containers-us-west-XX.railway.app:XXXX"

   Applying migration `20250626064755_alumni_user_models`
   Applying migration `20250626111242_add_updated_at_to_alumni`
   Applying migration `20250626111344_test`
   Applying migration `20250630205204_add_annonce_model`
   Applying migration `20250630220930_add_annonce_model`
   Applying migration `20250702085247_add_link_model`
   Applying migration `20250702090355_add_link_created_by`
   Applying migration `20250702110438_update_ressource_model`
   Applying migration `20250703132005_support_multiple_categories_in_ressource`

   All migrations have been successfully applied.
   ```

2. **Generate Prisma Client:**

   ```bash
   npx prisma generate
   ```

   **Expected output:**

   ```
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Generated Prisma Client (v5.x.x) to ./node_modules/.prisma/client in XXXms
   ```

3. **Verify Database Connection:**

   ```bash
   npx prisma db pull
   ```

   **Expected output:**

   ```
   Environment variables loaded from .env
   Prisma schema loaded from prisma/schema.prisma
   Datasource "db": PostgreSQL database "railway", schema "public" at "containers-us-west-XX.railway.app:XXXX"

   Introspecting based on datasource defined in prisma/schema.prisma
   ✔ Introspected 8 models and wrote them into prisma/schema.prisma in XXXms
   ```

### 7.3 Seed the Database (Optional)

1. **Run Database Seeding:**

   ```bash
   node seed.js
   ```

   **Expected output:**

   ```
   Database seeded successfully!
   Created X alumni users
   Created X resources
   Created X links
   Created X conseils
   ```

2. **Verify Seeding:**
   ```bash
   npx prisma studio
   ```
   - This will open Prisma Studio in your browser
   - Verify that tables have been created and populated
   - Close the browser tab when done

### 7.4 Verify Database Setup

1. **Check Database Tables:**

   ```bash
   npx prisma db execute --stdin
   ```

   Then enter:

   ```sql
   \dt
   ```

   Press Ctrl+D to execute.

2. **Expected Tables:**
   - `User`
   - `Alumni`
   - `Ressource`
   - `Link`
   - `Conseil`
   - `Bookmark`
   - `_prisma_migrations`

---

## Step 8: Test Your Deployment

### 8.1 Test Frontend Application

1. **Basic Functionality:**

   - Visit your Railway frontend URL
   - Verify the homepage loads correctly
   - Check that all navigation links work
   - Ensure responsive design works on mobile

2. **Page-by-Page Testing:**

   - **Home Page:** Verify hero section, features, and navigation
   - **Alumni Page:** Check alumni cards, search, and filters
   - **Ressources Page:** Verify resource cards and categories
   - **Conseils Page:** Test advice cards and interactions
   - **Liens Utiles Page:** Check link cards and search
   - **Connexion Page:** Verify login/register forms

3. **UI/UX Testing:**
   - Test all buttons and interactive elements
   - Verify Apple-style animations work
   - Check typewriter animation on homepage
   - Test responsive design on different screen sizes

### 8.2 Test Backend API

1. **Health Check:**

   - Visit `your-backend-url/health` (if available)
   - Should return a success response
   - Check Railway logs for any errors

2. **API Endpoints:**

   - Test authentication endpoints
   - Verify file upload functionality
   - Check bookmarking API
   - Test resource management

3. **Database Connectivity:**
   - Verify database queries work
   - Check that data persists correctly
   - Test user registration and login

### 8.3 Test User Registration and Authentication

1. **Create Test User:**

   - Go to the Connexion page
   - Click "Créer un compte"
   - Fill out the registration form
   - Submit and verify success

2. **Test Login:**

   - Login with the created user
   - Verify JWT token is generated
   - Check that user session persists
   - Test logout functionality

3. **Verify User Data:**
   - Check that user appears in database
   - Verify user profile is created
   - Test user-specific features

### 8.4 Test File Upload Functionality

1. **Upload Test File:**

   - Login as a user
   - Go to Ressources page
   - Click "Ajouter une ressource"
   - Upload a test file (PDF, image, etc.)
   - Submit the form

2. **Verify Upload:**

   - Check that file appears in your Cloudflare R2 bucket
   - Verify file URL is accessible
   - Test file download functionality
   - Check file metadata is correct

3. **Test Different File Types:**
   - Upload various file formats
   - Verify file size limits
   - Test file validation

### 8.5 Test Bookmarking System

1. **Bookmark Content:**

   - Login as a user
   - Go to Alumni page
   - Click bookmark icon on an alumni card
   - Verify icon changes to filled state

2. **Verify Bookmark Persistence:**

   - Refresh the page
   - Check that bookmark state persists
   - Test bookmarking resources and links
   - Verify bookmark removal works

3. **Test Bookmark Management:**
   - Check that users can't bookmark their own content
   - Verify admin bookmarking permissions
   - Test bookmark filtering and search

### 8.6 Test Admin Features

1. **Admin Login:**

   - Login with an admin account
   - Verify admin privileges are active
   - Check admin-only UI elements

2. **User Management:**

   - Test user role management
   - Verify admin can edit user profiles
   - Test user deletion (if implemented)

3. **Content Management:**
   - Test resource approval process
   - Verify admin can edit all content
   - Test content moderation features

### 8.7 Performance Testing

1. **Load Testing:**

   - Test page load times
   - Verify API response times
   - Check database query performance

2. **Concurrent Users:**

   - Test with multiple browser tabs
   - Verify no conflicts with concurrent operations
   - Check session management

3. **Error Handling:**
   - Test with invalid inputs
   - Verify error messages are user-friendly
   - Check that errors don't crash the application

---

## Step 9: Set Up Custom Domain (Optional)

### 9.1 Purchase Domain (if needed)

1. **Choose Domain Registrar:**

   - Popular options: Namecheap, GoDaddy, Google Domains
   - Purchase your desired domain (e.g., `sorbonexus.com`)

2. **Domain Configuration:**
   - Set up DNS management
   - Ensure you have access to DNS records
   - Note your domain registrar's DNS settings

### 9.2 Add Custom Domain to Railway

1. **Configure Frontend Domain:**

   - In Railway, go to your frontend service
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `sorbonexus.com`)

2. **Railway DNS Configuration:**
   - Railway will provide DNS records to add
   - Usually a CNAME record pointing to your Railway URL
   - Copy these DNS settings

### 9.3 Configure DNS Records

1. **Add CNAME Record:**

   - Go to your domain registrar's DNS settings
   - Add a CNAME record:
     - **Name:** `@` (or `www`)
     - **Value:** `your-railway-frontend-url`
     - **TTL:** 3600 (or default)

2. **Add Additional Records (if needed):**

   - **A Record:** If Railway provides an IP address
   - **TXT Record:** For domain verification
   - **MX Record:** For email (if needed)

3. **Wait for DNS Propagation:**
   - DNS changes can take up to 48 hours
   - Usually propagates within 1-2 hours
   - Use online DNS checkers to verify

### 9.4 Set Up SSL Certificate

1. **Automatic SSL:**

   - Railway automatically provides SSL certificates
   - No additional configuration needed
   - Certificates are managed by Railway

2. **Verify HTTPS:**
   - Test `https://yourdomain.com`
   - Verify SSL certificate is valid
   - Check for mixed content warnings

### 9.5 Test Custom Domain

1. **Domain Verification:**

   - Visit your custom domain
   - Verify it loads your application
   - Check that all functionality works

2. **SSL Verification:**
   - Test HTTPS access
   - Verify certificate is valid
   - Check browser security indicators

---

## Step 10: Monitor and Maintain

### 10.1 Set Up Monitoring

1. **Railway Dashboard Monitoring:**

   - Check Railway dashboard regularly
   - Monitor service status and health
   - Watch for any error indicators

2. **Application Logs:**

   - Review Railway logs periodically
   - Look for error patterns
   - Monitor performance metrics

3. **Database Monitoring:**
   - Check database connection status
   - Monitor query performance
   - Watch for storage usage

### 10.2 Backup Strategy

1. **Railway PostgreSQL Backups:**

   - Railway provides automatic backups
   - Backups are retained for 7 days
   - No additional configuration needed

2. **Manual Backups (Optional):**

   - Use Prisma to export data:
     ```bash
     npx prisma db pull
     ```
   - Backup environment variables
   - Document configuration settings

3. **R2 File Backups:**
   - Cloudflare R2 has built-in redundancy
   - Consider cross-region replication for critical files
   - Monitor storage usage and costs

### 10.3 Scaling Considerations

1. **Monitor Resource Usage:**

   - Check Railway resource consumption
   - Monitor database performance
   - Watch for memory and CPU usage

2. **Upgrade Plans:**

   - Consider upgrading Railway plan if needed
   - Monitor usage patterns
   - Plan for traffic spikes

3. **Performance Optimization:**
   - Enable Railway's edge caching
   - Configure R2 CDN for faster file delivery
   - Optimize database queries
   - Consider image optimization

### 10.4 Security Maintenance

1. **Regular Updates:**

   - Keep dependencies updated
   - Monitor security advisories
   - Update environment variables regularly

2. **Access Control:**

   - Review user permissions regularly
   - Monitor admin access
   - Implement rate limiting if needed

3. **Data Protection:**
   - Ensure GDPR compliance
   - Implement data retention policies
   - Regular security audits

---

## Environment Variables Reference

### Backend Environment Variables (`backend/.env`):

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@containers-us-west-XX.railway.app:XXXX/railway

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# API Configuration
VITE_API_URL=https://your-backend-service-name.up.railway.app

# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=sorbonexus
R2_CUSTOM_DOMAIN=https://ressources.sorbonexus.com

# Optional: Additional Configuration
NODE_ENV=production
PORT=8080
```

### Frontend Environment Variables (`.env`):

```env
VITE_API_URL=https://your-backend-service-name.up.railway.app
```

### Environment Variable Best Practices:

1. **Security:**

   - Use strong, randomly generated secrets
   - Never commit `.env` files to version control
   - Rotate secrets regularly

2. **Naming Conventions:**

   - Use UPPERCASE for environment variables
   - Use descriptive names
   - Group related variables

3. **Validation:**
   - Validate environment variables on startup
   - Provide clear error messages for missing variables
   - Use default values where appropriate

---

## Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Backend won't start?**

- **Check environment variables:** Ensure all required variables are set
- **Verify DATABASE_URL:** Test database connection
- **Check JWT_SECRET:** Ensure it's set and not empty
- **Review logs:** Check Railway deployment logs for specific errors
- **Verify dependencies:** Ensure all packages are in `package.json`
- **Check Node.js version:** Ensure compatibility with your code

**Database connection errors?**

- **Verify DATABASE_URL format:** Should be valid PostgreSQL connection string
- **Check database status:** Ensure PostgreSQL service is running
- **Test connection:** Use `npx prisma db pull` to test connectivity
- **Check migrations:** Ensure all migrations have been applied
- **Verify credentials:** Check username/password in connection string

**R2 file upload errors?**

- **Check R2 credentials:** Verify access key and secret are correct
- **Verify bucket name:** Ensure bucket exists and name matches exactly
- **Check CORS settings:** Verify CORS policy allows your domain
- **Test bucket access:** Try uploading manually to verify permissions
- **Check endpoint URL:** Ensure R2 endpoint is correct for your region

#### Frontend Issues

**Frontend can't connect to backend?**

- **Verify VITE_API_URL:** Ensure it points to correct backend URL
- **Check CORS settings:** Ensure backend allows frontend domain
- **Test backend directly:** Visit backend URL in browser
- **Check network requests:** Use browser dev tools to see failed requests
- **Verify SSL:** Ensure both frontend and backend use HTTPS in production

**Build failures?**

- **Check dependencies:** Ensure all packages are properly listed
- **Verify Node.js version:** Check compatibility with your dependencies
- **Review build logs:** Look for specific error messages
- **Test locally:** Try building locally to identify issues
- **Check environment variables:** Ensure all required variables are set

**Runtime errors?**

- **Check browser console:** Look for JavaScript errors
- **Verify API responses:** Check network tab for failed requests
- **Test with different browsers:** Identify browser-specific issues
- **Check for missing dependencies:** Ensure all imports are available

#### Authentication Issues

**JWT token errors?**

- **Verify JWT_SECRET:** Ensure it's set and consistent
- **Check token expiration:** Verify token lifetime settings
- **Test token generation:** Verify tokens are created correctly
- **Check token validation:** Ensure middleware is working properly

**User registration/login failures?**

- **Check database connection:** Ensure user data is being saved
- **Verify password hashing:** Check that passwords are properly hashed
- **Test email validation:** Ensure email format validation works
- **Check user roles:** Verify role assignment is working

#### File Upload Issues

**Uploads not working?**

- **Check R2 configuration:** Verify all R2 environment variables
- **Test bucket permissions:** Ensure bucket allows uploads
- **Verify file size limits:** Check if files exceed limits
- **Check file type validation:** Ensure file types are allowed
- **Test with different files:** Identify file-specific issues

**File access errors?**

- **Check file URLs:** Verify generated URLs are correct
- **Test bucket public access:** Ensure files are publicly accessible
- **Verify CORS settings:** Check if CORS allows file access
- **Test custom domain:** Ensure custom domain is configured correctly

#### Performance Issues

**Slow page loads?**

- **Check image optimization:** Ensure images are properly sized
- **Verify CDN usage:** Ensure R2 CDN is enabled
- **Monitor database queries:** Check for slow queries
- **Enable caching:** Configure Railway edge caching
- **Optimize bundle size:** Check for large dependencies

**High resource usage?**

- **Monitor Railway metrics:** Check CPU and memory usage
- **Optimize database queries:** Use Prisma query optimization
- **Enable compression:** Configure gzip compression
- **Consider scaling:** Upgrade Railway plan if needed

### Debugging Techniques

1. **Railway Logs:**

   - Access logs in Railway dashboard
   - Filter by service and deployment
   - Look for error patterns

2. **Browser Developer Tools:**

   - Check Console for JavaScript errors
   - Monitor Network tab for failed requests
   - Use Application tab to inspect storage

3. **Database Debugging:**

   - Use Prisma Studio for database inspection
   - Run queries directly in Railway shell
   - Check migration status

4. **Environment Variable Testing:**
   - Verify variables are loaded correctly
   - Test variable values in application
   - Check for typos and formatting issues

### Performance Optimization

1. **Frontend Optimization:**

   - Enable Railway's edge caching for static assets
   - Optimize images and use WebP format
   - Implement code splitting and lazy loading
   - Use service workers for caching

2. **Backend Optimization:**

   - Enable compression for API responses
   - Implement request rate limiting
   - Optimize database queries with Prisma
   - Use connection pooling for database

3. **R2 Optimization:**
   - Configure R2 CDN for faster file delivery
   - Use appropriate storage classes
   - Implement file lifecycle policies
   - Monitor storage costs and usage

---

## Local Development

### Quick Start with Script

For local development, use the provided script:

```bash
./start-all.sh
```

This script will:

- Start the backend server on port 8080
- Start the frontend development server
- Set up the database and run migrations
- Seed the database with sample data
- Open the application in your browser

### Manual Local Setup

**Backend Setup:**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
node seed.js

# Start the development server
npm start
```

**Frontend Setup:**

```bash
# Navigate to project root
cd /path/to/SorboNexus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start the development server
npm run dev
```

### Development Workflow

1. **Make Changes:**

   - Edit code in your preferred editor
   - Save files to trigger hot reload

2. **Test Changes:**

   - Check browser for updates
   - Test functionality thoroughly
   - Verify no console errors

3. **Commit Changes:**

   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

4. **Deploy Updates:**
   - Railway will automatically redeploy on push
   - Monitor deployment logs
   - Test production deployment

---

## Your SorboNexus app is now live on Railway! 🎉

### Platform Features

The deployed platform now includes:

**Core Functionality:**

- ✅ Modern Apple-style design with micro-interactions
- ✅ Alumni networking and profile management
- ✅ Resource sharing with Cloudflare R2 storage
- ✅ Bookmarking system for users
- ✅ Advice system from alumni
- ✅ Typewriter animations and smooth transitions

**Technical Features:**

- ✅ Responsive design for all devices
- ✅ Admin panel for content management
- ✅ Secure authentication and authorization
- ✅ File upload and management
- ✅ User profile customization
- ✅ Search and filtering capabilities

**Infrastructure:**

- ✅ Railway hosting with auto-scaling
- ✅ PostgreSQL database with automatic backups
- ✅ Cloudflare R2 for file storage
- ✅ SSL certificates and HTTPS
- ✅ Custom domain support
- ✅ Monitoring and logging

### Next Steps

1. **Monitor Performance:**

   - Check Railway dashboard regularly
   - Monitor application logs
   - Watch for any errors or issues

2. **User Feedback:**

   - Gather user feedback
   - Monitor usage patterns
   - Plan feature improvements

3. **Maintenance:**

   - Keep dependencies updated
   - Monitor security advisories
   - Plan regular backups

4. **Scaling:**
   - Monitor resource usage
   - Plan for traffic growth
   - Consider additional features

### Support and Resources

- **Railway Documentation:** [docs.railway.app](https://docs.railway.app/)
- **Cloudflare R2 Documentation:** [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2/)
- **Prisma Documentation:** [prisma.io/docs](https://prisma.io/docs/)
- **React Documentation:** [react.dev](https://react.dev/)

Your SorboNexus platform is now ready to connect Sorbonne University students with alumni and resources! 🚀

---

## 👨‍💻 Credits

**SorboNexus** was created and developed by **Seth Aguila**.

### About the Developer

Seth Aguila is a passionate developer and Sorbonne University student who created SorboNexus to help fellow students connect with alumni and access valuable resources for their academic and professional journey.

### Development Contributions

- **Full-Stack Development**: React, Node.js, Express, PostgreSQL
- **UI/UX Design**: Apple-inspired design with modern animations and micro-interactions
- **Cloud Infrastructure**: Railway deployment, Cloudflare R2 storage integration
- **Database Design**: Prisma ORM with comprehensive data modeling and migrations
- **Security Implementation**: JWT authentication, role-based access control, XSS protection
- **Performance Optimization**: CDN integration, caching strategies, responsive design
- **Documentation**: Comprehensive deployment guides and technical documentation

### Contact

- **Email**: sethaguila@icloud.com
- **LinkedIn**: [https://www.linkedin.com/in/sethaguila/](https://www.linkedin.com/in/sethaguila/)

### Centralized API Logic

All frontend API calls are now centralized in `src/api/` (e.g., `src/api/bookmarks.js`, `src/api/links.js`, etc.). This replaces the previous pattern of using scattered services or hooks for API calls. Update your imports accordingly.

### Global Bookmark Context

Bookmark logic is now managed globally via a BookmarkContext, ensuring consistent state and logic across all pages and components.
