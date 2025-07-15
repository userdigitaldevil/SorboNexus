import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
  Snackbar,
  Tooltip,
  Switch,
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
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { jwtDecode } from "jwt-decode";
import AlumniProfileCard from "../components/AlumniProfileCard";
import AlumniCard from "../components/AlumniCard";
import { useLocation, useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useAlumniEditModal } from "../components/AlumniEditModalContext";
import useBookmarks from "../hooks/useBookmarks";
import { getAlumni, getAlumniById, deleteAlumni } from "../api/alumni";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Alumni() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuffledOrder, setShuffledOrder] = useState(null);
  const [alreadyConnectedOpen, setAlreadyConnectedOpen] = useState(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [publicAlumni, setPublicAlumni] = useState(() => {
    const stored = localStorage.getItem("publicAlumni");
    return stored === null ? false : stored === "true";
  });

  // Add after isProfileModalOpen state is defined
  useEffect(() => {
    if (isProfileModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalContainerOverflow =
        mainScrollContainerRef.current?.style.overflow;

      document.body.style.overflow = "hidden";
      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.style.overflow = "hidden";
      }

      // Prevent scroll on the main container
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.addEventListener(
          "wheel",
          preventScroll,
          { passive: false }
        );
        mainScrollContainerRef.current.addEventListener(
          "touchmove",
          preventScroll,
          { passive: false }
        );
      }

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        if (mainScrollContainerRef.current) {
          mainScrollContainerRef.current.style.overflow =
            originalContainerOverflow;
          mainScrollContainerRef.current.removeEventListener(
            "wheel",
            preventScroll
          );
          mainScrollContainerRef.current.removeEventListener(
            "touchmove",
            preventScroll
          );
        }
      };
    } else {
      document.body.style.overflow = "";
      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.style.overflow = "";
      }
    }
  }, [isProfileModalOpen]);

  // Lock scrolling when list modal is open
  useEffect(() => {
    if (isListModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalContainerOverflow =
        mainScrollContainerRef.current?.style.overflow;

      document.body.style.overflow = "hidden";
      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.style.overflow = "hidden";
      }

      // Prevent scroll on the main container
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.addEventListener(
          "wheel",
          preventScroll,
          { passive: false }
        );
        mainScrollContainerRef.current.addEventListener(
          "touchmove",
          preventScroll,
          { passive: false }
        );
      }

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        if (mainScrollContainerRef.current) {
          mainScrollContainerRef.current.style.overflow =
            originalContainerOverflow;
          mainScrollContainerRef.current.removeEventListener(
            "wheel",
            preventScroll
          );
          mainScrollContainerRef.current.removeEventListener(
            "touchmove",
            preventScroll
          );
        }
      };
    } else {
      document.body.style.overflow = "";
      if (mainScrollContainerRef.current) {
        mainScrollContainerRef.current.style.overflow = "";
      }
    }
  }, [isListModalOpen]);

  // Use bookmark hook
  const {
    bookmarkedItems: bookmarkedAlumni,
    toggleBookmark: toggleBookmarkForAlumni,
    isBookmarked: isAlumniBookmarked,
    error: bookmarksError,
  } = useBookmarks("alumni");

  // Available domains with their color codes
  const DOMAIN_COLORS = {
    Chimie: "#ffb300", // vivid amber
    Électronique: "#8e24aa", // deep purple
    Informatique: "#ff80ab", // lighter pink
    Mathématiques: "#e53935", // matte red
    Mécanique: "#43a047", // strong green
    Physique: "#009688", // teal
    "Sciences de la Terre": "#3949ab", // strong blue-violet
    "Sciences de la vie": "#00bcd4", // strong cyan
  };

  const availableDomains = Object.keys(DOMAIN_COLORS);
  const [selectedDomains, setSelectedDomains] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const alumniEditModal = useAlumniEditModal();
  const { openEditModal } = alumniEditModal || {};

  const sectionRef = useRef(null);
  const filtersRef = useRef(null);
  const listButtonRef = useRef(null);
  const mainScrollContainerRef = useRef(null);

  const fetchAlumni = async () => {
    try {
      const data = await getAlumni();
      setAlumni(data);
      setCurrentPage(1);
      setLoading(false);
      // console.log("Fetched alumni:", data); // Removed for production
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

  useEffect(() => {
    localStorage.setItem("publicAlumni", publicAlumni);
  }, [publicAlumni]);

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
      (alum.avatar && alum.avatar.toLowerCase().includes(searchLower)) ||
      (alum.futureGoals &&
        alum.futureGoals.toLowerCase().includes(searchLower)) ||
      (alum.anneeFinL3 && alum.anneeFinL3.toLowerCase().includes(searchLower));
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
      selectedDomains.length === 0 ||
      (alum.domains &&
        selectedDomains.every((domain) => alum.domains.includes(domain))) ||
      (alum.field &&
        selectedDomains.every((domain) => alum.field.includes(domain)));
    const matchesBookmarked =
      !showBookmarkedOnly || isAlumniBookmarked(alum.id || alum._id);
    return matchesSearch && matchesFilter && matchesBookmarked;
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
    const isAlumniAdmin = (a) => a.isAdmin && !isSelf(a) && !isSeth(a);
    const isOther = (a) => !isSelf(a) && !isSeth(a) && !a.isAdmin;
    ordered = [
      selfCard,
      ...(filteredAlumni.find(isSeth) && !isSelf(filteredAlumni.find(isSeth))
        ? [filteredAlumni.find(isSeth)]
        : []),
      ...filteredAlumni.filter(isAlumniAdmin),
      ...filteredAlumni.filter(isOther),
    ];
  } else {
    // No user: sethaguila and all admins first, then all others
    const isSeth = (a) => a.id === 26;
    const isAlumniAdmin = (a) => a.isAdmin && !isSeth(a);
    const isOther = (a) => !isSeth(a) && !a.isAdmin;
    ordered = [
      ...(filteredAlumni.find(isSeth) ? [filteredAlumni.find(isSeth)] : []),
      ...filteredAlumni.filter(isAlumniAdmin),
      ...filteredAlumni.filter(isOther),
    ];
  }
  // Pagination is applied after ordering, so the most recently updated alumni will always be right after the admins, regardless of page.
  let displayOrdered = shuffledOrder ? shuffledOrder : ordered;
  const itemsPerPage = 12;
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
  }, [
    searchQuery,
    selectedDomains,
    showBookmarkedOnly,
    bookmarkedAlumni.size, // Use size instead of the Set object to prevent constant re-renders
    // Removed alumni, isAdmin, alumniId to prevent unwanted resets
  ]);

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
  const handleDomainToggle = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedDomains([]);
    setCurrentPage(1);
  };

  // Helper to open profile modal from grouped list
  const handleAlumniNameClick = (alum) => {
    openProfileModal(alum);
    // Don't close the list modal - let user keep browsing
  };

  const handleEditClick = async (alum) => {
    let alumniData = alum;
    if (isAdmin) {
      try {
        alumniData = await getAlumniById(alum.id);
      } catch (e) {}
    }
    if (openEditModal) {
      openEditModal(alumniData);
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
      const res = await deleteAlumni(alum.id, token);
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
    // console.log(
    //   "alumniId:",
    //   alumniId,
    //   "alumni:",
    //   alumni.map((a) => ({
    //     _id: a._id,
    //     id: a.id,
    //     name: a.name,
    //     hidden: a.hidden,
    //   }))
    // ); // Removed for production
  }, [alumni, alumniId]);

  // console.log("currentAlumni:", currentAlumni); // Removed for production

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (window.innerWidth < 600) {
      // On mobile, scroll to the 'Liste de tous les alumni' button
      if (listButtonRef.current) {
        const rect = listButtonRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        // Offset for sticky header if needed
        const offset = 12;
        window.scrollTo({
          top: rect.top + scrollTop - offset,
          behavior: "smooth",
        });
        return;
      }
    }
    if (filtersRef.current) {
      if (window.innerWidth < 600) {
        const rect = filtersRef.current.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const offset = 12;
        window.scrollTo({
          top: rect.top + scrollTop - offset,
          behavior: "smooth",
        });
      } else {
        filtersRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      ref={mainScrollContainerRef}
      className="glassy-bg min-h-screen smooth-scroll-all"
    >
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
                  fontWeight: 300,
                  mb: { xs: 3, md: 5 },
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.8rem",
                    lg: "4.2rem",
                  },
                  lineHeight: 1.05,
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  mt: { xs: 2, md: 8 },
                  letterSpacing: "-0.02em",
                }}
              >
                <span style={{ display: "block", fontWeight: 300 }}>
                  Réseau des
                </span>
                <span style={{ display: "block", fontWeight: 600 }}>
                  Alumni
                </span>
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
                  mb: { xs: 4, md: 8 },
                  fontWeight: 400,
                  lineHeight: 1.3,
                  maxWidth: 700,
                  mx: "auto",
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
                  letterSpacing: "0.01em",
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
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                    color: "white",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused": {
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid #3b82f6",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "& input::placeholder": {
                      color: "rgba(255, 255, 255, 0.5)",
                      opacity: 1,
                      fontSize: { xs: "0.85rem", md: "0.95rem" },
                    },
                    "& input": {
                      color: "white",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      padding: { xs: "14px", md: "18px" },
                      letterSpacing: "0.01em",
                    },
                  },
                }}
              />
              <Box sx={{ mt: { xs: 2, md: 3 }, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={openListModal}
                  ref={listButtonRef}
                  sx={{
                    color: "#3b82f6",
                    border: "1px solid #3b82f6",
                    fontWeight: 500,
                    borderRadius: 3,
                    px: { xs: 2.5, md: 3.5 },
                    py: { xs: 1.2, md: 1.5 },
                    background: "rgba(59, 130, 246, 0.05)",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                    fontSize: { xs: "0.85rem", md: "1rem" },
                    letterSpacing: "0.02em",
                    lineHeight: 1.4,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.08)",
                      borderColor: "#2563eb",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(59, 130, 246, 0.15)",
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Liste de tous les alumni
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
          <Box
            ref={filtersRef}
            sx={{ textAlign: "center", mb: { xs: 6, md: 12 } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Clear All Filters Button */}
              {selectedDomains.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearAllFilters}
                    sx={{
                      color: "#ef4444",
                      borderColor: "#ef4444",
                      fontWeight: 400,
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      px: { xs: 1.5, md: 2 },
                      py: { xs: 0.8, md: 1 },
                      minWidth: "auto",
                      borderRadius: 2,
                      letterSpacing: "0.01em",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(239, 68, 68, 0.08)",
                        borderColor: "#dc2626",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Effacer tous les filtres ({selectedDomains.length})
                  </Button>
                </motion.div>
              )}

              {/* Domain Filter Chips */}
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
                {availableDomains.map((domain, index) => (
                  <motion.div
                    key={domain}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={domain}
                      onClick={() => handleDomainToggle(domain)}
                      sx={{
                        background: selectedDomains.includes(domain)
                          ? DOMAIN_COLORS[domain]
                          : "rgba(255, 255, 255, 0.05)",
                        color: selectedDomains.includes(domain)
                          ? "white"
                          : "rgba(255, 255, 255, 0.7)",
                        border: selectedDomains.includes(domain)
                          ? "none"
                          : `1px solid ${DOMAIN_COLORS[domain]}30`,
                        backdropFilter: "blur(20px)",
                        fontWeight: 400,
                        fontSize: { xs: "0.75rem", md: "0.9rem" },
                        padding: { xs: "8px 14px", md: "10px 18px" },
                        height: { xs: "32px", md: "36px" },
                        borderRadius: 2,
                        letterSpacing: "0.01em",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background: selectedDomains.includes(domain)
                            ? DOMAIN_COLORS[domain]
                            : `${DOMAIN_COLORS[domain]}15`,
                          transform: "translateY(-3px)",
                          boxShadow: `0 8px 25px ${DOMAIN_COLORS[domain]}30`,
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
                transition={{ duration: 0.3, delay: 0.5 }}
              >
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
              </motion.div>
            </Box>
          </Box>
        </Container>
      </motion.section>

      {/* Alumni Grid Section */}
      {alumniId || publicAlumni ? (
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
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 300,
                  mb: { xs: 2, md: 5 },
                  fontSize: {
                    xs: "1.6rem",
                    sm: "2.1rem",
                    md: "2.6rem",
                    lg: "3.1rem",
                  },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Nos <span style={{ fontWeight: 600 }}>Anciens</span> Étudiants
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.4)",
                  fontSize: { xs: "0.7rem", md: "0.8rem" },
                  fontStyle: "italic",
                  mb: 2,
                  display: "block",
                  textAlign: "center",
                }}
              >
                Certains profils sont masqués
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  mb: 3,
                  fontWeight: 500,
                  borderRadius: 3,
                  px: { xs: 2, md: 3.5 },
                  py: { xs: 1, md: 1.5 },
                  background: "rgba(59, 130, 246, 0.05)",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  border: "1px solid #3b82f6",
                  color: "#3b82f6",
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.08)",
                    borderColor: "#2563eb",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(59, 130, 246, 0.15)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token && alumniId && selfCard) {
                    let fixed = [selfCard];
                    if (
                      sethCard &&
                      sethCard._id !== selfCard._id &&
                      sethCard.id !== selfCard.id
                    ) {
                      fixed.push(sethCard);
                    }
                    let rest = ordered.filter(
                      (a) =>
                        !fixed.some((f) => f._id === a._id && f.id === a.id)
                    );
                    const shuffledRest = shuffleArray(rest);
                    const newShuffledOrder = [...fixed, ...shuffledRest];
                    setShuffledOrder(newShuffledOrder);
                  } else {
                    const newShuffledOrder = shuffleArray(ordered);
                    setShuffledOrder(newShuffledOrder);
                  }
                  setCurrentPage(1);
                  setForceRerender((prev) => prev + 1);
                }}
              >
                Mélanger les cartes
              </Button>
            </Box>

            {isAdmin && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={publicAlumni}
                        onChange={() => setPublicAlumni((v) => !v)}
                        color="primary"
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#3b82f6",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#3b82f6",
                            },
                          "& .MuiSwitch-track": {
                            backgroundColor: "#e5e7eb",
                          },
                        }}
                      />
                    }
                    label={
                      <span
                        style={{
                          fontWeight: 500,
                          color: publicAlumni ? "#3b82f6" : "#888",
                        }}
                      >
                        Alumni publics
                      </span>
                    }
                    labelPlacement="start"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip
                    title="Permettre aux visiteurs non connectés de voir les alumni"
                    arrow
                  >
                    <InfoOutlinedIcon
                      sx={{ color: "#3b82f6", fontSize: 20, ml: 0.5 }}
                    />
                  </Tooltip>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#888", textAlign: "center" }}
                >
                  {publicAlumni
                    ? "Les alumni sont visibles par tous les visiteurs."
                    : "Seuls les utilisateurs connectés peuvent voir les alumni."}
                </Typography>
              </Box>
            )}

            {/* Restore the original <Grid> rendering for alumni cards: */}
            <Grid
              container
              rowSpacing={{ xs: 2, md: 6 }}
              columnSpacing={1}
              justifyContent="center"
              sx={{ maxWidth: "100%", width: "100%" }}
            >
              {/* Force re-render on shuffle */}
              <span style={{ display: "none" }}>{forceRerender}</span>
              {currentAlumni.map((alum, index) => (
                <Grid
                  gridColumn={{
                    xs: "span 12",
                    sm: "span 6",
                    md: "span 3",
                    lg: "span 3",
                    xl: "span 3",
                  }}
                  key={`${alum._id || alum.id}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    maxWidth: { xs: "100%", sm: "50%", md: "25%" },
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
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
                      isBookmarked={isAlumniBookmarked(alum.id || alum._id)}
                      onToggleBookmark={() =>
                        toggleBookmarkForAlumni(alum.id || alum._id)
                      }
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
          </Container>
        </motion.section>
      ) : (
        <Box
          sx={{
            minHeight: "40vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#3b82f6",
              fontWeight: 600,
              mb: 2,
              textAlign: "center",
            }}
          >
            Connectez-vous pour découvrir les alumni
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
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
              mt: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 35px rgba(59, 130, 246, 0.35)",
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => navigate("/connexion")}
          >
            Se connecter
          </Button>
        </Box>
      )}

      {/* Join Alumni Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              py: { xs: 4, md: 6 },
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
                <i className="fas fa-users"></i>
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
                {alumniId ? (
                  <>
                    <span style={{ fontWeight: 600 }}>Faites grandir</span>{" "}
                    notre réseau
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: 600 }}>Faites partie</span> de
                    notre réseau
                  </>
                )}
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
                {alumniId
                  ? "Invitez d'autres étudiants ou anciens et partagez le site ! Votre réseau est précieux pour enrichir notre communauté et aider les futurs étudiants de Sorbonne Université."
                  : "Vous êtes un étudiant ou ancien étudiant de Sorbonne Université ? Rejoignez notre réseau d'alumni pour partager votre expérience et aider les étudiants actuels."}
              </Typography>
            </motion.div>

            {!alumniId ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
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
            ) : (
              <motion.div
                whileHover={{ scale: 1.045 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<i className="fas fa-share-alt"></i>}
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
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
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
                  onClick={() => {
                    // Copy current URL to clipboard
                    navigator.clipboard.writeText(window.location.href);
                    setAlreadyConnectedOpen(true);
                  }}
                >
                  Partager le site
                </Button>
              </motion.div>
            )}
            <Snackbar
              open={alreadyConnectedOpen}
              autoHideDuration={3500}
              onClose={() => setAlreadyConnectedOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity="success"
                onClose={() => setAlreadyConnectedOpen(false)}
                sx={{ width: "100%" }}
              >
                {alumniId
                  ? "Lien du site copié dans le presse-papiers !"
                  : "Vous êtes déjà connecté."}
              </Alert>
            </Snackbar>
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
          onWheel={(e) => {
            // Prevent scroll from bubbling up to parent containers
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            // Prevent touch scroll from bubbling up to parent containers
            e.stopPropagation();
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
              isBookmarked={isAlumniBookmarked(
                selectedAlumni.id || selectedAlumni._id
              )}
              onToggleBookmark={() =>
                toggleBookmarkForAlumni(selectedAlumni.id || selectedAlumni._id)
              }
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
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95vw", sm: 600, md: 700 },
            maxHeight: "90vh",
            overflowY: "auto",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Close Button - positioned in upper right of modal */}
          <IconButton
            onClick={closeListModal}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: 40,
              height: 40,
              borderRadius: "12px",
              "&:hover": {
                color: "rgba(255, 255, 255, 1)",
                background: "rgba(0, 0, 0, 0.5)",
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <CloseIcon sx={{ fontSize: "1.3rem" }} />
          </IconButton>

          <Card
            elevation={0}
            sx={{
              background: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              maxWidth: 800,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              p: 0,
              scrollBehavior: "smooth",
              animation: isListModalOpen
                ? "modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
              "@keyframes modalFadeIn": {
                "0%": {
                  opacity: 0,
                  transform: "scale(0.95) translateY(10px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "scale(1) translateY(0)",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 4,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(30, 41, 59, 0.8)",
                borderRadius: "24px 24px 0 0",
              }}
            >
              <Typography
                id="alumni-list-modal-title"
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: "1.5rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                Liste de tous les alumni par catégorie
              </Typography>
            </Box>
            <Box sx={{ p: 4, pt: 2, minWidth: 320 }}>
              {/* Group alumni by the 8 available domains, use Accordions */}
              {(() => {
                const DOMAINES = [
                  "Mathématiques",
                  "Informatique",
                  "Physique",
                  "Chimie",
                  "Mécanique",
                  "Sciences de la vie",
                  "Sciences de la Terre",
                  "Électronique",
                ];

                const domainColors = {
                  Chimie: "#ffb300", // vivid amber
                  Électronique: "#8e24aa", // deep purple
                  Informatique: "#ff80ab", // lighter pink
                  Mathématiques: "#e53935", // matte red
                  Mécanique: "#43a047", // strong green
                  Physique: "#009688", // teal
                  "Sciences de la Terre": "#3949ab", // strong blue-violet
                  "Sciences de la vie": "#00bcd4", // strong cyan
                };

                // Helper function to compute alumni card color (same logic as AlumniCard)
                const getAlumniCardColor = (alum) => {
                  // Compute alumFields as array
                  let alumFields = Array.isArray(alum.field)
                    ? alum.field
                    : typeof alum.field === "string" && alum.field.includes(",")
                    ? alum.field.split(",").map((f) => f.trim())
                    : alum.field
                    ? [alum.field]
                    : [];

                  // Sort alumFields alphabetically for gradient order
                  const sortedAlumFields = [...alumFields].sort((a, b) =>
                    a.localeCompare(b)
                  );
                  const profileColors = sortedAlumFields.map(
                    (f) => domainColors[f.trim()] || "#888"
                  );

                  if (alum.color && alum.color.trim() !== "") {
                    return alum.color;
                  } else if (profileColors.length === 0) {
                    return "rgba(255,255,255,0.08)";
                  } else if (profileColors.length === 1) {
                    return profileColors[0];
                  } else {
                    return `linear-gradient(90deg, ${profileColors.join(
                      ", "
                    )})`;
                  }
                };

                // Group alumni by domains
                const groupedAlumni = DOMAINES.reduce((acc, domain) => {
                  acc[domain] = alumni.filter(
                    (alum) =>
                      (!alum.hidden ||
                        String(alum._id) === String(alumniId) ||
                        isAdmin) &&
                      (alum.domains?.includes(domain) ||
                        (alum.field && alum.field.includes(domain)))
                  );
                  return acc;
                }, {});

                return Object.entries(groupedAlumni)
                  .filter(([domain, group]) => group.length > 0) // Only show domains with alumni
                  .map(([domain, group], idx, arr) => (
                    <Accordion
                      key={domain}
                      defaultExpanded={false}
                      sx={{
                        background: "rgba(30, 41, 59, 0.8)",
                        borderRadius: "16px",
                        mb: 2,
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        "&:before": { display: "none" },
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          />
                        }
                        aria-controls={`panel-${domain}-content`}
                        id={`panel-${domain}-header`}
                        sx={{
                          background: "rgba(51, 65, 85, 0.9)",
                          color: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "16px",
                          minHeight: 64,
                          boxShadow: "none",
                          fontWeight: 500,
                          mb: 0,
                          "&:hover": {
                            background: "rgba(51, 65, 85, 1)",
                          },
                          transition: "background 0.2s ease",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontWeight: 600,
                              background:
                                domainColors[domain] ||
                                "rgba(255, 255, 255, 0.1)",
                              color: "rgba(255, 255, 255, 0.95)",
                              fontSize: "0.9rem",
                            }}
                          >
                            {domain[0]}
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "rgba(255, 255, 255, 0.95)",
                              fontWeight: 500,
                              fontSize: "1.1rem",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {domain}
                          </Typography>
                          <Chip
                            label={`${group.length} alumni`}
                            size="small"
                            sx={{
                              ml: 2,
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "rgba(255, 255, 255, 0.9)",
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              height: "24px",
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          background: "rgba(15, 23, 42, 0.6)",
                          borderRadius: "0 0 16px 16px",
                          p: 0,
                        }}
                      >
                        <List dense>
                          {group.map((alum) => {
                            // Récupère la première école ajoutée (rang 1) comme Licence/BSc
                            const licence =
                              alum.schoolsApplied && alum.schoolsApplied[0]
                                ? alum.schoolsApplied[0].name
                                : "—";
                            // Récupère la deuxième école ajoutée (rang 2) comme Master/École actuelle
                            const currentSchool =
                              alum.schoolsApplied && alum.schoolsApplied[1]
                                ? alum.schoolsApplied[1].name
                                : "—";
                            // Récupère l'année de fin de L3
                            const anneeFinL3 = alum.anneeFinL3
                              ? alum.anneeFinL3
                              : "—";
                            return (
                              <ListItem
                                key={alum.id}
                                button
                                onClick={() => handleAlumniNameClick(alum)}
                                sx={{
                                  px: 2,
                                  py: 1.5,
                                  borderRadius: "12px",
                                  margin: "4px 8px",
                                  cursor: "pointer",
                                  transition:
                                    "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.05)",
                                    transform: "translateX(2px)",
                                  },
                                  userSelect: "none",
                                }}
                                aria-label={`Voir la fiche de ${alum.name}`}
                              >
                                <ListItemIcon sx={{ minWidth: 48 }}>
                                  <Avatar
                                    sx={{
                                      background: getAlumniCardColor(alum),
                                      color: "rgba(255, 255, 255, 0.95)",
                                      fontWeight: 600,
                                      fontSize: "0.9rem",
                                      width: 40,
                                      height: 40,
                                    }}
                                  >
                                    {alum.avatar}
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <span
                                      style={{
                                        fontWeight: 500,
                                        color: "rgba(255, 255, 255, 0.95)",
                                        fontSize: "1rem",
                                        letterSpacing: "-0.01em",
                                      }}
                                    >
                                      {alum.name}
                                    </span>
                                  }
                                  secondary={
                                    <span
                                      style={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                        fontSize: "0.875rem",
                                        letterSpacing: "0.01em",
                                      }}
                                    >
                                      {/* Affiche : Licence/BSc | Master/École actuelle | Année de fin de L3 */}
                                      {licence} &nbsp;|&nbsp; {currentSchool}{" "}
                                      &nbsp;|&nbsp; {anneeFinL3}
                                    </span>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ));
              })()}
            </Box>
          </Card>
        </Box>
      </Modal>
    </div>
  );
}
