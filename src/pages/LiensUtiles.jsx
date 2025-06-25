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
} from "@mui/icons-material";

const LiensUtiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous les liens");
  const [bookmarkedLinks, setBookmarkedLinks] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const categories = [
    "Tous les liens",
    "Université",
    "Bibliothèques",
    "Services",
    "Carrière",
    "Outils",
  ];

  const links = [
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
  ];

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "Tous les liens" || link.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredLinks.slice(startIndex, endIndex);

  const toggleBookmark = (linkId) => {
    const newBookmarked = new Set(bookmarkedLinks);
    if (newBookmarked.has(linkId)) {
      newBookmarked.delete(linkId);
    } else {
      newBookmarked.add(linkId);
    }
    setBookmarkedLinks(newBookmarked);
  };

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
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: { xs: 3, md: 8 },
                  fontWeight: 400,
                  lineHeight: { xs: 1.4, md: 1.6 },
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                Découvrez tous les liens essentiels vers les services
                universitaires, bibliothèques et plateformes pédagogiques.{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Organisez et accédez facilement à vos ressources !
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ maxWidth: 600, mx: "auto" }}
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
          paddingTop: window.innerWidth < 600 ? "32px" : "32px",
          paddingBottom: window.innerWidth < 600 ? "32px" : "32px",
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
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {currentLinks.map((link, index) => (
              <Grid xs={12} sm={6} md={4} key={link.id}>
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
                        "& .link-icon": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                        "& .link-title": {
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
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: { xs: 2, md: 3 },
                        }}
                      >
                        <Box
                          className="link-icon"
                          sx={{
                            width: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                            borderRadius: 2,
                            background: link.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <i className={`${link.icon} text-xl`}></i>
                        </Box>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(link.id);
                          }}
                          sx={{
                            color: bookmarkedLinks.has(link.id)
                              ? "#3b82f6"
                              : "rgba(255, 255, 255, 0.6)",
                            "&:hover": {
                              color: "#3b82f6",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          {bookmarkedLinks.has(link.id) ? (
                            <BookmarkFilledIcon
                              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            />
                          ) : (
                            <BookmarkIcon
                              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            />
                          )}
                        </IconButton>
                      </Box>

                      <Typography
                        variant="h6"
                        className="link-title"
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
                          fontSize: { xs: "0.7rem", md: "0.875rem" },
                          mb: { xs: 2, md: 3 },
                        }}
                      >
                        {link.category}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#a1a1aa",
                          mb: { xs: 3, md: 4 },
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
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6b7280",
                            fontSize: { xs: "0.65rem", md: "0.75rem" },
                          }}
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          Lien externe
                        </Typography>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={
                              <ArrowRight
                                sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
                              />
                            }
                            onClick={() => window.open(link.url, "_blank")}
                            sx={{
                              fontWeight: 600,
                              px: { xs: 1.5, md: 2 },
                              py: { xs: 0.5, md: 0.5 },
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                              color: "white",
                              textTransform: "none",
                              fontSize: { xs: "0.65rem", md: "0.75rem" },
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                              },
                            }}
                          >
                            Visiter
                          </Button>
                        </motion.div>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.section>

      {/* Additional Resources Section */}
      <motion.section
        className="py-20 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "60px" : "80px",
          paddingBottom: window.innerWidth < 600 ? "60px" : "80px",
        }}
      >
        <Container maxWidth="lg">
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
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 4,
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ressources Complémentaires
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Outils et plateformes supplémentaires pour enrichir votre
              expérience académique
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      background: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "white",
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Outils Étudiants
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a1a1aa", mb: 3 }}>
                    Applications et outils essentiels pour la gestion de vos
                    études, prises de notes et organisation.
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-blue-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Gestionnaires de tâches"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-blue-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Applications de prise de notes"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-blue-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Outils de collaboration"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                  </List>
                </Card>
              </motion.div>
            </Grid>

            <Grid xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      background: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "white",
                    }}
                  >
                    <VideoIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Apprentissage
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a1a1aa", mb: 3 }}>
                    Plateformes de cours en ligne, tutoriels et ressources pour
                    approfondir vos connaissances.
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-purple-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Cours en ligne gratuits"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-purple-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Tutoriels vidéo"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-purple-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Exercices interactifs"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                  </List>
                </Card>
              </motion.div>
            </Grid>

            <Grid xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    p: 4,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      background: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      color: "white",
                    }}
                  >
                    <i className="fas fa-users text-2xl"></i>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Communauté
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a1a1aa", mb: 3 }}>
                    Forums, groupes d'étude et réseaux sociaux pour échanger
                    avec d'autres étudiants.
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-green-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Forums d'entraide"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-green-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Groupes d'étude"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <i className="fas fa-check text-green-400"></i>
                      </ListItemIcon>
                      <ListItemText
                        primary="Réseaux sociaux académiques"
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </ListItem>
                  </List>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              p: 8,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-teal-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-400/20 rounded-full blur-2xl" />
            </motion.div>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 4,
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
                zIndex: 1,
              }}
            >
              Besoin d'aide pour organiser vos liens ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 6,
                maxWidth: 600,
                mx: "auto",
                position: "relative",
                zIndex: 1,
              }}
            >
              Utilisez la fonctionnalité de favoris pour sauvegarder vos liens
              préférés et y accéder rapidement.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight />}
                sx={{
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  color: "white",
                  textTransform: "none",
                  fontSize: "1.1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(59, 130, 246, 0.4)",
                  },
                }}
              >
                Commencer à organiser
              </Button>
            </motion.div>
          </Box>
        </Container>
      </motion.section>
    </div>
  );
};

export default LiensUtiles;
