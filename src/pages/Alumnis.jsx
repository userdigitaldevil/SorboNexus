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
  Avatar,
  Modal,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import {
  ArrowRight,
  Search,
  Linkedin,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Grade as GradeIcon,
  Business as BusinessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { jwtDecode } from "jwt-decode";
import AlumniProfileCard from "../components/AlumniProfileCard";
import AlumniCard from "../components/AlumniCard";
import { renderTextWithLinks } from "../utils/textUtils.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAlumniEditModal } from "../components/AlumniEditModalContext";

export default function Alumnis() {
  // Admin state (must be first)
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledOrder, setShuffledOrder] = useState(null);

  const filters = [
    "Tous",
    "Informatique",
    "Droit",
    "Économie",
    "Lettres",
    "Sciences",
    "Médecine",
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const { openEditModal } = useAlumniEditModal();

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/api/alumni`);
      const data = await response.json();
      setAlumni(data);
      setCurrentPage(1);
      setLoading(false);
      console.log("Fetched alumni:", data);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Always trigger on location.search change
    const params = new URLSearchParams(location.search);
    if (params.get("editSelf") === "1") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const myAlumni = alumni.find(
            (a) =>
              String(a._id) === String(decoded.alumniId) ||
              String(a.id) === String(decoded.alumniId)
          );
          if (myAlumni) {
            handleEditClick(myAlumni);
          }
        } catch (e) {}
      }
      // Remove the query param for a clean URL
      params.delete("editSelf");
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
    }
  }, [location.search, alumni]);

  useEffect(() => {
    if (!loading) {
      // If ?profileSelf=1 is present, open the profile modal for the current user
      const params = new URLSearchParams(location.search);
      if (params.get("profileSelf") === "1") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const myAlumni = alumni.find(
              (a) => String(a._id) === String(decoded.alumniId)
            );
            if (myAlumni) {
              openProfileModal(myAlumni);
              // Remove the query param for a clean URL
              params.delete("profileSelf");
              navigate(
                { pathname: location.pathname, search: params.toString() },
                { replace: true }
              );
            }
          } catch (e) {}
        }
      }
    }
  }, [location, alumni, loading]);

  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const myAlumni = alumni.find(
            (a) =>
              String(a._id) === String(decoded.alumniId) ||
              String(a.id) === String(decoded.alumniId)
          );
          if (myAlumni) {
            handleEditClick(myAlumni);
          }
        } catch (e) {}
      }
    };
    window.addEventListener("openEditSelfModal", handler);
    return () => window.removeEventListener("openEditSelfModal", handler);
  }, [alumni]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      fetchAlumni();
    };
    window.addEventListener("profileUpdated", handleProfileUpdated);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdated);
  }, []);

  // Compute visibleAlumni: only show non-hidden, or self, or admin
  const visibleAlumni = alumni.filter(
    (alum) =>
      !alum.hidden ||
      String(alum._id) === String(alumniId) ||
      String(alum.id) === String(alumniId) ||
      isAdmin
  );
  // Compute filteredAlumni: search/filter logic
  let filteredAlumni = visibleAlumni.filter((alum) => {
    const searchLower = searchQuery.toLowerCase();
    // Check basic fields
    const basicMatch =
      (alum.name && alum.name.toLowerCase().includes(searchLower)) ||
      (alum.position && alum.position.toLowerCase().includes(searchLower)) ||
      (alum.degree && alum.degree.toLowerCase().includes(searchLower)) ||
      (alum.field && alum.field.toLowerCase().includes(searchLower)) ||
      (alum.avatar && alum.avatar.toLowerCase().includes(searchLower));
    // Check schools applied (accepted schools)
    const schoolsMatch =
      alum.schoolsApplied?.some(
        (school) =>
          school.name &&
          school.name.toLowerCase().includes(searchLower) &&
          school.status === "accepted"
      ) || false;
    const matchesSearch = basicMatch || schoolsMatch;
    const matchesFilter =
      activeFilter === "Tous" || alum.field === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Always include the user's own card (even if hidden), unless already present
  let self = alumni.find(
    (a) =>
      String(a._id) === String(alumniId) || String(a.id) === String(alumniId)
  );
  if (
    self &&
    !filteredAlumni.some(
      (a) =>
        String(a._id) === String(alumniId) || String(a.id) === String(alumniId)
    )
  ) {
    filteredAlumni = [self, ...filteredAlumni];
  }

  // Update the main ordering logic before pagination:
  let ordered = filteredAlumni;
  let sethCardIdx = filteredAlumni.findIndex(
    (a) => a.username && a.username.toLowerCase() === "sethaguila"
  );
  let sethCard = sethCardIdx > -1 ? filteredAlumni[sethCardIdx] : null;
  let selfCardIdx = alumniId
    ? filteredAlumni.findIndex(
        (a) =>
          String(a._id) === String(alumniId) ||
          String(a.id) === String(alumniId)
      )
    : -1;
  let selfCard = selfCardIdx > -1 ? filteredAlumni[selfCardIdx] : null;
  if (alumniId && selfCard) {
    // User signed in: self first, then sethaguila (if not self), then other admins, then all other non-hidden alumni
    const isSelf = (a) => a.id === selfCard.id;
    const isSeth = (a) => a.id === 26;
    const isAdmin = (a) => a.isAdmin && !isSelf(a) && !isSeth(a);
    const isOther = (a) => !isSelf(a) && !isSeth(a) && !a.isAdmin;
    ordered = [
      selfCard,
      ...(filteredAlumni.find(isSeth) && !isSelf(filteredAlumni.find(isSeth))
        ? [filteredAlumni.find(isSeth)]
        : []),
      ...filteredAlumni.filter(isAdmin),
      ...filteredAlumni.filter(isOther),
    ];
  } else {
    // No user: sethaguila and all admins first, then all others
    const isSeth = (a) => a.id === 26;
    const isAdmin = (a) => a.isAdmin && !isSeth(a);
    const isOther = (a) => !isSeth(a) && !a.isAdmin;
    ordered = [
      ...(filteredAlumni.find(isSeth) ? [filteredAlumni.find(isSeth)] : []),
      ...filteredAlumni.filter(isAdmin),
      ...filteredAlumni.filter(isOther),
    ];
  }
  // Pagination is applied after ordering, so the most recently updated alumni will always be right after the admins, regardless of page.
  let displayOrdered = shuffledOrder ? shuffledOrder : ordered;
  const itemsPerPage = 9;
  const totalPages = Math.ceil(displayOrdered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentAlumni = displayOrdered.slice(startIndex, endIndex);

  // Shuffle utility (Fisher-Yates)
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Reset shuffle if filters/search change
  useEffect(() => {
    setShuffledOrder(null);
  }, [searchQuery, activeFilter, alumni, isAdmin, alumniId]);

  const openProfileModal = (alum) => {
    setSelectedAlumni(alum);
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAlumni(null);
  };

  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => setIsListModalOpen(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // Helper to open profile modal from grouped list
  const handleAlumniNameClick = (alum) => {
    openProfileModal(alum);
    closeListModal();
  };

  const handleEditClick = async (alum) => {
    let alumniData = alum;
    if (isAdmin) {
      try {
        const res = await fetch(
          `${process.env.VITE_API_URL}/api/alumni/${alum.id}`
        );
        if (res.ok) {
          alumniData = await res.json();
        }
      } catch (e) {}
    }
    openEditModal(alumniData);
  };

  const handleGradeChange = (idx, field, value) => {
    // This function is no longer used in the new implementation
  };
  const handleAddGrade = () => {
    // This function is no longer used in the new implementation
  };
  const handleRemoveGrade = (idx) => {
    // This function is no longer used in the new implementation
  };
  const handleSchoolChange = (idx, field, value) => {
    // This function is no longer used in the new implementation
  };
  const handleAddSchool = () => {
    // This function is no longer used in the new implementation
  };
  const handleRemoveSchool = (idx) => {
    // This function is no longer used in the new implementation
  };

  const handleEditSubmit = async (e) => {
    // This function is no longer used in the new implementation
  };

  const handleDeleteClick = async (alum) => {
    if (
      !window.confirm(
        `Supprimer l'alumni ${alum.name} ? Cette action est irréversible et supprimera aussi son compte utilisateur.`
      )
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.VITE_API_URL}/api/alumni/${alum.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        await fetchAlumni();
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        alert("Erreur lors de la suppression de l'alumni.");
      }
    } catch (err) {
      alert("Erreur lors de la suppression de l'alumni.");
    }
  };

  // Place this at the top of the component (inside the function, before return)
  const adminGlow = {
    boxShadow: "0 0 36px 8px #3b82f6cc",
    transition: "filter 0.3s, box-shadow 0.3s",
    filter: "none",
    "&:hover": {
      filter: "hue-rotate(30deg)",
    },
  };

  // Generic handler for simple fields
  const handleEditFormChange = (e) => {
    // This function is no longer used in the new implementation
  };

  useEffect(() => {
    console.log(
      "alumniId:",
      alumniId,
      "alumni:",
      alumni.map((a) => ({
        _id: a._id,
        id: a.id,
        name: a.name,
        hidden: a.hidden,
      }))
    );
  }, [alumni, alumniId]);

  console.log("currentAlumni:", currentAlumni);

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
                <span style={{ display: "block" }}>Réseau des</span>
                <span style={{ display: "block" }}>Alumnis</span>
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
                Découvrez les parcours inspirants de nos anciens étudiants.
                Connectez-vous avec des professionnels dans votre domaine et
                bénéficiez de leur expérience.{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Inspirez-vous et connectez-vous !
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
                placeholder="Rechercher un alumni par nom, domaine ou entreprise..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      padding: { xs: "12px", md: "16px" },
                    },
                  },
                }}
              />
              <Box sx={{ mt: { xs: 2, md: 3 }, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={openListModal}
                  sx={{
                    color: "#3b82f6",
                    border: "1.5px solid #3b82f6",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.2 },
                    background: "rgba(59, 130, 246, 0.08)",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.15)",
                      borderColor: "#2563eb",
                    },
                  }}
                >
                  Liste de tous les alumnis
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </motion.section>

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
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
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
              {/* Centered Modifier ma carte button below the alert */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.13)",
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    background: "#ef4444",
                    "&:hover": {
                      background: "#dc2626",
                    },
                  }}
                  onClick={() => {
                    // Open the edit modal for the current user
                    const myAlumni = alumni.find(
                      (a) =>
                        String(a._id) === String(alumniId) ||
                        String(a.id) === String(alumniId)
                    );
                    if (myAlumni) handleEditClick(myAlumni);
                  }}
                >
                  Modifier ma carte
                </Button>
              </Box>
            </Container>
          </motion.section>
        )}

      {/* Filters Section */}
      <motion.section
        className="py-0 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "16px" : "16px",
          paddingBottom: window.innerWidth < 600 ? "16px" : "16px",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 12 } }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 1, md: 2 },
                justifyContent: "center",
                pt: { xs: 2, md: 4 },
                mt: 0,
              }}
            >
              {filters.map((filter, index) => (
                <motion.div
                  key={filter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={filter}
                    onClick={() => handleFilterChange(filter)}
                    sx={{
                      background:
                        activeFilter === filter
                          ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                          : "rgba(255, 255, 255, 0.08)",
                      color:
                        activeFilter === filter
                          ? "white"
                          : "rgba(255, 255, 255, 0.8)",
                      border:
                        activeFilter === filter
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(20px)",
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", md: "0.875rem" },
                      padding: { xs: "6px 12px", md: "8px 16px" },
                      height: { xs: "28px", md: "auto" },
                      "&:hover": {
                        background:
                          activeFilter === filter
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

      {/* Alumni Grid Section */}
      <motion.section
        className="pb-24 px-6 bg-gradient-to-r from-blue-900/40 to-teal-900/40 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "16px" : "16px",
          paddingBottom: window.innerWidth < 600 ? "80px" : "96px",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: { xs: 2, md: 4 },
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nos Anciens Étudiants
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                mb: 2,
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                py: 1.2,
                background: "rgba(59, 130, 246, 0.08)",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
                fontSize: { xs: "0.8rem", md: "1rem" },
                border: "1.5px solid #3b82f6",
                color: "#3b82f6",
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.15)",
                  borderColor: "#2563eb",
                },
              }}
              onClick={() => {
                // Find the fixed cards (self, sethaguila) as above
                let fixed = [];
                if (alumniId && selfCard) fixed.push(selfCard);
                if (
                  sethCard &&
                  (!selfCard ||
                    (sethCard._id !== selfCard._id &&
                      sethCard.id !== selfCard.id))
                )
                  fixed.push(sethCard);
                // The rest are all other cards (admins and others, already in order)
                let rest = ordered.filter(
                  (a) => !fixed.some((f) => f._id === a._id && f.id === a.id)
                );
                const shuffledRest = shuffleArray(rest);
                setShuffledOrder([...fixed, ...shuffledRest]);
                setCurrentPage(1);
              }}
            >
              Mélanger les cartes
            </Button>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            sx={{
              maxWidth: "100%",
              width: "100%",
            }}
          >
            {currentAlumni.map((alum, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
                xl={3}
                key={alum.id || alum._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: { xs: "100%", sm: "50%", md: "25%" },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    opacity:
                      (String(alum._id) === String(alumniId) ||
                        String(alum.id) === String(alumniId)) &&
                      alum.hidden
                        ? 0.5
                        : 1,
                  }}
                >
                  <AlumniCard
                    alum={alum}
                    index={index}
                    onCardClick={openProfileModal}
                    adminGlow={adminGlow}
                    isAdmin={isAdmin}
                    onEditClick={handleEditClick}
                    alumniId={alumniId}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Pagination (always visible) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => {
                  setCurrentPage(value);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
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
        </Container>
      </motion.section>

      {/* Join Alumni Section */}
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
                Faites partie de notre réseau
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
                  mb: 8,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: "auto",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Vous êtes un ancien étudiant de la Sorbonne ? Rejoignez notre
                réseau d'alumnis pour partager votre expérience et aider les
                étudiants actuels.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Rejoindre le réseau
              </Button>
            </motion.div>
          </Box>
        </Container>
      </motion.section>

      {/* Profile Modal */}
      <Modal
        open={isProfileModalOpen}
        onClose={closeProfileModal}
        aria-labelledby="profile-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            maxWidth: 600,
            width: "100%",
            borderRadius: 16,
            scrollBehavior: "smooth",
          }}
        >
          {selectedAlumni ? (
            <AlumniProfileCard
              alum={selectedAlumni}
              isAdmin={isAdmin}
              alumniId={alumniId}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              onClose={closeProfileModal}
            />
          ) : null}
        </motion.div>
      </Modal>

      {/* Grouped Alumni List Modal */}
      <Modal
        open={isListModalOpen}
        onClose={closeListModal}
        aria-labelledby="alumni-list-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95vw", sm: 500, md: 600 },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: 24,
            p: 0,
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Close Button - positioned in upper right of modal */}
          <IconButton
            onClick={closeListModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: 36,
              height: 36,
              "&:hover": {
                color: "#fff",
                background: "rgba(0, 0, 0, 0.5)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>

          <Card
            elevation={24}
            sx={{
              background: "rgba(15, 23, 42, 0.98)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              maxWidth: 700,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              p: 0,
              scrollBehavior: "smooth",
              animation: isListModalOpen ? "modalFadeIn 0.1s ease-out" : "none",
              "@keyframes modalFadeIn": {
                "0%": {
                  opacity: 0,
                  transform: "scale(0.98)",
                },
                "100%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography
                id="alumni-list-modal-title"
                variant="h5"
                sx={{ fontWeight: 800, color: "#3b82f6" }}
              >
                Liste de tous les alumnis par catégorie
              </Typography>
            </Box>
            <Box sx={{ p: 3, pt: 0, minWidth: 320 }}>
              {/* Group alumni by field, use Accordions */}
              {Object.entries(
                alumni
                  .filter(
                    (alum) =>
                      !alum.hidden ||
                      String(alum._id) === String(alumniId) ||
                      isAdmin
                  )
                  .reduce((acc, alum) => {
                    if (!acc[alum.field]) acc[alum.field] = [];
                    acc[alum.field].push(alum);
                    return acc;
                  }, {})
              ).map(([field, group], idx, arr) => (
                <Accordion
                  key={field}
                  defaultExpanded={false}
                  sx={{
                    background: "rgba(59,130,246,0.07)",
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: "none",
                    border: "1.5px solid rgba(59,130,246,0.13)",
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#3b82f6" }} />}
                    aria-controls={`panel-${field}-content`}
                    id={`panel-${field}-header`}
                    sx={{
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                      color: "white",
                      borderRadius: 2,
                      minHeight: 56,
                      boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                      fontWeight: 700,
                      mb: 0,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontWeight: 700,
                          background: group[0]?.color || "#3b82f6",
                        }}
                      >
                        {field[0]}
                      </Avatar>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          letterSpacing: 0.5,
                          textShadow: "0 1px 4px #0002",
                        }}
                      >
                        {field}
                      </Typography>
                      <Chip
                        label={`${group.length} alumnis`}
                        size="small"
                        sx={{
                          ml: 2,
                          background: "rgba(255,255,255,0.13)",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: "rgba(15,23,42,0.97)",
                      borderRadius: 2,
                      p: 0,
                    }}
                  >
                    <List dense>
                      {group.map((alum) => {
                        // Find BSc/licence
                        const licence = Object.keys(alum.grades).find(
                          (k) =>
                            k.toLowerCase().includes("licence") ||
                            k.toLowerCase().includes("bsc")
                        );
                        // Find current school (first accepted)
                        const currentSchool = alum.schoolsApplied.find(
                          (s) => s.status === "accepted"
                        );
                        // Try to extract company from currentPosition
                        let company = "";
                        if (alum.currentPosition) {
                          const match =
                            alum.currentPosition.match(/chez ([^,]+)/i);
                          if (match) company = match[1];
                          else {
                            // fallback: last word if 'à' or 'at' present
                            const m2 =
                              alum.currentPosition.match(/(?:à|at) ([^,]+)/i);
                            if (m2) company = m2[1];
                          }
                        }
                        return (
                          <ListItem
                            key={alum.id}
                            button
                            onClick={() => handleAlumniNameClick(alum)}
                            sx={{
                              px: 1.5,
                              py: 1.2,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "background 0.1s ease",
                              "&:hover": {
                                background: "rgba(59,130,246,0.1)",
                              },
                              userSelect: "none",
                            }}
                            aria-label={`Voir la fiche de ${alum.name}`}
                          >
                            <ListItemIcon sx={{ minWidth: 44 }}>
                              <Avatar
                                sx={{
                                  background: alum.color,
                                  color: "#fff",
                                  fontWeight: 700,
                                }}
                              >
                                {alum.avatar}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "#fff",
                                    fontSize: "1.08rem",
                                  }}
                                >
                                  {alum.name}
                                </span>
                              }
                              secondary={
                                <span
                                  style={{
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: "0.98rem",
                                  }}
                                >
                                  {licence ? (
                                    <>{licence} &nbsp;|&nbsp; </>
                                  ) : null}
                                  {currentSchool ? currentSchool.name : "—"}{" "}
                                  &nbsp;|&nbsp; {company || "—"}
                                </span>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}
