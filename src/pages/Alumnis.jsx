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
  Close as CloseIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Grade as GradeIcon,
  Business as BusinessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { jwtDecode } from "jwt-decode";

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    degree: "",
    position: "",
    field: "",
    linkedin: "",
    email: "",
    avatar: "",
    color: "",
    gradient: "",
    conseil: "",
    profile: {
      email: "",
      linkedin: "",
      currentPosition: "",
      grades: {},
      schoolsApplied: [],
    },
    isAdmin: false,
  });

  const filters = [
    "Tous",
    "Informatique",
    "Droit",
    "Économie",
    "Lettres",
    "Sciences",
    "Médecine",
  ];

  useEffect(() => {
    fetch("http://localhost:5001/api/alumni")
      .then((res) => res.json())
      .then((data) => {
        setAlumni(data);
        setLoading(false);
        console.log("Fetched alumni:", data);
      });
  }, []);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.degree.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "Tous" || alum.field === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentAlumni = filteredAlumni.slice(startIndex, endIndex);
  // If admin, ensure admin card is always first
  if (isAdmin) {
    const adminIdx = currentAlumni.findIndex((a) => a.isAdmin);
    if (adminIdx > 0) {
      const [adminCard] = currentAlumni.splice(adminIdx, 1);
      currentAlumni = [adminCard, ...currentAlumni];
    }
  }

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

  const handleEditClick = (alum) => {
    setEditAlumni(alum);
    setEditForm({
      name: alum.name || "",
      degree: alum.degree || "",
      position: alum.position || "",
      field: alum.field || "",
      linkedin: alum.profile?.linkedin || "",
      email: alum.profile?.email || "",
      avatar: alum.avatar || "",
      color: alum.color || "",
      gradient: alum.gradient || "",
      conseil: alum.conseil || "",
      profile: {
        email: alum.profile?.email || "",
        linkedin: alum.profile?.linkedin || "",
        currentPosition: alum.profile?.currentPosition || "",
        grades: alum.profile?.grades || {},
        schoolsApplied: alum.profile?.schoolsApplied || [],
      },
      isAdmin: alum.isAdmin || false,
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setEditForm((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      }));
    } else if (name === "isAdmin") {
      setEditForm((prev) => ({ ...prev, isAdmin: value === "true" }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add helpers for grades and schools
  const handleGradeChange = (key, value) => {
    setEditForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        grades: { ...prev.profile.grades, [key]: value },
      },
    }));
  };
  const handleAddGrade = () => {
    setEditForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        grades: { ...prev.profile.grades, "": "" },
      },
    }));
  };
  const handleRemoveGrade = (key) => {
    setEditForm((prev) => {
      const newGrades = { ...prev.profile.grades };
      delete newGrades[key];
      return {
        ...prev,
        profile: { ...prev.profile, grades: newGrades },
      };
    });
  };
  const handleSchoolChange = (idx, field, value) => {
    setEditForm((prev) => {
      const schools = [...(prev.profile.schoolsApplied || [])];
      schools[idx] = { ...schools[idx], [field]: value };
      return {
        ...prev,
        profile: { ...prev.profile, schoolsApplied: schools },
      };
    });
  };
  const handleAddSchool = () => {
    setEditForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        schoolsApplied: [
          ...(prev.profile.schoolsApplied || []),
          { name: "", status: "accepted" },
        ],
      },
    }));
  };
  const handleRemoveSchool = (idx) => {
    setEditForm((prev) => {
      const schools = [...(prev.profile.schoolsApplied || [])];
      schools.splice(idx, 1);
      return {
        ...prev,
        profile: { ...prev.profile, schoolsApplied: schools },
      };
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Auto-generate avatar from name
    const avatar = editForm.name ? editForm.name[0].toUpperCase() : "";
    const formToSend = {
      ...editForm,
      avatar,
    };
    if (!isAdmin) {
      // Remove restricted fields for normal alumni
      delete formToSend.color;
      delete formToSend.gradient;
      delete formToSend.isAdmin;
    }
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5001/api/alumni/${editAlumni._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToSend),
      }
    );
    if (res.ok) {
      // Refresh alumni list
      const updated = alumni.map((a) =>
        a._id === editAlumni._id ? { ...a, ...formToSend } : a
      );
      setAlumni(updated);
      setEditModalOpen(false);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  // Helper to render conseil with clickable links
  function renderConseilWithLinks(text) {
    if (!text) return null;
    // Regex to match URLs
    const urlRegex =
      /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.match(urlRegex)) {
        let href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
              wordBreak: "break-all",
            }}
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
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
                  mb: 8,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  mx: "auto",
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
                      fontSize: "1rem",
                      padding: "16px",
                    },
                  },
                }}
              />
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={openListModal}
                  sx={{
                    color: "#3b82f6",
                    border: "1.5px solid #3b82f6",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 3,
                    py: 1.2,
                    background: "rgba(59, 130, 246, 0.08)",
                    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08)",
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

      {/* Filters Section */}
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
                      fontSize: "0.875rem",
                      padding: "8px 16px",
                      height: "auto",
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
        className="py-24 px-6 bg-gradient-to-r from-blue-900/40 to-teal-900/40 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 4,
                fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Nos Anciens Étudiants
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {currentAlumni.map((alum, index) => (
              <Grid item xs={12} md={6} lg={4} key={alum.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    onClick={() => openProfileModal(alum)}
                    sx={{
                      background:
                        alum.isAdmin && isAdmin
                          ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, #3b82f6 60%, #8b5cf6 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                      backdropFilter:
                        alum.isAdmin && isAdmin ? "blur(16px)" : "blur(10px)",
                      border:
                        alum.isAdmin && isAdmin
                          ? "2px solid #fff"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      boxShadow:
                        alum.isAdmin && isAdmin
                          ? "0 0 12px 2px #8b5cf6, 0 0 24px 4px #3b82f6"
                          : undefined,
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow:
                          alum.isAdmin && isAdmin
                            ? "0 0 20px 6px #fff, 0 0 40px 10px #3b82f6"
                            : "0 20px 40px rgba(0, 0, 0, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        height: 120,
                        background: alum.color,
                        position: "relative",
                      }}
                    />
                    <CardContent sx={{ p: 4, pt: 8 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 80,
                          left: 24,
                          zIndex: 10,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            background: alum.color,
                            border: "4px solid rgba(255, 255, 255, 0.1)",
                            fontSize: "1.5rem",
                            fontWeight: 700,
                          }}
                        >
                          {alum.avatar}
                        </Avatar>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: alum.isAdmin && isAdmin ? "#fff" : "white",
                          background:
                            alum.isAdmin && isAdmin
                              ? "rgba(255,255,255,0.18)"
                              : undefined,
                          borderRadius: alum.isAdmin && isAdmin ? 2 : undefined,
                          px: alum.isAdmin && isAdmin ? 2 : undefined,
                          py: alum.isAdmin && isAdmin ? 1 : undefined,
                          boxShadow:
                            alum.isAdmin && isAdmin
                              ? "0 2px 24px 2px #fff6"
                              : undefined,
                          backdropFilter:
                            alum.isAdmin && isAdmin ? "blur(8px)" : undefined,
                          fontFamily:
                            alum.isAdmin && isAdmin ? "monospace" : undefined,
                          letterSpacing:
                            alum.isAdmin && isAdmin ? 1.5 : undefined,
                        }}
                      >
                        {alum.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#3b82f6",
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {alum.degree}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          mb: 3,
                          lineHeight: 1.5,
                        }}
                      >
                        {alum.position}
                      </Typography>

                      {/* Admin edit icon */}
                      {(isAdmin || alum._id === alumniId) && (
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            color: alum.isAdmin ? "#fff" : "#3b82f6",
                            background: alum.isAdmin
                              ? "#3b82f6"
                              : "rgba(255,255,255,0.08)",
                            boxShadow: alum.isAdmin
                              ? "0 0 8px 2px #fff"
                              : undefined,
                            zIndex: 20,
                            "&:hover": {
                              background: "#1e40af",
                              color: "#fff",
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(alum);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              d="M16.474 5.474a2.5 2.5 0 1 1 3.536 3.536l-9.193 9.193a2 2 0 0 1-.707.464l-3.5 1.167a.5.5 0 0 1-.633-.633l1.167-3.5a2 2 0 0 1 .464-.707l9.192-9.192Z"
                            />
                          </svg>
                        </IconButton>
                      )}

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Linkedin size={16} />}
                          sx={{
                            color: "#3b82f6",
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.1)",
                            },
                          }}
                        >
                          LinkedIn
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Mail size={16} />}
                          sx={{
                            color: "rgba(255, 255, 255, 0.6)",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          Email
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
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
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            elevation={24}
            sx={{
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                opacity: 0.8,
              },
            }}
          >
            {selectedAlumni && (
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: selectedAlumni.color,
                      mr: 3,
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {selectedAlumni.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        mb: 1,
                      }}
                    >
                      {selectedAlumni.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#3b82f6",
                        fontWeight: 600,
                      }}
                    >
                      {selectedAlumni.position}
                    </Typography>
                  </Box>
                  {(isAdmin ||
                    (selectedAlumni && selectedAlumni._id === alumniId)) && (
                    <IconButton
                      sx={{
                        color: "#3b82f6",
                        position: "absolute",
                        top: 16,
                        right: 56,
                        zIndex: 30,
                        background: "rgba(255,255,255,0.08)",
                        "&:hover": { background: "#1e40af", color: "#fff" },
                      }}
                      onClick={() => {
                        handleEditClick(selectedAlumni);
                        setIsProfileModalOpen(false);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M16.474 5.474a2.5 2.5 0 1 1 3.536 3.536l-9.193 9.193a2 2 0 0 1-.707.464l-3.5 1.167a.5.5 0 0 1-.633-.633l1.167-3.5a2 2 0 0 1 .464-.707l9.192-9.192Z"
                        />
                      </svg>
                    </IconButton>
                  )}
                </Box>

                <Divider
                  sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }}
                />

                {/* Contact Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Contact
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      startIcon={<EmailIcon />}
                      href={`mailto:${selectedAlumni.profile.email}`}
                      sx={{
                        color: "#3b82f6",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1)",
                          border: "1px solid #3b82f6",
                        },
                      }}
                    >
                      Email
                    </Button>
                    <Button
                      startIcon={<LinkedInIcon />}
                      href={selectedAlumni.profile.linkedin}
                      target="_blank"
                      sx={{
                        color: "#0077b5",
                        border: "1px solid rgba(0, 119, 181, 0.3)",
                        "&:hover": {
                          background: "rgba(0, 119, 181, 0.1)",
                          border: "1px solid #0077b5",
                        },
                      }}
                    >
                      LinkedIn
                    </Button>
                  </Box>
                </Box>

                {/* Current Position */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Poste actuel
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BusinessIcon sx={{ color: "#3b82f6" }} />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {selectedAlumni.profile.currentPosition}
                    </Typography>
                  </Box>
                </Box>

                {/* Grades */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Notes obtenues
                  </Typography>
                  <List dense>
                    {Object.entries(selectedAlumni.profile.grades).map(
                      ([program, grade]) => (
                        <ListItem key={program} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <GradeIcon sx={{ color: "#3b82f6" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={program}
                            secondary={grade}
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: { color: "#3b82f6", fontWeight: 600 },
                            }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>

                {/* Schools Applied */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Écoles demandées
                  </Typography>
                  <List dense>
                    {selectedAlumni.profile.schoolsApplied.map((school) => (
                      <ListItem key={school.name} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {school.status === "accepted" ? (
                            <CheckCircleOutlineIcon sx={{ color: "#10b981" }} />
                          ) : (
                            <CancelIcon sx={{ color: "#ef4444" }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={school.name}
                          secondary={
                            school.status === "accepted" ? "Accepté" : "Refusé"
                          }
                          primaryTypographyProps={{
                            sx: { color: "white", fontWeight: 500 },
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              color:
                                school.status === "accepted"
                                  ? "#10b981"
                                  : "#ef4444",
                              fontWeight: 600,
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Conseil */}
                {selectedAlumni.conseil && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Conseil de cet alumni
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.85)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {renderConseilWithLinks(selectedAlumni.conseil)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            )}
          </Card>
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
          p: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            elevation={24}
            sx={{
              background: "rgba(15, 23, 42, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              maxWidth: 700,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              p: 0,
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
              <IconButton
                onClick={closeListModal}
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 3, pt: 0, minWidth: 320 }}>
              {/* Group alumni by field, use Accordions */}
              {Object.entries(
                alumni.reduce((acc, alum) => {
                  if (!acc[alum.field]) acc[alum.field] = [];
                  acc[alum.field].push(alum);
                  return acc;
                }, {})
              ).map(([field, group], idx, arr) => (
                <Accordion
                  key={field}
                  defaultExpanded={arr.length <= 3}
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
                        const licence = Object.keys(alum.profile.grades).find(
                          (k) =>
                            k.toLowerCase().includes("licence") ||
                            k.toLowerCase().includes("bsc")
                        );
                        // Find current school (first accepted)
                        const currentSchool = alum.profile.schoolsApplied.find(
                          (s) => s.status === "accepted"
                        );
                        // Try to extract company from currentPosition
                        let company = "";
                        if (alum.profile.currentPosition) {
                          const match =
                            alum.profile.currentPosition.match(/chez ([^,]+)/i);
                          if (match) company = match[1];
                          else {
                            // fallback: last word if 'à' or 'at' present
                            const m2 =
                              alum.profile.currentPosition.match(
                                /(?:à|at) ([^,]+)/i
                              );
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
                              transition: "background 0.2s",
                              "&:hover": {
                                background: "rgba(59,130,246,0.13)",
                              },
                              "&:active": {
                                background: "rgba(59,130,246,0.18)",
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
        </motion.div>
      </Modal>

      {/* Edit Alumni Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
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
            maxWidth: 420,
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Modifier l'alumni
          </Typography>
          <form onSubmit={handleEditSubmit}>
            <TextField
              label="Nom"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Diplôme"
              name="degree"
              value={editForm.degree}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Poste"
              name="position"
              value={editForm.position}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Domaine"
              name="field"
              value={editForm.field}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="LinkedIn"
              name="profile.linkedin"
              value={editForm.profile?.linkedin || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={editForm.email || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Profile Email"
              name="profile.email"
              value={editForm.profile?.email || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Profile Poste Actuel"
              name="profile.currentPosition"
              value={editForm.profile?.currentPosition || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            {/* Grades Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Notes / Diplômes</Typography>
              {Object.entries(editForm.profile?.grades || {}).map(
                ([key, value], idx) => (
                  <Box key={key + idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      label="Diplôme"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const grades = { ...editForm.profile.grades };
                        const val = grades[key];
                        delete grades[key];
                        grades[newKey] = val;
                        setEditForm((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, grades },
                        }));
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Note"
                      value={value}
                      onChange={(e) => handleGradeChange(key, e.target.value)}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button
                      onClick={() => handleRemoveGrade(key)}
                      color="error"
                      size="small"
                    >
                      Supprimer
                    </Button>
                  </Box>
                )
              )}
              <Button onClick={handleAddGrade} size="small" sx={{ mt: 1 }}>
                Ajouter un diplôme/note
              </Button>
            </Box>
            {/* Schools Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Écoles demandées</Typography>
              {(editForm.profile?.schoolsApplied || []).map((school, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="École"
                    value={school.name}
                    onChange={(e) =>
                      handleSchoolChange(idx, "name", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    select
                    label="Statut"
                    value={school.status}
                    onChange={(e) =>
                      handleSchoolChange(idx, "status", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 1 }}
                    SelectProps={{ native: true }}
                  >
                    <option value="accepted">Accepté</option>
                    <option value="rejected">Refusé</option>
                  </TextField>
                  <Button
                    onClick={() => handleRemoveSchool(idx)}
                    color="error"
                    size="small"
                  >
                    Supprimer
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddSchool} size="small" sx={{ mt: 1 }}>
                Ajouter une école
              </Button>
            </Box>
            <TextField
              label="Conseil"
              name="conseil"
              value={editForm.conseil || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
              multiline
              minRows={4}
            />
            {/* Only show these fields for admin */}
            {isAdmin && (
              <>
                <TextField
                  label="Couleur (hex)"
                  name="color"
                  value={editForm.color || ""}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Dégradé (gradient)"
                  name="gradient"
                  value={editForm.gradient || ""}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Admin (true/false)"
                  name="isAdmin"
                  value={editForm.isAdmin ? "true" : "false"}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={() => setEditModalOpen(false)}>Annuler</Button>
              <Button type="submit" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
