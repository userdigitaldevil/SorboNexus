import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:600px)");

  // Set preview length and lines based on device
  const PREVIEW_LENGTH = isMobile ? 90 : 200;
  const PREVIEW_LINES = isMobile ? 2 : 3;

  // Style constants for alignment
  const LEFT_COL_WIDTH = 220;

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/api/alumni`)
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
      (!tip.hidden || tip._id === alumniId || tip.id === alumniId || isAdmin)
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

  const toggleExpanded = (tipId) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
    } else {
      newExpanded.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

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
        `${process.env.VITE_API_URL}/api/alumni/${editAlumni._id}`,
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
          `${process.env.VITE_API_URL}/api/alumni`
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
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
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

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 8 } }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: "center", mb: { xs: 3, md: 8 } }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: { xs: 50, md: 80 },
                  height: { xs: 50, md: 80 },
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "white",
                  fontSize: { xs: "1.25rem", md: "2rem" },
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
                  fontWeight: 700,
                  mb: { xs: 1, md: 2 },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3.5rem" },
                }}
              >
                Conseils des Alumnis
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: { xs: 1.4, md: 1.5 },
                }}
              >
                Découvrez les conseils précieux de nos anciens étudiants pour
                réussir votre parcours universitaire et professionnel
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
            </motion.div>
          )}

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
                  elevation={1}
                  sx={{
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: 2,
                    boxShadow: "0 1px 6px rgba(59, 130, 246, 0.06)",
                    mb: { xs: 1.5, md: 2 },
                    p: 0,
                    overflow: "visible",
                    position: "relative",
                    transition: "box-shadow 0.2s",
                    minHeight: { xs: 60, md: 100 },
                    display: "flex",
                    alignItems: "center",
                    opacity:
                      (tip._id === alumniId || tip.id === alumniId) &&
                      tip.hidden
                        ? 0.5
                        : 1,
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.10)",
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
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        onClick={() => openProfileModal(tip)}
                        sx={{
                          width: { xs: 36, md: 44 },
                          height: { xs: 36, md: 44 },
                          background: getAlumniCardColor(tip),
                          fontSize: { xs: "0.8rem", md: "1rem" },
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
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
                            fontWeight: 600,
                            cursor: "pointer",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: { xs: 80, md: 120 },
                            fontSize: { xs: "0.8rem", md: "1rem" },
                            "&:hover": {
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
                          color: "rgba(255,255,255,0.7)",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 80, md: 120 },
                          fontSize: { xs: "0.65rem", md: "0.75rem" },
                        }}
                      >
                        {tip.position}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: { xs: 80, md: 120 },
                          fontSize: { xs: "0.65rem", md: "0.75rem" },
                        }}
                      >
                        {tip.title}
                      </Typography>
                      <Chip
                        label={tip.category}
                        size="small"
                        sx={{
                          background: "rgba(59, 130, 246, 0.2)",
                          color: "#3b82f6",
                          fontWeight: 600,
                          mt: 0.5,
                          fontSize: { xs: "0.6rem", md: "0.75rem" },
                          height: { xs: "20px", md: "24px" },
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
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                        fontFamily: "inherit",
                        minHeight: 48,
                        mb: 1,
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
                            fontWeight: 600,
                            p: 0,
                            minWidth: "auto",
                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.1)",
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
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
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

        {/* Join Network Section */}
        <Box
          sx={{
            transform: { xs: "scale(0.88)", sm: "scale(1)", md: "scale(1)" },
            transformOrigin: "top center",
          }}
        >
          <Card
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              p: { xs: 2, sm: 4, md: 6 },
              textAlign: "center",
              mt: 8,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background:
                  "linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                opacity: 0.8,
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2.1rem" },
              }}
            >
              Faites partie de notre réseau
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 4,
                maxWidth: "600px",
                margin: "0 auto",
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
              }}
            >
              Vous êtes un ancien étudiant de la Sorbonne ? Rejoignez notre
              réseau d'alumnis pour partager votre expérience et aider les
              étudiants actuels.
            </Typography>
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
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.1rem" },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
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
          </Card>
        </Box>
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
              isAdmin={false}
              handleEditClick={handleEditClick}
              onClose={closeProfileModal}
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
    </Box>
  );
}
