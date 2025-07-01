import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Box,
  Grid,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryIcon,
  Support as SupportIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  Translate as TranslateIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  School as UniversityIcon,
  Favorite as HeartIcon,
  Headset as HeadsetIcon,
  Spa as SpaIcon,
  Spellcheck as SpellcheckIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRight,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import predefinedIcons from "../data/predefinedIcons";
import useMediaQuery from "@mui/material/useMediaQuery";

const LiensUtiles = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Core page state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous les liens");
  const [bookmarkedLinks, setBookmarkedLinks] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const itemsPerPage = 15;

  // Admin authentication and permissions
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit modal state management
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    icon: "",
    gradient: "",
  });
  const [iconMode, setIconMode] = useState("predefined"); // "predefined", "custom", or "manual"
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  // Add modal state management
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    icon: "",
    gradient: "",
  });
  const [addIconMode, setAddIconMode] = useState("predefined");
  const [addCustomIconUrl, setAddCustomIconUrl] = useState("");
  const [addIconSearch, setAddIconSearch] = useState("");

  // ============================================================================
  // CONSTANTS AND CONFIGURATION
  // ============================================================================

  const categories = [
    "Tous les liens",
    "Université",
    "Bibliothèques",
    "Services",
    "Carrière",
    "Outils",
  ];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Check and set admin status based on JWT token
   * Runs on component mount to determine user permissions
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  /**
   * Scroll to top when component mounts for better UX
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ============================================================================
  // FUNCTIONS
  // ============================================================================

  const [links, setLinks] = useState([
    {
      id: 1,
      title: "Portail Étudiant Sorbonne",
      url: "https://etudiant.sorbonne-universite.fr",
      description:
        "Accès à vos informations personnelles, inscriptions, notes et planning de cours.",
      category: "Université",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    },
    {
      id: 2,
      title: "Bibliothèque Sainte-Geneviève",
      url: "https://www-bsg.univ-paris1.fr",
      description:
        "Catalogue en ligne, réservation de documents et accès aux ressources numériques.",
      category: "Bibliothèques",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    },
    {
      id: 3,
      title: "BUFR de Mathématiques",
      url: "https://www.bufr.math-info.univ-paris1.fr",
      description: "Bibliothèque spécialisée en mathématiques et informatique.",
      category: "Bibliothèques",
      icon: "fas fa-calculator",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      id: 4,
      title: "Service de Santé Universitaire",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/sante",
      description:
        "Consultations médicales, psychologiques et services de prévention.",
      category: "Services",
      icon: "fas fa-heartbeat",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 5,
      title: "Service d'Orientation",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/orientation",
      description:
        "Accompagnement dans votre parcours académique et professionnel.",
      category: "Carrière",
      icon: "fas fa-compass",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    },
    {
      id: 6,
      title: "Moodle Sorbonne",
      url: "https://moodle.sorbonne-universite.fr",
      description:
        "Plateforme d'apprentissage en ligne avec cours et ressources pédagogiques.",
      category: "Université",
      icon: "fas fa-laptop",
      gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    },
    {
      id: 7,
      title: "Catalogue SUDOC",
      url: "https://www.sudoc.abes.fr",
      description:
        "Catalogue collectif des bibliothèques universitaires françaises.",
      category: "Bibliothèques",
      icon: "fas fa-search",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    },
    {
      id: 8,
      title: "Service Social Étudiant",
      url: "https://www.sorbonne-universite.fr/vie-etudiante/aide-sociale",
      description: "Aides financières, logement et accompagnement social.",
      category: "Services",
      icon: "fas fa-hands-helping",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      id: 9,
      title: "LinkedIn Alumni Sorbonne",
      url: "https://www.linkedin.com/groups/sorbonne-alumni",
      description: "Réseau professionnel des anciens étudiants de la Sorbonne.",
      category: "Carrière",
      icon: "fab fa-linkedin",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    },
    {
      id: 10,
      title: "Google Scholar",
      url: "https://scholar.google.com",
      description:
        "Moteur de recherche spécialisé dans les publications académiques.",
      category: "Outils",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 11,
      title: "Zotero",
      url: "https://www.zotero.org",
      description: "Gestionnaire de références bibliographiques gratuit.",
      category: "Outils",
      icon: "fas fa-file-alt",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    },
    {
      id: 12,
      title: "DeepL Traducteur",
      url: "https://www.deepl.com",
      description:
        "Traducteur en ligne spécialisé dans les textes académiques.",
      category: "Outils",
      icon: "fas fa-language",
      gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    },
    {
      id: 13,
      title: "Overleaf",
      url: "https://www.overleaf.com",
      description:
        "Éditeur LaTeX collaboratif en ligne pour rédiger des documents académiques.",
      category: "Outils",
      icon: "fas fa-file-code",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    },
    {
      id: 14,
      title: "Mendeley",
      url: "https://www.mendeley.com",
      description: "Gestionnaire de références et réseau social académique.",
      category: "Outils",
      icon: "fas fa-users",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    {
      id: 15,
      title: "ResearchGate",
      url: "https://www.researchgate.net",
      description: "Réseau social pour chercheurs et scientifiques.",
      category: "Carrière",
      icon: "fas fa-microscope",
      gradient: "linear-gradient(135deg, #00d4aa 0%, #059669 100%)",
    },
    {
      id: 16,
      title: "Academia.edu",
      url: "https://www.academia.edu",
      description: "Plateforme de partage de publications académiques.",
      category: "Carrière",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 17,
      title: "arXiv",
      url: "https://arxiv.org",
      description: "Archive de prépublications scientifiques en ligne.",
      category: "Outils",
      icon: "fas fa-atom",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
    },
    {
      id: 18,
      title: "JSTOR",
      url: "https://www.jstor.org",
      description: "Bibliothèque numérique d'articles académiques.",
      category: "Bibliothèques",
      icon: "fas fa-journal-whills",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 19,
      title: "Roadmap.sh",
      url: "https://roadmap.sh",
      description:
        "Roadmaps et guides pour apprendre différentes technologies et compétences.",
      category: "Outils",
      icon: "fas fa-route",
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    },
    {
      id: 20,
      title: "ChatGPT",
      url: "https://chat.openai.com",
      description:
        "Assistant IA pour l'aide aux études, rédaction et résolution de problèmes.",
      category: "Outils",
      icon: "fas fa-robot",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 21,
      title: "Claude",
      url: "https://claude.ai",
      description:
        "Assistant IA spécialisé dans l'analyse de documents et la recherche.",
      category: "Outils",
      icon: "fas fa-brain",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 22,
      title: "Perplexity",
      url: "https://www.perplexity.ai",
      description:
        "Moteur de recherche IA avec sources et citations pour la recherche académique.",
      category: "Outils",
      icon: "fas fa-search-plus",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 23,
      title: "Grammarly",
      url: "https://www.grammarly.com",
      description:
        "Correcteur orthographique et grammatical pour améliorer vos écrits.",
      category: "Outils",
      icon: "fas fa-spell-check",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      id: 24,
      title: "Notion",
      url: "https://www.notion.so",
      description:
        "Outil de prise de notes et d'organisation pour vos projets et cours.",
      category: "Outils",
      icon: "fas fa-sticky-note",
      gradient: "linear-gradient(135deg, #000000 0%, #374151 100%)",
    },
    {
      id: 25,
      title: "Obsidian",
      url: "https://obsidian.md",
      description: "Application de prise de notes avec liens entre documents.",
      category: "Outils",
      icon: "fas fa-gem",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
    },
    {
      id: 26,
      title: "Anki",
      url: "https://apps.ankiweb.net",
      description:
        "Système de cartes mémoire espacées pour la mémorisation efficace.",
      category: "Outils",
      icon: "fas fa-layer-group",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 27,
      title: "Khan Academy",
      url: "https://www.khanacademy.org",
      description:
        "Cours gratuits en ligne dans de nombreuses matières académiques.",
      category: "Outils",
      icon: "fas fa-chalkboard-teacher",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      id: 28,
      title: "Coursera",
      url: "https://www.coursera.org",
      description: "Plateforme de cours en ligne de grandes universités.",
      category: "Outils",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 29,
      title: "edX",
      url: "https://www.edx.org",
      description:
        "Cours en ligne de MIT, Harvard et autres institutions prestigieuses.",
      category: "Outils",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    },
    {
      id: 30,
      title: "GitHub",
      url: "https://github.com",
      description:
        "Plateforme de développement collaboratif et de partage de code.",
      category: "Outils",
      icon: "fab fa-github",
      gradient: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
    },
    {
      id: 31,
      title: "Greg Hogg",
      url: "https://www.greghogg.com",
      description:
        "Ressources et conseils pour l'apprentissage des mathématiques et de l'informatique.",
      category: "Outils",
      icon: "fas fa-lightbulb",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 32,
      title: "DeepSeek",
      url: "https://www.deepseek.com",
      description:
        "Assistant IA spécialisé dans la programmation et le développement.",
      category: "Outils",
      icon: "fas fa-code",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
    },
    {
      id: 33,
      title: "Build Your Own X",
      url: "https://github.com/codecrafters-io/build-your-own-x",
      description:
        "Collection de tutoriels pour construire vos propres outils et applications.",
      category: "Outils",
      icon: "fas fa-hammer",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      id: 34,
      title: "France IOI",
      url: "https://www.france-ioi.org",
      description:
        "Site français d'algorithmique et de programmation pour débutants.",
      category: "Outils",
      icon: "fas fa-flag",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 35,
      title: "Prologin",
      url: "https://prologin.org",
      description: "Concours national français d'informatique pour les jeunes.",
      category: "Outils",
      icon: "fas fa-trophy",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 36,
      title: "LeetCode",
      url: "https://leetcode.com",
      description:
        "Plateforme de problèmes d'algorithmes et de structures de données.",
      category: "Outils",
      icon: "fas fa-code-branch",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    },
    {
      id: 37,
      title: "Kaggle",
      url: "https://www.kaggle.com",
      description:
        "Plateforme de science des données, compétitions et datasets.",
      category: "Outils",
      icon: "fas fa-chart-line",
      gradient: "linear-gradient(135deg, #20b2aa 0%, #008b8b 100%)",
    },
    {
      id: 38,
      title: "Codeforces",
      url: "https://codeforces.com",
      description:
        "Plateforme de programmation compétitive avec compétitions régulières.",
      category: "Outils",
      icon: "fas fa-chess",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 39,
      title: "TryAlgo",
      url: "https://tryalgo.org",
      description: "Site d'algorithmique avec cours et exercices en français.",
      category: "Outils",
      icon: "fas fa-puzzle-piece",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      id: 40,
      title: "Kattis",
      url: "https://open.kattis.com",
      description: "Plateforme de problèmes de programmation compétitive.",
      category: "Outils",
      icon: "fas fa-rocket",
      gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    },
    {
      id: 41,
      title: "ENT Sorbonne",
      url: "https://ent.sorbonne-universite.fr/sciences-etudiants/fr/index.html",
      description:
        "Environnement Numérique de Travail de Sorbonne Université pour les étudiants en sciences.",
      category: "Université",
      icon: "fas fa-university",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 42,
      title: "Zimbra Sorbonne",
      url: "https://zcs.sorbonne-universite.fr/#1",
      description: "Service de messagerie électronique de Sorbonne Université.",
      category: "Université",
      icon: "fas fa-envelope",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
    {
      id: 43,
      title: "Algo Monster Flowchart",
      url: "https://algo.monster/flowchart",
      description:
        "Outil interactif pour créer et visualiser des organigrammes d'algorithmes.",
      category: "Outils",
      icon: "fas fa-project-diagram",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 44,
      title: "GEI-UNIV",
      url: "https://gei-univ.fr",
      description:
        "Site officiel du concours GEI-UNIV pour les admissions parallèles en écoles d'ingénieurs.",
      category: "Carrière",
      icon: "fas fa-graduation-cap",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    },
    {
      id: 45,
      title: "Polytechnique Gargantua",
      url: "https://gargantua.polytechnique.fr",
      description:
        "Plateforme pédagogique de l'École Polytechnique pour les ressources et cours.",
      category: "Carrière",
      icon: "fas fa-rocket",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 46,
      title: "Concours Universitaire Centrale",
      url: "https://www.groupe-centrale.com/concours-universitaire/",
      description:
        "Concours d'admission pour les Écoles Centrale destiné aux étudiants en Licence.",
      category: "Carrière",
      icon: "fas fa-building",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    },
    {
      id: 1001,
      title: "CROUS Paris",
      url: "https://www.crous-paris.fr/",
      description:
        "Logement, bourses, restauration et services étudiants à Paris.",
      category: "Services",
      icon: "fas fa-building",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 1002,
      title: "MesServicesEtudiants.gouv.fr",
      url: "https://www.messervices.etudiant.gouv.fr/envole/",
      description:
        "Portail national pour toutes vos démarches étudiantes (DSE, logement, bourses, etc.)",
      category: "Services",
      icon: "fas fa-globe",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 1003,
      title: "AlgoMap.io - DSA Roadmap",
      url: "https://algomap.io/roadmap",
      description:
        "Roadmap gratuite pour apprendre les structures de données et algorithmes avec exercices LeetCode organisés par difficulté.",
      category: "Outils",
      icon: "fas fa-code",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      id: 1004,
      title: "Greg Hogg - YouTube",
      url: "https://www.youtube.com/@GregHogg",
      description:
        "Chaîne YouTube de Greg Hogg avec des tutoriels de programmation et conseils pour les développeurs.",
      category: "Outils",
      icon: "fab fa-youtube",
      gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
  ]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Filter predefined icons based on search query for edit modal
   * @returns {Array} Filtered icons matching the search criteria
   */
  const getFilteredIconsForEdit = () => {
    return predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(iconSearch.toLowerCase())
    );
  };

  /**
   * Filter predefined icons based on search query for add modal
   * @returns {Array} Filtered icons matching the search criteria
   */
  const getFilteredIconsForAdd = () => {
    return predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(addIconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(addIconSearch.toLowerCase())
    );
  };

  /**
   * Generate unique ID for new links
   * @returns {number} Next available ID
   */
  const generateUniqueLinkId = () => {
    return Math.max(...links.map((link) => link.id)) + 1;
  };

  // ============================================================================
  // DATA FILTERING AND COMPUTED VALUES
  // ============================================================================

  // Get filtered icons for edit modal
  const filteredIcons = getFilteredIconsForEdit();

  // Get filtered icons for add modal
  const filteredAddIcons = getFilteredIconsForAdd();

  // Predefined gradients organized by category
  const categoryGradients = {
    Université: [
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
      "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    ],
    Bibliothèques: [
      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
      "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
    ],
    Services: [
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #059669 0%, #047857 100%)",
      "linear-gradient(135deg, #047857 0%, #065f46 100%)",
    ],
    Carrière: [
      "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
    ],
    Outils: [
      "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
    ],
  };

  // ============================================================================
  // LINKS DATA AND FILTERING LOGIC
  // ============================================================================

  /**
   * Filter links based on search query and active category
   * @returns {Array} Filtered and sorted links
   */
  const getFilteredAndSortedLinks = () => {
    return links
      .filter((link) => {
        const matchesSearch =
          searchQuery === "" ||
          link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          activeCategory === "Tous les liens" ||
          link.category === activeCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Sort by category first, then by title
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
  };

  // Get filtered and sorted links
  const filteredLinks = getFilteredAndSortedLinks();

  // Calculate pagination values
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredLinks.slice(startIndex, endIndex);

  // ============================================================================
  // BOOKMARK MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Toggle bookmark status for a specific link
   * @param {number} linkId - ID of the link to toggle bookmark
   */
  const toggleBookmarkForLink = (linkId) => {
    const newBookmarkedLinks = new Set(bookmarkedLinks);
    if (newBookmarkedLinks.has(linkId)) {
      newBookmarkedLinks.delete(linkId);
    } else {
      newBookmarkedLinks.add(linkId);
    }
    setBookmarkedLinks(newBookmarkedLinks);
  };

  const toggleDescriptionExpansion = (linkId) => {
    const newExpandedDescriptions = new Set(expandedDescriptions);
    if (newExpandedDescriptions.has(linkId)) {
      newExpandedDescriptions.delete(linkId);
    } else {
      newExpandedDescriptions.add(linkId);
    }
    setExpandedDescriptions(newExpandedDescriptions);
  };

  // ============================================================================
  // EDIT MODAL MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Open edit modal and populate form with link data
   * @param {Object} link - Link object to edit
   */
  const openEditModalWithLinkData = (link) => {
    setEditingLink(link);
    setEditForm({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      icon: link.icon,
      gradient: link.gradient,
    });
    setIconMode("predefined");
    setCustomIconUrl("");
    setIconSearch("");
    setEditModalOpen(true);
  };

  /**
   * Update specific field in edit form
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  const updateEditFormField = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Save changes to existing link and close edit modal
   */
  const saveLinkChanges = () => {
    // Determine icon value based on selected mode
    const iconValue = iconMode === "predefined" ? editForm.icon : customIconUrl;

    // Update the link in the array
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === editingLink.id
          ? {
              ...link,
              title: editForm.title,
              url: editForm.url,
              description: editForm.description,
              category: editForm.category,
              icon: iconValue,
              gradient: editForm.gradient,
            }
          : link
      )
    );

    closeEditModal();
  };

  /**
   * Delete the currently editing link and close modal
   */
  const deleteCurrentLink = () => {
    setLinks((prevLinks) =>
      prevLinks.filter((link) => link.id !== editingLink.id)
    );
    closeEditModal();
  };

  /**
   * Close edit modal and reset form state
   */
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingLink(null);
  };

  // ============================================================================
  // ADD MODAL MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Open add modal and reset form to initial state
   */
  const openAddModalWithEmptyForm = () => {
    setAddForm({
      title: "",
      url: "",
      description: "",
      category: "",
      icon: "",
      gradient: "",
    });
    setAddIconMode("predefined");
    setAddCustomIconUrl("");
    setAddIconSearch("");
    setAddModalOpen(true);
  };

  /**
   * Update specific field in add form
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  const updateAddFormField = (field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Create new link and add to links array
   */
  const createAndAddNewLink = () => {
    // Determine icon value based on selected mode
    const iconValue =
      addIconMode === "predefined" ? addForm.icon : addCustomIconUrl;

    // Create new link with unique ID
    const newLink = {
      id: generateUniqueLinkId(),
      title: addForm.title,
      url: addForm.url,
      description: addForm.description,
      category: addForm.category,
      icon: iconValue,
      gradient: addForm.gradient,
    };

    // Add to links array
    setLinks((prevLinks) => [...prevLinks, newLink]);
    closeAddModal();
  };

  /**
   * Close add modal and reset form state
   */
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  // Helper to chunk array into groups of 4
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-700/40 via-teal-400/20 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-gradient-to-br from-pink-500/30 via-blue-400/10 to-teal-400/30 rounded-full blur-2xl animate-pulse-slower" />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-20 pb-16 px-4 bg-gradient-to-r from-blue-900/30 to-teal-900/30 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "80px" : "80px",
          paddingBottom: window.innerWidth < 600 ? "64px" : "64px",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: { xs: 2, md: 4 },
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.2rem",
                    md: "3.5rem",
                    lg: "4rem",
                  },
                  lineHeight: { xs: 1.2, md: 1.1 },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  mt: { xs: 1, md: 6 },
                }}
              >
                <span style={{ display: "block" }}>Liens</span>
                <span style={{ display: "block" }}>Utiles</span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  mb: { xs: 2, md: 3 },
                  fontWeight: 400,
                  lineHeight: { xs: 1.4, md: 1.6 },
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                Accédez facilement à tous vos services universitaires,
                bibliothèques et plateformes pédagogiques. Retrouvez des liens
                pour vous entraîner, vous informer et définir vos objectifs
                académiques et professionnels.
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Utilisez la fonctionnalité de favoris pour sauvegarder vos
                  liens préférés et y accéder rapidement.
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ maxWidth: 600, mx: "auto", pb: 3 }}
            >
              <TextField
                fullWidth
                placeholder="Rechercher des liens par nom, catégorie ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    color: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "2px solid #3b82f6",
                    },
                    "& input::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                      opacity: 1,
                    },
                    "& input": {
                      color: "white",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      padding: { xs: "12px", md: "16px" },
                    },
                  },
                }}
              />
            </motion.div>

            {/* Admin Add Button */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{ mt: 4, pt: 4 }}
              >
                <Button
                  variant="contained"
                  onClick={openAddModalWithEmptyForm}
                  startIcon={<i className="fas fa-plus"></i>}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    minHeight: 0,
                    minWidth: 0,
                    lineHeight: 1.2,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                    },
                  }}
                >
                  Ajouter un nouveau lien
                </Button>
              </motion.div>
            )}
          </Box>
        </Container>
      </motion.section>

      {/* Categories & Filters */}
      <motion.section
        className="py-8 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 3, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 1, md: 2 },
                justifyContent: "center",
                pt: { xs: 1, md: 2 },
                mt: 0,
              }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      background:
                        activeCategory === category
                          ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                          : "rgba(255, 255, 255, 0.08)",
                      color:
                        activeCategory === category
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)",
                      border:
                        activeCategory === category
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(20px)",
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      padding: { xs: "6px 12px", md: "8px 16px" },
                      height: { xs: "28px", md: "auto" },
                      "&:hover": {
                        background:
                          activeCategory === category
                            ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                            : "rgba(255, 255, 255, 0.12)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </Container>
      </motion.section>

      {/* Links Grid */}
      <motion.section
        className="py-12 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "48px" : "48px",
          paddingBottom: window.innerWidth < 600 ? "48px" : "48px",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ overflow: "hidden" }}>
          {isMobile ? (
            // MOBILE: 2x2 grid carousel with responsive sizing
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: { xs: 1, sm: 1.5 },
                pb: 2,
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {chunkArray(currentLinks, 4).map((chunk, chunkIdx) => (
                <Box
                  key={chunkIdx}
                  sx={{
                    minWidth: 0,
                    flex: "0 0 calc(100vw - 32px)",
                    maxWidth: "calc(100vw - 32px)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: 2,
                    scrollSnapAlign: "start",
                    p: 1,
                  }}
                >
                  {chunk.map((link, index) => (
                    <Box key={link.id} sx={{ width: "100%", height: "100%" }}>
                      {/* Card rendering (copy from existing Grid) */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card
                          sx={{
                            height: "100%",
                            maxWidth: { xs: 280, md: 320 },
                            mx: "auto",
                            background: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 3,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(59, 130, 246, 0.3)",
                              "& .resource-icon": {
                                transform: "scale(1.1) rotate(5deg)",
                              },
                              "& .resource-title": {
                                background:
                                  "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                              },
                            },
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "2px",
                              background: link.gradient,
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                            },
                            "&:hover::before": {
                              opacity: 1,
                            },
                          }}
                        >
                          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                            <Box
                              className="resource-icon"
                              sx={{
                                width: { xs: 40, md: 48 },
                                height: { xs: 40, md: 48 },
                                borderRadius: 2,
                                background: link.gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: { xs: 2, md: 3 },
                                color: "white",
                                transition: "all 0.3s ease",
                              }}
                            >
                              <i className={`${link.icon} text-xl`}></i>
                            </Box>
                            <Typography
                              variant="h6"
                              className="resource-title"
                              sx={{
                                fontWeight: 600,
                                mb: { xs: 1, md: 2 },
                                transition: "all 0.3s ease",
                                fontSize: { xs: "0.9rem", md: "1.25rem" },
                              }}
                            >
                              {link.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#3b82f6",
                                fontWeight: 500,
                                mb: { xs: 1, md: 2 },
                                fontSize: { xs: "0.7rem", md: "0.875rem" },
                              }}
                            >
                              {link.category}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#a1a1aa",
                                mb: { xs: 2, md: 3 },
                                lineHeight: 1.6,
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                              }}
                            >
                              {link.description}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Chip
                                label="Lien"
                                size="small"
                                sx={{
                                  background: "rgba(59, 130, 246, 0.1)",
                                  color: "#3b82f6",
                                  border: "1px solid rgba(59, 130, 246, 0.2)",
                                  fontSize: { xs: "0.6rem", md: "0.75rem" },
                                  height: { xs: "20px", md: "24px" },
                                }}
                              />
                              <Button
                                variant="contained"
                                size="small"
                                endIcon={<ArrowRight />}
                                onClick={() => window.open(link.url, "_blank")}
                                sx={{
                                  fontWeight: 700,
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 2,
                                  background: "#2563eb",
                                  color: "#fff",
                                  textTransform: "none",
                                  fontSize: "0.95rem",
                                  minHeight: "32px",
                                  boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
                                  transition:
                                    "all 0.2s cubic-bezier(.4,2,.6,1)",
                                  "&:hover": {
                                    background: "#1e40af",
                                    color: "#fff",
                                    boxShadow:
                                      "0 4px 16px rgba(59,130,246,0.16)",
                                  },
                                }}
                              >
                                Accéder
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          ) : (
            // DESKTOP/TABLET: original grid
            <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
              {currentLinks.map((link, index) => (
                <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  key={link.id}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        maxWidth: { xs: 280, md: 320 },
                        mx: "auto",
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          "& .resource-icon": {
                            transform: "scale(1.1) rotate(5deg)",
                          },
                          "& .resource-title": {
                            background:
                              "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          },
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          background: link.gradient,
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        },
                        "&:hover::before": {
                          opacity: 1,
                        },
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                        <Box
                          className="resource-icon"
                          sx={{
                            width: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                            borderRadius: 2,
                            background: link.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: { xs: 2, md: 3 },
                            color: "white",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <i className={`${link.icon} text-xl`}></i>
                        </Box>
                        <Typography
                          variant="h6"
                          className="resource-title"
                          sx={{
                            fontWeight: 600,
                            mb: { xs: 1, md: 2 },
                            transition: "all 0.3s ease",
                            fontSize: { xs: "0.9rem", md: "1.25rem" },
                          }}
                        >
                          {link.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 500,
                            mb: { xs: 1, md: 2 },
                            fontSize: { xs: "0.7rem", md: "0.875rem" },
                          }}
                        >
                          {link.category}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#a1a1aa",
                            mb: { xs: 2, md: 3 },
                            lineHeight: 1.6,
                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                          }}
                        >
                          {link.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label="Lien"
                            size="small"
                            sx={{
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              fontSize: { xs: "0.6rem", md: "0.75rem" },
                              height: { xs: "20px", md: "24px" },
                            }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<ArrowRight />}
                            onClick={() => window.open(link.url, "_blank")}
                            sx={{
                              fontWeight: 700,
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              background: "#2563eb",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: "0.95rem",
                              minHeight: "32px",
                              boxShadow: "0 2px 8px rgba(59,130,246,0.10)",
                              transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                              "&:hover": {
                                background: "#1e40af",
                                color: "#fff",
                                boxShadow: "0 4px 16px rgba(59,130,246,0.16)",
                              },
                            }}
                          >
                            Accéder
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: 4, md: 6 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  size={window.innerWidth < 600 ? "small" : "large"}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      background: "rgba(255, 255, 255, 0.05)",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                      },
                    },
                    "& .Mui-selected": {
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%) !important",
                      color: "white !important",
                      border: "1px solid #3b82f6 !important",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%) !important",
                      },
                    },
                  }}
                />
              </Box>
            </motion.div>
          )}
        </Container>
      </motion.section>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={closeEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Modifier le lien
          <IconButton
            onClick={closeEditModal}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              ml: 1,
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Titre"
              value={editForm.title}
              onChange={(e) => updateEditFormField("title", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <TextField
              label="URL"
              value={editForm.url}
              onChange={(e) => updateEditFormField("url", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <TextField
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                updateEditFormField("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              >
                Catégorie
              </InputLabel>
              <Select
                value={editForm.category}
                onChange={(e) =>
                  updateEditFormField("category", e.target.value)
                }
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {categories.slice(1).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Icon Selection */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Icône
              </Typography>

              {/* Icon Mode Toggle */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                  variant={iconMode === "predefined" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setIconMode("predefined")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      iconMode === "predefined"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      iconMode === "predefined"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      iconMode === "predefined"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        iconMode === "predefined"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Icônes prédéfinies
                </Button>
                <Button
                  variant={iconMode === "custom" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setIconMode("custom")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      iconMode === "custom"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      iconMode === "custom"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      iconMode === "custom"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        iconMode === "custom"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  URL personnalisée
                </Button>
                <Button
                  variant={iconMode === "manual" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setIconMode("manual")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      iconMode === "manual"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      iconMode === "manual"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      iconMode === "manual"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        iconMode === "manual"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Classe FontAwesome
                </Button>
              </Box>

              {/* Predefined Icons Grid */}
              {iconMode === "predefined" && (
                <>
                  <TextField
                    label="Rechercher une icône"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      input: { color: "white" },
                      label: { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: 1,
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 1,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 1,
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {getFilteredIconsForEdit().map((iconOption) => (
                      <IconButton
                        key={iconOption.value}
                        onClick={() =>
                          updateEditFormField("icon", iconOption.value)
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          border:
                            editForm.icon === iconOption.value
                              ? "2px solid #3b82f6"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                          background:
                            editForm.icon === iconOption.value
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(255, 255, 255, 0.05)",
                          color: "white",
                          fontSize: "1.2rem",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid #3b82f6",
                          },
                        }}
                      >
                        <i className={iconOption.value}></i>
                      </IconButton>
                    ))}
                  </Box>
                </>
              )}

              {/* Custom Icon URL Input */}
              {iconMode === "custom" && (
                <TextField
                  label="URL de l'icône"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  fullWidth
                  placeholder="https://example.com/icon.png"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              )}

              {iconMode === "manual" && (
                <TextField
                  label="Classe FontAwesome (ex: fas fa-atom)"
                  value={editForm.icon}
                  onChange={(e) => updateEditFormField("icon", e.target.value)}
                  fullWidth
                  placeholder="fas fa-atom"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              )}
            </Box>

            {/* Gradient Selection */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Gradient
              </Typography>

              <TextField
                label="Gradient personnalisé (CSS)"
                value={editForm.gradient}
                onChange={(e) =>
                  updateEditFormField("gradient", e.target.value)
                }
                fullWidth
                placeholder="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={deleteCurrentLink}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderColor: "#ef4444",
              color: "#ef4444",
              "&:hover": {
                borderColor: "#dc2626",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            Supprimer
          </Button>
          <Button
            onClick={closeEditModal}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={saveLinkChanges}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
              },
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Modal */}
      <Dialog
        open={addModalOpen}
        onClose={closeAddModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Ajouter un nouveau lien
          <IconButton
            onClick={closeAddModal}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              ml: 1,
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Titre"
              value={addForm.title}
              onChange={(e) => updateAddFormField("title", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <TextField
              label="URL"
              value={addForm.url}
              onChange={(e) => updateAddFormField("url", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <TextField
              label="Description"
              value={addForm.description}
              onChange={(e) =>
                updateAddFormField("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                }}
              >
                Catégorie
              </InputLabel>
              <Select
                value={addForm.category}
                onChange={(e) => updateAddFormField("category", e.target.value)}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
              >
                {categories.slice(1).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Icon Selection */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Icône
              </Typography>

              {/* Icon Mode Toggle */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                  variant={
                    addIconMode === "predefined" ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => setAddIconMode("predefined")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      addIconMode === "predefined"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      addIconMode === "predefined"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      addIconMode === "predefined"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        addIconMode === "predefined"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Icônes prédéfinies
                </Button>
                <Button
                  variant={addIconMode === "custom" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setAddIconMode("custom")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      addIconMode === "custom"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      addIconMode === "custom"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      addIconMode === "custom"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        addIconMode === "custom"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  URL personnalisée
                </Button>
                <Button
                  variant={addIconMode === "manual" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setAddIconMode("manual")}
                  sx={{
                    fontSize: "0.75rem",
                    px: 2,
                    py: 0.5,
                    background:
                      addIconMode === "manual"
                        ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                        : "transparent",
                    borderColor:
                      addIconMode === "manual"
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.3)",
                    color:
                      addIconMode === "manual"
                        ? "white"
                        : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      background:
                        addIconMode === "manual"
                          ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  Classe FontAwesome
                </Button>
              </Box>

              {/* Predefined Icons Grid */}
              {addIconMode === "predefined" && (
                <>
                  <TextField
                    label="Rechercher une icône"
                    value={addIconSearch}
                    onChange={(e) => setAddIconSearch(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      input: { color: "white" },
                      label: { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: 1,
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 1,
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 1,
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {getFilteredIconsForAdd().map((iconOption) => (
                      <IconButton
                        key={iconOption.value}
                        onClick={() =>
                          updateAddFormField("icon", iconOption.value)
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          border:
                            addForm.icon === iconOption.value
                              ? "2px solid #3b82f6"
                              : "1px solid rgba(255, 255, 255, 0.2)",
                          background:
                            addForm.icon === iconOption.value
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(255, 255, 255, 0.05)",
                          color: "white",
                          fontSize: "1.2rem",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid #3b82f6",
                          },
                        }}
                      >
                        <i className={iconOption.value}></i>
                      </IconButton>
                    ))}
                  </Box>
                </>
              )}

              {/* Custom Icon URL Input */}
              {addIconMode === "custom" && (
                <TextField
                  label="URL de l'icône"
                  value={addCustomIconUrl}
                  onChange={(e) => setAddCustomIconUrl(e.target.value)}
                  fullWidth
                  placeholder="https://example.com/icon.png"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              )}

              {addIconMode === "manual" && (
                <TextField
                  label="Classe FontAwesome (ex: fas fa-atom)"
                  value={addForm.icon}
                  onChange={(e) => updateAddFormField("icon", e.target.value)}
                  fullWidth
                  placeholder="fas fa-atom"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                  }}
                />
              )}
            </Box>

            {/* Gradient Selection */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Gradient
              </Typography>

              <TextField
                label="Gradient personnalisé (CSS)"
                value={addForm.gradient}
                onChange={(e) => updateAddFormField("gradient", e.target.value)}
                fullWidth
                placeholder="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={closeAddModal}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={createAndAddNewLink}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LiensUtiles;
