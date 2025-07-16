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
  Tooltip,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowRight, Search } from "lucide-react";
import {
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import predefinedIcons from "../data/predefinedIcons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import useBookmarks from "../hooks/useBookmarks";
import {
  getRessources,
  addRessource,
  editRessource,
  deleteRessource,
} from "../api/ressources";
import { uploadFile } from "../api/upload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

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
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
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
    loginRequired: false,
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
  const PREVIEW_LENGTH = 250;
  const PREVIEW_LINES = 4;
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
  const mainScrollContainerRef = useRef(null);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);

  // Lock scrolling when add modal is open
  useEffect(() => {
    if (addModalOpen) {
      // Lock body scrolling
      document.body.style.overflow = "hidden";

      // Lock main scroll container
      const mainContainer = document.querySelector(".main-scroll-container");
      if (mainContainer) {
        mainContainer.style.overflow = "hidden";
      }

      // Prevent scroll on the main container
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      if (mainContainer) {
        mainContainer.addEventListener("wheel", preventScroll, {
          passive: false,
        });
        mainContainer.addEventListener("touchmove", preventScroll, {
          passive: false,
        });
      }

      return () => {
        document.body.style.overflow = "";
        if (mainContainer) {
          mainContainer.style.overflow = "";
          mainContainer.removeEventListener("wheel", preventScroll);
          mainContainer.removeEventListener("touchmove", preventScroll);
        }
      };
    } else {
      // Restore body scrolling
      document.body.style.overflow = "";

      // Restore main scroll container
      const mainContainer = document.querySelector(".main-scroll-container");
      if (mainContainer) {
        mainContainer.style.overflow = "";
      }
    }
  }, [addModalOpen]);

  // Lock scrolling when edit modal is open
  useEffect(() => {
    if (editModalOpen) {
      // Lock body scrolling
      document.body.style.overflow = "hidden";

      // Lock main scroll container
      const mainContainer = document.querySelector(".main-scroll-container");
      if (mainContainer) {
        mainContainer.style.overflow = "hidden";
      }

      // Prevent scroll on the main container
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      if (mainContainer) {
        mainContainer.addEventListener("wheel", preventScroll, {
          passive: false,
        });
        mainContainer.addEventListener("touchmove", preventScroll, {
          passive: false,
        });
      }

      return () => {
        document.body.style.overflow = "";
        if (mainContainer) {
          mainContainer.style.overflow = "";
          mainContainer.removeEventListener("wheel", preventScroll);
          mainContainer.removeEventListener("touchmove", preventScroll);
        }
      };
    } else {
      // Restore body scrolling
      document.body.style.overflow = "";

      // Restore main scroll container
      const mainContainer = document.querySelector(".main-scroll-container");
      if (mainContainer) {
        mainContainer.style.overflow = "";
      }
    }
  }, [editModalOpen]);

  // Use bookmark hook
  const {
    bookmarkedItems: bookmarkedResources,
    toggleBookmark: toggleBookmarkForResource,
    isBookmarked: isResourceBookmarked,
    error: bookmarksError,
  } = useBookmarks("ressource");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch resources from backend, with error handling
  useEffect(() => {
    getRessources()
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
      const matchesBookmarked =
        !showBookmarkedOnly || isResourceBookmarked(resource.id);

      return (
        matchesSearch && matchesCategory && matchesFilter && matchesBookmarked
      );
    });
  }, [
    resources,
    searchQuery,
    activeCategory,
    activeFilter,
    showBookmarkedOnly,
    bookmarkedResources,
  ]);

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
        loginRequired: !!addForm.loginRequired,
        filter: Array.isArray(addForm.filter)
          ? addForm.filter.join(",")
          : addForm.filter,
      };
      const token = localStorage.getItem("token");
      const data = await addRessource(payload, token);
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
        loginRequired: !!editForm.loginRequired,
        filter: Array.isArray(editForm.filter)
          ? editForm.filter.join(",")
          : editForm.filter,
      };
      const token = localStorage.getItem("token");
      const data = await editRessource(editForm.id, payload, token);
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
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      await deleteRessource(resourceToDelete.id, token);
      setResources((prev) => prev.filter((r) => r.id !== resourceToDelete.id));
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="glassy-bg min-h-screen smooth-scroll-all">
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
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: { xs: 3, md: 4 },
                fontSize: { xs: "2.2rem", sm: "3.2rem", md: "4.2rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Ressources
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 400,
                maxWidth: 800,
                mx: "auto",
                mb: { xs: 4, md: 5 },
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                lineHeight: 1.6,
                letterSpacing: "0.01em",
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
          py: { xs: 5, md: 8 },
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
                mb: { xs: 3, md: 5 },
                fontWeight: 300,
                background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Trouvez ce que vous cherchez
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                mb: { xs: 3, md: 4 },
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
            <Box sx={{ mb: { xs: 3, md: 4 } }} ref={categoriesRef}>
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 2, md: 3 },
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.3rem" },
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
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
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                      height: { xs: "32px", md: "36px" },
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.2)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        transform: "translateY(-1px)",
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
                  mb: { xs: 2, md: 3 },
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 400,
                  fontSize: { xs: "1rem", md: "1.3rem" },
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
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
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                      height: { xs: "32px", md: "36px" },
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      "&:hover": {
                        background: "rgba(139, 92, 246, 0.2)",
                        border: "1px solid rgba(139, 92, 246, 0.3)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Bookmarked Filter */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
            >
              <Chip
                icon={<BookmarkFilledIcon />}
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

            {/* Add small 'ajouter une ressource' button below filters */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 3 }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<i className="fas fa-plus"></i>}
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  px: 2.5,
                  py: 1,
                  borderRadius: 3,
                  color: "#3b82f6",
                  borderColor: "#3b82f6",
                  minWidth: "auto",
                  textTransform: "none",
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.06)",
                    borderColor: "#2563eb",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => {
                  if (isLoggedIn) {
                    openAddModal();
                  } else {
                    navigate("/connexion");
                  }
                }}
              >
                Ajouter une ressource
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Always render the resource grid for all users, regardless of login status. */}
      <motion.section
        className="py-20 px-6 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "80px" : "100px",
          paddingBottom: window.innerWidth < 600 ? "80px" : "100px",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {filteredResources.map((resource, index) => (
              <Grid
                gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
                key={resource.id}
                sx={{
                  display: "flex",
                  height: "100%",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    onClick={() => {
                      if (resource.loginRequired && !isLoggedIn) {
                        setLoginPopupOpen(true);
                        return;
                      }
                      if (resource.resourceUrl) {
                        window.open(
                          getResourceUrl(resource.resourceUrl),
                          "_blank"
                        );
                      }
                    }}
                    sx={{
                      height: expandedDescriptions.has(resource.id)
                        ? "auto"
                        : { xs: 480, md: 520 },
                      minHeight: { xs: 480, md: 520 },
                      width: "100%",
                      maxWidth: { xs: 280, md: 320 },
                      mx: "auto",
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      cursor: resource.resourceUrl ? "pointer" : "default",
                      position: "relative",
                      overflow: "visible",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: { xs: 2, md: 4 },
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
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
                          fontWeight: 500,
                          mb: { xs: 1.5, md: 2.5 },
                          transition: "all 0.3s ease",
                          fontSize: { xs: "1rem", md: "1.3rem" },
                          lineHeight: 1.3,
                          letterSpacing: "-0.01em",
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
                                fontWeight: 400,
                                fontSize: { xs: "0.65rem", md: "0.75rem" },
                                height: { xs: "20px", md: "24px" },
                                borderRadius: 1.5,
                                letterSpacing: "0.01em",
                              }}
                            />
                          ))}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#3b82f6",
                          fontWeight: 400,
                          mb: { xs: 1.5, md: 2.5 },
                          fontSize: { xs: "0.75rem", md: "0.9rem" },
                          letterSpacing: "0.02em",
                          lineHeight: 1.4,
                        }}
                      >
                        {resource.subject}
                      </Typography>
                      <Box
                        sx={{
                          flexGrow: 1,
                          overflow: expandedDescriptions.has(resource.id)
                            ? "visible"
                            : "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ node, ...props }) => (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.7)",
                                  mb: { xs: 2.5, md: 3.5 },
                                  lineHeight: 1.7,
                                  fontSize: { xs: "0.8rem", md: "0.9rem" },
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-word",
                                  overflow: expandedDescriptions.has(
                                    resource.id
                                  )
                                    ? "visible"
                                    : "hidden",
                                  display: "block",
                                  fontWeight: 400,
                                  letterSpacing: "0.01em",
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
                              fontWeight: 500,
                              p: 0,
                              minWidth: "auto",
                              fontSize: { xs: "0.8rem", md: "0.9rem" },
                              mb: 1,
                              mt: expandedDescriptions.has(resource.id)
                                ? 2
                                : "auto",
                              letterSpacing: "0.02em",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "rgba(59, 130, 246, 0.08)",
                                color: "#2563eb",
                              },
                            }}
                          >
                            {expandedDescriptions.has(resource.id)
                              ? "Voir moins"
                              : "Lire la suite"}
                          </Button>
                        )}
                      </Box>
                      {/* Spacer to push bottom elements to the bottom */}
                      <Box sx={{ flexGrow: 1 }} />
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
                            background: "rgba(59, 130, 246, 0.08)",
                            color: "#3b82f6",
                            border: "1px solid rgba(59, 130, 246, 0.15)",
                            fontSize: { xs: "0.65rem", md: "0.75rem" },
                            height: { xs: "22px", md: "26px" },
                            fontWeight: 400,
                            borderRadius: 1.5,
                            letterSpacing: "0.01em",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmarkForResource(resource.id);
                            }}
                            sx={{
                              color: isResourceBookmarked(resource.id)
                                ? "#f59e0b"
                                : "rgba(255, 255, 255, 0.6)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                color: isResourceBookmarked(resource.id)
                                  ? "#d97706"
                                  : "#f59e0b",
                                transform: "scale(1.1)",
                              },
                            }}
                            title={
                              isResourceBookmarked(resource.id)
                                ? "Retirer des favoris"
                                : "Ajouter aux favoris"
                            }
                          >
                            {isResourceBookmarked(resource.id) ? (
                              <BookmarkFilledIcon
                                sx={{
                                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                                }}
                              />
                            ) : (
                              <BookmarkIcon
                                sx={{
                                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                                }}
                              />
                            )}
                          </IconButton>
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
        </Container>
      </motion.section>

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

      {/* Upload Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              mt: { xs: 8, md: 12 },
              position: "relative",
              py: { xs: 6, md: 8 },
              px: { xs: 2, md: 4 },
              mb: { xs: 4, md: 6 },
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
                <i className="fas fa-share-alt"></i>
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
                <span style={{ fontWeight: 600 }}>Partagez</span> vos ressources
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
                Partagez vos ressources et aidez la communauté SorboNexus à
                grandir !{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Notes de cours, résumés, exercices, modèles de CV
                </span>{" "}
                et{" "}
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  lettres de motivation
                </span>{" "}
                - tout est précieux pour les futurs étudiants.
                <br />
                <span style={{ color: "#10b981", fontWeight: 500 }}>
                  Vos ressources peuvent faire la différence dans le parcours
                  d'un autre étudiant !
                </span>
              </Typography>
            </motion.div>

            {isLoggedIn && (
              <motion.div
                whileHover={{ scale: 1.045 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<i className="fas fa-plus"></i>}
                  sx={{
                    fontWeight: 400,
                    fontFamily: "inherit",
                    letterSpacing: "0.01em",
                    px: 5,
                    py: 2,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    color: "#fff",
                    textTransform: "none",
                    fontSize: { xs: "0.9rem", md: "1.1rem" },
                    boxShadow: "0 8px 32px rgba(59,130,246,0.13)",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid rgba(59,130,246,0.18)",
                    transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      color: "#fff",
                      boxShadow: "0 16px 48px 0 rgba(59,130,246,0.18)",
                      border: "1.5px solid #3b82f6",
                      "&::after": {
                        opacity: 1,
                      },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: 4,
                      pointerEvents: "none",
                      boxShadow: "0 0 0 4px rgba(59,130,246,0.13)",
                      opacity: 0,
                      transition: "opacity 0.22s cubic-bezier(.4,0,.2,1)",
                    },
                  }}
                  onClick={openAddModal}
                >
                  Ajouter une ressource
                </Button>
              </motion.div>
            )}
            {!isLoggedIn && (
              <motion.div
                whileHover={{ scale: 1.045 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<i className="fas fa-plus"></i>}
                  sx={{
                    fontWeight: 400,
                    fontFamily: "inherit",
                    letterSpacing: "0.01em",
                    px: 5,
                    py: 2,
                    borderRadius: 4,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    color: "#fff",
                    textTransform: "none",
                    fontSize: { xs: "0.9rem", md: "1.1rem" },
                    boxShadow: "0 8px 32px rgba(59,130,246,0.13)",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid rgba(59,130,246,0.18)",
                    transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      color: "#fff",
                      boxShadow: "0 16px 48px 0 rgba(59,130,246,0.18)",
                      border: "1.5px solid #3b82f6",
                      "&::after": {
                        opacity: 1,
                      },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: 4,
                      pointerEvents: "none",
                      boxShadow: "0 0 0 4px rgba(59,130,246,0.13)",
                      opacity: 0,
                      transition: "opacity 0.22s cubic-bezier(.4,0,.2,1)",
                    },
                  }}
                  onClick={() => navigate("/connexion")}
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
            width: { xs: "95vw", sm: "90vw", md: "auto" },
            maxWidth: { xs: "95vw", sm: "90vw", md: 600 },
            maxHeight: "90vh",
            overflowX: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "white",
            fontWeight: 500,
            fontSize: { xs: "1.4rem", md: "1.6rem" },
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 4,
            pt: 4,
            px: 4,
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          Ajouter une ressource
          <IconButton
            onClick={closeAddModal}
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              ml: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                color: "white",
                background: "rgba(255, 255, 255, 0.08)",
                transform: "scale(1.05)",
              },
            }}
          >
            <i className="fas fa-times"></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
            }}
          >
            <TextField
              label="Titre"
              value={addForm.title}
              onChange={(e) => updateAddFormField("title", e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  borderRadius: 2.5,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                    borderWidth: "1.5px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                    fontWeight: 500,
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "16px 14px",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  letterSpacing: "0.02em",
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
                  borderRadius: 2.5,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.95rem",
                  letterSpacing: "0.02em",
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
                  borderRadius: 2.5,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.95rem",
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#3b82f6",
                mt: 0.5,
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              Markdown supporté (titres, listes, gras, italique, liens, etc.)
            </Typography>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
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
                  borderRadius: 2.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                      borderRadius: 2.5,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
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
                    sx={{
                      background: "none !important",
                      color: "white",
                      fontSize: "0.9rem",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1) !important",
                        borderRadius: 1.5,
                        mx: 0.5,
                      },
                    }}
                  >
                    <Checkbox
                      checked={addForm.category.indexOf(category) > -1}
                      sx={{
                        color: "#3b82f6",
                        p: 0.5,
                        mr: 1,
                        "&.Mui-checked": {
                          color: "#3b82f6",
                        },
                      }}
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
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 500,
                mb: 2,
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
              }}
            >
              Icône
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              <Button
                variant={
                  addIconMode === "predefined" ? "contained" : "outlined"
                }
                size="small"
                onClick={() => setAddIconMode("predefined")}
                sx={{
                  fontSize: "0.85rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      addIconMode === "predefined"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Icônes prédéfinies
              </Button>
              <Button
                variant={addIconMode === "custom" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAddIconMode("custom")}
                sx={{
                  fontSize: "0.85rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      addIconMode === "custom"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                URL personnalisée
              </Button>
              <Button
                variant={addIconMode === "manual" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAddIconMode("manual")}
                sx={{
                  fontSize: "0.85rem",
                  px: 2.5,
                  py: 1,
                  borderRadius: 2.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  "&:hover": {
                    background:
                      addIconMode === "manual"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
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
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontSize: "0.9rem",
                      letterSpacing: "0.02em",
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 1.5,
                    maxHeight: "200px",
                    overflowY: "auto",
                    p: 2,
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 2.5,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {getFilteredIconsForAdd().map((iconOption) => (
                    <IconButton
                      key={iconOption.value}
                      onClick={() =>
                        updateAddFormField("icon", iconOption.value)
                      }
                      sx={{
                        width: 44,
                        height: 44,
                        border:
                          addForm.icon === iconOption.value
                            ? "2px solid #3b82f6"
                            : "1px solid rgba(255,255,255,0.1)",
                        background:
                          addForm.icon === iconOption.value
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(255,255,255,0.02)",
                        color: "white",
                        fontSize: "1.3rem",
                        borderRadius: 2.5,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(59,130,246,0.1)",
                          border: "1px solid #3b82f6",
                          transform: "scale(1.05)",
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
                    borderRadius: 2.5,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
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
                    borderRadius: 2.5,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              />
            )}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
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
                  borderRadius: 2.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                      borderRadius: 2.5,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                  },
                }}
              >
                <MenuItem
                  value="PDF"
                  sx={{
                    background: "none !important",
                    color: "white",
                    fontSize: "0.9rem",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1) !important",
                      borderRadius: 1.5,
                      mx: 0.5,
                    },
                  }}
                >
                  PDF
                </MenuItem>
                <MenuItem
                  value="Image"
                  sx={{
                    background: "none !important",
                    color: "white",
                    fontSize: "0.9rem",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1) !important",
                      borderRadius: 1.5,
                      mx: 0.5,
                    },
                  }}
                >
                  Image
                </MenuItem>
                <MenuItem
                  value="Lien"
                  sx={{
                    background: "none !important",
                    color: "white",
                    fontSize: "0.9rem",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1) !important",
                      borderRadius: 1.5,
                      mx: 0.5,
                    },
                  }}
                >
                  Lien
                </MenuItem>
                <MenuItem
                  value="Text"
                  sx={{
                    background: "none !important",
                    color: "white",
                    fontSize: "0.9rem",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1) !important",
                      borderRadius: 1.5,
                      mx: 0.5,
                    },
                  }}
                >
                  Text
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                  },
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
                  borderRadius: 2.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30, 41, 59, 0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                      borderRadius: 2.5,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
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
                    sx={{
                      background: "none !important",
                      color: "white",
                      fontSize: "0.9rem",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1) !important",
                        borderRadius: 1.5,
                        mx: 0.5,
                      },
                    }}
                  >
                    <Checkbox
                      checked={addForm.filter.indexOf(filter) > -1}
                      sx={{
                        color: "#3b82f6",
                        p: 0.5,
                        mr: 1,
                        "&.Mui-checked": {
                          color: "#3b82f6",
                        },
                      }}
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
                    color: uploading ? "rgba(255, 255, 255, 0.4)" : "#3b82f6",
                    borderColor: uploading
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#3b82f6",
                    mb: 2,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2.5,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    "&:hover": {
                      background: uploading
                        ? "transparent"
                        : "rgba(59, 130, 246, 0.1)",
                      borderColor: uploading
                        ? "rgba(255, 255, 255, 0.2)"
                        : "#2563eb",
                    },
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
                      try {
                        const token = localStorage.getItem("token");
                        const data = await uploadFile(file, token);
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#10b981",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    Fichier prêt à être ajouté :{" "}
                    {uploadedOriginalName ||
                      addForm.resourceUrl.split("/").pop()}
                  </Typography>
                )}
                {uploadError && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#ef4444",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
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
                    borderRadius: 2.5,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&.Mui-focused": {
                      color: "#3b82f6",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              />
            )}
            {addError && (
              <Typography
                sx={{
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  mt: 1,
                }}
              >
                {addError}
              </Typography>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={addForm.loginRequired}
                  onChange={(e) =>
                    updateAddFormField("loginRequired", e.target.checked)
                  }
                  color="primary"
                />
              }
              label={
                <Typography sx={{ color: "#3b82f6", fontWeight: 500 }}>
                  Connexion requise pour accéder à la ressource
                </Typography>
              }
              sx={{ mb: 1, mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: { xs: 2, sm: 3, md: 4 }, gap: { xs: 1, md: 2 } }}
        >
          <Button
            onClick={closeAddModal}
            variant="outlined"
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.9rem",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2.5,
              letterSpacing: "0.02em",
              textTransform: "none",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.3)",
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
              fontSize: "0.9rem",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2.5,
              letterSpacing: "0.02em",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                transform: "translateY(-1px)",
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
            width: { xs: "95vw", sm: "90vw", md: "auto" },
            maxWidth: { xs: "95vw", sm: "90vw", md: 600 },
            maxHeight: "90vh",
            overflowX: "hidden",
          },
        }}
      >
        {editForm && (
          <>
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
            <DialogContent sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 2, md: 3 },
                }}
              >
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
                  onChange={(e) =>
                    updateEditFormField("subject", e.target.value)
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
                <Typography
                  variant="caption"
                  sx={{ color: "#3b82f6", mt: 0.5 }}
                >
                  Markdown supporté (titres, listes, gras, italique, liens,
                  etc.)
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
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: "rgba(30, 41, 59, 0.98)",
                          color: "white",
                          maxHeight: 200,
                          minWidth: 180,
                          borderRadius: 2.5,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
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
                        sx={{
                          background: "none !important",
                          color: "white",
                          fontSize: "0.9rem",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1) !important",
                            borderRadius: 1.5,
                            mx: 0.5,
                          },
                        }}
                      >
                        <Checkbox
                          checked={editForm.category.indexOf(category) > -1}
                          sx={{
                            color: "#3b82f6",
                            p: 0.5,
                            mr: 1,
                            "&.Mui-checked": {
                              color: "#3b82f6",
                            },
                          }}
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
                    variant={
                      editIconMode === "custom" ? "contained" : "outlined"
                    }
                    size="small"
                    onClick={() => setEditIconMode("custom")}
                    sx={{ fontSize: "0.75rem", px: 2, py: 0.5 }}
                  >
                    URL personnalisée
                  </Button>
                  <Button
                    variant={
                      editIconMode === "manual" ? "contained" : "outlined"
                    }
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
                    onChange={(e) =>
                      updateEditFormField("icon", e.target.value)
                    }
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
                    onChange={(e) =>
                      updateEditFormField("type", e.target.value)
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
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: "rgba(30, 41, 59, 0.98)",
                          color: "white",
                          borderRadius: 2.5,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      value="PDF"
                      sx={{
                        background: "none !important",
                        color: "white",
                        fontSize: "0.9rem",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1) !important",
                          borderRadius: 1.5,
                          mx: 0.5,
                        },
                      }}
                    >
                      PDF
                    </MenuItem>
                    <MenuItem
                      value="Image"
                      sx={{
                        background: "none !important",
                        color: "white",
                        fontSize: "0.9rem",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1) !important",
                          borderRadius: 1.5,
                          mx: 0.5,
                        },
                      }}
                    >
                      Image
                    </MenuItem>
                    <MenuItem
                      value="Lien"
                      sx={{
                        background: "none !important",
                        color: "white",
                        fontSize: "0.9rem",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1) !important",
                          borderRadius: 1.5,
                          mx: 0.5,
                        },
                      }}
                    >
                      Lien
                    </MenuItem>
                    <MenuItem
                      value="Text"
                      sx={{
                        background: "none !important",
                        color: "white",
                        fontSize: "0.9rem",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1) !important",
                          borderRadius: 1.5,
                          mx: 0.5,
                        },
                      }}
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
                      "& .MuiSvgIcon-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: "rgba(30, 41, 59, 0.98)",
                          color: "white",
                          maxHeight: 200,
                          minWidth: 180,
                          borderRadius: 2.5,
                          border: "1px solid rgba(255, 255, 255, 0.1)",
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
                        sx={{
                          background: "none !important",
                          color: "white",
                          fontSize: "0.9rem",
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.1) !important",
                            borderRadius: 1.5,
                            mx: 0.5,
                          },
                        }}
                      >
                        <Checkbox
                          checked={editForm.filter.indexOf(filter) > -1}
                          sx={{
                            color: "#3b82f6",
                            p: 0.5,
                            mr: 1,
                            "&.Mui-checked": {
                              color: "#3b82f6",
                            },
                          }}
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
                          try {
                            const token = localStorage.getItem("token");
                            const data = await uploadFile(file, token);
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
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        },
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
                {editError && (
                  <Typography color="error">{editError}</Typography>
                )}
                {editForm && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={!!editForm.loginRequired}
                        onChange={(e) =>
                          updateEditFormField("loginRequired", e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Typography sx={{ color: "#3b82f6", fontWeight: 500 }}>
                        Connexion requise pour accéder à la ressource
                      </Typography>
                    }
                    sx={{ mb: 1, mt: 1 }}
                  />
                )}
              </Box>
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
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  },
                }}
                disabled={editLoading}
              >
                {editLoading ? "Modification..." : "Enregistrer"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #23272f 0%, #1a1d23 100%)",
            color: "#fff",
            borderRadius: 5,
            boxShadow: "0 8px 40px 0 rgba(0,0,0,0.32)",
            p: 0,
            overflow: "visible",
            position: "relative",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={closeDeleteDialog}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#cbd5e1",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            transition: "background 0.2s",
            "&:hover": {
              background: "rgba(59,130,246,0.12)",
              color: "#3b82f6",
            },
            zIndex: 2,
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
        <DialogTitle
          sx={{
            color: "#ef4444",
            fontWeight: 700,
            textAlign: "center",
            pt: 4,
            pb: 1,
            fontSize: "1.3rem",
            letterSpacing: 0.2,
          }}
        >
          Confirmer la suppression
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            pb: 1,
            color: "#e0e7ef",
            fontSize: "1.08rem",
          }}
        >
          Voulez-vous vraiment supprimer cette ressource ? Cette action est
          irréversible.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{
              borderColor: "rgba(255,255,255,0.18)",
              color: "#cbd5e1",
              fontWeight: 500,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontSize: { xs: "1rem", sm: "1.08rem" },
              textTransform: "none",
              background: "rgba(255,255,255,0.03)",
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
                borderColor: "#3b82f6",
                color: "#3b82f6",
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteResource}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "white",
              fontWeight: 600,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontSize: { xs: "1rem", sm: "1.08rem" },
              textTransform: "none",
              boxShadow: "0 8px 25px rgba(239, 68, 68, 0.13)",
              "&:hover": {
                background: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
              },
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={loginPopupOpen}
        onClose={() => setLoginPopupOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #23272f 0%, #1a1d23 100%)",
            color: "#fff",
            borderRadius: 5,
            boxShadow: "0 8px 40px 0 rgba(0,0,0,0.32)",
            p: 0,
            overflow: "visible",
            position: "relative",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => setLoginPopupOpen(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "#cbd5e1",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 2,
            transition: "background 0.2s",
            "&:hover": {
              background: "rgba(59,130,246,0.12)",
              color: "#3b82f6",
            },
            zIndex: 2,
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
        <DialogTitle
          sx={{
            color: "#3b82f6",
            fontWeight: 700,
            textAlign: "center",
            pt: 4,
            pb: 1,
            fontSize: "1.4rem",
            letterSpacing: 0.2,
          }}
        >
          Connexion requise
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            pb: 1,
            color: "#e0e7ef",
            fontSize: "1.1rem",
          }}
        >
          <span>Connectez-vous pour voir la ressource.</span>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setLoginPopupOpen(false);
              navigate("/connexion");
            }}
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              color: "white",
              fontWeight: 600,
              px: 5,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
              letterSpacing: "0.02em",
              lineHeight: 1.4,
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.18)",
              mt: 1,
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
              },
            }}
          >
            Se connecter
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
