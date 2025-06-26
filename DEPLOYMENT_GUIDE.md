# 🚀 SorboNexus Railway Deployment Guide

## Overview

This guide will help you deploy your SorboNexus full-stack application (React/Vite frontend + Node.js/Express/Prisma backend) on **Railway**, using Railway's managed PostgreSQL database.

---

## Prerequisites

- GitHub account
- Railway account ([railway.app](https://railway.app/))
- Your code pushed to GitHub
- Railway PostgreSQL database (already set up)

---

## Step 1: Prepare Your Code

1. **Push your latest code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```
2. **Check your backend `.env` file:**
   - Should use `DATABASE_URL` for PostgreSQL and `JWT_SECRET` for authentication.

---

## Step 2: Create a Railway Project

1. Go to [railway.app](https://railway.app/) and log in.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your SorboNexus repository.

---

## Step 3: Deploy the Backend Service

1. **Add a new service** → **Deploy from GitHub**.
2. **Root Directory:** `backend/`
3. **Install Command:** `npm install`
4. **Start Command:** `node index.js`
5. **Environment Variables:**
   - `DATABASE_URL` (from your Railway Postgres plugin)
   - `JWT_SECRET` (set a strong secret)
   - `VITE_API_URL` (set to your backend Railway URL)
6. Click **Deploy**.

---

## Step 4: Deploy the Frontend Service

1. **Add a new service** → **Deploy from GitHub**.
2. **Root Directory:** `/` (or `/src` if your Vite config is there)
3. **Install Command:** `npm install`
4. **Build Command:** `npm run build`
5. **Start Command:** `npm run preview` or `npx serve -s dist`
6. **Environment Variables:**
   - `VITE_API_URL` (set to your backend's Railway URL)
7. Click **Deploy**.

---

## Step 5: Run Prisma Migrations on Railway

1. In your Railway backend service, open the **Shell** tab.
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
   This applies your migrations to the Railway Postgres database.

---

## Step 6: Test Your Deployment

- Visit your Railway frontend URL and test the app.
- Check backend logs for errors.
- Make sure the frontend can talk to the backend and the backend can talk to the database.

---

## Step 7: (Optional) Set Up a Custom Domain

- In Railway, go to your frontend service and add a custom domain if you want.

---

## Troubleshooting

- **Backend won't start?**
  - Check your environment variables (especially `DATABASE_URL` and `JWT_SECRET`).
  - Check logs in the Railway dashboard.
- **Frontend can't connect to backend?**
  - Make sure `VITE_API_URL` is set to your backend's Railway URL.
  - Check CORS settings in your backend.
- **Migrations not working?**
  - Make sure you run `npx prisma migrate deploy` in the Railway backend shell.

---

## Example Environment Variables

**Backend (`backend/.env`):**

```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_jwt_secret
```

**Frontend (`.env`):**

```
VITE_API_URL=https://your-backend.up.railway.app
```

---

## Your SorboNexus app is now live on Railway! 🎉
