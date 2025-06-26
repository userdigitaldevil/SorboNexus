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
    hidden: false,
    nationalities: "",
    stagesWorkedContestsExtracurriculars: "",
    futureGoals: "",
    anneeFinL3: "",
    // Password change fields
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });
  const [editError, setEditError] = useState("");

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

  const fetchAlumni = async () => {
    try {
      const response = await fetch(`${process.env.VITE_API_URL}/api/alumni`);
      const data = await response.json();
      setAlumni(data);
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
    // If ?editSelf=1 is present, open the edit modal for the current user
    const params = new URLSearchParams(location.search);
    if (params.get("editSelf") === "1") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const myAlumni = alumni.find(
            (a) => String(a._id) === String(decoded.alumniId)
          );
          if (myAlumni) {
            handleEditClick(myAlumni);
            // Remove the query param for a clean URL
            params.delete("editSelf");
            navigate(
              { pathname: location.pathname, search: params.toString() },
              { replace: true }
            );
          }
        } catch (e) {}
      }
    }
  }, [location, alumni]);

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

  const visibleAlumni = alumni.filter(
    (alum) => !alum.hidden || String(alum._id) === String(alumniId) || isAdmin
  );
  const filteredAlumni = visibleAlumni.filter((alum) => {
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
      alum.profile?.schoolsApplied?.some(
        (school) =>
          school.name &&
          school.name.toLowerCase().includes(searchLower) &&
          school.status === "accepted"
      ) || false;

    const matchesSearch = basicMatch || schoolsMatch;
    const matchesFilter =
      activeFilter === "Tous" || alum.field === activeFilter;

    // Debug logging for new alumni
    if (searchQuery && !matchesSearch) {
      console.log("Alumni not matching search:", {
        name: alum.name,
        position: alum.position,
        degree: alum.degree,
        field: alum.field,
        schoolsApplied: alum.profile?.schoolsApplied,
        searchQuery: searchQuery,
        hidden: alum.hidden,
      });
    }

    return matchesSearch && matchesFilter;
  });

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentAlumni = filteredAlumni.slice(startIndex, endIndex);

  // Custom ordering:
  if (alumniId) {
    // If logged in: self first (always first card on first page), then admins (excluding self if admin), then others
    const self = filteredAlumni.find((a) => String(a._id) === String(alumniId));
    const adminCards = filteredAlumni.filter(
      (a) => a.isAdmin && String(a._id) !== String(alumniId)
    );
    const otherCards = filteredAlumni.filter(
      (a) => !a.isAdmin && String(a._id) !== String(alumniId)
    );
    const ordered = [...(self ? [self] : []), ...adminCards, ...otherCards];
    // Apply pagination after ordering
    currentAlumni = ordered.slice(startIndex, endIndex);
  } else {
    // If not logged in: admins first, with 'admindigitaldevil' (or name contains 'DigitalDevil') always first
    const adminCards = filteredAlumni.filter((a) => a.isAdmin);
    const otherCards = filteredAlumni.filter((a) => !a.isAdmin);
    // Find the special admin
    let specialAdminIdx = adminCards.findIndex(
      (a) =>
        (a.username && a.username.toLowerCase() === "admindigitaldevil") ||
        (a.name && a.name.toLowerCase().includes("digitaldevil"))
    );
    let specialAdmin = null;
    if (specialAdminIdx > -1) {
      [specialAdmin] = adminCards.splice(specialAdminIdx, 1);
    }
    const ordered = [
      ...(specialAdmin ? [specialAdmin] : []),
      ...adminCards,
      ...otherCards,
    ];
    currentAlumni = ordered.slice(startIndex, endIndex);
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
      hidden: alum.hidden || false,
      nationalities: Array.isArray(alum.nationalities)
        ? alum.nationalities.join(", ")
        : alum.nationalities || "",
      stagesWorkedContestsExtracurriculars:
        alum.stagesWorkedContestsExtracurriculars || "",
      futureGoals: alum.futureGoals || "",
      anneeFinL3: alum.anneeFinL3 || "",
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
    setEditError("");

    // Validate password change if provided
    if (editForm.newPassword || editForm.confirmPassword) {
      if (!editForm.newPassword) {
        setEditError("Veuillez saisir un nouveau mot de passe");
        return;
      }
      if (!editForm.confirmPassword) {
        setEditError("Veuillez confirmer le nouveau mot de passe");
        return;
      }
      if (editForm.newPassword !== editForm.confirmPassword) {
        setEditError("Les mots de passe ne correspondent pas");
        return;
      }
      // Password strength validation (basic check - backend will do full validation)
      if (editForm.newPassword.length < 8) {
        setEditError("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
    }

    // Debug: log the form state before sending
    console.log("Submitting editForm:", editForm);
    // Build payload
    const stringFields = [
      "name",
      "degree",
      "position",
      "field",
      "linkedin",
      "email",
      "avatar",
      "color",
      "gradient",
      "conseil",
    ];
    const payload = {
      ...stringFields.reduce(
        (acc, key) => ({ ...acc, [key]: editForm[key] || "" }),
        {}
      ),
      isAdmin: !!editForm.isAdmin,
      hidden: !!editForm.hidden,
      nationalities: (editForm.nationalities || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stagesWorkedContestsExtracurriculars:
        editForm.stagesWorkedContestsExtracurriculars || "",
      futureGoals: editForm.futureGoals || "",
      anneeFinL3: editForm.anneeFinL3 || "",
      profile: {
        email: editForm.profile?.email || "",
        linkedin: editForm.profile?.linkedin || "",
        currentPosition: editForm.profile?.currentPosition || "",
        grades: editForm.profile?.grades || {},
        schoolsApplied: editForm.profile?.schoolsApplied || [],
      },
      updatedAt: new Date(),
    };

    // Add password change to payload if provided
    if (
      editForm.newPassword &&
      editForm.confirmPassword &&
      editForm.newPassword === editForm.confirmPassword
    ) {
      payload.newPassword = editForm.newPassword;
    }

    // Debug: log the payload before sending
    console.log("Submitting payload:", payload);
    // Send to backend
    const response = await fetch(
      `${process.env.VITE_API_URL}/api/alumni/${editAlumni._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      // Refresh alumni data
      await fetchAlumni();
      setEditModalOpen(false);
      setEditAlumni(null);
      setEditError("");
      // Clear password fields
      setEditForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
      }));
      // Notify navbar to refresh user data
      localStorage.setItem("profileUpdated", Date.now().toString());
      window.dispatchEvent(new Event("profileUpdated"));
    } else {
      const err = await response.json();
      setEditError(err.error || "Erreur lors de la mise à jour.");
    }
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
        `${process.env.VITE_API_URL}/api/alumni/${alum._id}`,
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
        alumni.find((a) => String(a._id) === String(alumniId))?.hidden && (
          <motion.section
            className="py-8 px-6 z-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              paddingTop: window.innerWidth < 600 ? "40px" : "64px",
              paddingBottom: window.innerWidth < 600 ? "40px" : "64px",
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: 3,
                  p: { xs: 2, md: 3 },
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  Votre profil est caché
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(239, 68, 68, 0.8)",
                    mb: { xs: 1.5, md: 2 },
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
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
                    fontSize: { xs: "0.7rem", md: "0.875rem" },
                    px: { xs: 2, md: 3 },
                    py: { xs: 0.5, md: 1 },
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
                <AlumniCard
                  alum={alum}
                  index={index}
                  onCardClick={openProfileModal}
                  adminGlow={adminGlow}
                  isAdmin={isAdmin}
                  onEditClick={handleEditClick}
                />
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
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            maxWidth: 600,
            width: "100%",
            borderRadius: 16,
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
            position: "relative",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={() => setEditModalOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 30,
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

          <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
            {editAlumni && String(alumniId) === String(editAlumni._id)
              ? "Modifier ma carte"
              : "Modifier l'alumni"}
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
            {/* Hide profile option for admin or self */}
            {(isAdmin ||
              (editAlumni && String(alumniId) === String(editAlumni._id))) && (
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!editForm.hidden}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          hidden: e.target.checked,
                        }))
                      }
                      name="hidden"
                      color="primary"
                    />
                  }
                  label="Cacher mon profil"
                />
              </Box>
            )}
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
            <TextField
              label="Nationalités (séparées par des virgules)"
              name="nationalities"
              value={editForm.nationalities || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stages, entreprises, concours, extrascolaire (texte libre)"
              name="stagesWorkedContestsExtracurriculars"
              value={editForm.stagesWorkedContestsExtracurriculars || ""}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Projets futurs (métiers, masters, écoles visés...)"
              name="futureGoals"
              value={editForm.futureGoals || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Année de fin de L3 (4 chiffres)"
              name="anneeFinL3"
              value={editForm.anneeFinL3 || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 4, pattern: "\\d{4}" }}
            />

            {/* Password Change Section */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "#3b82f6", fontWeight: 600 }}
              >
                Changer le mot de passe
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "rgba(255, 255, 255, 0.7)" }}
              >
                Laissez vide pour ne pas changer le mot de passe
              </Typography>

              <TextField
                label="Nouveau mot de passe"
                name="newPassword"
                type={editForm.showPassword ? "text" : "password"}
                value={editForm.newPassword}
                onChange={handleEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                      >
                        {editForm.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Minimum 8 caractères, 1 majuscule, 1 chiffre, 1 symbole"
              />

              <TextField
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                type={editForm.showConfirmPassword ? "text" : "password"}
                value={editForm.confirmPassword}
                onChange={handleEditFormChange}
                fullWidth
                sx={{ mb: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        edge="end"
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                      >
                        {editForm.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  editForm.newPassword &&
                  editForm.confirmPassword &&
                  editForm.newPassword !== editForm.confirmPassword
                }
                helperText={
                  editForm.newPassword &&
                  editForm.confirmPassword &&
                  editForm.newPassword !== editForm.confirmPassword
                    ? "Les mots de passe ne correspondent pas"
                    : ""
                }
              />
            </Box>

            {/* Only admins can edit color, gradient, and admin status */}
            {isAdmin && (
              <>
                <TextField
                  label="Couleur (hex)"
                  name="color"
                  value={editForm.color}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Dégradé (gradient)"
                  name="gradient"
                  value={editForm.gradient}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!editForm.isAdmin}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          isAdmin: e.target.checked,
                        }))
                      }
                      name="isAdmin"
                      color="primary"
                    />
                  }
                  label="Donner le statut administrateur à cet utilisateur"
                  sx={{ mb: 2 }}
                />
              </>
            )}
            {editAlumni && editAlumni.createdAt && (
              <TextField
                label="Date de création du compte"
                value={new Date(editAlumni.createdAt).toLocaleString("fr-FR")}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            )}
            {editError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {editError}
              </Typography>
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
