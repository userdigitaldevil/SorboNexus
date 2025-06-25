import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  Lightbulb,
  Link,
  Calendar,
  MessageCircle,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Grid,
  Container,
  Link as MuiLink,
  Avatar,
  Rating,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";

const features = [
  {
    icon: <BookOpen size={24} />,
    title: "Ressources Complètes",
    description:
      "Accédez à une bibliothèque de ressources pédagogiques, supports de cours et documents de référence pour tous les niveaux.",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    icon: <Users size={24} />,
    title: "Réseau Alumni",
    description:
      "Connectez-vous avec les anciens étudiants pour des opportunités de mentorat, de stage et de développement professionnel.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Conseils Pratiques",
    description:
      "Bénéficiez de conseils d'experts pour réussir vos études, gérer votre temps et préparer votre avenir professionnel.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    icon: <Link size={24} />,
    title: "Liens Utiles",
    description:
      "Trouvez tous les liens essentiels vers les services universitaires, bibliothèques et plateformes pédagogiques.",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    icon: <Calendar size={24} />,
    title: "Événements",
    description:
      "Restez informé des événements universitaires, conférences, ateliers et rencontres professionnelles.",
    gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Communauté",
    description:
      "Rejoignez une communauté active d'étudiants et diplômés pour échanger, collaborer et s'entraider.",
    gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
  },
];

const testimonials = [
  {
    name: "Marie Jeanne",
    initials: "MJ",
    rating: 5,
    text: "SorboNexus m'a permis de trouver des ressources essentielles pour mon mémoire. La communauté est incroyablement solidaire et les conseils des alumnis m'ont ouvert des portes pour mon stage.",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  },
  {
    name: "Thomas Laurent",
    initials: "TL",
    rating: 4.5,
    text: "En tant qu'alumni, je trouve SorboNexus indispensable pour rester connecté avec l'université. C'est aussi une excellente plateforme pour partager mon expérience professionnelle avec les étudiants actuels.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  },
  {
    name: "Sophie Ahmed",
    initials: "SA",
    rating: 5,
    text: "La section 'conseils' m'a beaucoup aidée dans mon orientation professionnelle. J'ai pu prendre contact avec des professionnels dans mon domaine grâce au réseau alumni.",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

const stats = [
  { value: "1.5K+", label: "Étudiants actifs" },
  { value: "850+", label: "Alumnis inscrits" },
  { value: "2.7K+", label: "Ressources" },
  { value: "98%", label: "Satisfaction" },
];

export default function Home() {
  // Live alumni count
  const [alumniCount, setAlumniCount] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const navigate = useNavigate();

  // Get current year
  const currentYear = new Date().getFullYear();

  // Get alumniId from JWT
  let alumniId = null;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        alumniId = decoded.alumniId;
      } catch (e) {
        alumniId = null;
      }
    }
  }

  useEffect(() => {
    fetch("http://localhost:5001/api/alumni")
      .then((res) => res.json())
      .then((data) => {
        setAlumniCount(data.length);
        setAlumni(data);
      });
  }, []);

  // Format number as 1.5K if >= 1000
  function formatCount(n) {
    if (n == null) return "...";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
    return n + "+";
  }

  // Count alumni who completed their license before current year
  const alumniWithLicenseBeforeCurrentYear = alumni.filter((alum) => {
    if (!alum.anneeFinL3) return false;
    const anneeFin = parseInt(alum.anneeFinL3);
    return !isNaN(anneeFin) && anneeFin <= currentYear;
  }).length;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          pt: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 1 }}
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        {/* Floating Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          style={{
            position: "absolute",
            top: "25%",
            right: "20%",
            color: "#3b82f6",
          }}
        >
          <Sparkles size={24} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          style={{
            position: "absolute",
            bottom: "30%",
            left: "15%",
            color: "#06b6d4",
          }}
        >
          <Star size={20} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          style={{
            position: "absolute",
            top: "60%",
            left: "25%",
            color: "#8b5cf6",
          }}
        >
          <Zap size={18} />
        </motion.div>

        {/* Main Hero Content */}
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {/* Left Side - Text Content */}
            <Grid xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    textAlign: { xs: "center", md: "left" },
                  }}
                >
                  {/* Main Title */}
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      mb: 3,
                      fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                      lineHeight: 1.1,
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      position: "relative",
                    }}
                  >
                    Bienvenue sur{" "}
                    <span style={{ display: "block" }}>SorboNexus</span>
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      mb: 4,
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: 500,
                      mx: { xs: "auto", md: 0 },
                    }}
                  >
                    Votre portail vers les ressources, conseils, liens utiles et
                    le réseau des alumnis de la communauté Sorbonne.{" "}
                    <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                      Explorez, apprenez et connectez-vous !
                    </span>
                  </Typography>

                  {/* Action Buttons */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      mb: 4,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        component={RouterLink}
                        to="/ressources"
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={20} />}
                        sx={{
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                          fontSize: "1rem",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                            boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)",
                          },
                        }}
                      >
                        Découvrez nos ressources
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        component={MuiLink}
                        href="#features"
                        variant="outlined"
                        size="large"
                        sx={{
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          color: "#3b82f6",
                          borderColor: "#3b82f6",
                          borderWidth: 2,
                          background: "rgba(59, 130, 246, 0.05)",
                          fontSize: "1rem",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1)",
                            borderColor: "#1e40af",
                            borderWidth: 2,
                          },
                        }}
                      >
                        En savoir plus
                      </Button>
                    </motion.div>
                  </Stack>

                  {/* Stats Preview */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      flexWrap: "wrap",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1 }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: "#3b82f6",
                            mb: 0.5,
                          }}
                        >
                          {formatCount(alumniCount)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Étudiants actifs
                        </Typography>
                      </Box>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: "#3b82f6",
                            mb: 0.5,
                          }}
                        >
                          {formatCount(alumniWithLicenseBeforeCurrentYear)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: "0.875rem",
                          }}
                        >
                          Alumnis qui ont eu leur licence avant {currentYear}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Side - Visual Card */}
            <Grid xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ perspective: "1000px" }}
              >
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;

                      // Calculate mouse position relative to center
                      const relativeX = (x - centerX) / centerX;
                      const relativeY = (y - centerY) / centerY;

                      // Update CSS custom properties for color interpolation
                      e.currentTarget.style.setProperty("--mouse-x", relativeX);
                      e.currentTarget.style.setProperty("--mouse-y", relativeY);
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "24px",
                        p: 4,
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: "16px",
                          left: "50%",
                          transform:
                            "translateX(calc(-50% + var(--mouse-x, 0) * 20px))",
                          width: "60%",
                          height: "2px",
                          background:
                            "linear-gradient(90deg, transparent, #3b82f6, #06b6d4, #3b82f6, transparent)",
                          borderRadius: "1px",
                          filter: "blur(0.5px)",
                          opacity: 0.8,
                          zIndex: 1,
                        },
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.12)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.2)",
                          "&::before": {
                            opacity: 1,
                            filter: "blur(1px)",
                          },
                        },
                      }}
                    >
                      {/* Feature Highlights */}
                      <Grid
                        container
                        spacing={3}
                        sx={{ justifyContent: "center", alignItems: "center" }}
                      >
                        {features.slice(0, 4).map((feature, index) => (
                          <Grid xs={6} key={index}>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.6,
                                delay: 1.5 + index * 0.1,
                              }}
                              whileHover={{ scale: 1.1 }}
                              style={{ height: "100%" }}
                            >
                              <Box
                                className="feature-highlight"
                                component={RouterLink}
                                to={
                                  index === 0
                                    ? "/ressources"
                                    : index === 1
                                    ? "/alumnis"
                                    : index === 2
                                    ? "/conseils"
                                    : index === 3
                                    ? "/liens-utiles"
                                    : "/"
                                }
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  textAlign: "center",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  minHeight: 100,
                                  textDecoration: "none",
                                  color: "inherit",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.15)",
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                                  },
                                }}
                              >
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.6 }}
                                >
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 2,
                                      background: feature.gradient,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      margin: "0 auto 8px",
                                      color: "white",
                                      transition: "all 0.3s ease",
                                    }}
                                  >
                                    {feature.icon}
                                  </Box>
                                </motion.div>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: "white",
                                    fontSize: "0.75rem",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                              </Box>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Bottom Accent */}
                      <motion.div
                        className="bottom-accent"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        transition={{ duration: 1, delay: 2 }}
                        style={{
                          height: "2px",
                          background:
                            "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                          marginTop: 24,
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Card>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Hidden Profile Message */}
      {alumniId && alumni.find((a) => a._id === alumniId)?.hidden && (
        <motion.section
          className="py-8 px-6 z-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#ef4444",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Votre profil est caché
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(239, 68, 68, 0.8)",
                  mb: 2,
                }}
              >
                Modifier votre carte pour l'afficher aux autres utilisateurs
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/alumnis?editSelf=1")}
                sx={{
                  color: "#ef4444",
                  borderColor: "#ef4444",
                  "&:hover": {
                    borderColor: "#dc2626",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                Modifier ma carte
              </Button>
            </Box>
          </Container>
        </motion.section>
      )}

      {/* Features Section */}
      <Box
        id="features"
        component="section"
        sx={{
          py: 8,
          px: 2,
          background: "rgba(255,255,255,0.02)",
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
              variant="h3"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Notre plateforme vous offre
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        background: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: feature.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          color: "white",
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box component="section" sx={{ py: 8, px: 2 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Ce que disent nos utilisateurs
            </Typography>
          </motion.div>

          <Stack spacing={3}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                  x: 5,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)",
                      transform: "translateY(-2px)",
                      "& .testimonial-avatar": {
                        transform: "scale(1.1) rotate(5deg)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
                      },
                      "& .testimonial-quote": {
                        color: "rgba(255, 255, 255, 0.9)",
                      },
                      "& .testimonial-name": {
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
                      background: `linear-gradient(90deg, ${
                        testimonial.gradient.split(",")[0]
                      }, ${testimonial.gradient.split(",")[1]})`,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover::before": {
                      opacity: 1,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Avatar
                          className="testimonial-avatar"
                          sx={{
                            width: 48,
                            height: 48,
                            background: testimonial.gradient,
                            fontWeight: 700,
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                        >
                          {testimonial.initials}
                        </Avatar>
                      </motion.div>
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            className="testimonial-name"
                            sx={{
                              fontWeight: 600,
                              transition: "all 0.3s ease",
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Rating
                              value={testimonial.rating}
                              precision={0.5}
                              readOnly
                              size="small"
                              sx={{
                                "& .MuiRating-iconFilled": {
                                  color: "#fbbf24",
                                },
                                "& .MuiRating-iconHover": {
                                  color: "#f59e0b",
                                },
                              }}
                            />
                          </motion.div>
                        </Box>
                        <Typography
                          variant="body2"
                          className="testimonial-quote"
                          sx={{
                            color: "#a1a1aa",
                            fontStyle: "italic",
                            transition: "all 0.3s ease",
                            lineHeight: 1.6,
                          }}
                        >
                          "{testimonial.text}"
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        component="section"
        sx={{
          py: 8,
          px: 2,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: "center" }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 1,
                fontSize: "1.75rem",
              }}
            >
              Notre Impact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 4,
                fontSize: "0.95rem",
              }}
            >
              Découvrez l'ampleur de notre communauté
            </Typography>

            {/* Simple Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4rem",
                flexWrap: "wrap",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                style={{ textAlign: "center" }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    background:
                      "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "2.5rem",
                    mb: 0.5,
                  }}
                >
                  {formatCount(alumniCount)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Étudiants actifs
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ textAlign: "center" }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    background:
                      "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontSize: "2.5rem",
                    mb: 0.5,
                  }}
                >
                  {formatCount(alumniWithLicenseBeforeCurrentYear)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  Alumnis qui ont eu leur licence avant {currentYear}
                </Typography>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Box>

      {/* Feedback & Contributions Section */}
      <Box
        component="section"
        sx={{
          py: 8,
          px: 2,
          background: "rgba(255,255,255,0.02)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: "center" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 3,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Contribuez au Projet
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: 4,
                fontWeight: 500,
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Je suis ouvert aux retours, modifications du site et contributions
              de la communauté
            </Typography>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                elevation={0}
                sx={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 4,
                  p: 4,
                  maxWidth: 600,
                  mx: "auto",
                  mb: 4,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  SorboNexus est un projet open source développé pour la
                  communauté étudiante. Vos suggestions, améliorations et
                  contributions sont les bienvenues !
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      href="https://github.com/userdigitaldevil/SorboNexus/"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                        color: "white",
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                        fontSize: "1rem",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                          boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Voir le Repository GitHub
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      href="mailto:sethaguila@icloud.com"
                      startIcon={
                        <Box component="span" sx={{ fontSize: "1.2rem" }}>
                          ✉️
                        </Box>
                      }
                      sx={{
                        color: "#3b82f6",
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontSize: "1rem",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1)",
                          borderColor: "#1e40af",
                          borderWidth: 2,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Envoyer un Feedback
                    </Button>
                  </motion.div>
                </Stack>
              </Card>
            </motion.div>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontStyle: "italic",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              © 2025 Seth Aguila - Développé avec &lt;3 pour la communauté
              Sorbonne Sciences Jussieu
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
