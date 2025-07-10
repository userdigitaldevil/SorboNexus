import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Box,
  Grid,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryIcon,
  Support as SupportIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  Build as BuildIcon,
  Translate as TranslateIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  School as UniversityIcon,
  Favorite as HeartIcon,
  Headset as HeadsetIcon,
  Spa as SpaIcon,
  Spellcheck as SpellcheckIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRight,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import predefinedIcons from "../data/predefinedIcons";
import useMediaQuery from "@mui/material/useMediaQuery";
import useBookmarks from "../hooks/useBookmarks";
import { getLinks, addLink, editLink, deleteLink } from "../api/links";
import { useNavigate } from "react-router-dom";

const LiensUtiles = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Core page state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous les liens");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Use bookmark hook
  const {
    bookmarkedItems: bookmarkedLinks,
    toggleBookmark: toggleBookmarkForLink,
    isBookmarked: isLinkBookmarked,
    error: bookmarksError,
  } = useBookmarks("link");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Admin authentication and permissions
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit modal state management
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    icon: "",
  });
  const [iconMode, setIconMode] = useState("predefined"); // "predefined", "custom", or "manual"
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  // Add modal state management
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    icon: "",
  });
  const [addIconMode, setAddIconMode] = useState("predefined");
  const [addCustomIconUrl, setAddCustomIconUrl] = useState("");
  const [addIconSearch, setAddIconSearch] = useState("");

  // Add back expansion/collapse state
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());

  // Remove hardcoded links, initialize as empty array
  const [links, setLinks] = useState([]);

  // Fetch links from backend on mount, with error handling
  useEffect(() => {
    getLinks()
      .then((data) => setLinks(data))
      .catch((err) => {
        alert("Erreur lors du chargement des liens: " + err.message);
      });
  }, []);

  // ============================================================================
  // CONSTANTS AND CONFIGURATION
  // ============================================================================

  const categories = [
    "Tous les liens",
    "Université",
    "Bibliothèques",
    "Services",
    "Carrière",
    "Outils",
  ];

  // Predefined gradients and colors for each category
  const CATEGORY_STYLES = {
    Université: {
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      color: "#3b82f6",
    },
    Bibliothèques: {
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      color: "#8b5cf6",
    },
    Services: {
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "#10b981",
    },
    Carrière: {
      gradient: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      color: "#ef4444",
    },
    Outils: {
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      color: "#f59e0b",
    },
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Check and set admin status based on JWT token
   * Runs on component mount to determine user permissions
   */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false);
        setUserId(decoded.id || decoded.userId || null);
      } catch (error) {
        setIsAdmin(false);
        setUserId(null);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserId(null);
    }
  }, []);

  /**
   * Scroll to top when component mounts for better UX
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ============================================================================
  // FUNCTIONS
  // ============================================================================

  /**
   * Filter predefined icons based on search query for edit modal
   * @returns {Array} Filtered icons matching the search criteria
   */
  const getFilteredIconsForEdit = () => {
    return predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(iconSearch.toLowerCase())
    );
  };

  /**
   * Filter predefined icons based on search query for add modal
   * @returns {Array} Filtered icons matching the search criteria
   */
  const getFilteredIconsForAdd = () => {
    return predefinedIcons.filter(
      (icon) =>
        icon.label.toLowerCase().includes(addIconSearch.toLowerCase()) ||
        icon.value.toLowerCase().includes(addIconSearch.toLowerCase())
    );
  };

  /**
   * Generate unique ID for new links
   * @returns {number} Next available ID
   */
  const generateUniqueLinkId = () => {
    return Math.max(...links.map((link) => link.id)) + 1;
  };

  // ============================================================================
  // DATA FILTERING AND COMPUTED VALUES
  // ============================================================================

  // Get filtered icons for edit modal
  const filteredIcons = getFilteredIconsForEdit();

  // Get filtered icons for add modal
  const filteredAddIcons = getFilteredIconsForAdd();

  // Predefined gradients organized by category
  const categoryGradients = {
    Université: [
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
      "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    ],
    Bibliothèques: [
      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
      "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)",
    ],
    Services: [
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #059669 0%, #047857 100%)",
      "linear-gradient(135deg, #047857 0%, #065f46 100%)",
    ],
    Carrière: [
      "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
      "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
      "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
    ],
    Outils: [
      "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
      "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
    ],
  };

  // ============================================================================
  // LINKS DATA AND FILTERING LOGIC
  // ============================================================================

  /**
   * Filter links based on search query and active category
   * @returns {Array} Filtered and sorted links
   */
  const getFilteredAndSortedLinks = () => {
    return links
      .filter((link) => {
        if (!link || typeof link !== "object") return false;
        const title = (link.title || "").toLowerCase();
        const description = (link.description || "").toLowerCase();
        const category = (link.category || "").toLowerCase();
        const query = (searchQuery || "").toLowerCase();
        const matchesSearch =
          !query ||
          title.includes(query) ||
          description.includes(query) ||
          category.includes(query);
        const matchesCategory =
          activeCategory === "Tous les liens" ||
          link.category === activeCategory;
        const matchesBookmarked =
          !showBookmarkedOnly || isLinkBookmarked(link.id);
        return matchesSearch && matchesCategory && matchesBookmarked;
      })
      .sort((a, b) => {
        // Sort by category first, then by title
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.title.localeCompare(b.title);
      });
  };

  // Get filtered and sorted links
  const filteredLinks = getFilteredAndSortedLinks();

  // Calculate pagination values
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLinks = filteredLinks.slice(startIndex, endIndex);

  // ============================================================================
  // BOOKMARK MANAGEMENT FUNCTIONS
  // ============================================================================

  // ============================================================================
  // EDIT MODAL MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Open edit modal and populate form with link data
   * @param {Object} link - Link object to edit
   */
  const openEditModalWithLinkData = (link) => {
    setEditingLink(link);
    setEditForm({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      icon: link.icon,
    });
    setIconMode("predefined");
    setCustomIconUrl("");
    setIconSearch("");
    setEditModalOpen(true);
  };

  /**
   * Update specific field in edit form
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  const updateEditFormField = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Save changes to existing link and close edit modal
   */
  const saveLinkChanges = async () => {
    const token = localStorage.getItem("token");
    const iconValue = iconMode === "predefined" ? editForm.icon : customIconUrl;
    try {
      const updated = await editLink(
        editingLink.id,
        {
          title: editForm.title,
          url: editForm.url,
          description: editForm.description,
          category: editForm.category,
          icon: iconValue,
        },
        token
      );
      setLinks((prevLinks) =>
        prevLinks.map((link) => (link.id === editingLink.id ? updated : link))
      );
      closeEditModal();
    } catch (err) {
      alert("Erreur lors de la modification du lien: " + err.message);
    }
  };

  /**
   * Delete the currently editing link and close modal
   */
  const deleteCurrentLink = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteLink(editingLink.id, token);
      setLinks((prevLinks) =>
        prevLinks.filter((link) => link.id !== editingLink.id)
      );
    } catch (err) {
      alert("Erreur lors de la suppression du lien: " + err.message);
    }
    closeEditModal();
  };

  /**
   * Close edit modal and reset form state
   */
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingLink(null);
  };

  // ============================================================================
  // ADD MODAL MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Open add modal and reset form to initial state
   */
  const openAddModalWithEmptyForm = () => {
    setAddForm({
      title: "",
      url: "",
      description: "",
      category: "",
      icon: "",
    });
    setAddIconMode("predefined");
    setAddCustomIconUrl("");
    setAddIconSearch("");
    setAddModalOpen(true);
  };

  /**
   * Update specific field in add form
   * @param {string} field - Field name to update
   * @param {any} value - New value for the field
   */
  const updateAddFormField = (field, value) => {
    setAddForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Create new link and add to links array
   */
  const createAndAddNewLink = async () => {
    const token = localStorage.getItem("token");
    const iconValue =
      addIconMode === "predefined" ? addForm.icon : addCustomIconUrl;
    try {
      const newLink = await addLink(
        {
          title: addForm.title,
          url: addForm.url,
          description: addForm.description,
          category: addForm.category,
          icon: iconValue,
        },
        token
      );
      setLinks((prevLinks) => [...prevLinks, newLink]);
      closeAddModal();
    } catch (err) {
      alert("Erreur lors de l'ajout du lien: " + err.message);
    }
  };

  /**
   * Close add modal and reset form state
   */
  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  const isSmallMobile = useMediaQuery("(max-width:400px)");
  const isTinyMobile = useMediaQuery("(max-width:300px)");

  // Helper to chunk array into groups of 4
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const toggleDescriptionExpansion = (linkId) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(linkId)) {
        newSet.delete(linkId);
      } else {
        newSet.add(linkId);
      }
      return newSet;
    });
  };

  // Add a new state to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Add userId state to track logged-in user's ID
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  return (
    <div className="glassy-bg min-h-screen smooth-scroll-all">
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
                  fontWeight: 700,
                  mb: { xs: 2.5, md: 4.5 },
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.8rem",
                    lg: "4.2rem",
                  },
                  lineHeight: { xs: 1.1, md: 1.05 },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  mt: { xs: 1, md: 6 },
                  letterSpacing: "-0.03em",
                }}
              >
                <span style={{ display: "block" }}>Liens</span>
                <span style={{ display: "block" }}>Utiles</span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.85)",
                  mb: { xs: 3, md: 4 },
                  fontWeight: 400,
                  lineHeight: { xs: 1.5, md: 1.6 },
                  maxWidth: 700,
                  mx: "auto",
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
                  letterSpacing: "0.01em",
                }}
              >
                Accédez facilement à tous vos services universitaires,
                bibliothèques et plateformes pédagogiques. Retrouvez des liens
                pour vous entraîner, vous informer et définir vos objectifs
                académiques et professionnels.
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                  Utilisez la fonctionnalité de favoris pour sauvegarder vos
                  liens préférés et y accéder rapidement.
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ maxWidth: 600, mx: "auto", pb: 3 }}
            >
              <TextField
                fullWidth
                placeholder="Rechercher des liens par nom, catégorie ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    background: "rgba(255, 255, 255, 0.06)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 2.5,
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
                      color: "rgba(255, 255, 255, 0.4)",
                      opacity: 1,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                    },
                    "& input": {
                      color: "white",
                      fontSize: { xs: "0.95rem", md: "1.05rem" },
                      padding: { xs: "14px", md: "18px" },
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                    },
                  },
                }}
              />
            </motion.div>
          </Box>
        </Container>
      </motion.section>

      {/* Categories & Filters */}
      <motion.section
        className="py-8 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 3, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: { xs: 1, md: 2 },
                justifyContent: "center",
                pt: { xs: 1, md: 2 },
                mt: 0,
              }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={category}
                    onClick={() => setActiveCategory(category)}
                    sx={{
                      background:
                        activeCategory === category
                          ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                          : "rgba(255, 255, 255, 0.06)",
                      color:
                        activeCategory === category
                          ? "white"
                          : "rgba(255, 255, 255, 0.75)",
                      border:
                        activeCategory === category
                          ? "none"
                          : "1px solid rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                      padding: { xs: "8px 14px", md: "10px 18px" },
                      height: { xs: "32px", md: "auto" },
                      borderRadius: 2,
                      letterSpacing: "0.02em",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background:
                          activeCategory === category
                            ? "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)"
                            : "rgba(255, 255, 255, 0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>

            {/* Bookmarked Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Chip
                  icon={<BookmarkFilledIcon />}
                  label={
                    showBookmarkedOnly
                      ? "Favoris uniquement"
                      : "Tous les favoris"
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
                      openAddModalWithEmptyForm();
                    } else {
                      navigate("/connexion");
                    }
                  }}
                >
                  Ajouter un lien
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </motion.section>

      {/* Links Grid */}
      <motion.section
        className="py-12 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          paddingTop: window.innerWidth < 600 ? "48px" : "48px",
          paddingBottom: window.innerWidth < 600 ? "48px" : "48px",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ overflow: "hidden" }}>
          {isMobile ? (
            // MOBILE: always 2 columns x 3 rows grid carousel
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: 0.5, // reduce gap between chunks
                pb: 1,
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {chunkArray(currentLinks, 6).map((chunk, chunkIdx) => (
                <Box
                  key={chunkIdx}
                  sx={{
                    width: "100vw",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr 1fr",
                    gap: 0,
                    p: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  {chunk.map((link, index) => (
                    <Box
                      key={link.id}
                      sx={{
                        width: "44vw",
                        minWidth: "44vw",
                        maxWidth: "44vw",
                        height: { xs: 170, sm: 190 }, // Reduced height for less dead space
                        p: 0.5,
                        boxSizing: "border-box",
                      }}
                    >
                      {/* Card rendering (copy from existing Grid) */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        style={{ height: "100%" }}
                      >
                        <Card
                          sx={{
                            height: "100%", // Card fills its container
                            width: "100%",
                            maxWidth: "none",
                            mx: 0,
                            background: "rgba(255,255,255,0.04)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                            display: "flex",
                            flexDirection: "column",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(59, 130, 246, 0.25)",
                              "& .link-title": {
                                color: "#3b82f6",
                              },
                            },
                          }}
                        >
                          <CardContent
                            sx={{
                              p: { xs: 1.2, md: 1.5 },
                              flex: "1 1 auto",
                              minHeight: 0,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "flex-start",
                              overflow: "hidden",
                              pb: 4, // Increased bottom padding for better spacing
                            }}
                          >
                            {/* Content wrapper */}
                            <Box
                              sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {/* Icon and Title Row */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: { xs: 0.4, sm: 0.6 },
                                  mb: { xs: 0.4, sm: 0.5 },
                                }}
                              >
                                <Box
                                  className="link-icon"
                                  sx={{
                                    width: { xs: 18, md: 22 },
                                    height: { xs: 18, md: 22 },
                                    borderRadius: "50%",
                                    background:
                                      CATEGORY_STYLES[link.category]
                                        ?.gradient ||
                                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                                    mb: 0.7,
                                    flexShrink: 0,
                                  }}
                                >
                                  <i
                                    className={link.icon}
                                    style={{
                                      fontSize: "0.55rem", // 15% of the circle
                                      width: "0.55em",
                                      height: "0.55em",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  className="link-title"
                                  sx={{
                                    fontWeight: 500,
                                    transition: "all 0.2s ease",
                                    fontSize: { xs: "0.6rem", sm: "0.65rem" },
                                    lineHeight: 1.3,
                                    color: "rgba(255, 255, 255, 0.85)",
                                    textAlign: "left",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                    letterSpacing: "0.01em",
                                  }}
                                >
                                  {link.title}
                                </Typography>

                                {/* Admin Edit Button */}
                                {(isAdmin ||
                                  (userId && link.createdById === userId)) && (
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModalWithLinkData(link);
                                    }}
                                    size="small"
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.6)",
                                      p: 0.2,
                                      minWidth: "auto",
                                      width: { xs: "16px", sm: "18px" },
                                      height: { xs: "16px", sm: "18px" },
                                      "&:hover": {
                                        color: "#f59e0b",
                                        background: "rgba(245, 158, 11, 0.1)",
                                      },
                                    }}
                                  >
                                    <EditIcon
                                      sx={{
                                        fontSize: {
                                          xs: "0.55rem",
                                          sm: "0.6rem",
                                        },
                                      }}
                                    />
                                  </IconButton>
                                )}

                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmarkForLink(link.id);
                                  }}
                                  size="small"
                                  sx={{
                                    color: isLinkBookmarked(link.id)
                                      ? "#3b82f6"
                                      : "rgba(255, 255, 255, 0.4)",
                                    p: 0.2,
                                    minWidth: "auto",
                                    width: { xs: "16px", sm: "18px" },
                                    height: { xs: "16px", sm: "18px" },
                                    "&:hover": {
                                      color: "#3b82f6",
                                      background: "rgba(59, 130, 246, 0.1)",
                                    },
                                  }}
                                >
                                  {isLinkBookmarked(link.id) ? (
                                    <BookmarkFilledIcon
                                      sx={{
                                        fontSize: {
                                          xs: "0.55rem",
                                          sm: "0.6rem",
                                        },
                                        color: "#f59e0b",
                                      }}
                                    />
                                  ) : (
                                    <BookmarkIcon
                                      sx={{
                                        fontSize: {
                                          xs: "0.55rem",
                                          sm: "0.6rem",
                                        },
                                        color: "rgba(255, 255, 255, 0.6)",
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </Box>

                              {/* Category Badge */}
                              <Box sx={{ mb: { xs: 0.4, sm: 0.5 } }}>
                                <Chip
                                  label={link.category}
                                  size="small"
                                  sx={{
                                    background: "rgba(59, 130, 246, 0.08)",
                                    color: "#3b82f6",
                                    fontSize: { xs: "0.45rem", sm: "0.5rem" },
                                    height: { xs: "16px", sm: "18px" },
                                    fontWeight: 500,
                                    border:
                                      "1px solid rgba(59, 130, 246, 0.15)",
                                    borderRadius: 1.5,
                                    "& .MuiChip-label": {
                                      px: { xs: 0.5, sm: 0.6 },
                                      letterSpacing: "0.02em",
                                    },
                                  }}
                                />
                              </Box>

                              {/* Description */}
                              <Typography
                                variant="caption"
                                data-link-desc-id={link.id}
                                sx={{
                                  color: "rgba(255, 255, 255, 0.65)",
                                  mb: { xs: 0.8, md: 1 },
                                  lineHeight: 1.4,
                                  fontSize: { xs: "0.52rem", md: "0.58rem" },
                                  fontWeight: 400,
                                  letterSpacing: "0.01em",
                                  ...(isMobile
                                    ? {
                                        display: "block",
                                        overflow: "visible",
                                        minHeight: undefined,
                                        maxHeight: undefined,
                                      }
                                    : expandedDescriptions.has(link.id)
                                    ? {
                                        display: "block",
                                        overflow: "visible",
                                        minHeight: undefined,
                                        maxHeight: undefined,
                                      }
                                    : {
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        minHeight: "3.6em",
                                        maxHeight: "3.6em",
                                      }),
                                  textAlign: "left",
                                  transition: "max-height 0.3s ease",
                                }}
                              >
                                {link.description}
                              </Typography>
                              {((!isMobile && link.description.length > 121) ||
                                (!isMobile &&
                                  link.description.length > 121)) && (
                                <Box
                                  sx={{
                                    mb: { xs: 0.5, md: 0.6 },
                                    height: "1.2em",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDescriptionExpansion(link.id);
                                    }}
                                    sx={{
                                      color: "#3b82f6",
                                      textTransform: "none",
                                      fontSize: { xs: "0.35rem", sm: "0.4rem" },
                                      fontWeight: 500,
                                      p: 0,
                                      minWidth: "auto",
                                      "&:hover": {
                                        background: "rgba(59, 130, 246, 0.1)",
                                      },
                                    }}
                                  >
                                    {expandedDescriptions.has(link.id)
                                      ? "Voir moins"
                                      : "Lire la suite"}
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              width: "100%",
                              p: 1,
                              pt: 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                endIcon={
                                  <ArrowRight
                                    sx={{
                                      fontSize: { xs: "0.5rem", md: "0.55rem" },
                                    }}
                                  />
                                }
                                onClick={() => window.open(link.url, "_blank")}
                                sx={{
                                  fontWeight: 500,
                                  px: { xs: 0.9, md: 1.1 },
                                  py: { xs: 0.25, md: 0.3 },
                                  borderRadius: 1,
                                  border: "1px solid rgba(59, 130, 246, 0.3)",
                                  color: "#3b82f6",
                                  textTransform: "none",
                                  fontSize: { xs: "0.45rem", md: "0.5rem" },
                                  background: "rgba(59, 130, 246, 0.05)",
                                  minHeight: { xs: "22px", md: "26px" },
                                  "&:hover": {
                                    background: "rgba(59, 130, 246, 0.1)",
                                    border: "1px solid #3b82f6",
                                    transform: "translateY(-1px)",
                                    boxShadow:
                                      "0 2px 8px rgba(59, 130, 246, 0.15)",
                                  },
                                }}
                              >
                                Accéder
                              </Button>
                            </Box>
                          </Box>
                        </Card>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          ) : (
            // DESKTOP/TABLET: original grid
            <Grid
              container
              spacing={{ xs: 1.5, md: 2.5 }}
              justifyContent="center"
            >
              {currentLinks.map((link, index) => (
                <Grid
                  gridColumn={{ xs: "span 12", sm: "span 6", md: "span 4" }}
                  key={link.id}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        height: { xs: "100%", md: 170 },
                        maxWidth: { xs: 180, md: 200 },
                        mx: "auto",
                        background: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 1.5,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                          background: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          "& .link-title": {
                            color: "#3b82f6",
                          },
                        },
                      }}
                    >
                      <CardContent
                        sx={{ p: { xs: 1, md: 1.2 }, height: { md: 140 } }}
                      >
                        {/* Icon and Title Row */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 0.7, md: 0.8 },
                            mb: { xs: 0.6, md: 0.7 },
                          }}
                        >
                          <Box
                            className="link-icon"
                            sx={{
                              width: { xs: 18, md: 22 },
                              height: { xs: 18, md: 22 },
                              borderRadius: "50%",
                              background:
                                CATEGORY_STYLES[link.category]?.gradient ||
                                "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                              mb: 0.7,
                              flexShrink: 0,
                            }}
                          >
                            <i
                              className={link.icon}
                              style={{
                                fontSize: "0.55rem", // 15% of the circle
                                width: "0.55em",
                                height: "0.55em",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            className="link-title"
                            sx={{
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                              fontSize: { xs: "0.65rem", md: "0.75rem" },
                              lineHeight: 1.2,
                              color: "rgba(255, 255, 255, 0.9)",
                              textAlign: "left",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              flex: 1,
                            }}
                          >
                            {link.title}
                          </Typography>

                          {/* Admin Edit Button */}
                          {(isAdmin ||
                            (userId && link.createdById === userId)) && (
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModalWithLinkData(link);
                              }}
                              size="small"
                              sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                p: 0.3,
                                minWidth: "auto",
                                width: { xs: "18px", md: "22px" },
                                height: { xs: "18px", md: "22px" },
                                "&:hover": {
                                  color: "#f59e0b",
                                  background: "rgba(245, 158, 11, 0.1)",
                                },
                              }}
                            >
                              <EditIcon
                                sx={{
                                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                                }}
                              />
                            </IconButton>
                          )}

                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmarkForLink(link.id);
                            }}
                            size="small"
                            sx={{
                              color: isLinkBookmarked(link.id)
                                ? "#3b82f6"
                                : "rgba(255, 255, 255, 0.4)",
                              p: 0.3,
                              minWidth: "auto",
                              width: { xs: "18px", md: "22px" },
                              height: { xs: "18px", md: "22px" },
                              "&:hover": {
                                color: "#3b82f6",
                                background: "rgba(59, 130, 246, 0.1)",
                              },
                            }}
                          >
                            {isLinkBookmarked(link.id) ? (
                              <BookmarkFilledIcon
                                sx={{
                                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                                  color: "#f59e0b",
                                }}
                              />
                            ) : (
                              <BookmarkIcon
                                sx={{
                                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                                  color: "rgba(255, 255, 255, 0.6)",
                                }}
                              />
                            )}
                          </IconButton>
                        </Box>

                        {/* Category Badge */}
                        <Box sx={{ mb: { xs: 0.5, md: 0.6 } }}>
                          <Chip
                            label={link.category}
                            size="small"
                            sx={{
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              fontSize: { xs: "0.5rem", md: "0.55rem" },
                              height: { xs: "16px", md: "18px" },
                              fontWeight: 500,
                              border: "1px solid rgba(59, 130, 246, 0.2)",
                              "& .MuiChip-label": {
                                px: { xs: 0.6, md: 0.7 },
                              },
                            }}
                          />
                        </Box>

                        {/* Description */}
                        <Typography
                          variant="caption"
                          data-link-desc-id={link.id}
                          sx={{
                            color: "rgba(255, 255, 255, 0.65)",
                            mb: { xs: 0.8, md: 1 },
                            lineHeight: 1.4,
                            fontSize: { xs: "0.52rem", md: "0.58rem" },
                            fontWeight: 400,
                            letterSpacing: "0.01em",
                            ...(isMobile
                              ? {
                                  display: "block",
                                  overflow: "visible",
                                  minHeight: undefined,
                                  maxHeight: undefined,
                                }
                              : expandedDescriptions.has(link.id)
                              ? {
                                  display: "block",
                                  overflow: "visible",
                                  minHeight: undefined,
                                  maxHeight: undefined,
                                }
                              : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "3.6em",
                                  maxHeight: "3.6em",
                                }),
                            textAlign: "left",
                            transition: "max-height 0.3s ease",
                          }}
                        >
                          {link.description}
                        </Typography>
                        {((!isMobile && link.description.length > 121) ||
                          (!isMobile && link.description.length > 121)) && (
                          <Box
                            sx={{
                              mb: { xs: 0.5, md: 0.6 },
                              height: "1.2em",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescriptionExpansion(link.id);
                              }}
                              sx={{
                                color: "#3b82f6",
                                textTransform: "none",
                                fontSize: { xs: "0.35rem", sm: "0.4rem" },
                                fontWeight: 500,
                                p: 0,
                                minWidth: "auto",
                                "&:hover": {
                                  background: "rgba(59, 130, 246, 0.1)",
                                },
                              }}
                            >
                              {expandedDescriptions.has(link.id)
                                ? "Voir moins"
                                : "Lire la suite"}
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          width: "100%",
                          p: 1,
                          pt: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={
                              <ArrowRight
                                sx={{
                                  fontSize: { xs: "0.5rem", md: "0.55rem" },
                                }}
                              />
                            }
                            onClick={() => window.open(link.url, "_blank")}
                            sx={{
                              fontWeight: 500,
                              px: { xs: 0.9, md: 1.1 },
                              py: { xs: 0.25, md: 0.3 },
                              borderRadius: 1,
                              border: "1px solid rgba(59, 130, 246, 0.3)",
                              color: "#3b82f6",
                              textTransform: "none",
                              fontSize: { xs: "0.45rem", md: "0.5rem" },
                              background: "rgba(59, 130, 246, 0.05)",
                              minHeight: { xs: "22px", md: "26px" },
                              "&:hover": {
                                background: "rgba(59, 130, 246, 0.1)",
                                border: "1px solid #3b82f6",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
                              },
                            }}
                          >
                            Accéder
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: 4, md: 6 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  size={window.innerWidth < 600 ? "small" : "large"}
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
          )}
        </Container>
      </motion.section>

      {/* Edit Modal */}
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
          Modifier le lien
          <IconButton
            onClick={closeEditModal}
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
        <DialogContent sx={{ pt: 4, px: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Titre"
              value={editForm.title}
              onChange={(e) => updateEditFormField("title", e.target.value)}
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
              label="URL"
              value={editForm.url}
              onChange={(e) => updateEditFormField("url", e.target.value)}
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
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                updateEditFormField("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
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
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                    fontWeight: 500,
                  },
                }}
              >
                Catégorie
              </InputLabel>
              <Select
                value={editForm.category}
                onChange={(e) =>
                  updateEditFormField("category", e.target.value)
                }
                sx={{
                  color: "white",
                  borderRadius: 2.5,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                    borderWidth: "1.5px",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30,41,59,0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                      borderRadius: 2.5,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Sélectionner une catégorie
                </MenuItem>
                {categories.slice(1).map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{
                      fontSize: "0.9rem",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1)",
                        borderRadius: 1.5,
                        mx: 0.5,
                      },
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                variant={iconMode === "predefined" ? "contained" : "outlined"}
                size="small"
                onClick={() => setIconMode("predefined")}
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
                      iconMode === "predefined"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Icônes prédéfinies
              </Button>
              <Button
                variant={iconMode === "custom" ? "contained" : "outlined"}
                size="small"
                onClick={() => setIconMode("custom")}
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
                      iconMode === "custom"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                URL personnalisée
              </Button>
              <Button
                variant={iconMode === "manual" ? "contained" : "outlined"}
                size="small"
                onClick={() => setIconMode("manual")}
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
                      iconMode === "manual"
                        ? "rgba(59, 130, 246, 0.8)"
                        : "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Classe FontAwesome
              </Button>
            </Box>
            {iconMode === "predefined" && (
              <>
                <TextField
                  label="Rechercher une icône"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
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
                  {getFilteredIconsForEdit().map((iconOption) => (
                    <IconButton
                      key={iconOption.value}
                      onClick={() =>
                        updateEditFormField("icon", iconOption.value)
                      }
                      sx={{
                        width: 44,
                        height: 44,
                        border:
                          editForm.icon === iconOption.value
                            ? "2px solid #3b82f6"
                            : "1px solid rgba(255,255,255,0.1)",
                        background:
                          editForm.icon === iconOption.value
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
            {iconMode === "custom" && (
              <TextField
                label="URL de l'icône"
                value={customIconUrl}
                onChange={(e) => setCustomIconUrl(e.target.value)}
                fullWidth
                placeholder="https://example.com/icon.png"
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
            )}
            {iconMode === "manual" && (
              <TextField
                label="Classe FontAwesome (ex: fas fa-atom)"
                value={editForm.icon}
                onChange={(e) => updateEditFormField("icon", e.target.value)}
                fullWidth
                placeholder="fas fa-atom"
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
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button
            onClick={deleteCurrentLink}
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              borderColor: "#ef4444",
              color: "#ef4444",
              fontSize: "0.9rem",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2.5,
              letterSpacing: "0.02em",
              textTransform: "none",
              "&:hover": {
                borderColor: "#dc2626",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            Supprimer
          </Button>
          <Button
            onClick={closeEditModal}
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
            onClick={saveLinkChanges}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderRadius: 2.5,
              letterSpacing: "0.02em",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Modal */}
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
          Ajouter un nouveau lien
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
        <DialogContent sx={{ pt: 4, px: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              label="URL"
              value={addForm.url}
              onChange={(e) => updateAddFormField("url", e.target.value)}
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
              label="Description"
              value={addForm.description}
              onChange={(e) =>
                updateAddFormField("description", e.target.value)
              }
              fullWidth
              multiline
              rows={3}
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
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: { xs: "0.9rem", md: "0.95rem" },
                  fontWeight: 500,
                  "&.Mui-focused": {
                    color: "#3b82f6",
                    fontWeight: 500,
                  },
                }}
              >
                Catégorie
              </InputLabel>
              <Select
                value={addForm.category}
                onChange={(e) => updateAddFormField("category", e.target.value)}
                sx={{
                  color: "white",
                  borderRadius: 2.5,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                    borderWidth: "1.5px",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "rgba(255, 255, 255, 0.7)",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: "rgba(30,41,59,0.98)",
                      color: "white",
                      maxHeight: 200,
                      minWidth: 180,
                      borderRadius: 2.5,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Sélectionner une catégorie
                </MenuItem>
                {categories.slice(1).map((category) => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{
                      fontSize: "0.9rem",
                      "&:hover": {
                        background: "rgba(59, 130, 246, 0.1)",
                        borderRadius: 1.5,
                        mx: 0.5,
                      },
                    }}
                  >
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
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
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
            onClick={createAndAddNewLink}
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
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LiensUtiles;
