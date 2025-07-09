import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  Lightbulb,
  Link,
  Calendar,
  MessageCircle,
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
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";
import FeatureCard from "../components/FeatureCard";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import AlumniProfileCard from "../components/AlumniProfileCard";
import { DOMAIN_COLORS } from "../components/AlumniCard.jsx";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Helper function to get alumni card color (same logic as Conseils page)
function getAlumniCardColor(alumni) {
  // Use domains array if available, otherwise fall back to field
  let alumDomains = [];

  if (Array.isArray(alumni.domains) && alumni.domains.length > 0) {
    alumDomains = alumni.domains;
  } else if (Array.isArray(alumni.field) && alumni.field.length > 0) {
    alumDomains = alumni.field;
  } else if (typeof alumni.field === "string" && alumni.field.trim() !== "") {
    // Handle comma-separated field string like "Mathématiques,Informatique"
    alumDomains = alumni.field
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  }

  // Sort domains alphabetically for consistent gradient order
  const sortedDomains = [...alumDomains].sort((a, b) => a.localeCompare(b));
  const profileColors = sortedDomains.map(
    (domain) => DOMAIN_COLORS[domain.trim()] || "#888"
  );

  let domainBg;
  if (alumni.customCardColor && alumni.customCardColor.trim() !== "") {
    domainBg = alumni.customCardColor;
  } else if (alumni.color && alumni.color.trim() !== "") {
    domainBg = alumni.color;
  } else if (profileColors.length === 0) {
    domainBg = "rgba(255,255,255,0.08)";
  } else if (profileColors.length === 1) {
    domainBg = profileColors[0];
  } else {
    domainBg = `linear-gradient(90deg, ${profileColors.join(", ")})`;
  }

  return domainBg;
}

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
    title: "Alumni",
    description:
      "Connectez-vous avec les anciens étudiants pour des opportunités de mentorat, de stage et de développement professionnel.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
    path: "/alumni",
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
  { value: "850+", label: "Alumni inscrits" },
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
    fetch(`${import.meta.env.VITE_API_URL}/api/alumni`)
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
        `${import.meta.env.VITE_API_URL}/api/annonces?skip=${
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/annonces`, {
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
        `${import.meta.env.VITE_API_URL}/api/annonces/${id}`,
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
              {alumniProfile && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: getAlumniCardColor(alumniProfile),
                  }}
                >
                  {alumniProfile.avatar || name.substring(0, 2).toUpperCase()}
                </Avatar>
              )}
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

  // Add at the top of the Home component:
  const annoncesRef = useRef(null);
  const handleScrollToAnnonces = () => {
    annoncesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add handleScrollToConseils function above the return if not present
  const conseilsRef = useRef(null);
  const handleScrollToConseils = () => {
    if (conseilsRef.current) {
      conseilsRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      // fallback: scroll to top or a default position
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const sorboNexusRef = useRef(null);
  const handleScrollToSorboNexus = () => {
    sorboNexusRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide arrow if scrolled more than 80vh
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowArrow(false);
      } else {
        setShowArrow(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="glassy-bg min-h-screen">
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

        {/* Main Hero Content */}
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {/* Left Side - Text Content */}
            <Grid gridColumn={{ xs: "span 12", md: "span 6" }}>
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
                      fontWeight: 300,
                      mb: { xs: 1.5, md: 2 },
                      fontSize: {
                        xs: "3rem",
                        sm: "3.5rem",
                        md: "4.5rem",
                        lg: "5.5rem",
                      },
                      lineHeight: 1.05,
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      letterSpacing: "-0.02em",
                      position: "relative",
                    }}
                  >
                    Bienvenue sur{" "}
                    <span style={{ display: "block", fontWeight: 600 }}>
                      SorboNexus
                    </span>
                  </Typography>

                  {/* Hero Subtitle */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 400,
                      mb: { xs: 4, md: 5 },
                      fontSize: {
                        xs: "1.3rem",
                        sm: "1.5rem",
                        md: "1.8rem",
                        lg: "2rem",
                      },
                      lineHeight: 1.3,
                      color: "rgba(255, 255, 255, 0.8)",
                      textAlign: { xs: "center", md: "left" },
                      maxWidth: "700px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Votre passerelle vers l'excellence académique.
                    Connectez-vous avec des alumni qui ont écrit leur succès, et
                    découvrez leurs secrets de réussite.
                  </Typography>

                  {/* Mini Feature Cards - Inline with text */}
                  <Box
                    sx={{
                      display: { xs: "none", lg: "flex" },
                      flexDirection: "column",
                      gap: 2,
                      position: "absolute",
                      right: "-120px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                    }}
                  >
                    {features.slice(0, 4).map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 80,
                          height: 80,
                          flex: "0 0 auto",
                        }}
                      >
                        <FeatureCard
                          feature={feature}
                          index={index}
                          variant="mini"
                          onCardClick={() => handleCardNavigation(feature.path)}
                          fixedSize
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Medium Screen Mini Feature Cards - Right side */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex", lg: "none" },
                      flexDirection: "column",
                      gap: 1.5,
                      position: "absolute",
                      right: "-80px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                    }}
                  >
                    {features.slice(0, 4).map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 65,
                          height: 65,
                          flex: "0 0 auto",
                        }}
                      >
                        <FeatureCard
                          feature={feature}
                          index={index}
                          variant="mini"
                          onCardClick={() => handleCardNavigation(feature.path)}
                          fixedSize
                        />
                      </Box>
                    ))}
                  </Box>

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
                        onClick={() => handleCardNavigation("/alumni")}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={18} />}
                        sx={{
                          fontWeight: 500,
                          px: { xs: 4, md: 5 },
                          py: { xs: 1.5, md: 2 },
                          borderRadius: "28px",
                          background:
                            "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          textTransform: "none",
                          letterSpacing: "0.01em",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                            boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4)",
                            transform: "scale(1.02)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Découvrez nos alumni
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleScrollToSorboNexus}
                        sx={{
                          fontWeight: 500,
                          px: { xs: 4, md: 5 },
                          py: { xs: 1.5, md: 2 },
                          borderRadius: "28px",
                          color: "#3b82f6",
                          borderColor: "#3b82f6",
                          borderWidth: 2,
                          background: "rgba(59, 130, 246, 0.05)",
                          fontSize: { xs: "1rem", md: "1.1rem" },
                          textTransform: "none",
                          letterSpacing: "0.01em",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1)",
                            borderColor: "#1e40af",
                            borderWidth: 2,
                            transform: "scale(1.02)",
                          },
                          transition: "all 0.2s ease",
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
                      gap: { xs: 2, md: 6 },
                      flexWrap: "nowrap",
                      justifyContent: { xs: "center", md: "flex-start" },
                      mt: { xs: 6, md: 8 },
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
                            fontWeight: 300,
                            color: "#3b82f6",
                            mb: 1,
                            fontSize: { xs: "1.2rem", md: "2.5rem" },
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {formatCount(alumniCount)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: "0.7rem", md: "1rem" },
                            fontWeight: 400,
                            letterSpacing: "0.01em",
                          }}
                        >
                          Étudiants actifs
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "rgba(255, 255, 255, 0.5)",
                            fontSize: { xs: "0.6rem", md: "0.85rem" },
                            fontWeight: 400,
                            mt: 1,
                            letterSpacing: "0.01em",
                          }}
                        >
                          Certains profils sont masqués
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
                            fontWeight: 300,
                            color: "#3b82f6",
                            mb: 1,
                            fontSize: { xs: "1.2rem", md: "2.5rem" },
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {formatCount(alumniWithLicenseBeforeCurrentYear)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            fontSize: { xs: "0.7rem", md: "1rem" },
                            fontWeight: 400,
                            letterSpacing: "0.01em",
                          }}
                        >
                          Alumni qui ont eu leur licence avant {currentYear}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>

                  {/* Mobile Mini Feature Cards */}
                  <Box
                    sx={{
                      display: { xs: "flex", md: "none" },
                      justifyContent: "center",
                      gap: 2,
                      mt: 4,
                      mb: 3,
                    }}
                  >
                    {features.slice(0, 4).map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 60,
                          height: 60,
                          flex: "0 0 auto",
                        }}
                      >
                        <FeatureCard
                          feature={feature}
                          index={index}
                          variant="mini"
                          onCardClick={() => handleCardNavigation(feature.path)}
                          fixedSize
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
        {showArrow && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: { xs: 80, md: 100 },
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={handleScrollToSorboNexus}
            tabIndex={0}
            role="button"
            aria-label="Scroll to SorboNexus section"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: { xs: 38, md: 48 },
                  color: "rgba(255,255,255,0.85)",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: "#3b82f6",
                  },
                }}
              />
            </motion.div>
          </Box>
        )}
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

      {/* SorboNexus Intro Section - moved here */}
      <Box
        component="section"
        ref={sorboNexusRef}
        sx={{ py: { xs: 4, md: 8 }, px: 2 }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: "center" }}
          >
            <Card
              elevation={0}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(17,24,39,0.82) 60%, rgba(30,41,59,0.88) 100%)",
                backdropFilter: "blur(32px) saturate(200%)",
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                maxWidth: { xs: 600, md: 900 },
                mx: "auto",
                mb: { xs: 3, md: 4 },
                border: "1.5px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
                "::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(59,130,246,0.07) 100%)",
                  pointerEvents: "none",
                  borderRadius: 4,
                },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  mb: { xs: 2, md: 3 },
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                SorboNexus, la plateforme des étudiants de Jussieu
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  mb: 2,
                  fontSize: { xs: "0.8rem", md: "0.95rem" },
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                SorboNexus est la plateforme créée pour les étudiants de
                Jussieu, dédiée à accompagner votre réussite tout au long de
                votre parcours universitaire et dans la préparation de vos
                candidatures en master ou en école, en{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  France comme à l'international
                </span>
                .
                <br />
                <br />
                L'objectif, c'est vraiment d'
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  inspirer les élèves
                </span>{" "}
                de Sorbonne Université, afin qu'ils intègrent à leur tour{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  les meilleurs parcours
                </span>
                , comme toi. Cela contribue à renforcer le{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  rayonnement de l'université
                </span>
                , à consolider le{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  réseau des alumni
                </span>
                , et à le faire perdurer pour les générations futures.
                <br />
                <br />
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(30,41,59,0.55)",
                    backdropFilter: "blur(18px) saturate(180%)",
                    borderRadius: 4,
                    p: { xs: 2, md: 3 },
                    my: 2,
                    boxShadow: "0 4px 16px 0 rgba(31,38,135,0.10)",
                    border: "1.5px solid rgba(255,255,255,0.10)",
                    textAlign: "center",
                    maxWidth: 600,
                    mx: "auto",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      mb: 2,
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                      lineHeight: 1.6,
                    }}
                  >
                    Dans la section Conseil, tu peux partager tout ce qui
                    pourrait être utile à d'autres utilisateurs. Même si t'es
                    encore en L2 ou L3, tu pourrais déjà donner des conseils
                    pour les L1 qui arrive la rentrée prochaine! Ils pourront
                    plus facilement s'intégrer avec vos conseils et retours!
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleScrollToAnnonces}
                      endIcon={
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{ verticalAlign: "middle" }}
                        >
                          <path
                            d="M12 5v14m0 0l-7-7m7 7l7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      }
                      sx={{
                        fontWeight: 600,
                        px: { xs: 1.2, md: 2 },
                        py: { xs: 0.3, md: 0.6 },
                        minHeight: { xs: 28, md: 32 },
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                        boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                        fontSize: { xs: "0.70rem", md: "0.80rem" },
                        color: "#fff",
                        textTransform: "none",
                        letterSpacing: 0.5,
                        transition: "all 0.2s",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                          color: "#fff",
                          transform: "scale(1.07)",
                        },
                      }}
                    >
                      Voir les idées/exemples en bas
                    </Button>
                  </Box>
                </Card>
                <br />
                L'idée est de transmettre ce que tu aurais aimé savoir avant.
                Cela peut être un texte court ou plus détaillé, selon ce que tu
                souhaites partager.
                <br />
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  Chaque conseil compte
                </span>{" "}
                et peut vraiment aider d'autres étudiants à avancer plus
                sereinement.
                <br />
                <br />
                Vous y trouverez une multitude de{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  ressources utiles
                </span>{" "}
                : <b>modèles de lettres de motivation</b>,{" "}
                <b>informations détaillées sur les UE</b>,{" "}
                <b>guides pour constituer vos dossiers</b>, et{" "}
                <b>conseils pratiques</b> pour chaque étape de votre cursus.
                <br />
                <br />
                Découvrez également des{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  retours d'expérience et témoignages d'élèves sur les licences
                  de SU (simple, bi-disciplinaire, intensives) et masters dans
                  differentes universités
                </span>{" "}
                que vous souhaitez suivre, ainsi que des témoignages d'élèves
                ayant réussi des concours comme <b>GEI-UNIV</b> (admissions
                parallèles), des oraux, et des intégrations dans des écoles (en{" "}
                <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                  France comme à l'international
                </span>
                ) telles que{" "}
                <b>
                  Polytechnique, ENS, Princeton, CentraleSupélec, Télécom,
                  Dauphine, Sorbonne, Paris-Saclay, ESPCI, Paris Cité
                </b>{" "}
                et bien d'autres.
                <br />
                <br />
                Le site propose aussi des fiches sur les écoles, des astuces
                pour les candidatures à l'étranger, exemples de CV, ainsi que
                des conseils pour les entretiens.
                <br />
                <br />
                Ton parcours aidera et motivera les nouveaux L1 , mais aussi les
                L2 et les L3 qui souhaitent faire le même parcours que toi. Le
                site a besoin des parcours comme le tien, et on aimerait bien
                recevoir des conseils, témoignages venant de toi mais aussi des
                ressources utiles qui t'ont aidé durant ton parcours.
                <br />
                <br />
                <span style={{ fontStyle: "italic" }}>
                  Le site est encore en développement, mais vous pouvez dès
                  maintenant créer votre compte, personnaliser votre profil et
                  contribuer à enrichir la base de connaissances pour aider les
                  générations futures.
                </span>
                <br />
                <span
                  style={{
                    color: "#3b82f6",
                    fontWeight: 700,
                    display: "block",
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: "1.25rem",
                  }}
                >
                  Explorez, partagez, et faites grandir la communauté !
                </span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  mt: 3,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/conseils")}
                  sx={{
                    fontWeight: 600,
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    color: "#fff",
                    textTransform: "none",
                    letterSpacing: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      color: "#fff",
                      transform: "scale(1.07)",
                    },
                  }}
                >
                  Voir les conseils
                </Button>
              </Box>
            </Card>
          </motion.div>
        </Container>
      </Box>

      {/* Annonces Section */}
      <Box
        component="section"
        ref={annoncesRef}
        sx={{ py: { xs: 4, md: 8 }, px: 2 }}
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

          {/* FULL FEATURES SECTION: All 6 feature cards in responsive grid */}
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
              <Grid
                gridColumn={{ xs: "span 12", md: "span 4", lg: "span 3" }}
                key={index}
              >
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
        }}
      >
        <Container maxWidth="md">
          <Card
            elevation={0}
            className="glassy-bg"
            sx={{
              background: "rgba(30, 41, 59, 0.7)",
              backdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "1.5px solid rgba(255, 255, 255, 0.13)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              maxWidth: 600,
              mx: "auto",
              mb: { xs: 3, md: 4 },
              border: "1.5px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                mb: { xs: 2, md: 3 },
                fontWeight: 700,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
              }}
            >
              Notre Impact
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: { xs: 2, md: 4 },
                fontSize: { xs: "0.8rem", md: "0.95rem" },
              }}
            >
              Découvrez l'ampleur de notre communauté
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 2, md: 4 },
                flexWrap: "wrap",
                mt: 2,
              }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
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
                  component="div"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 500,
                    fontSize: { xs: "0.75rem", md: "0.9rem" },
                  }}
                >
                  Étudiants actifs
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: { xs: "0.6rem", md: "0.7rem" },
                    fontStyle: "italic",
                    mt: 0.5,
                  }}
                >
                  Certains profils sont masqués
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 1, md: 2 },
                  height: { xs: 32, md: 48 },
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 2,
                  mx: { xs: 1, md: 2 },
                  display: { xs: "none", sm: "block" },
                }}
              />
              <Box sx={{ textAlign: "center", flex: 1 }}>
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
                  component="div"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 500,
                    fontSize: { xs: "0.75rem", md: "0.9rem" },
                  }}
                >
                  Alumni qui ont eu leur licence avant {currentYear}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Feedback & Contributions Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 4, md: 8 },
          px: 2,
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
              Ce projet est ouvert à tous vos feedbacks, pull requests et
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
                className="glassy-bg"
                sx={{
                  background: "unset",
                  borderRadius: 4,
                  p: { xs: 2, md: 4 },
                  maxWidth: 600,
                  mx: "auto",
                  mb: { xs: 3, md: 4 },
                  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                  border: "1.5px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography
                  variant="body1"
                  component="div"
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
              component="div"
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
    </div>
  );
}
