> **Disclaimer:** This is a personal project by Seth Aguila. SorboNexus is not an official website of Sorbonne Université and is not affiliated with or endorsed by the university.

# [SorboNexus](https://sorbonexus.com/) - https://sorbonexus.com/

SorboNexus is the platform created for Jussieu students, dedicated to supporting your success throughout your university journey and in preparing your applications for master's programs or schools, both in France and internationally.

The goal is truly to inspire Sorbonne University students so that they, in turn, join the best programs—just like you. This helps to enhance the university's reputation, strengthen the alumni network, and ensure it endures for future generations.

You'll find a wealth of useful resources: cover letter templates, detailed information on course units, guides for assembling your applications, and practical advice for every stage of your studies.

You'll also discover feedback and testimonials from students about the bachelor's and master's programs you're interested in, as well as stories from students who have succeeded in competitive exams like GEI-UNIV (parallel admissions), oral exams, and admissions to prestigious schools (in France and internationally) such as Polytechnique, ENS, Princeton, CentraleSupélec, Télécom, Dauphine, Sorbonne, Paris-Saclay, and many more.

The site also offers school profiles, tips for applying abroad, CV examples, and interview advice.

The site is still under development, but you can already create your account, personalize your profile, and help enrich the knowledge base to support future generations.

[Explore, share, and help grow the community!]

## Main Features

- 📚 **Shared Resources**: All logged-in users can add, edit, and delete their own resources (course notes, summaries, exercises, CV templates, cover letters, entrance exams/oral subjects, etc.).
- 🔍 **Advanced Search**: Search for resources by title, subject, or description, and filter by category/type.
- 🖼️ **File Uploads**: All users can upload files (PDFs, images, links) to share with the community.
- 📝 **Markdown Descriptions**: Resource descriptions support Markdown for rich formatting.
- 🏷️ **Useful Links**: Access a dynamic list of essential links for students.
- 👤 **Personalized Profiles**: Create and personalize your profile, share your journey and advice.
- 🛡️ **Permission Management**: Admins can manage all resources, but each user controls their own contributions.
- 📈 **Growing Community**: Contribute to the knowledge base to help future generations.

---

# Français

SorboNexus est la plateforme créée pour les étudiants de Jussieu, dédiée à accompagner votre réussite tout au long de votre parcours universitaire et dans la préparation de vos candidatures en master ou en école, en France comme à l'international.

L'objectif, c'est vraiment d'inspirer les élèves de Sorbonne Université, afin qu'ils intègrent à leur tour les meilleurs parcours, comme toi. Cela contribue à renforcer le rayonnement de l'université, à consolider le réseau des alumni, et à le faire perdurer pour les générations futures.

Vous y trouverez une multitude de ressources utiles : modèles de lettres de motivation, informations détaillées sur les UE, guides pour constituer vos dossiers, et conseils pratiques pour chaque étape de votre cursus.

Découvrez également des retours d'expérience et témoignages d'élèves sur les licences et masters que vous souhaitez suivre, ainsi que des témoignages d'élèves ayant réussi des concours comme GEI-UNIV (admissions parallèles), des oraux, et des intégrations dans des écoles prestigieuses (en France comme à l'international) telles que Polytechnique, ENS, Princeton, CentraleSupélec, Télécom, Dauphine, Sorbonne, Paris-Saclay et bien d'autres.

Le site propose aussi des fiches sur les écoles, des astuces pour les candidatures à l'étranger, des exemples de CV, ainsi que des conseils pour les entretiens.

Le site est encore en développement, mais vous pouvez dès maintenant créer votre compte, personnaliser votre profil et contribuer à enrichir la base de connaissances pour aider les générations futures.

[Explorez, partagez, et faites grandir la communauté !]

## Fonctionnalités principales

- 📚 **Ressources partagées** : Tous les utilisateurs connectés peuvent ajouter, éditer et supprimer leurs propres ressources (notes de cours, résumés, exercices, modèles de CV, lettres de motivation, sujets de concours/oraux, etc.).
- 🔍 **Recherche avancée** : Recherchez des ressources par titre, sujet ou description, et filtrez par catégorie/type.
- 🖼️ **Upload de fichiers** : Tous les utilisateurs peuvent uploader des fichiers (PDF, images, liens) pour les partager avec la communauté.
- 📝 **Descriptions en Markdown** : Les descriptions de ressources supportent le Markdown pour une mise en forme riche.
- 🏷️ **Liens utiles** : Accédez à une liste dynamique de liens essentiels pour les étudiants.
- 👤 **Profils personnalisés** : Créez et personnalisez votre profil, partagez votre parcours et vos conseils.
- 🛡️ **Gestion des permissions** : Les administrateurs peuvent gérer toutes les ressources, mais chaque utilisateur contrôle ses propres ajouts.
- 📈 **Communauté en croissance** : Participez à l'enrichissement de la base de connaissances pour aider les générations futures.

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
