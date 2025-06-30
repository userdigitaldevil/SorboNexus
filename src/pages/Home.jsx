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
  Alert,
  Modal,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";
import FeatureCard from "../components/FeatureCard";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import AlumniProfileCard from "../components/AlumniProfileCard";

const features = [
  {
    icon: <BookOpen size={24} />,
    title: "Ressources Complètes",
    description:
      "Accédez à une bibliothèque de ressources pédagogiques, supports de cours et documents de référence pour tous les niveaux.",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
    path: "/ressources",
  },
  {
    icon: <Users size={24} />,
    title: "Réseau Alumni",
    description:
      "Connectez-vous avec les anciens étudiants pour des opportunités de mentorat, de stage et de développement professionnel.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    path: "/alumnis",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Conseils Pratiques",
    description:
      "Bénéficiez de conseils d'experts pour réussir vos études, gérer votre temps et préparer votre avenir professionnel.",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    path: "/conseils",
  },
  {
    icon: <Link size={24} />,
    title: "Liens Utiles",
    description:
      "Trouvez tous les liens essentiels vers les services universitaires, bibliothèques et plateformes pédagogiques.",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    path: "/liens-utiles",
  },
  {
    icon: <Calendar size={24} />,
    title: "Événements",
    description:
      "Restez informé des événements universitaires, conférences, ateliers et rencontres professionnelles.",
    gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
    path: "/evenements",
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Communauté",
    description:
      "Rejoignez une communauté active d'étudiants et diplômés pour échanger, collaborer et s'entraider.",
    gradient: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    path: "/communaute",
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

  // Function to handle navigation with scroll to top
  const handleCardNavigation = (path) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path);
  };

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/api/alumni`)
      .then((res) => res.json())
      .then((data) => {
        setAlumniCount(data.length);
        setAlumni(data);
      });
  }, []);

  // Scroll to top when component mounts (especially important for mobile)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Annonces state
  const [annonces, setAnnonces] = useState([]);
  const [annoncesTotal, setAnnoncesTotal] = useState(0);
  const [annoncesLoading, setAnnoncesLoading] = useState(true);
  const [annoncesError, setAnnoncesError] = useState("");
  const [annoncesModalOpen, setAnnoncesModalOpen] = useState(false);
  const [annoncesPage, setAnnoncesPage] = useState(1);
  const annoncesPerPage = 3;

  // Add form (admin)
  const [newAnnonceTitle, setNewAnnonceTitle] = useState("");
  const [newAnnonceContent, setNewAnnonceContent] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Admin detection
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(!!decoded.isAdmin);
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Fetch annonces (for home or modal)
  const fetchAnnonces = async (page = 1, perPage = 3) => {
    setAnnoncesLoading(true);
    setAnnoncesError("");
    try {
      const res = await fetch(
        `${process.env.VITE_API_URL}/api/annonces?skip=${
          (page - 1) * perPage
        }&take=${perPage}`
      );
      if (!res.ok) throw new Error("Erreur lors du chargement des annonces.");
      const data = await res.json();
      setAnnonces(data.annonces);
      setAnnoncesTotal(data.total);
    } catch (err) {
      setAnnoncesError(
        err.message || "Erreur lors du chargement des annonces."
      );
    } finally {
      setAnnoncesLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces(1, annoncesPerPage);
  }, []);

  // Modal pagination
  const handleOpenAnnoncesModal = () => {
    setAnnoncesPage(1);
    setAnnoncesModalOpen(true);
    fetchAnnonces(1, annoncesPerPage);
  };
  const handleCloseAnnoncesModal = () => setAnnoncesModalOpen(false);
  const handleAnnoncesPageChange = (page) => {
    setAnnoncesPage(page);
    fetchAnnonces(page, annoncesPerPage);
  };

  // Add annonce (admin)
  const handleAddAnnonce = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.VITE_API_URL}/api/annonces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newAnnonceTitle,
          content: newAnnonceContent,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'ajout de l'annonce.");
      }
      setNewAnnonceTitle("");
      setNewAnnonceContent("");
      fetchAnnonces(1, annoncesPerPage);
    } catch (err) {
      setAddError(err.message || "Erreur lors de l'ajout de l'annonce.");
    } finally {
      setAddLoading(false);
    }
  };

  // Delete annonce (admin)
  const handleDeleteAnnonce = async (id) => {
    if (!window.confirm("Supprimer cette annonce ?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VITE_API_URL}/api/annonces/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Erreur lors de la suppression.");
      fetchAnnonces(1, annoncesPerPage);
      if (annoncesModalOpen) fetchAnnonces(annoncesPage, annoncesPerPage);
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  // Format date
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Render annonce card
  function AnnonceCard({ annonce, showDelete }) {
    const [expanded, setExpanded] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    // Find the alumni in the main alumni list by user ID (any user in users array)
    const alumniFromList = alumni.find(
      (a) =>
        Array.isArray(a.users) &&
        a.users.some((u) => u.id === annonce.createdBy.id)
    );
    const alumniProfile = alumniFromList || annonce.createdBy.alumni;
    const name =
      alumniProfile?.name ||
      annonce.createdBy?.username ||
      "Utilisateur inconnu";
    // Simple logic: if content > 350 chars or > 8 lines, show 'Lire la suite'
    const maxChars = 350;
    const maxLines = 8;
    const contentLines = (annonce.content || "").split(/\r?\n/);
    const isLong =
      (annonce.content && annonce.content.length > maxChars) ||
      contentLines.length > maxLines;
    const previewContent = isLong
      ? contentLines.slice(0, maxLines).join("\n").slice(0, maxChars)
      : annonce.content;
    return (
      <>
        <Card
          sx={{
            background: "rgba(59,130,246,0.08)",
            border: "1.5px solid #3b82f6",
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(59,130,246,0.08)",
            maxWidth: 600,
            width: "100%",
            mx: "auto",
            p: 2,
            textAlign: "left",
            position: "relative",
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#3b82f6",
                  mr: 1,
                  cursor: alumniProfile ? "pointer" : "default",
                  textDecoration: alumniProfile ? "underline" : "none",
                }}
                onClick={() => alumniProfile && setProfileModalOpen(true)}
              >
                {name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {formatDate(annonce.createdAt)}
              </Typography>
              {showDelete && (
                <IconButton
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={() => handleDeleteAnnonce(annonce.id)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              )}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#f3f4f6",
                mb: 0.5,
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
              component="div"
            >
              <ReactMarkdown
                children={annonce.title}
                components={{
                  strong: ({ node, ...props }) => (
                    <strong style={{ color: "#fff" }} {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em style={{ color: "#e0e7ef" }} {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      style={{
                        background: "#222",
                        color: "#fff",
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: "0.98em",
                      }}
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      style={{
                        fontSize: "1.3em",
                        color: "#fff",
                        fontWeight: 800,
                        margin: 0,
                      }}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      style={{
                        fontSize: "1.15em",
                        color: "#fff",
                        fontWeight: 700,
                        margin: 0,
                      }}
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      style={{
                        fontSize: "1.05em",
                        color: "#fff",
                        fontWeight: 700,
                        margin: 0,
                      }}
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <span
                      {...props}
                      style={{ display: "block", marginBottom: 4 }}
                    />
                  ),
                }}
                skipHtml={false}
              />
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#f3f4f6",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                mt: 1,
                mb: 0.5,
                minHeight: 0,
              }}
              component="div"
            >
              <ReactMarkdown
                children={
                  expanded || !isLong
                    ? annonce.content
                    : previewContent + (isLong ? "..." : "")
                }
                components={{
                  p: ({ node, ...props }) => (
                    <span
                      {...props}
                      style={{ display: "block", marginBottom: 8 }}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      style={{ marginLeft: 16, marginBottom: 4 }}
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      style={{ marginLeft: 16, marginBottom: 8 }}
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      style={{ marginLeft: 16, marginBottom: 8 }}
                      {...props}
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      style={{
                        background: "#222",
                        color: "#fff",
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: "0.95em",
                      }}
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      style={{
                        background: "#222",
                        color: "#fff",
                        borderRadius: 6,
                        padding: 12,
                        fontSize: "0.98em",
                        overflowX: "auto",
                      }}
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      style={{
                        borderLeft: "3px solid #3b82f6",
                        margin: "8px 0",
                        padding: "4px 16px",
                        color: "#cbd5e1",
                        fontStyle: "italic",
                        background: "rgba(59,130,246,0.07)",
                      }}
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      style={{ color: "#60a5fa", textDecoration: "underline" }}
                      {...props}
                    />
                  ),
                }}
                skipHtml={false}
              />
              {isLong && (
                <Button
                  size="small"
                  sx={{
                    color: "#60a5fa",
                    textTransform: "none",
                    fontWeight: 600,
                    ml: 0,
                    mt: 1,
                    fontSize: "0.85rem",
                  }}
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? "Réduire" : "Lire la suite"}
                </Button>
              )}
            </Typography>
          </CardContent>
        </Card>
        {/* Alumni Profile Modal */}
        {alumniProfile && (
          <Modal
            open={profileModalOpen}
            onClose={() => setProfileModalOpen(false)}
            aria-labelledby="alumni-profile-modal-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: 600,
                width: "100%",
                maxHeight: { xs: "90vh", md: "80vh" },
                overflowY: "auto",
                outline: "none",
                bgcolor: "transparent",
                borderRadius: 3,
                boxShadow: 24,
              }}
            >
              <AlumniProfileCard
                alum={alumniProfile}
                isAdmin={false}
                onClose={() => setProfileModalOpen(false)}
              />
            </Box>
          </Modal>
        )}
      </>
    );
  }

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
          pt: { xs: "72px", sm: "72px" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
          transition={{ duration: 0.5, delay: 0.6 }}
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
          transition={{ duration: 0.5, delay: 0.8 }}
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
          transition={{ duration: 0.5, delay: 1.0 }}
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
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
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
                      mb: { xs: 2, md: 3 },
                      fontSize: {
                        xs: "1.8rem",
                        sm: "2.2rem",
                        md: "3.5rem",
                        lg: "4rem",
                      },
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
                      mb: { xs: 3, md: 4 },
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: 900,
                      mx: { xs: "auto", md: 0 },
                      fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    }}
                  >
                    SorboNexus est la plateforme créée pour les étudiants de
                    Jussieu, dédiée à accompagner votre réussite tout au long de
                    votre parcours universitaire et dans la préparation de vos
                    candidatures en master ou en école, en France comme à
                    l'international.
                    <br />
                    <br />
                    Vous y trouverez une multitude de ressources utiles :
                    modèles de lettres de motivation, informations détaillées
                    sur les UE, guides pour constituer vos dossiers, et conseils
                    pratiques pour chaque étape de votre cursus.
                    <br />
                    <br />
                    Découvrez également des retours d'expérience et témoignages
                    d'élèves ayant réussi les concours comme <b>
                      GEI-UNIV
                    </b>{" "}
                    (admissions parallèles), des oraux, et des intégrations dans
                    des écoles prestigieuses telles que{" "}
                    <b>
                      Polytechnique, ENS, CentraleSupélec, Dauphine, Sorbonne,
                      Paris-Saclay
                    </b>{" "}
                    et bien d'autres.
                    <br />
                    <br />
                    Le site propose aussi des fiches sur les écoles, des astuces
                    pour les candidatures à l'étranger, des exemples de CV, des
                    conseils pour les entretiens.
                    <br />
                    <br />
                    <span
                      style={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                        fontSize: "1.05em",
                        display: "block",
                        marginTop: "0.5em",
                      }}
                    >
                      Le site est encore en développement, mais vous pouvez dès
                      maintenant créer votre compte, personnaliser votre profil
                      et contribuer à enrichir la base de connaissances pour
                      aider les générations futures.
                      <br />
                      <span
                        style={{
                          color: "#3b82f6",
                          fontWeight: 700,
                          fontStyle: "italic",
                          fontSize: "1.1em",
                        }}
                      >
                        Explorez, partagez, et faites grandir la communauté !
                      </span>
                    </span>
                  </Typography>

                  {/* Action Buttons */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1.5, md: 2 }}
                    sx={{
                      mb: { xs: 3, md: 4 },
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleCardNavigation("/alumnis")}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={20} />}
                        sx={{
                          fontWeight: 600,
                          px: { xs: 3, md: 4 },
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: 3,
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                            boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)",
                          },
                        }}
                      >
                        Découvrez nos alumnis
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
                          px: { xs: 3, md: 4 },
                          py: { xs: 1.2, md: 1.5 },
                          borderRadius: 3,
                          color: "#3b82f6",
                          borderColor: "#3b82f6",
                          borderWidth: 2,
                          background: "rgba(59, 130, 246, 0.05)",
                          fontSize: { xs: "0.9rem", md: "1rem" },
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
                      gap: { xs: 2, md: 3 },
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
                            fontSize: { xs: "1.5rem", md: "2.125rem" },
                          }}
                        >
                          {formatCount(alumniCount)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: "0.7rem", md: "0.875rem" },
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
                            fontSize: { xs: "1.5rem", md: "2.125rem" },
                          }}
                        >
                          {formatCount(alumniWithLicenseBeforeCurrentYear)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: "0.7rem", md: "0.875rem" },
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
                            <FeatureCard
                              feature={feature}
                              index={index}
                              variant="mini"
                              onCardClick={() =>
                                handleCardNavigation(feature.path)
                              }
                            />
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
      {alumniId &&
        alumni.find(
          (a) =>
            String(a._id) === String(alumniId) ||
            String(a.id) === String(alumniId)
        )?.hidden && (
          <motion.section
            className="py-8 px-6 z-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Container
              maxWidth="lg"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Alert
                severity="warning"
                icon={false}
                sx={{
                  background: "rgba(239, 68, 68, 0.13)",
                  border: "1.5px solid #ef4444",
                  color: "#b91c1c",
                  fontWeight: 600,
                  borderRadius: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  maxWidth: 600,
                  mx: "auto",
                }}
                iconMapping={{
                  warning: (
                    <WarningAmberIcon
                      sx={{ mr: 1, fontSize: 28, color: "#ef4444" }}
                    />
                  ),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningAmberIcon
                    sx={{ fontSize: 24, color: "#ef4444", mr: 1 }}
                  />
                  Votre profil est caché parce que vous avez choisi de le
                  masquer, ou parce qu'un administrateur l'a masqué
                  (informations incomplètes).
                </Box>
              </Alert>
            </Container>
          </motion.section>
        )}

      {/* Annonces Section */}
      <Box component="section" sx={{ py: { xs: 4, md: 8 }, px: 2 }}>
        <Container maxWidth="md">
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
                mb: { xs: 3, md: 5 },
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Annonces
            </Typography>
            {annoncesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : annoncesError ? (
              <Alert severity="error">{annoncesError}</Alert>
            ) : (
              <Stack spacing={3} alignItems="center">
                {annonces.length === 0 && (
                  <Typography variant="body1" sx={{ color: "#64748b" }}>
                    Aucune annonce pour le moment.
                  </Typography>
                )}
                {annonces.map((annonce) => (
                  <AnnonceCard
                    key={annonce.id}
                    annonce={annonce}
                    showDelete={isAdmin}
                  />
                ))}
              </Stack>
            )}
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleOpenAnnoncesModal}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                Voir les annonces passées
              </Button>
            </Box>
            {isAdmin && (
              <Box
                component="form"
                onSubmit={handleAddAnnonce}
                sx={{
                  mt: 5,
                  maxWidth: 600,
                  mx: "auto",
                  textAlign: "left",
                  background: "rgba(30,41,59,0.04)",
                  borderRadius: 2,
                  p: 3,
                  boxShadow: "0 2px 8px rgba(59,130,246,0.06)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "#3b82f6" }}
                >
                  Ajouter une annonce
                </Typography>
                <TextField
                  label="Titre (Markdown supporté)"
                  value={newAnnonceTitle}
                  onChange={(e) => setNewAnnonceTitle(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{
                    mb: 2,
                    fontFamily: "inherit",
                    color: "#f3f4f6",
                    background: "rgba(59,130,246,0.04)",
                  }}
                  inputProps={{
                    style: {
                      color: "#f3f4f6",
                      fontFamily: "inherit",
                      background: "rgba(59,130,246,0.04)",
                    },
                  }}
                  required
                  placeholder={
                    "Vous pouvez utiliser du Markdown, des titres, etc."
                  }
                />
                <TextField
                  label="Contenu (Markdown supporté)"
                  value={newAnnonceContent}
                  onChange={(e) => setNewAnnonceContent(e.target.value)}
                  fullWidth
                  multiline
                  minRows={4}
                  sx={{
                    mb: 2,
                    fontFamily: "inherit",
                    color: "#f3f4f6",
                    background: "rgba(59,130,246,0.04)",
                  }}
                  inputProps={{
                    style: {
                      color: "#f3f4f6",
                      fontFamily: "inherit",
                      background: "rgba(59,130,246,0.04)",
                    },
                  }}
                  required
                  placeholder={
                    "Vous pouvez utiliser du Markdown, des listes, des titres, etc."
                  }
                />
                {addError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {addError}
                  </Alert>
                )}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={addLoading}
                  >
                    {addLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Publier"
                    )}
                  </Button>
                </Box>
              </Box>
            )}
            {/* Modal for past annonces */}
            <Modal open={annoncesModalOpen} onClose={handleCloseAnnoncesModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "#18181b",
                  p: 4,
                  borderRadius: 2,
                  minWidth: 320,
                  maxWidth: 600,
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: 24,
                  scrollBehavior: "smooth",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: "#3b82f6",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  Annonces passées
                </Typography>
                {annoncesLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <CircularProgress color="primary" />
                  </Box>
                ) : annoncesError ? (
                  <Alert severity="error">{annoncesError}</Alert>
                ) : (
                  <Stack spacing={3} alignItems="center">
                    {annonces.length === 0 && (
                      <Typography variant="body1" sx={{ color: "#64748b" }}>
                        Aucune annonce pour le moment.
                      </Typography>
                    )}
                    {annonces.map((annonce) => (
                      <AnnonceCard
                        key={annonce.id}
                        annonce={annonce}
                        showDelete={isAdmin}
                      />
                    ))}
                  </Stack>
                )}
                {/* Pagination */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  {annoncesTotal > annoncesPerPage && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        variant="outlined"
                        disabled={annoncesPage === 1}
                        onClick={() =>
                          handleAnnoncesPageChange(annoncesPage - 1)
                        }
                      >
                        Précédent
                      </Button>
                      <Typography sx={{ color: "#3b82f6", fontWeight: 600 }}>
                        Page {annoncesPage} /{" "}
                        {Math.ceil(annoncesTotal / annoncesPerPage)}
                      </Typography>
                      <Button
                        variant="outlined"
                        disabled={
                          annoncesPage ===
                          Math.ceil(annoncesTotal / annoncesPerPage)
                        }
                        onClick={() =>
                          handleAnnoncesPageChange(annoncesPage + 1)
                        }
                      >
                        Suivant
                      </Button>
                    </Stack>
                  )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button onClick={handleCloseAnnoncesModal} sx={{ mt: 2 }}>
                    Fermer
                  </Button>
                </Box>
              </Box>
            </Modal>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        component="section"
        sx={{
          py: { xs: 4, md: 8 },
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
                mb: { xs: 3, md: 6 },
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
              }}
            >
              Notre plateforme vous offre
            </Typography>
          </motion.div>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            sx={{
              maxWidth: "1200px",
              margin: "0 auto",
              px: { xs: 1, sm: 2 },
            }}
          >
            {features.map((feature, index) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={index}>
                <FeatureCard
                  feature={feature}
                  index={index}
                  variant="full"
                  onCardClick={() => handleCardNavigation(feature.path)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 4, md: 8 },
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
                fontSize: { xs: "1.25rem", md: "1.75rem" },
              }}
            >
              Notre Impact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: { xs: 2, md: 4 },
                fontSize: { xs: "0.8rem", md: "0.95rem" },
              }}
            >
              Découvrez l'ampleur de notre communauté
            </Typography>

            {/* Simple Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: window.innerWidth < 600 ? "2rem" : "4rem",
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
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
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
                    fontSize: { xs: "0.75rem", md: "0.9rem" },
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
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
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
                    fontSize: { xs: "0.75rem", md: "0.9rem" },
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
          py: { xs: 4, md: 8 },
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
                mb: { xs: 2, md: 3 },
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Contribuez au Projet
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mb: { xs: 3, md: 4 },
                fontWeight: 500,
                maxWidth: 800,
                mx: "auto",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
              }}
            >
              Seth est ouvert à tous vos feedbacks, pull requests et
              contributions !<br />
              Vous êtes invités à compléter votre profil alumni et à partager
              les conseils et ressources qui vous ont aidé dans votre parcours
              pour inspirer et aider la communauté.
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
                  p: { xs: 2, md: 4 },
                  maxWidth: 600,
                  mx: "auto",
                  mb: { xs: 3, md: 4 },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: { xs: 2, md: 3 },
                    lineHeight: 1.7,
                    fontSize: { xs: "0.8rem", md: "1rem" },
                  }}
                >
                  SorboNexus est un projet open source développé pour la
                  communauté étudiante. Vos suggestions, améliorations et
                  contributions sont les bienvenues !
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1.5, md: 2 }}
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
                        px: { xs: 3, md: 4 },
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 3,
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                        fontSize: { xs: "0.8rem", md: "1rem" },
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
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={
                        <Box
                          component="span"
                          sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
                        >
                          ✉️
                        </Box>
                      }
                      sx={{
                        color: "#3b82f6",
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                        fontWeight: 600,
                        px: { xs: 3, md: 4 },
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 3,
                        fontSize: { xs: "0.8rem", md: "1rem" },
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
                fontSize: { xs: "0.7rem", md: "0.875rem" },
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
