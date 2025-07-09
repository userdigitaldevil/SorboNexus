import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { ArrowRight, Search } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import predefinedIcons from "../data/predefinedIcons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";

// CATEGORY_STYLES for resource categories
const CATEGORY_STYLES = {
  Mathématiques: {
    gradient: "linear-gradient(135deg, #e53935 0%, #ffb300 100%)",
    color: "#e53935",
  },
  Physique: {
    gradient: "linear-gradient(135deg, #009688 0%, #43e97b 100%)",
    color: "#009688",
  },
  Informatique: {
    gradient: "linear-gradient(135deg, #ff80ab 0%, #3b82f6 100%)",
    color: "#ff80ab",
  },
  Chimie: {
    gradient: "linear-gradient(135deg, #ffb300 0%, #ff7043 100%)",
    color: "#ffb300",
  },
  Électronique: {
    gradient: "linear-gradient(135deg, #8e24aa 0%, #00bcd4 100%)",
    color: "#8e24aa",
  },
  Mécanique: {
    gradient: "linear-gradient(135deg, #43a047 0%, #00bcd4 100%)",
    color: "#43a047",
  },
  "Sciences de la Terre": {
    gradient: "linear-gradient(135deg, #3949ab 0%, #00bcd4 100%)",
    color: "#3949ab",
  },
  "Sciences de la vie": {
    gradient: "linear-gradient(135deg, #00bcd4 0%, #43e97b 100%)",
    color: "#00bcd4",
  },
  Autres: {
    gradient: "linear-gradient(135deg, #f59e42 0%, #7e57c2 100%)",
    color: "#f59e42",
  },
};

export default function Ressources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState([
    "Toutes les ressources",
  ]);
  const [activeFilter, setActiveFilter] = useState(["Tous"]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const categoriesRef = useRef(null);
  const [resources, setResources] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    subject: "",
    description: "",
    icon: "",
    gradient: "",
    type: "PDF",
    category: ["Autres"],
    filter: ["Livres"],
    resourceUrl: "",
    format: "pdf",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addIconMode, setAddIconMode] = useState("predefined");
  const [addCustomIconUrl, setAddCustomIconUrl] = useState("");
  const [addIconSearch, setAddIconSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [editIconMode, setEditIconMode] = useState("predefined");
  const [editCustomIconUrl, setEditCustomIconUrl] = useState("");
  const [editIconSearch, setEditIconSearch] = useState("");
  // Add state for expanded descriptions
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const PREVIEW_LENGTH = 200;
  const PREVIEW_LINES = 3;
  const isLongDescription = (desc) =>
    desc &&
    (desc.length > PREVIEW_LENGTH || desc.split("\n").length > PREVIEW_LINES);
  const getPreviewDescription = (desc) => {
    if (!desc) return "";
    const lines = desc.split("\n");
    let preview = lines.slice(0, PREVIEW_LINES).join("\n");
    if (preview.length > PREVIEW_LENGTH) {
      preview = preview.substring(0, PREVIEW_LENGTH) + "...";
    } else if (lines.length > PREVIEW_LINES) {
      preview += "...";
    }
    return preview;
  };
  const toggleDescriptionExpansion = (id) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [userId, setUserId] = useState(null);
  // Add a state to store the original uploaded file name
  const [uploadedOriginalName, setUploadedOriginalName] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch resources from backend, with error handling
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || ""}/api/ressources`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des ressources");
        return res.json();
      })
      .then((data) => setResources(data))
      .catch((err) => {
        alert("Erreur lors du chargement des ressources: " + err.message);
      });
  }, []);

  // Admin detection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
        setUserId(decoded.id);
      } catch (error) {
        setIsAdmin(false);
        setUserId(null);
      }
    }
  }, []);

  const categories = [
    "Toutes les ressources",
    "Mathématiques",
    "Physique",
    "Informatique",
    "Chimie",
    "Électronique",
    "Mécanique",
    "Sciences de la Terre",
    "Sciences de la vie",
    "Autres",
  ];

  const filters = [
    "Tous",
    "Cours",
    "TD",
    "Examens",
    "Livres",
    "Exercices",
    "Vidéos",
    "Témoignages",
    "Concours",
    "CV",
    "Lettres",
    "Astuces",
    "Codes",
    "Autres",
  ];

  // Memoize filtered resources to prevent recalculation on every render
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory.includes("Toutes les ressources") ||
        (Array.isArray(resource.category) &&
          resource.category.some((cat) => activeCategory.includes(cat)));
      const matchesFilter =
        activeFilter.includes("Tous") ||
        (typeof resource.filter === "string"
          ? resource.filter
              .split(",")
              .map((f) => f.trim())
              .some((f) => activeFilter.includes(f))
          : Array.isArray(resource.filter)
          ? resource.filter.some((f) => activeFilter.includes(f))
          : false);

      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [resources, searchQuery, activeCategory, activeFilter]);

  // Helper for icon search
  const getFilteredIconsForAdd = () =>
    predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(addIconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(addIconSearch.toLowerCase())
    );
  const getFilteredIconsForEdit = () =>
    predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(editIconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(editIconSearch.toLowerCase())
    );

  // Add modal handlers
  const openAddModal = () => {
    setAddModalOpen(true);
    setAddForm((prev) => ({
      ...prev,
      filter: Array.isArray(prev.filter)
        ? prev.filter
        : typeof prev.filter === "string" && prev.filter.length > 0
        ? prev.filter.split(",").map((f) => f.trim())
        : [],
      category: Array.isArray(prev.category)
        ? prev.category
        : typeof prev.category === "string" && prev.category.length > 0
        ? prev.category.split(",").map((c) => c.trim())
        : ["Autres"],
    }));
  };
  const closeAddModal = () => setAddModalOpen(false);
  const updateAddFormField = (field, value) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddResource = async () => {
    setAddLoading(true);
    setAddError("");
    try {
      const payload = {
        ...addForm,
        filter: Array.isArray(addForm.filter)
          ? addForm.filter.join(",")
          : addForm.filter,
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/ressources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la ressource");
      const data = await res.json();
      setResources((prev) => [data, ...prev]);
      setAddModalOpen(false);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  // Open edit modal with resource data
  const openEditModal = (resource) => {
    setEditForm({
      ...resource,
      filter: Array.isArray(resource.filter)
        ? resource.filter
        : typeof resource.filter === "string" && resource.filter.length > 0
        ? resource.filter.split(",").map((f) => f.trim())
        : [],
      category: Array.isArray(resource.category)
        ? resource.category
        : typeof resource.category === "string" && resource.category.length > 0
        ? resource.category.split(",").map((c) => c.trim())
        : ["Autres"],
    });
    setEditError("");
    setEditModalOpen(true);
  };
  const closeEditModal = () => setEditModalOpen(false);
  const updateEditFormField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleEditResource = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const payload = {
        ...editForm,
        filter: Array.isArray(editForm.filter)
          ? editForm.filter.join(",")
          : editForm.filter,
      };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/ressources/${editForm.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok)
        throw new Error("Erreur lors de la modification de la ressource");
      const data = await res.json();
      setResources((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      setEditModalOpen(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete logic
  const openDeleteDialog = (resource) => {
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);
  const handleDeleteResource = async () => {
    if (!resourceToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/ressources/${
          resourceToDelete.id
        }`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.error || "Erreur lors de la suppression de la ressource."
        );
      }
      setResources((prev) => prev.filter((r) => r.id !== resourceToDelete.id));
      closeDeleteDialog();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="glassy-bg min-h-screen">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-700/40 via-teal-400/20 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-gradient-to-br from-pink-500/30 via-blue-400/10 to-teal-400/30 rounded-full blur-2xl animate-pulse-slower" />
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="relative pt-20 pb-16 px-4 bg-gradient-to-r from-blue-900/30 to-teal-900/30 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "80px" : "80px",
          paddingBottom: window.innerWidth < 600 ? "64px" : "64px",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
                fontSize: { xs: "0.95rem", sm: "1.15rem", md: "1.5rem" },
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
            transition={{ duration: 0.5 }}
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
            <Box sx={{ mb: { xs: 2, md: 3 } }} ref={categoriesRef}>
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
                    onClick={() => {
                      setActiveCategory((prev) => {
                        if (category === "Toutes les ressources")
                          return ["Toutes les ressources"];
                        if (prev.includes(category)) {
                          const next = prev.filter((c) => c !== category);
                          return next.length === 0
                            ? ["Toutes les ressources"]
                            : next;
                        } else {
                          return prev
                            .filter((c) => c !== "Toutes les ressources")
                            .concat(category);
                        }
                      });
                    }}
                    sx={{
                      background: activeCategory.includes(category)
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
                    onClick={() => {
                      setActiveFilter((prev) => {
                        if (filter === "Tous") return ["Tous"];
                        if (prev.includes(filter)) {
                          const next = prev.filter((f) => f !== filter);
                          return next.length === 0 ? ["Tous"] : next;
                        } else {
                          return prev
                            .filter((f) => f !== "Tous")
                            .concat(filter);
                        }
                      });
                    }}
                    sx={{
                      background: activeFilter.includes(filter)
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
            {/* Add small 'ajouter une ressource' button below filters */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 2 }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<i className="fas fa-plus"></i>}
                sx={{
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  color: "#3b82f6",
                  borderColor: "#3b82f6",
                  minWidth: "auto",
                  textTransform: "none",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.08)",
                    borderColor: "#2563eb",
                  },
                }}
                onClick={() => {
                  const section = document.getElementById(
                    "partagez-vos-ressources"
                  );
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Ajouter une ressource
              </Button>
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
            {filteredResources.map((resource, index) => (
              <Grid
                gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
                key={resource.id}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    onClick={() => {
                      if (resource.resourceUrl) {
                        window.open(
                          getResourceUrl(resource.resourceUrl),
                          "_blank"
                        );
                      }
                    }}
                    sx={{
                      height: "100%",
                      maxWidth: { xs: 280, md: 320 },
                      mx: "auto",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      cursor: resource.resourceUrl ? "pointer" : "default",
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
                          background:
                            CATEGORY_STYLES[resource.category]?.gradient ||
                            "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
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
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: { xs: 1, md: 2 },
                        }}
                      >
                        {Array.isArray(resource.category) &&
                          resource.category.map((cat) => (
                            <Chip
                              key={cat}
                              label={cat}
                              size="small"
                              sx={{
                                background: "#3b82f6",
                                color: "white",
                                fontWeight: 500,
                              }}
                            />
                          ))}
                      </Box>
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
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#a1a1aa",
                                mb: { xs: 2, md: 3 },
                                lineHeight: 1.6,
                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {expandedDescriptions.has(resource.id)
                          ? resource.description
                          : getPreviewDescription(resource.description)}
                      </ReactMarkdown>
                      {isLongDescription(resource.description) && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDescriptionExpansion(resource.id);
                          }}
                          sx={{
                            color: "#3b82f6",
                            textTransform: "none",
                            fontWeight: 600,
                            p: 0,
                            minWidth: "auto",
                            fontSize: { xs: "0.75rem", md: "0.875rem" },
                            mb: 1,
                            "&:hover": {
                              background: "rgba(59, 130, 246, 0.1)",
                            },
                          }}
                        >
                          {expandedDescriptions.has(resource.id)
                            ? "Voir moins"
                            : "Lire la suite"}
                        </Button>
                      )}
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
                        {resource.resourceUrl && (
                          <i
                            className="fas fa-download"
                            style={{
                              color: "#10b981",
                              fontSize: "0.7rem",
                              cursor: "pointer",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                getResourceUrl(resource.resourceUrl),
                                "_blank"
                              );
                            }}
                          />
                        )}
                        {(isAdmin || userId === resource.createdById) && (
                          <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(resource);
                              }}
                              sx={{ color: "#f59e42" }}
                              title="Modifier"
                            >
                              <i className="fas fa-edit"></i>
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(resource);
                              }}
                              sx={{ color: "#ef4444" }}
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      {resource.createdAt && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            color: "#888",
                            mt: 2,
                            textAlign: "right",
                            fontSize: "0.75rem",
                          }}
                        >
                          Ajouté le{" "}
                          {new Date(resource.createdAt).toLocaleDateString(
                            "fr-FR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredResources.length > itemsPerPage && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: { xs: 3, md: 6 },
              }}
            >
              <Pagination
                count={Math.ceil(filteredResources.length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => {
                  setCurrentPage(value);
                  if (categoriesRef.current) {
                    categoriesRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
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
        id="partagez-vos-ressources"
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
                  fontSize: { xs: "0.95rem", sm: "1.05rem", md: "1.25rem" },
                }}
              >
                Vous avez des notes de cours, des résumés ou des exercices
                utiles ?{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Contribuez à enrichir la communauté SorboNexus
                </span>{" "}
                en partageant vos ressources.
                <br />
                <span style={{ color: "#10b981", fontWeight: 500 }}>
                  Vous pouvez aussi ajouter vos modèles de CV, modèles de
                  lettres de motivation, ou des sujets de concours/oraux !
                </span>
              </Typography>
            </motion.div>

            {isLoggedIn && (
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
                  onClick={openAddModal}
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
            )}
            {!isLoggedIn && (
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
                  onClick={() => navigate("/connexion")}
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
            )}
          </Box>
        </Container>
      </motion.section>

      {/* Add Resource Modal */}
      <Dialog
        open={addModalOpen}
        onClose={closeAddModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Ajouter une ressource
          <IconButton
            onClick={closeAddModal}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              ml: 1,
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Titre"
              value={addForm.title}
              onChange={(e) => updateAddFormField("title", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
            <TextField
              label="Sujet"
              value={addForm.subject}
              onChange={(e) => updateAddFormField("subject", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
            <TextField
              label="Description"
              value={addForm.description}
              onChange={(e) =>
                updateAddFormField("description", e.target.value)
              }
              fullWidth
              multiline
              minRows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                },
              }}
            />
            <Typography variant="caption" sx={{ color: "#3b82f6", mt: 0.5 }}>
              Markdown supporté (titres, listes, gras, italique, liens, etc.)
            </Typography>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                }}
              >
                Catégorie
              </InputLabel>
              <Select
                multiple
                value={addForm.category}
                onChange={(e) =>
                  updateAddFormField(
                    "category",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                sx={{
                  color: "white",
                  background: "rgba(30, 41, 59, 0.95)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                    },
                  },
                }}
                renderValue={(selected) =>
                  Array.isArray(selected) ? selected.join(", ") : selected
                }
              >
                {categories.slice(1).map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{ background: "none !important", color: "white" }}
                  >
                    <Checkbox
                      checked={addForm.category.indexOf(category) > -1}
                      sx={{ color: "#3b82f6", p: 0.5, mr: 1 }}
                    />
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Icon Selection */}
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 500, mb: 1 }}
            >
              Icône
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant={
                  addIconMode === "predefined" ? "contained" : "outlined"
                }
                size="small"
                onClick={() => setAddIconMode("predefined")}
                sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
              >
                Icônes prédéfinies
              </Button>
              <Button
                variant={addIconMode === "custom" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAddIconMode("custom")}
                sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
              >
                URL personnalisée
              </Button>
              <Button
                variant={addIconMode === "manual" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAddIconMode("manual")}
                sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
              >
                Classe FontAwesome
              </Button>
            </Box>
            {addIconMode === "predefined" && (
              <>
                <TextField
                  label="Rechercher une icône"
                  value={addIconSearch}
                  onChange={(e) => setAddIconSearch(e.target.value)}
                  size="small"
                  fullWidth
                  sx={{
                    mb: 1,
                    input: { color: "white" },
                    label: { color: "rgba(255,255,255,0.7)" },
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 1,
                    maxHeight: "200px",
                    overflowY: "auto",
                    p: 1,
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 1,
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  {getFilteredIconsForAdd().map((iconOption) => (
                    <IconButton
                      key={iconOption.value}
                      onClick={() =>
                        updateAddFormField("icon", iconOption.value)
                      }
                      sx={{
                        width: 40,
                        height: 40,
                        border:
                          addForm.icon === iconOption.value
                            ? "2px solid #3b82f6"
                            : "1px solid rgba(255,255,255,0.2)",
                        background:
                          addForm.icon === iconOption.value
                            ? "rgba(59,130,246,0.2)"
                            : "rgba(255,255,255,0.05)",
                        color: "white",
                        fontSize: "1.2rem",
                        "&:hover": {
                          background: "rgba(59,130,246,0.1)",
                          border: "1px solid #3b82f6",
                        },
                      }}
                    >
                      <i className={iconOption.value}></i>
                    </IconButton>
                  ))}
                </Box>
              </>
            )}
            {addIconMode === "custom" && (
              <TextField
                label="URL de l'icône"
                value={addCustomIconUrl}
                onChange={(e) => setAddCustomIconUrl(e.target.value)}
                fullWidth
                placeholder="https://example.com/icon.png"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
            )}
            {addIconMode === "manual" && (
              <TextField
                label="Classe FontAwesome (ex: fas fa-atom)"
                value={addForm.icon}
                onChange={(e) => updateAddFormField("icon", e.target.value)}
                fullWidth
                placeholder="fas fa-atom"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
            )}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                }}
              >
                Type
              </InputLabel>
              <Select
                value={addForm.type}
                onChange={(e) => updateAddFormField("type", e.target.value)}
                sx={{
                  color: "white",
                  background: "rgba(30, 41, 59, 0.95)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                    },
                  },
                }}
              >
                <MenuItem
                  value="PDF"
                  sx={{ background: "none !important", color: "white" }}
                >
                  PDF
                </MenuItem>
                <MenuItem
                  value="Image"
                  sx={{ background: "none !important", color: "white" }}
                >
                  Image
                </MenuItem>
                <MenuItem
                  value="Lien"
                  sx={{ background: "none !important", color: "white" }}
                >
                  Lien
                </MenuItem>
                <MenuItem
                  value="Text"
                  sx={{ background: "none !important", color: "white" }}
                >
                  Text
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  "&.Mui-focused": { color: "#3b82f6" },
                }}
              >
                Filtre
              </InputLabel>
              <Select
                multiple
                value={addForm.filter}
                onChange={(e) =>
                  updateAddFormField(
                    "filter",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                sx={{
                  color: "white",
                  background: "rgba(30, 41, 59, 0.95)",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                    },
                  },
                }}
                renderValue={(selected) => selected.join(", ")}
              >
                {[
                  "Cours",
                  "TD",
                  "Examens",
                  "Livres",
                  "Exercices",
                  "Vidéos",
                  "Témoignages",
                  "Concours",
                  "CV",
                  "Lettres",
                  "Astuces",
                  "Codes",
                  "Autres",
                ].map((filter) => (
                  <MenuItem
                    key={filter}
                    value={filter}
                    sx={{ background: "none !important", color: "white" }}
                  >
                    <Checkbox
                      checked={addForm.filter.indexOf(filter) > -1}
                      sx={{ color: "#3b82f6", p: 0.5, mr: 1 }}
                    />
                    {filter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {addForm.type === "PDF" || addForm.type === "Image" ? (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={uploading}
                  sx={{
                    color: uploading ? "#aaa" : "#3b82f6",
                    borderColor: uploading ? "#aaa" : "#3b82f6",
                    mb: 1,
                  }}
                >
                  {uploading ? "Uploading..." : "Upload your file"}
                  <input
                    type="file"
                    accept={addForm.type === "PDF" ? ".pdf" : "image/*"}
                    hidden
                    ref={fileInputRef}
                    onChange={async (e) => {
                      setUploadError("");
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploading(true);
                      const formData = new FormData();
                      formData.append("file", file);
                      try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                          `${import.meta.env.VITE_API_URL || ""}/api/upload`,
                          {
                            method: "POST",
                            headers: token
                              ? { Authorization: `Bearer ${token}` }
                              : {},
                            body: formData,
                          }
                        );
                        if (!res.ok)
                          throw new Error("Erreur lors de l'upload du fichier");
                        const data = await res.json();
                        if (!data.filename)
                          throw new Error("Réponse d'upload invalide");
                        const fileUrl =
                          data.url || `/api/files/${data.filename}`;
                        updateAddFormField("resourceUrl", fileUrl);
                        setUploadedOriginalName(data.originalName || "");
                      } catch (err) {
                        setUploadError(err.message);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </Button>
                {addForm.resourceUrl && (
                  <Typography variant="caption" sx={{ color: "#10b981" }}>
                    Fichier prêt à être ajouté :{" "}
                    {uploadedOriginalName ||
                      addForm.resourceUrl.split("/").pop()}
                  </Typography>
                )}
                {uploadError && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {uploadError}
                  </Typography>
                )}
              </Box>
            ) : addForm.type === "Text" ? null : (
              <TextField
                label="URL de la ressource"
                value={addForm.resourceUrl}
                onChange={(e) =>
                  updateAddFormField("resourceUrl", e.target.value)
                }
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
            )}
            {addError && <Typography color="error">{addError}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={closeAddModal}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddResource}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
            disabled={addLoading}
          >
            {addLoading ? "Ajout..." : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Resource Modal */}
      <Dialog
        open={editModalOpen}
        onClose={closeEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 600,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Modifier la ressource
          <IconButton
            onClick={closeEditModal}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              ml: 1,
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editForm && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Titre"
                value={editForm.title}
                onChange={(e) => updateEditFormField("title", e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
              <TextField
                label="Sujet"
                value={editForm.subject}
                onChange={(e) => updateEditFormField("subject", e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
              <TextField
                label="Description"
                value={editForm.description}
                onChange={(e) =>
                  updateEditFormField("description", e.target.value)
                }
                fullWidth
                multiline
                minRows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: "#3b82f6", mt: 0.5 }}>
                Markdown supporté (titres, listes, gras, italique, liens, etc.)
              </Typography>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  }}
                >
                  Catégorie
                </InputLabel>
                <Select
                  multiple
                  value={editForm.category}
                  onChange={(e) =>
                    updateEditFormField(
                      "category",
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value
                    )
                  }
                  sx={{
                    color: "white",
                    background: "rgba(30, 41, 59, 0.95)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "rgba(30, 41, 59, 0.98)",
                        color: "white",
                        maxHeight: 200,
                        minWidth: 180,
                      },
                    },
                  }}
                  renderValue={(selected) =>
                    Array.isArray(selected) ? selected.join(", ") : selected
                  }
                >
                  {categories.slice(1).map((category) => (
                    <MenuItem
                      key={category}
                      value={category}
                      sx={{ background: "none !important", color: "white" }}
                    >
                      <Checkbox
                        checked={editForm.category.indexOf(category) > -1}
                        sx={{ color: "#3b82f6", p: 0.5, mr: 1 }}
                      />
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Icon Selection */}
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Icône
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                  variant={
                    editIconMode === "predefined" ? "contained" : "outlined"
                  }
                  size="small"
                  onClick={() => setEditIconMode("predefined")}
                  sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
                >
                  Icônes prédéfinies
                </Button>
                <Button
                  variant={editIconMode === "custom" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setEditIconMode("custom")}
                  sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
                >
                  URL personnalisée
                </Button>
                <Button
                  variant={editIconMode === "manual" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setEditIconMode("manual")}
                  sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
                >
                  Classe FontAwesome
                </Button>
              </Box>
              {editIconMode === "predefined" && (
                <>
                  <TextField
                    label="Rechercher une icône"
                    value={editIconSearch}
                    onChange={(e) => setEditIconSearch(e.target.value)}
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      input: { color: "white" },
                      label: { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, 1fr)",
                      gap: 1,
                      maxHeight: "200px",
                      overflowY: "auto",
                      p: 1,
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 1,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {getFilteredIconsForEdit().map((iconOption) => (
                      <IconButton
                        key={iconOption.value}
                        onClick={() =>
                          updateEditFormField("icon", iconOption.value)
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          border:
                            editForm.icon === iconOption.value
                              ? "2px solid #3b82f6"
                              : "1px solid rgba(255,255,255,0.2)",
                          background:
                            editForm.icon === iconOption.value
                              ? "rgba(59,130,246,0.2)"
                              : "rgba(255,255,255,0.05)",
                          color: "white",
                          fontSize: "1.2rem",
                          "&:hover": {
                            background: "rgba(59,130,246,0.1)",
                            border: "1px solid #3b82f6",
                          },
                        }}
                      >
                        <i className={iconOption.value}></i>
                      </IconButton>
                    ))}
                  </Box>
                </>
              )}
              {editIconMode === "custom" && (
                <TextField
                  label="URL de l'icône"
                  value={editCustomIconUrl}
                  onChange={(e) => setEditCustomIconUrl(e.target.value)}
                  fullWidth
                  placeholder="https://example.com/icon.png"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.7)",
                      "&.Mui-focused": { color: "#3b82f6" },
                    },
                  }}
                />
              )}
              {editIconMode === "manual" && (
                <TextField
                  label="Classe FontAwesome (ex: fas fa-atom)"
                  value={editForm.icon}
                  onChange={(e) => updateEditFormField("icon", e.target.value)}
                  fullWidth
                  placeholder="fas fa-atom"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.7)",
                      "&.Mui-focused": { color: "#3b82f6" },
                    },
                  }}
                />
              )}
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  }}
                >
                  Type
                </InputLabel>
                <Select
                  value={editForm.type}
                  onChange={(e) => updateEditFormField("type", e.target.value)}
                  sx={{
                    color: "white",
                    background: "rgba(30, 41, 59, 0.95)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "rgba(30, 41, 59, 0.98)",
                        color: "white",
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="PDF"
                    sx={{ background: "none !important", color: "white" }}
                  >
                    PDF
                  </MenuItem>
                  <MenuItem
                    value="Image"
                    sx={{ background: "none !important", color: "white" }}
                  >
                    Image
                  </MenuItem>
                  <MenuItem
                    value="Lien"
                    sx={{ background: "none !important", color: "white" }}
                  >
                    Lien
                  </MenuItem>
                  <MenuItem
                    value="Text"
                    sx={{ background: "none !important", color: "white" }}
                  >
                    Text
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    "&.Mui-focused": { color: "#3b82f6" },
                  }}
                >
                  Filtre
                </InputLabel>
                <Select
                  multiple
                  value={editForm.filter}
                  onChange={(e) =>
                    updateEditFormField(
                      "filter",
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value
                    )
                  }
                  sx={{
                    color: "white",
                    background: "rgba(30, 41, 59, 0.95)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#3b82f6",
                    },
                    "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        background: "rgba(30, 41, 59, 0.98)",
                        color: "white",
                        maxHeight: 200,
                        minWidth: 180,
                      },
                    },
                  }}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[
                    "Cours",
                    "TD",
                    "Examens",
                    "Livres",
                    "Exercices",
                    "Vidéos",
                    "Témoignages",
                    "Concours",
                    "CV",
                    "Lettres",
                    "Astuces",
                    "Codes",
                    "Autres",
                  ].map((filter) => (
                    <MenuItem
                      key={filter}
                      value={filter}
                      sx={{ background: "none !important", color: "white" }}
                    >
                      <Checkbox
                        checked={editForm.filter.indexOf(filter) > -1}
                        sx={{ color: "#3b82f6", p: 0.5, mr: 1 }}
                      />
                      {filter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {editForm.type === "PDF" || editForm.type === "Image" ? (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploading}
                    sx={{
                      color: uploading ? "#aaa" : "#3b82f6",
                      borderColor: uploading ? "#aaa" : "#3b82f6",
                      mb: 1,
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload your file"}
                    <input
                      type="file"
                      accept={editForm.type === "PDF" ? ".pdf" : "image/*"}
                      hidden
                      ref={fileInputRef}
                      onChange={async (e) => {
                        setUploadError("");
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const token = localStorage.getItem("token");
                          const res = await fetch(
                            `${import.meta.env.VITE_API_URL || ""}/api/upload`,
                            {
                              method: "POST",
                              headers: token
                                ? { Authorization: `Bearer ${token}` }
                                : {},
                              body: formData,
                            }
                          );
                          if (!res.ok)
                            throw new Error(
                              "Erreur lors de l'upload du fichier"
                            );
                          const data = await res.json();
                          if (!data.filename)
                            throw new Error("Réponse d'upload invalide");
                          const fileUrl =
                            data.url || `/api/files/${data.filename}`;
                          updateEditFormField("resourceUrl", fileUrl);
                        } catch (err) {
                          setUploadError(err.message);
                        } finally {
                          setUploading(false);
                        }
                      }}
                    />
                  </Button>
                  {editForm.resourceUrl && (
                    <Typography variant="caption" sx={{ color: "#10b981" }}>
                      Fichier prêt à être ajouté :{" "}
                      {editForm.resourceUrl.split("/").pop()}
                    </Typography>
                  )}
                  {uploadError && (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {uploadError}
                    </Typography>
                  )}
                </Box>
              ) : editForm.type === "Text" ? null : (
                <TextField
                  label="URL de la ressource"
                  value={editForm.resourceUrl}
                  onChange={(e) =>
                    updateEditFormField("resourceUrl", e.target.value)
                  }
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-focused": { color: "#3b82f6" },
                    },
                  }}
                />
              )}
              {editError && <Typography color="error">{editError}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={closeEditModal}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleEditResource}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
            disabled={editLoading}
          >
            {editLoading ? "Modification..." : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        PaperProps={{
          sx: {
            background: "rgba(30,41,59,1)",
            color: "white",
            borderRadius: 3,
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cette ressource ? Cette action est
          irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Annuler</Button>
          <Button
            onClick={handleDeleteResource}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// When displaying or downloading resources, ensure resourceUrl uses /api/files/ if not already an external URL
function getResourceUrl(resourceUrl) {
  if (!resourceUrl) return "";
  if (
    resourceUrl.startsWith("http://") ||
    resourceUrl.startsWith("https://") ||
    resourceUrl.startsWith("/api/files/") ||
    resourceUrl.includes("r2.cloudflarestorage.com")
  ) {
    return resourceUrl;
  }
  // fallback for legacy data
  return `/api/files/${resourceUrl.replace(/^.*[\\/]/, "")}`;
}
