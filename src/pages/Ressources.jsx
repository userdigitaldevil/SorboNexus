import { motion } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
} from "@mui/material";
import { ArrowRight, Search } from "lucide-react";

export default function Ressources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes les ressources");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    "Toutes les ressources",
    "Informatique",
    "Mathématiques",
    "Physique",
    "Histoire",
  ];

  const filters = ["Tous", "Cours", "TD", "Examens", "Livres"];

  const resources = [
    {
      id: 1,
      title: "Algorithmique Avancée",
      subject: "Licence 3 - Informatique",
      description:
        "Cours complet sur les algorithmes avancés avec exemples et exercices pratiques. Inclut les graphes, algorithmes de tri et complexité.",
      icon: "fas fa-file-pdf",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      type: "PDF",
      pages: "42 pages",
      category: "Informatique",
      filter: "Cours",
    },
    {
      id: 2,
      title: "Analyse Mathématique",
      subject: "Licence 2 - Mathématiques",
      description:
        "Notes de cours complètes sur l'analyse réelle, suites et séries, fonctions de plusieurs variables. Avec corrigés d'exercices.",
      icon: "fas fa-file-alt",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      type: "PDF",
      pages: "120 pages",
      category: "Mathématiques",
      filter: "Cours",
    },
    {
      id: 3,
      title: "TP Chimie Organique",
      subject: "Licence 1 - Chimie",
      description:
        "Guide complet de travaux pratiques avec protocoles expérimentaux, fiches techniques et conseils de sécurité.",
      icon: "fas fa-vial",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      type: "TP",
      pages: "TP",
      category: "Physique",
      filter: "TD",
    },
    {
      id: 4,
      title: "Histoire Moderne",
      subject: "Licence 2 - Histoire",
      description:
        "Chronologie détaillée de la période moderne (1492-1789) avec analyses des événements clés et biographies des figures importantes.",
      icon: "fas fa-history",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      type: "PDF",
      pages: "85 pages",
      category: "Histoire",
      filter: "Cours",
    },
    {
      id: 5,
      title: "Grammaire Anglaise",
      subject: "Licence 1 - Langues",
      description:
        "Guide complet de grammaire anglaise avec exercices corrigés, listes de vocabulaire et conseils pour la prononciation.",
      icon: "fas fa-language",
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      type: "PDF",
      pages: "64 pages",
      category: "Histoire",
      filter: "Livres",
    },
    {
      id: 6,
      title: "Web Development",
      subject: "Master 1 - Informatique",
      description:
        "Projet complet de développement web avec HTML, CSS, JavaScript et React. Inclut les bonnes pratiques et optimisation.",
      icon: "fas fa-laptop-code",
      gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
      type: "Projet",
      pages: "Projet",
      category: "Informatique",
      filter: "TD",
    },
    {
      id: 7,
      title: "Physique Quantique",
      subject: "Licence 3 - Physique",
      description:
        "Cours approfondi sur les principes de la mécanique quantique avec applications pratiques et exercices résolus.",
      icon: "fas fa-atom",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      type: "PDF",
      pages: "95 pages",
      category: "Physique",
      filter: "Cours",
    },
    {
      id: 8,
      title: "Examen Final Mathématiques",
      subject: "Licence 2 - Mathématiques",
      description:
        "Sujet d'examen avec corrigé détaillé pour l'évaluation finale en analyse et algèbre linéaire.",
      icon: "fas fa-file-alt",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      type: "PDF",
      pages: "Examen",
      category: "Mathématiques",
      filter: "Examens",
    },
    {
      id: 9,
      title: "Livre de Référence - Histoire",
      subject: "Licence 3 - Histoire",
      description:
        "Ouvrage de référence complet sur l'histoire contemporaine avec bibliographie et index détaillés.",
      icon: "fas fa-book",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      type: "PDF",
      pages: "320 pages",
      category: "Histoire",
      filter: "Livres",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "Toutes les ressources" ||
      resource.category === activeCategory;
    const matchesFilter =
      activeFilter === "Tous" || resource.filter === activeFilter;

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = filteredResources.slice(startIndex, endIndex);

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
        className="relative pt-40 pb-32 px-6 bg-gradient-to-r from-blue-900/30 to-teal-900/30 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
                  mb: 4,
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  mt: 6,
                }}
              >
                <span style={{ display: "block" }}>Ressources</span>
                <span style={{ display: "block" }}>Académiques</span>
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
                  mb: 8,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Accédez à une bibliothèque complète de ressources pédagogiques,
                supports de cours, et outils d'apprentissage pour toutes les
                disciplines.{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Explorez, découvrez et apprenez !
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
                placeholder="Rechercher des ressources par nom, matière ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#6b7280" />
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
                      fontSize: "1rem",
                      padding: "16px",
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
        className="py-16 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 12 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                pt: 4,
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
                      fontSize: "0.875rem",
                      padding: "8px 16px",
                      height: "auto",
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

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                mt: 2,
              }}
            >
              {filters.map((filter, index) => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index + 5) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={filter}
                    onClick={() => setActiveFilter(filter)}
                    sx={{
                      background:
                        activeFilter === filter
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(255, 255, 255, 0.08)",
                      color:
                        activeFilter === filter
                          ? "#3b82f6"
                          : "rgba(255, 255, 255, 0.8)",
                      border:
                        activeFilter === filter
                          ? "1px solid #3b82f6"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(20px)",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      padding: "8px 16px",
                      height: "auto",
                      "&:hover": {
                        background:
                          activeFilter === filter
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(255, 255, 255, 0.12)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </Container>
      </motion.section>

      {/* Resource Grid */}
      <motion.section
        className="py-20 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {currentResources.map((resource, index) => (
              <Grid xs={12} sm={6} md={4} key={resource.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      maxWidth: 320,
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
                        background: resource.gradient,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        className="resource-icon"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: resource.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          color: "white",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <i className={`${resource.icon} text-xl`}></i>
                      </Box>
                      <Typography
                        variant="h6"
                        className="resource-title"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {resource.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#3b82f6",
                          fontSize: "0.875rem",
                          mb: 3,
                        }}
                      >
                        {resource.subject}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#a1a1aa",
                          mb: 4,
                          lineHeight: 1.6,
                        }}
                      >
                        {resource.description}
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
                            fontSize: "0.75rem",
                          }}
                        >
                          <i className="fas fa-file-alt mr-1"></i>{" "}
                          {resource.pages} • {resource.type}
                        </Typography>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            endIcon={<ArrowRight size={16} />}
                            sx={{
                              fontWeight: 600,
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                              fontSize: "0.75rem",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)",
                              },
                            }}
                          >
                            Télécharger
                          </Button>
                        </motion.div>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  size="large"
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

      {/* Upload Section */}
      <motion.section
        className="py-24 px-6 bg-gradient-to-r from-blue-900/40 to-teal-900/40 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", position: "relative" }}>
            {/* Floating shape */}
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-teal-400/20 rounded-full blur-2xl z-0"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Partagez vos ressources
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 10,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: "auto",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Vous avez des notes de cours, des résumés ou des exercices
                utiles ?{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Contribuez à enrichir la communauté SorboNexus
                </span>{" "}
                en partageant vos ressources.
              </Typography>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<i className="fas fa-plus"></i>}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                  fontSize: "1rem",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Ajouter une ressource
              </Button>
            </motion.div>
          </Box>
        </Container>
      </motion.section>
    </div>
  );
}
