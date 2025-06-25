# 🚀 SorboNexus Full-Stack Deployment Guide

## Overview

This guide will deploy your SorboNexus application with **real-time updates** using Render.com (free tier).

## Prerequisites

- GitHub account
- MongoDB Atlas account (free)
- Render.com account (free)

---

## Step 1: Set up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for free account
3. Create a free cluster (M0 tier)

### 1.2 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `sorbonexus`

**Example:**

```
mongodb+srv://username:password@cluster.mongodb.net/sorbonexus?retryWrites=true&w=majority
```

---

## Step 2: Prepare Your Code

### 2.1 Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Environment Variables

Create `.env` files for local development:

**Backend/.env:**

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sorbonexus?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

**Frontend/.env:**

```
VITE_API_URL=http://localhost:5001
```

---

## Step 3: Deploy to Render

### 3.1 Deploy Backend First

1. **Go to Render Dashboard:**

   - Visit [render.com](https://render.com)
   - Sign up/Login
   - Click "New +" → "Web Service"

2. **Connect Repository:**

   - Connect your GitHub repo
   - Select the repository

3. **Configure Backend:**

   - **Name:** `sorbonexus-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** `Free`

4. **Environment Variables:**

   - Click "Environment" tab
   - Add these variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A random secret string
     - `NODE_ENV`: `production`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Copy the URL (e.g., `https://sorbonexus-backend.onrender.com`)

### 3.2 Deploy Frontend

1. **Create New Web Service:**

   - Click "New +" → "Web Service"
   - Connect same GitHub repo

2. **Configure Frontend:**

   - **Name:** `sorbonexus-frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - **Plan:** `Free`

3. **Environment Variables:**

   - `VITE_API_URL`: Your backend URL (e.g., `https://sorbonexus-backend.onrender.com`)

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment

---

## Step 4: Test Your Deployment

### 4.1 Test Backend

- Visit your backend URL + `/` (e.g., `https://sorbonexus-backend.onrender.com/`)
- Should see "API running!"

### 4.2 Test Frontend

- Visit your frontend URL
- Test login functionality
- Test adding alumni (should work in real-time!)

---

## Step 5: Set up Custom Domain (Optional)

1. **In Render Dashboard:**

   - Go to your frontend service
   - Click "Settings" → "Custom Domains"
   - Add your domain

2. **Update DNS:**
   - Point your domain to Render's servers
   - Wait for DNS propagation

---

## Troubleshooting

### Common Issues:

1. **Backend won't start:**

   - Check MongoDB connection string
   - Verify environment variables
   - Check logs in Render dashboard

2. **Frontend can't connect to backend:**

   - Verify `VITE_API_URL` is correct
   - Check CORS settings
   - Ensure backend is running

3. **Real-time updates not working:**
   - Verify both services are deployed as web services (not static sites)
   - Check API calls in browser console
   - Ensure environment variables are set correctly

### Debug Commands:

```bash
# Check backend logs
# Go to Render dashboard → Backend service → Logs

# Check frontend logs
# Go to Render dashboard → Frontend service → Logs
```

---

## Real-Time Updates ✅

With this setup, when an admin adds a new alumni member:

1. ✅ **Backend saves to MongoDB**
2. ✅ **Frontend fetches updated data**
3. ✅ **New cards appear immediately**
4. ✅ **No manual rebuilds needed**

---

## Cost

- **MongoDB Atlas:** Free (512MB storage)
- **Render:** Free (750 hours/month)
- **Total:** $0/month

---

## Next Steps

1. Set up monitoring
2. Add SSL certificates
3. Configure backups
4. Set up CI/CD pipeline

Your SorboNexus application is now live with real-time updates! 🎉
