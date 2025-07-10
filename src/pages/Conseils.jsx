import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import useBookmarks from "../hooks/useBookmarks";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Grid,
  Pagination,
  Chip,
  Modal,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingIcon,
  Group as GroupIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Grade as GradeIcon,
  Business as BusinessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Cancel as CancelIcon,
  WarningAmber as WarningAmberIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
} from "@mui/icons-material";
import AlumniProfileCard from "../components/AlumniProfileCard";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { renderTextWithLinks } from "../utils/textUtils.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DOMAIN_COLORS } from "../components/AlumniCard.jsx";
import AlumniEditModal from "../components/AlumniEditModal";
import useMediaQuery from "@mui/material/useMediaQuery";

const tipsPerPage = 9;

function getAlumniCardColor(tip) {
  // Use domains array if available, otherwise fall back to field
  let alumDomains = [];

  if (Array.isArray(tip.domains) && tip.domains.length > 0) {
    alumDomains = tip.domains;
  } else if (Array.isArray(tip.field) && tip.field.length > 0) {
    alumDomains = tip.field;
  } else if (typeof tip.field === "string" && tip.field.trim() !== "") {
    // Handle comma-separated field string like "Mathématiques,Informatique"
    alumDomains = tip.field
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
  if (tip.customCardColor && tip.customCardColor.trim() !== "") {
    domainBg = tip.customCardColor;
  } else if (tip.color && tip.color.trim() !== "") {
    domainBg = tip.color;
  } else if (profileColors.length === 0) {
    domainBg = "rgba(255,255,255,0.08)";
  } else if (profileColors.length === 1) {
    domainBg = profileColors[0];
  } else {
    domainBg = `linear-gradient(90deg, ${profileColors.join(", ")})`;
  }

  return domainBg;
}

export default function Conseils() {
  // Admin state
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

  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTips, setExpandedTips] = useState(new Set());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
  const [alreadyConnectedOpen, setAlreadyConnectedOpen] = useState(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Refs to track card positions for smooth scrolling
  const cardRefs = useRef({});

  // Use bookmark hook for alumni
  const {
    bookmarkedItems: bookmarkedAlumni,
    toggleBookmark: toggleBookmarkForAlumni,
    isBookmarked: isAlumniBookmarked,
    loading: bookmarksLoading,
    error: bookmarksError,
  } = useBookmarks("alumni");

  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:600px)");

  // Set preview length and lines based on device
  const PREVIEW_LENGTH = isMobile ? 90 : 200;
  const PREVIEW_LINES = isMobile ? 2 : 3;

  // Style constants for alignment
  const LEFT_COL_WIDTH = 220;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/alumni`)
      .then((res) => res.json())
      .then((data) => {
        setAlumni(data);
        setLoading(false);
        console.log("Fetched alumni (conseils):", data);
      });
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const alumniTips = alumni.map((alum) => ({
    id: alum.id,
    _id: alum._id,
    title: alum.degree || alum.name,
    content: alum.conseil || "",
    author: alum.name,
    position: alum.position,
    avatar: alum.avatar,
    category: alum.field,
    field: alum.field, // Add this line to pass field to the color function
    profile: alum.profile,
    gradient: alum.gradient,
    conseil: alum.conseil,
    color: alum.color,
    domains: alum.domains,
    customCardColor: alum.customCardColor,
    hidden: alum.hidden,
    isAdmin: alum.isAdmin || false,
    updatedAt: alum.updatedAt, // Add updatedAt for sorting
  }));

  // Only include alumni with a non-empty conseil and not hidden, or self, or admin
  let filteredAlumniTips = alumniTips.filter(
    (tip) =>
      tip.conseil &&
      tip.conseil.trim().length > 0 &&
      (!tip.hidden || tip._id === alumniId || tip.id === alumniId || isAdmin) &&
      (!showBookmarkedOnly || isAlumniBookmarked(tip._id || tip.id))
  );

  // Remove hidden conseils of other users if not admin
  if (!isAdmin) {
    filteredAlumniTips = filteredAlumniTips.filter(
      (tip) => !tip.hidden || tip._id === alumniId || tip.id === alumniId
    );
  }

  // Custom ordering: user first, then admins, then others
  let userTip = null;
  let adminTips = [];
  let otherTips = [];
  if (alumniId) {
    userTip = filteredAlumniTips.find(
      (tip) => tip._id === alumniId || tip.id === alumniId
    );
    adminTips = filteredAlumniTips.filter(
      (tip) => tip.isAdmin && tip._id !== alumniId && tip.id !== alumniId
    );
    otherTips = filteredAlumniTips.filter(
      (tip) => !tip.isAdmin && tip._id !== alumniId && tip.id !== alumniId
    );
  } else {
    adminTips = filteredAlumniTips.filter((tip) => tip.isAdmin);
    otherTips = filteredAlumniTips.filter((tip) => !tip.isAdmin);
  }
  // Sort admins alphabetically by author
  adminTips.sort((a, b) => a.author.localeCompare(b.author));
  // Sort others by most recently updated
  otherTips.sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (a.updatedAt) return -1;
    if (b.updatedAt) return 1;
    return 0;
  });

  // Final ordered list: user first (if present), then admins, then others
  const orderedAlumniTips = [
    ...(userTip ? [userTip] : []),
    ...adminTips,
    ...otherTips,
  ];

  // Pagination
  const totalPages = Math.ceil(orderedAlumniTips.length / tipsPerPage);
  const currentTips = orderedAlumniTips.slice(
    (currentPage - 1) * tipsPerPage,
    currentPage * tipsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setExpandedTips(new Set()); // Reset expanded state when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpanded = useCallback(
    (tipId) => {
      const newExpanded = new Set(expandedTips);
      const wasExpanded = newExpanded.has(tipId);

      if (wasExpanded) {
        // Collapsing - only scroll back if the content was long enough to require scrolling
        newExpanded.delete(tipId);
        setExpandedTips(newExpanded);

        // Check if scrolling is needed by comparing card position before and after collapse
        setTimeout(() => {
          const cardElement = cardRefs.current[tipId];
          if (cardElement) {
            const rect = cardElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const cardTop = rect.top;

            // Only scroll if the card is not visible in the viewport (indicating long content was expanded)
            if (cardTop < 0 || cardTop > viewportHeight) {
              const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
              const offset = viewportHeight / 2; // Center the card in the viewport
              window.scrollTo({
                top: rect.top + scrollTop - offset,
                behavior: "smooth",
              });
            }
          }
        }, 100);
      } else {
        // Expanding
        newExpanded.add(tipId);
        setExpandedTips(newExpanded);
      }
    },
    [expandedTips]
  );

  /**
   * Toggle bookmark status for a specific alumni
   * @param {number} alumniId - ID of the alumni to toggle bookmark
   */

  const openProfileModal = (tip) => {
    setSelectedProfile(tip);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedProfile(null);
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
    closeProfileModal();
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/alumni/${editAlumni._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        // Refresh alumni data
        const updatedResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/alumni`
        );
        const updatedData = await updatedResponse.json();
        setAlumni(updatedData);
        setEditModalOpen(false);
        setEditAlumni(null);

        // Notify navbar to refresh user data
        localStorage.setItem("profileUpdated", Date.now().toString());
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        console.error("Failed to update alumni");
      }
    } catch (error) {
      console.error("Error updating alumni:", error);
    }
  };

  const isLongContent = (content) => {
    // Too long if more than PREVIEW_LENGTH chars or more than PREVIEW_LINES lines
    return (
      content.length > PREVIEW_LENGTH ||
      content.split("\n").length > PREVIEW_LINES
    );
  };

  const getPreviewContent = (content) => {
    // Show up to PREVIEW_LINES lines, but no more than PREVIEW_LENGTH chars
    const lines = content.split("\n");
    let preview = lines.slice(0, PREVIEW_LINES).join("\n");
    if (preview.length > PREVIEW_LENGTH) {
      preview = preview.substring(0, PREVIEW_LENGTH) + "...";
    } else if (lines.length > PREVIEW_LINES) {
      preview += "...";
    }
    return preview;
  };

  return (
    <div className="glassy-bg min-h-screen smooth-scroll-all">
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
        <LightbulbIcon />
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
        <SchoolIcon />
      </motion.div>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: { xs: 60, md: 90 },
                  height: { xs: 60, md: 90 },
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                  color: "white",
                  fontSize: { xs: "1.5rem", md: "2.2rem" },
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                }}
              >
                <GroupIcon />
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 300,
                  mb: { xs: 1, md: 2 },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3.5rem" },
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                <span style={{ fontWeight: 600 }}>Conseils</span> des Alumni
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.3rem" },
                  maxWidth: "700px",
                  margin: "0 auto",
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  mb: { xs: 4, md: 5 },
                }}
              >
                Découvrez les conseils, retours, témoignages et messages
                précieux de nos anciens étudiants pour réussir votre parcours
                universitaire et professionnel
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Hidden Profile Message */}
        {alumniId &&
          alumni.find(
            (a) =>
              String(a._id) === String(alumniId) ||
              String(a.id) === String(alumniId)
          )?.hidden && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Container
                maxWidth="lg"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Alert
                  severity="warning"
                  icon={false}
                  sx={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#dc2626",
                    fontWeight: 400,
                    borderRadius: 3,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    maxWidth: 700,
                    mx: "auto",
                    backdropFilter: "blur(10px)",
                    letterSpacing: "0.01em",
                    lineHeight: 1.5,
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
            </motion.div>
          )}

        {/* Bookmarked Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Chip
              icon={
                showBookmarkedOnly ? <BookmarkFilledIcon /> : <BookmarkIcon />
              }
              label={
                showBookmarkedOnly ? "Favoris uniquement" : "Tous les favoris"
              }
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              sx={{
                background: showBookmarkedOnly
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "rgba(255,255,255,0.05)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: { xs: "0.8rem", md: "0.9rem" },
                height: { xs: "36px", md: "40px" },
                fontWeight: 500,
                letterSpacing: "0.01em",
                "&:hover": {
                  background: showBookmarkedOnly
                    ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)"
                    : "rgba(245, 158, 11, 0.2)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  transform: "translateY(-1px)",
                },
                "& .MuiChip-icon": {
                  color: showBookmarkedOnly ? "white" : "#f59e0b",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Tips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            {currentTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card
                  ref={(el) => (cardRefs.current[tip.id] = el)}
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    mb: { xs: 2, md: 3 },
                    p: 0,
                    overflow: "visible",
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    minHeight: { xs: 80, md: 120 },
                    display: "flex",
                    alignItems: "center",
                    opacity:
                      (tip._id === alumniId || tip.id === alumniId) &&
                      tip.hidden
                        ? 0.5
                        : 1,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(59, 130, 246, 0.15)",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    },
                  }}
                >
                  {/* Left: Avatar & Info */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      minWidth: { xs: 160, md: LEFT_COL_WIDTH },
                      maxWidth: { xs: 160, md: LEFT_COL_WIDTH },
                      px: { xs: 1.5, md: 2 },
                      py: { xs: 1, md: 1.5 },
                      gap: { xs: 1.5, md: 2 },
                      position: "relative",
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        onClick={() => openProfileModal(tip)}
                        sx={{
                          width: { xs: 42, md: 52 },
                          height: { xs: 42, md: 52 },
                          background: getAlumniCardColor(tip),
                          fontSize: { xs: "0.9rem", md: "1.1rem" },
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.25)",
                          },
                        }}
                      >
                        {tip.avatar || tip.author.substring(0, 2).toUpperCase()}
                      </Avatar>
                    </motion.div>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        minWidth: 0,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Typography
                          onClick={() => openProfileModal(tip)}
                          variant="body1"
                          sx={{
                            color: "#3b82f6",
                            fontWeight: 500,
                            cursor: "pointer",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: { xs: 90, md: 130 },
                            fontSize: { xs: "0.85rem", md: "1.05rem" },
                            letterSpacing: "0.01em",
                            lineHeight: 1.3,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              color: "#2563eb",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {tip.author}
                        </Typography>
                      </motion.div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.75)",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 90, md: 130 },
                          fontSize: { xs: "0.7rem", md: "0.8rem" },
                          fontWeight: 400,
                          letterSpacing: "0.01em",
                          lineHeight: 1.3,
                        }}
                      >
                        {tip.position}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.6)",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 90, md: 130 },
                          fontSize: { xs: "0.7rem", md: "0.8rem" },
                          fontWeight: 400,
                          letterSpacing: "0.01em",
                          lineHeight: 1.3,
                        }}
                      >
                        {tip.title}
                      </Typography>
                      <Chip
                        label={tip.category}
                        size="small"
                        sx={{
                          background: "rgba(59, 130, 246, 0.08)",
                          color: "#3b82f6",
                          fontWeight: 400,
                          mt: 1,
                          fontSize: { xs: "0.65rem", md: "0.75rem" },
                          height: { xs: "22px", md: "26px" },
                          borderRadius: 1.5,
                          letterSpacing: "0.01em",
                          border: "1px solid rgba(59, 130, 246, 0.15)",
                        }}
                      />
                    </Box>
                  </Box>
                  {/* Right: Conseil Content */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      p: { xs: 1.5, md: 2 },
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      component="div"
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: { xs: "0.85rem", md: "0.95rem" },
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        fontFamily: "inherit",
                        minHeight: 48,
                        mb: 1.5,
                        fontWeight: 400,
                        letterSpacing: "0.01em",
                      }}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {expandedTips.has(tip.id)
                          ? tip.content
                          : getPreviewContent(tip.content)}
                      </ReactMarkdown>
                    </Typography>
                    {/* Expand/Collapse Button */}
                    {isLongContent(tip.content) && (
                      <Box sx={{ mt: 1 }}>
                        <Button
                          onClick={() => toggleExpanded(tip.id)}
                          sx={{
                            color: "#3b82f6",
                            textTransform: "none",
                            fontWeight: 500,
                            p: 0,
                            minWidth: "auto",
                            fontSize: { xs: "0.8rem", md: "0.9rem" },
                            letterSpacing: "0.02em",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.08)",
                              color: "#2563eb",
                            },
                          }}
                          endIcon={
                            expandedTips.has(tip.id) ? (
                              <ExpandLessIcon
                                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                              />
                            ) : (
                              <ExpandMoreIcon
                                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                              />
                            )
                          }
                        >
                          {expandedTips.has(tip.id)
                            ? "Voir moins"
                            : "Lire la suite"}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.03)",
                  borderRadius: 2,
                  fontWeight: 400,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-1px)",
                  },
                },
                "& .Mui-selected": {
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%) !important",
                  color: "white !important",
                  border: "1px solid #3b82f6 !important",
                  fontWeight: 500,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%) !important",
                    transform: "translateY(-1px)",
                  },
                },
              }}
            />
          </Box>
        </motion.div>

        {/* Join Network Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box
            sx={{
              textAlign: "center",
              mt: { xs: 8, md: 12 },
              position: "relative",
              py: { xs: 6, md: 8 },
              px: { xs: 2, md: 4 },
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Background gradient effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{
                position: "absolute",
                top: "10%",
                left: "10%",
                width: "150px",
                height: "150px",
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(30px)",
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
                width: "200px",
                height: "200px",
                background:
                  "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Box
                sx={{
                  width: { xs: 50, md: 70 },
                  height: { xs: 50, md: 70 },
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "white",
                  fontSize: { xs: "1.2rem", md: "1.6rem" },
                  boxShadow: "0 6px 20px rgba(59, 130, 246, 0.25)",
                }}
              >
                <LightbulbIcon />
              </Box>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 300,
                  mb: { xs: 2, md: 3 },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.5rem" },
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                <span style={{ fontWeight: 600 }}>Partagez</span> vos conseils
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: { xs: 4, md: 5 },
                  maxWidth: "700px",
                  margin: "0 auto",
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                  lineHeight: 1.4,
                  letterSpacing: "0.01em",
                }}
              >
                Remplissez votre profil et donnez de précieux conseils aux
                autres étudiants. C'est le cœur du site et votre expérience peut
                vraiment faire la différence pour les futurs étudiants de
                Sorbonne Université.
              </Typography>
            </motion.div>
            {!alumniId && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ width: "100%" }}
              >
                <Box sx={{ pt: { xs: 2, sm: 3, md: 4 } }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                      color: "white",
                      fontWeight: 500,
                      px: 5,
                      py: 2,
                      borderRadius: 4,
                      textTransform: "none",
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                      letterSpacing: "0.02em",
                      lineHeight: 1.4,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.25)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 35px rgba(59, 130, 246, 0.35)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                      },
                    }}
                    onClick={() => {
                      if (!alumniId) {
                        navigate("/connexion");
                      } else {
                        setAlreadyConnectedOpen(true);
                      }
                    }}
                  >
                    Rejoindre le réseau
                  </Button>
                </Box>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Container>

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
          {selectedProfile ? (
            <AlumniProfileCard
              alum={
                alumni.find((a) => a.id === selectedProfile.id) ||
                selectedProfile
              }
              isAdmin={isAdmin}
              alumniId={alumniId}
              handleEditClick={handleEditClick}
              onClose={closeProfileModal}
              isBookmarked={isAlumniBookmarked(selectedProfile.id)}
              onToggleBookmark={() =>
                toggleBookmarkForAlumni(selectedProfile.id)
              }
            />
          ) : null}
        </motion.div>
      </Modal>

      {/* Edit Modal */}
      <AlumniEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        alumni={editAlumni}
        setAlumni={setEditAlumni}
        isAdmin={isAdmin}
      />

      <Snackbar
        open={alreadyConnectedOpen}
        autoHideDuration={3500}
        onClose={() => setAlreadyConnectedOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="info"
          onClose={() => setAlreadyConnectedOpen(false)}
          sx={{ width: "100%" }}
        >
          Vous êtes déjà connecté.
        </Alert>
      </Snackbar>
    </div>
  );
}
