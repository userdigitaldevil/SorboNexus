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
} from "@mui/icons-material";
import AlumniProfileCard from "../components/AlumniProfileCard";
import { jwtDecode } from "jwt-decode";

const tipsPerPage = 9;

export default function Conseils() {
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

  useEffect(() => {
    fetch("http://localhost:5001/api/alumni")
      .then((res) => res.json())
      .then((data) => {
        setAlumni(data);
        setLoading(false);
        console.log("Fetched alumni (conseils):", data);
      });
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
    profile: alum.profile,
    gradient: alum.gradient,
    conseil: alum.conseil,
    color: alum.color,
  }));

  // Preview length for conseil content
  const PREVIEW_LENGTH = 200;

  // Style constants for alignment
  const LEFT_COL_WIDTH = 220;

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTips, setExpandedTips] = useState(new Set());
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
        `http://localhost:5001/api/alumni/${editAlumni._id}`,
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
        const updatedResponse = await fetch("http://localhost:5001/api/alumni");
        const updatedData = await updatedResponse.json();
        setAlumni(updatedData);
        setEditModalOpen(false);
        setEditAlumni(null);
      } else {
        console.error("Failed to update alumni");
      }
    } catch (error) {
      console.error("Error updating alumni:", error);
    }
  };

  const currentTips = alumniTips.slice(
    (currentPage - 1) * tipsPerPage,
    currentPage * tipsPerPage
  );

  const totalPages = Math.ceil(alumniTips.length / tipsPerPage);

  const isLongContent = (content) => content.length > PREVIEW_LENGTH;

  const getPreviewContent = (content) => {
    if (content.length <= PREVIEW_LENGTH) return content;
    return content.substring(0, PREVIEW_LENGTH) + "...";
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

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "white",
                  fontSize: "2rem",
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
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Conseils des Alumnis
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Découvrez les conseils précieux de nos anciens étudiants pour
                réussir votre parcours universitaire et professionnel
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Tips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
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
                    mb: 2,
                    p: 0,
                    overflow: "visible",
                    position: "relative",
                    transition: "box-shadow 0.2s",
                    minHeight: 100,
                    display: "flex",
                    alignItems: "center",
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
                      minWidth: LEFT_COL_WIDTH,
                      maxWidth: LEFT_COL_WIDTH,
                      px: 2,
                      py: 1.5,
                      gap: 2,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        onClick={() => openProfileModal(tip)}
                        sx={{
                          width: 44,
                          height: 44,
                          background: tip.color,
                          fontSize: "1rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
                          },
                        }}
                      >
                        {tip.avatar}
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
                            maxWidth: 120,
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
                          maxWidth: 120,
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
                          maxWidth: 120,
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
                      p: 2,
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.85)",
                        lineHeight: 1.7,
                        fontSize: "1.05rem",
                        mb: isLongContent(tip.content) ? 2 : 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {expandedTips.has(tip.id)
                        ? renderConseilWithLinks(tip.content)
                        : renderConseilWithLinks(
                            getPreviewContent(tip.content)
                          )}
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
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.1)",
                            },
                          }}
                          endIcon={
                            expandedTips.has(tip.id) ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <Card
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              p: 6,
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
              }}
            >
              Besoin de plus de conseils ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 4,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Rejoignez notre communauté d'alumnis pour échanger directement
              avec nos anciens étudiants
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  fontSize: "1.1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                  },
                }}
              >
                Rejoindre la communauté
              </Button>
            </motion.div>
          </Card>
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
          {selectedProfile && (
            <AlumniProfileCard
              alum={{
                ...selectedProfile,
                name: selectedProfile.author,
                degree: selectedProfile.title,
              }}
              isAdmin={false}
              handleEditClick={handleEditClick}
            />
          )}
        </motion.div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-modal-title"
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
              background: "rgba(15, 23, 42, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              maxWidth: 600,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <Box sx={{ p: 4 }}>
              <Typography
                id="edit-modal-title"
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#3b82f6",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Modifier ma carte
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
                      <Box
                        key={key + idx}
                        sx={{ display: "flex", gap: 1, mb: 1 }}
                      >
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
                          onChange={(e) =>
                            handleGradeChange(key, e.target.value)
                          }
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
                  {(editForm.profile?.schoolsApplied || []).map(
                    (school, idx) => (
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
                    )
                  )}
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
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button onClick={() => setEditModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="contained">
                    Enregistrer
                  </Button>
                </Box>
              </form>
            </Box>
          </Card>
        </motion.div>
      </Modal>
    </Box>
  );
}
