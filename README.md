# SorboNexus

> **Project History:**
> This is the second version of the SorboNexus repository. The project was initially started as a static website on another repo that I have made privaate now. It has now been fully migrated to a modern React frontend, and a backend (Node.js/Express + MongoDB) has been added to replace local/static data with a dynamic API and database.
>
> **Author & Mission:**
> Developed by Seth Aguila as a personal initiative during the summer following his first year at Sorbonne Université, this project aims to empower students by bridging information gaps and promoting equal access to academic and professional resources.

SorboNexus is a modern web platform for students and alumni of Sorbonne University. It provides a collaborative space to access resources, connect with alumni, share advice, and discover useful links and events.

## Features

- **Ressources Complètes**: Access a library of educational resources, course materials, and reference documents for all levels.
- **Réseau Alumni**: Connect with alumni for mentorship, internships, and professional development.
- **Conseils Pratiques**: Get expert advice for academic success, time management, and career preparation.
- **Liens Utiles**: Find essential links to university services, libraries, and educational platforms.
- **Événements**: Stay informed about university events, conferences, workshops, and professional meetings.
- **Communauté**: Join an active community of students and graduates to exchange, collaborate, and support each other.
- **Authentication**: Secure login for users and admin, with JWT-based authentication.

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database (local or Railway)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/SorboNexus.git
cd SorboNexus
```

### 2. Backend Setup

1. Go to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory with the following content:
   ```env
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Replace `your_postgres_connection_string` with your actual PostgreSQL connection string and `your_jwt_secret` with a strong JWT secret.
4. Run migrations and seed data:
   ```bash
   npx prisma migrate dev
   node seedAlumni.js
   ```
5. Start the backend server:
   ```bash
   node index.js
   ```
   The backend will run on [http://localhost:5001](http://localhost:5001).

### 3. Frontend Setup

1. Return to the project root:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on [http://localhost:5173](http://localhost:5173) (or the next available port, e.g., 5178).

---

## Deployment on Railway

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Deploy Backend on Railway

- Create a new Railway project and add a service from your repo.
- Set the **Root Directory** to `backend/`.
- **Install Command:** `npm install`
- **Start Command:** `node index.js`
- **Environment Variables:**
  - `DATABASE_URL` (from Railway Postgres plugin)
  - `JWT_SECRET` (set a strong secret)
  - `VITE_API_URL` (set to your backend's Railway URL)

### 3. Deploy Frontend on Railway

- Add another service from your repo.
- **Root Directory:** `/` (or `/src` if your Vite config is there)
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Start Command:** `npm run preview` or `npx serve -s dist`
- **Environment Variables:**
  - `VITE_API_URL` (set to your backend's Railway URL)

### 4. Run Prisma Migrations on Railway

- In the Railway backend service shell:
  ```bash
  npx prisma migrate deploy
  ```

### 5. Test Your Deployment

- Visit your Railway frontend URL and test the app.
- Check backend logs for errors.

---

## Project Structure

```
SorboNexus/
  backend/         # Express.js backend API (Prisma/PostgreSQL)
    prisma/        # Prisma schema and migrations
    routes/        # API routes (auth, alumni, conseils)
    seedAlumni.js  # Alumni data seeder
    .env           # PostgreSQL connection string (not committed)
  src/             # React frontend (Vite)
    components/    # Shared UI components
    pages/         # Main app pages (Home, Alumnis, Conseils, etc.)
    data/          # Sample/mock data (for development)
  public/          # Static assets
  README.md        # Project documentation
```

---

## Environment Variables

- **Backend**: `.env` in `backend/`:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `JWT_SECRET` (JWT signing secret)
- **Frontend**: `.env` in `/`:
  - `VITE_API_URL` (URL of your backend API)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
