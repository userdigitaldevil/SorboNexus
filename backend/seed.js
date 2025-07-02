const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

console.log("Prisma client keys:", Object.keys(prisma));

async function main() {
  // Find or create the user 'sethaguila'
  let user = await prisma.user.findUnique({
    where: { username: "sethaguila" },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: "sethaguila",
        password: "password", // You may want to hash this in production
        isAdmin: true,
      },
    });
  }

  // Remove all existing links first (optional, for idempotency)
  await prisma.link.deleteMany();

  const links = [
    {
      title: "Portail Étudiant Sorbonne",
      url: "https://etudiant.sorbonne-universite.fr",
      description:
        "Accès à vos informations personnelles, inscriptions, notes et planning de cours.",
      category: "Université",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    },
    {
      title: "Bibliothèque Sainte-Geneviève",
      url: "https://www-bsg.univ-paris1.fr",
      description:
        "Catalogue en ligne, réservation de documents et accès aux ressources numériques.",
      category: "Bibliothèques",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    },
    {
      title: "BUFR de Mathématiques",
      url: "https://www.bufr.math-info.univ-paris1.fr",
      description: "Bibliothèque spécialisée en mathématiques et informatique.",
      category: "Bibliothèques",
      icon: "fas fa-calculator",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      title: "Service de Santé Universitaire",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/sante",
      description:
        "Consultations médicales, psychologiques et services de prévention.",
      category: "Services",
      icon: "fas fa-heartbeat",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      title: "Service d'Orientation",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/orientation",
      description:
        "Accompagnement dans votre parcours académique et professionnel.",
      category: "Carrière",
      icon: "fas fa-compass",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    },
    {
      title: "Moodle Sorbonne",
      url: "https://moodle.sorbonne-universite.fr",
      description:
        "Plateforme d'apprentissage en ligne avec cours et ressources pédagogiques.",
      category: "Université",
      icon: "fas fa-laptop",
      gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    },
    {
      title: "Catalogue SUDOC",
      url: "https://www.sudoc.abes.fr",
      description:
        "Catalogue collectif des bibliothèques universitaires françaises.",
      category: "Bibliothèques",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    },
    {
      title: "Service Social Étudiant",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/aide-sociale",
      description: "Aides financières, logement et accompagnement social.",
      category: "Services",
      icon: "fas fa-hands-helping",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      title: "LinkedIn Alumni Sorbonne",
      url: "https://www.linkedin.com/groups/sorbonne-alumni",
      description: "Réseau professionnel des anciens étudiants de la Sorbonne.",
      category: "Carrière",
      icon: "fab fa-linkedin",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    },
    // Add more links here as needed, following the same structure
  ];

  for (const link of links) {
    await prisma.link.create({ data: { ...link, createdById: user.id } });
  }

  console.log("Seeded links!");
}

// SEED LINKS DATA
async function seedLinks() {
  const links = [
    {
      title: "Bibliothèque Sainte-Geneviève",
      category: "Bibliothèques",
      description:
        "Catalogue en ligne, réservation de documents et accès aux ressources numériques.",
      url: "https://www-bsg.univ-paris1.fr",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "BUFR de Mathématiques",
      category: "Bibliothèques",
      description: "Bibliothèque spécialisée en mathématiques et informatique.",
      url: "https://www.bufr.math-info.univ-paris1.fr",
      icon: "fas fa-calculator",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "Catalogue SUDOC",
      category: "Bibliothèques",
      description:
        "Catalogue collectif des bibliothèques universitaires françaises.",
      url: "https://www.sudoc.abes.fr",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      createdById: 21,
    },
    {
      title: "JSTOR",
      category: "Bibliothèques",
      description: "Bibliothèque numérique d'articles académiques.",
      url: "https://www.jstor.org",
      icon: "fas fa-book-open",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Academia.edu",
      category: "Carrière",
      description: "Plateforme de partage de publications académiques.",
      url: "https://www.academia.edu/",
      icon: "fas fa-user-graduate",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Concours Universitaire Centrale",
      category: "Carrière",
      description:
        "Concours d'admission pour les Écoles Centrale destiné aux étudiants en Licence.",
      url: "https://www.concours-centrale-supelec.fr/",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "GEI-UNIV",
      category: "Carrière",
      description:
        "Site officiel du concours GEI-UNIV pour les admissions parallèles en écoles d'ingénieurs.",
      url: "https://www.geiuniv.com/",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "LinkedIn Alumni Sorbonne",
      category: "Carrière",
      description: "Réseau professionnel des anciens étudiants de la Sorbonne.",
      url: "https://www.linkedin.com/groups/sorbonne-alumni",
      icon: "fab fa-linkedin",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Polytechnique Gargantua",
      category: "Carrière",
      description:
        "Plateforme pédagogique de l'École Polytechnique pour les ressources et cours.",
      url: "https://gargantua.polytechnique.fr/",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "ResearchGate",
      category: "Carrière",
      description: "Réseau social pour chercheurs et scientifiques.",
      url: "https://www.researchgate.net/",
      icon: "fas fa-flask",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Service d'Orientation",
      category: "Carrière",
      description:
        "Accompagnement dans votre parcours académique et professionnel.",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/orientation",
      icon: "fas fa-compass",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Algo Monster Flowchart",
      category: "Outils",
      description:
        "Outil interactif pour créer et visualiser des organigrammes d'algorithmes.",
      url: "https://algo.monster/flowchart",
      icon: "fas fa-project-diagram",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "AlgoMap.io - DSA Roadmap",
      category: "Outils",
      description:
        "Roadmap gratuite pour apprendre les structures de données et algorithmes avec exercices LeetCode organisés par difficulté.",
      url: "https://algomap.io/roadmap",
      icon: "fas fa-route",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "Anki",
      category: "Outils",
      description:
        "Système de cartes mémoire espacées pour la mémorisation efficace.",
      url: "https://apps.ankiweb.net/",
      icon: "fas fa-clone",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "arXiv",
      category: "Outils",
      description: "Archive de prépublications scientifiques en ligne.",
      url: "https://arxiv.org/",
      icon: "fas fa-archive",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Build Your Own X",
      category: "Outils",
      description:
        "Collection de tutoriels pour construire vos propres outils et applications.",
      url: "https://github.com/codecrafters-io/build-your-own-x",
      icon: "fas fa-tools",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "ChatGPT",
      category: "Outils",
      description:
        "Assistant IA pour l'aide aux études, rédaction et résolution de problèmes.",
      url: "https://chat.openai.com/",
      icon: "fas fa-robot",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "Claude",
      category: "Outils",
      description:
        "Assistant IA spécialisé dans l'analyse de documents et la recherche.",
      url: "https://claude.ai/",
      icon: "fas fa-brain",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Codeforces",
      category: "Outils",
      description:
        "Plateforme de programmation compétitive avec compétitions régulières.",
      url: "https://codeforces.com/",
      icon: "fas fa-code",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Coursera",
      category: "Outils",
      description: "Plateforme de cours en ligne de grandes universités.",
      url: "https://www.coursera.org/",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "DeepL Traducteur",
      category: "Outils",
      description:
        "Traducteur en ligne spécialisé dans les textes académiques.",
      url: "https://www.deepl.com/translator",
      icon: "fas fa-language",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "DeepSeek",
      category: "Outils",
      description:
        "Assistant IA spécialisé dans la programmation et le développement.",
      url: "https://www.deepseek.com/",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "edX",
      category: "Outils",
      description:
        "Cours en ligne de MIT, Harvard et autres institutions prestigieuses.",
      url: "https://www.edx.org/",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "France IOI",
      category: "Outils",
      description:
        "Site français d'algorithmique et de programmation pour débutants.",
      url: "https://www.france-ioi.org/",
      icon: "fas fa-flag",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "GitHub",
      category: "Outils",
      description:
        "Plateforme de développement collaboratif et de partage de code.",
      url: "https://github.com/",
      icon: "fab fa-github",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Google Scholar",
      category: "Outils",
      description:
        "Moteur de recherche spécialisé dans les publications académiques.",
      url: "https://scholar.google.com/",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Grammarly",
      category: "Outils",
      description:
        "Correcteur orthographique et grammatical pour améliorer vos écrits.",
      url: "https://www.grammarly.com/",
      icon: "fas fa-spell-check",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Greg Hogg",
      category: "Outils",
      description:
        "Ressources et conseils pour l'apprentissage des mathématiques et de l'informatique.",
      url: "https://greghogg.com/",
      icon: "fas fa-lightbulb",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "Greg Hogg - YouTube",
      category: "Outils",
      description:
        "Chaîne YouTube de Greg Hogg avec des tutoriels de programmation et conseils pour les développeurs.",
      url: "https://www.youtube.com/c/GregHogg",
      icon: "fab fa-youtube",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Kaggle",
      category: "Outils",
      description:
        "Plateforme de science des données, compétitions et datasets.",
      url: "https://www.kaggle.com/",
      icon: "fas fa-database",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Kattis",
      category: "Outils",
      description: "Plateforme de problèmes de programmation compétitive.",
      url: "https://open.kattis.com/",
      icon: "fas fa-laptop-code",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Khan Academy",
      category: "Outils",
      description:
        "Cours gratuits en ligne dans de nombreuses matières académiques.",
      url: "https://www.khanacademy.org/",
      icon: "fas fa-chalkboard-teacher",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "LeetCode",
      category: "Outils",
      description:
        "Plateforme de problèmes d'algorithmes et de structures de données.",
      url: "https://leetcode.com/",
      icon: "fas fa-code",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Mendeley",
      category: "Outils",
      description: "Gestionnaire de références et réseau social académique.",
      url: "https://www.mendeley.com/",
      icon: "fas fa-bookmark",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Notion",
      category: "Outils",
      description:
        "Outil de prise de notes et d'organisation pour vos projets et cours.",
      url: "https://www.notion.so/",
      icon: "fas fa-sticky-note",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Obsidian",
      category: "Outils",
      description: "Application de prise de notes avec liens entre documents.",
      url: "https://obsidian.md/",
      icon: "fas fa-link",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Overleaf",
      category: "Outils",
      description:
        "Éditeur LaTeX collaboratif en ligne pour rédiger des documents académiques.",
      url: "https://www.overleaf.com/",
      icon: "fas fa-file-alt",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Perplexity",
      category: "Outils",
      description:
        "Moteur de recherche IA avec sources et citations pour la recherche académique.",
      url: "https://www.perplexity.ai/",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Prologin",
      category: "Outils",
      description: "Concours national français d'informatique pour les jeunes.",
      url: "https://prologin.org/",
      icon: "fas fa-trophy",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "Roadmap.sh",
      category: "Outils",
      description:
        "Roadmaps et guides pour apprendre différentes technologies et compétences.",
      url: "https://roadmap.sh/",
      icon: "fas fa-map",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "TryAlgo",
      category: "Outils",
      description: "Site d'algorithmique avec cours et exercices en français.",
      url: "https://tryalgo.org/",
      icon: "fas fa-brain",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
    {
      title: "Zotero",
      category: "Outils",
      description: "Gestionnaire de références bibliographiques gratuit.",
      url: "https://www.zotero.org/",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "CROUS Paris",
      category: "Services",
      description:
        "Logement, bourses, restauration et services étudiants à Paris.",
      url: "https://www.crous-paris.fr/",
      icon: "fas fa-home",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "MesServicesEtudiants.gouv.fr",
      category: "Services",
      description:
        "Portail national pour toutes vos démarches étudiantes (DSE, logement, bourses, etc.)",
      url: "https://www.messervices.etudiant.gouv.fr/",
      icon: "fas fa-globe",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Service de Santé Universitaire",
      category: "Services",
      description:
        "Consultations médicales, psychologiques et services de prévention.",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/sante",
      icon: "fas fa-heartbeat",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      createdById: 21,
    },
    {
      title: "Service Social Étudiant",
      category: "Services",
      description: "Aides financières, logement et accompagnement social.",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/aide-sociale",
      icon: "fas fa-hands-helping",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      createdById: 21,
    },
    {
      title: "ENT Sorbonne",
      category: "Université",
      description:
        "Environnement Numérique de Travail de Sorbonne Université pour les étudiants en sciences.",
      url: "https://ent.sorbonne-universite.fr/",
      icon: "fas fa-network-wired",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Moodle Sorbonne",
      category: "Université",
      description:
        "Plateforme d'apprentissage en ligne avec cours et ressources pédagogiques.",
      url: "https://moodle.sorbonne-universite.fr",
      icon: "fas fa-laptop",
      gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
      createdById: 21,
    },
    {
      title: "Portail Étudiant Sorbonne",
      category: "Université",
      description:
        "Accès à vos informations personnelles, inscriptions, notes et planning de cours.",
      url: "https://etudiant.sorbonne-universite.fr",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      createdById: 21,
    },
    {
      title: "Zimbra Sorbonne",
      category: "Université",
      description: "Service de messagerie électronique de Sorbonne Université.",
      url: "https://zimbra.sorbonne-universite.fr/",
      icon: "fas fa-envelope",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      createdById: 21,
    },
  ];

  for (const link of links) {
    await prisma.link.create({ data: link });
  }
}

if (require.main === module) {
  seedLinks()
    .then(() => {
      console.log("Links seeded successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error seeding links:", err);
      process.exit(1);
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
