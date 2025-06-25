import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ textAlign: "center" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                lineHeight: { xs: 1.2, md: 1.1 },
              }}
            >
              Ressources
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 500,
                maxWidth: 800,
                mx: "auto",
                mb: { xs: 3, md: 4 },
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                lineHeight: { xs: 1.4, md: 1.5 },
              }}
            >
              Découvrez notre collection de ressources éducatives pour enrichir
              votre parcours académique
            </Typography>
          </motion.div>
        </Container>
      </motion.section>

      {/* Search and Filters Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 3, md: 6 },
          px: 2,
          background: "transparent",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 4 },
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              Trouvez ce que vous cherchez
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                mb: { xs: 2, md: 3 },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TextField
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#6b7280" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: 600,
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    color: "white",
                    "&:hover": {
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    },
                    "&.Mui-focused": {
                      border: "1px solid #3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>

            {/* Categories */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, md: 2 },
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "1.25rem" },
                  textAlign: "center",
                }}
              >
                Catégories
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1, md: 1.5 },
                  justifyContent: "center",
                }}
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      background:
                        activeCategory === category
                          ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                          : "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      height: { xs: "28px", md: "32px" },
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Filters */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 1, md: 2 },
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", md: "1.25rem" },
                  textAlign: "center",
                }}
              >
                Types de ressources
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1, md: 1.5 },
                  justifyContent: "center",
                }}
              >
                {filters.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    onClick={() => setActiveFilter(filter)}
                    sx={{
                      background:
                        activeFilter === filter
                          ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                          : "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      height: { xs: "28px", md: "32px" },
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.2)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Resource Grid */}
      <motion.section
        className="py-20 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "60px" : "80px",
          paddingBottom: window.innerWidth < 600 ? "60px" : "80px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
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
                        background: resource.gradient,
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
                          background: resource.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: { xs: 2, md: 3 },
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
                          mb: { xs: 1, md: 2 },
                          transition: "all 0.3s ease",
                          fontSize: { xs: "0.9rem", md: "1.25rem" },
                        }}
                      >
                        {resource.title}
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
                        {resource.subject}
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
                        {resource.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={resource.type}
                          size="small"
                          sx={{
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59, 130, 246, 0.2)",
                            fontSize: { xs: "0.6rem", md: "0.75rem" },
                            height: { xs: "20px", md: "24px" },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: "0.6rem", md: "0.75rem" },
                          }}
                        >
                          {resource.pages}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 3, md: 6 },
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                size={window.innerWidth < 600 ? "small" : "medium"}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(255, 255, 255, 0.05)",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                    },
                    "&.Mui-selected": {
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                      color: "white",
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
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
