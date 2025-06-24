# SorboNexus

> **Project History:**
> This is the second version of the SorboNexus repository. The project was initially started as a static website. It has now been fully migrated to a modern React frontend, and a backend (Node.js/Express + MongoDB) has been added to replace local/static data with a dynamic API and database.
>
> **Author & Mission:**
> Developed by Seth Aguila as a personal project to help students fight the information asymmetry and ensure equal access to academic and professional resources.

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

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or local MongoDB instance

### 1. Clone the Repository

```bash
git clone git@github.com:userdigitaldevil/SorboNexus.git
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
   MONGO_URI=your_mongodb_connection_string
   ```
   Replace `your_mongodb_connection_string` with your actual MongoDB URI.
4. (Optional) Seed the database with sample alumni and user data:
   ```bash
   node seedAlumni.js
   node seedUsers.js
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

## Usage

- Open your browser and go to the frontend URL (shown in the terminal, e.g., http://localhost:5173 or http://localhost:5178).
- The frontend communicates with the backend API at `http://localhost:5001`.
- You can log in as an admin or user (see `backend/alumniUsers.json` for sample credentials if seeded).

---

## Project Structure

```
SorboNexus/
  backend/         # Express.js backend API
    models/        # Mongoose models
    routes/        # API routes (auth, alumni, conseils)
    seedAlumni.js  # Alumni data seeder
    seedUsers.js   # User data seeder
    .env           # MongoDB connection string (not committed)
  src/             # React frontend
    components/    # Shared UI components
    pages/         # Main app pages (Home, Alumnis, Conseils, etc.)
    data/          # Sample/mock data (for development)
  public/          # Static assets
  README.md        # Project documentation
```

---

## Environment Variables

- **Backend**: Requires a `.env` file in `backend/` with:
  - `MONGO_URI` (your MongoDB connection string)
- **Frontend**: No environment variables required by default, but you can add Vite env variables as needed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)
