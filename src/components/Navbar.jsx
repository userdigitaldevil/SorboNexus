import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
  ListItemIcon,
  Grow,
  Fade,
  FormControlLabel,
  Checkbox,
  Chip,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GradeIcon from "@mui/icons-material/Grade";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import AlumniProfileCard from "./AlumniProfileCard";
import { useAlumniEditModal } from "./AlumniEditModalContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SketchPicker } from "react-color";
import usePageScrollLock from "../hooks/usePageScrollLock";

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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const navItems = [
    { name: "Accueil", path: "/" },
    { name: "Ressources", path: "/ressources" },
    { name: "Conseils", path: "/conseils" },
    { name: "Alumni", path: "/alumni" },
    { name: "Liens Utiles", path: "/liens-utiles" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    // Always scroll to top when navigating
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile drawer if open
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Alumni state (works for both admins and non-admins)
  const [alumniUser, setAlumniUser] = useState(null);

  // Function to fetch alumni user data (for both admin and non-admin)
  const fetchAlumniUser = async () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.alumniId) {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/alumni/${decoded.alumniId}`
            );
            if (res.ok) {
              const data = await res.json();
              setAlumniUser(data);
            } else {
              setAlumniUser(null);
            }
          } else {
            setAlumniUser(null);
          }
        } catch (e) {
          setAlumniUser(null);
        }
      } else {
        setAlumniUser(null);
      }
    }
  };

  useEffect(() => {
    fetchAlumniUser();
  }, []);

  // Listen for storage changes (when profile is updated from other pages)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "profileUpdated") {
        fetchAlumniUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom events
    const handleProfileUpdate = () => {
      fetchAlumniUser();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Periodic refresh every 30 seconds to ensure data is up to date
  useEffect(() => {
    if (alumniUser) {
      const interval = setInterval(() => {
        fetchAlumniUser();
      }, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [alumniUser]);

  // Add back the anchor and handlers for the profile menu (move these above any JSX usage)
  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const drawer = (
    <Box
      sx={{
        width: 280,
        pt: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(20, 30, 48, 0.85)",
        backdropFilter: "blur(16px)",
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        transition: "background 0.3s",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
            background:
              "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          SorboNexus
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: "white", p: 1.5 }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>
      <List sx={{ width: "100%", flex: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            component={Link}
            to={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              color: isActive(item.path) ? theme.palette.primary.main : "white",
              borderRadius: 2,
              mx: 2,
              my: 0.5,
              minHeight: 48,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                sx: {
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  letterSpacing: "0.02em",
                  lineHeight: 1.3,
                },
              }}
            />
          </ListItem>
        ))}
        {alumniUser ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: 3, mt: 2 }}>
            <Button
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(59,130,246,0.3)",
                color: "#fff",
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 2.5,
                boxShadow: "0 2px 8px rgba(59,130,246,0.06)",
                textTransform: "none",
                fontSize: { xs: "0.9rem", sm: "0.95rem" },
                letterSpacing: "0.02em",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "rgba(59,130,246,0.12)",
                  borderColor: "#3b82f6",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontWeight: 700,
                  background: alumniUser.color || "#3b82f6",
                  color: "#fff",
                  mr: 1,
                }}
              >
                {alumniUser.avatar}
              </Avatar>
              {alumniUser.name.split(" ")[0]}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              TransitionComponent={Grow}
              PaperProps={{
                sx: {
                  borderRadius: 2.5,
                  boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.25)",
                  minWidth: 200,
                  mt: 1.5,
                  background: "rgba(30, 41, 59, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  p: 0.5,
                  overflow: "hidden",
                },
              }}
              MenuListProps={{
                sx: {
                  p: 0,
                },
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  setIsAlumniProfileModalOpen(true);
                  handleProfileClose();
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  py: 2,
                  px: 3,
                  borderRadius: 1.5,
                  mx: 0.5,
                  my: 0.25,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                Voir ma carte
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openEditSelfModal([alumniUser]);
                  handleProfileClose();
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  py: 2,
                  px: 3,
                  borderRadius: 1.5,
                  mx: 0.5,
                  my: 0.25,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                Modifier ma carte
              </MenuItem>
              {alumniUser.isAdmin && (
                <MenuItem
                  onClick={() => {
                    setIsAddAlumniModalOpen(true);
                    handleProfileClose();
                  }}
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    py: 2,
                    px: 3,
                    borderRadius: 1.5,
                    mx: 0.5,
                    my: 0.25,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1)",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  Ajouter un alumni
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("isAdmin");
                  window.location.reload();
                }}
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  py: 2,
                  px: 3,
                  borderRadius: 1.5,
                  mx: 0.5,
                  my: 0.25,
                  color: "#ef4444",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(239, 68, 68, 0.1)",
                    transform: "translateX(2px)",
                  },
                }}
              >
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <ListItem sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              component={Link}
              to="/connexion"
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                fontWeight: 500,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                py: 1.8,
                borderRadius: 2.5,
                boxShadow: "0 2px 8px rgba(59,130,246,0.06)",
                textTransform: "none",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Connexion
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  // Add before the component return:
  const [editingGradeKeys, setEditingGradeKeys] = useState({});
  const handleGradeKeyChange = (oldKey, newKey) => {
    setEditingGradeKeys((prev) => ({ ...prev, [oldKey]: newKey }));
  };
  const handleGradeKeyBlur = (oldKey) => {
    const newKey = editingGradeKeys[oldKey];
    if (newKey && newKey !== oldKey) {
      const val = editData.profile.grades[oldKey];
      const newGrades = { ...editData.profile.grades };
      delete newGrades[oldKey];
      newGrades[newKey] = val;
      setEditData((prev) => ({
        ...prev,
        profile: { ...prev.profile, grades: newGrades },
      }));
      setEditingGradeKeys((prev) => {
        const copy = { ...prev };
        delete copy[oldKey];
        return copy;
      });
    }
  };
  // For alumni edit modal
  const [alumniEditingGradeKeys, setAlumniEditingGradeKeys] = useState({});
  const handleAlumniGradeKeyChange = (oldKey, newKey) => {
    setAlumniEditingGradeKeys((prev) => ({ ...prev, [oldKey]: newKey }));
  };
  const handleAlumniGradeKeyBlur = (oldKey) => {
    const newKey = alumniEditingGradeKeys[oldKey];
    if (newKey && newKey !== oldKey) {
      const val = alumniEditForm.profile.grades[oldKey];
      const newGrades = { ...alumniEditForm.profile.grades };
      delete newGrades[oldKey];
      newGrades[newKey] = val;
      setAlumniEditForm((prev) => ({
        ...prev,
        profile: { ...prev.profile, grades: newGrades },
      }));
      setAlumniEditingGradeKeys((prev) => {
        const copy = { ...prev };
        delete copy[oldKey];
        return copy;
      });
    }
  };

  // Add Alumni state
  const [isAddAlumniModalOpen, setIsAddAlumniModalOpen] = useState(false);
  const [addAlumniForm, setAddAlumniForm] = useState({
    name: "",
    degree: "",
    position: "",
    field: [],
    email: "",
    linkedin: "",
    avatar: "",
    conseil: "",
    color: "",
    gradient: "",
    isAdmin: false,
    hidden: false,
    anneeFinL3: "",
    futureGoals: "",
    nationalities: "",
    stagesWorkedContestsExtracurriculars: "",
    username: "",
    password: "",
    currentPosition: "",
  });
  const [addAlumniGrades, setAddAlumniGrades] = useState([
    { key: "", value: "" },
  ]);
  const [addAlumniSchools, setAddAlumniSchools] = useState([
    { name: "", status: "accepted" },
  ]);

  // Add a list of preset gradients
  const gradientOptions = [
    {
      label: "Bleu-Violet",
      value: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    },
    {
      label: "Orange-Rouge",
      value: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    },
    {
      label: "Vert-Bleu",
      value: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    },
    {
      label: "Rose-Violet",
      value: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    },
    {
      label: "Gris-Bleu",
      value: "linear-gradient(135deg, #64748b 0%, #3b82f6 100%)",
    },
    { label: "Custom", value: "custom" },
  ];
  const [gradientSelect, setGradientSelect] = useState(
    gradientOptions[0].value
  );

  // Handlers for add alumni form
  const handleAddAlumniChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setAddAlumniForm((prev) => ({
        ...prev,
        profile: { ...prev.profile, [key]: value },
      }));
    } else if (type === "checkbox") {
      setAddAlumniForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setAddAlumniForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAddAlumniGradeChange = (idx, field, value) => {
    setAddAlumniGrades((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };
  const handleAddAlumniAddGrade = () => {
    setAddAlumniGrades((prev) => [...prev, { key: "", value: "" }]);
  };
  const handleAddAlumniRemoveGrade = (idx) => {
    setAddAlumniGrades((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleAddAlumniSchoolChange = (idx, field, value) => {
    setAddAlumniSchools((prev) => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  };
  const handleAddAlumniAddSchool = () => {
    setAddAlumniSchools((prev) => [...prev, { name: "", status: "accepted" }]);
  };
  const handleAddAlumniRemoveSchool = (idx) => {
    setAddAlumniSchools((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit handler
  const handleAddAlumniSubmit = async (e) => {
    e.preventDefault();
    // Build grades and schools arrays
    const gradesArr = addAlumniGrades
      .filter((g) => g.key && g.value)
      .map((g) => ({ subject: g.key, value: g.value }));
    const schoolsArr = addAlumniSchools.filter((s) => s.name);
    // Require all fields except conseil
    const required = [
      "name",
      "degree",
      "position",
      "field",
      "email",
      "linkedin",
      "avatar",
      "currentPosition",
    ];
    for (const field of required) {
      const val = field.startsWith("profile.")
        ? addAlumniForm.profile[field.split(".")[1]]
        : addAlumniForm[field];
      if (!val) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }
    }
    if (gradesArr.length === 0) {
      alert("Veuillez ajouter au moins une note/diplôme.");
      return;
    }
    if (schoolsArr.length === 0) {
      alert("Veuillez ajouter au moins une école demandée.");
      return;
    }
    // Format nationalities as array
    let nationalitiesArr = [];
    if (addAlumniForm.nationalities) {
      nationalitiesArr = addAlumniForm.nationalities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    // Build alumni object for backend
    const alumniToSend = {
      ...addAlumniForm,
      // Send field as a comma-separated string if it's an array
      field: Array.isArray(addAlumniForm.field)
        ? addAlumniForm.field.join(",")
        : addAlumniForm.field || "",
      avatar: addAlumniForm.name ? addAlumniForm.name[0].toUpperCase() : "",
      grades: gradesArr,
      schoolsApplied: schoolsArr,
      isAdmin: addAlumniForm.isAdmin,
      nationalities: nationalitiesArr,
      anneeFinL3: addAlumniForm.anneeFinL3,
      futureGoals: addAlumniForm.futureGoals,
      stagesWorkedContestsExtracurriculars:
        addAlumniForm.stagesWorkedContestsExtracurriculars,
      position: addAlumniForm.position,
      // Do NOT include currentPosition at all
    };
    // Remove the profile and currentPosition fields if present
    delete alumniToSend.profile;
    delete alumniToSend.currentPosition;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alumniToSend),
      });
      if (res.ok) {
        setIsAddAlumniModalOpen(false);
        setAddAlumniForm({
          name: "",
          degree: "",
          position: "",
          field: [],
          email: "",
          linkedin: "",
          avatar: "",
          conseil: "",
          color: "",
          gradient: "",
          isAdmin: false,
          hidden: false,
          anneeFinL3: "",
          futureGoals: "",
          nationalities: "",
          stagesWorkedContestsExtracurriculars: "",
          username: "",
          password: "",
          currentPosition: "",
        });
        setAddAlumniGrades([{ key: "", value: "" }]);
        setAddAlumniSchools([{ name: "", status: "accepted" }]);
        window.dispatchEvent(new Event("profileUpdated"));
      } else {
        alert("Erreur lors de la création de l'alumni.");
      }
    } catch (err) {
      alert("Erreur lors de la création de l'alumni.");
    }
  };

  const [isAlumniProfileModalOpen, setIsAlumniProfileModalOpen] =
    useState(false);

  const { openEditSelfModal } = useAlumniEditModal();

  // Lock scrolling when alumni profile modal is open
  useEffect(() => {
    if (isAlumniProfileModalOpen) {
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
  }, [isAlumniProfileModalOpen]);

  // Lock scrolling when add alumni modal is open
  useEffect(() => {
    if (isAddAlumniModalOpen) {
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
  }, [isAddAlumniModalOpen]);

  const [showFullConseil, setShowFullConseil] = useState(false);
  const conseilMaxLength = 180;
  const conseilIsLong = (addAlumniForm.conseil || "").length > conseilMaxLength;
  const conseilPreview =
    conseilIsLong && !showFullConseil
      ? (addAlumniForm.conseil || "").slice(0, conseilMaxLength) + "..."
      : addAlumniForm.conseil || "";

  const anyModalOpen = isAlumniProfileModalOpen || isAddAlumniModalOpen;
  usePageScrollLock(anyModalOpen);

  return (
    <>
      <AppBar
        position="fixed"
        className="glass"
        sx={{
          width: "100vw",
          left: 0,
          top: 0,
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.13)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          zIndex: 1000,
          borderRadius: 0,
          margin: 0,
          padding: 0,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 5, md: 7, lg: 9 },
            py: 2,
            minHeight: "76px",
            height: "76px",
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              onClick={() => handleNavigation("/")}
              sx={{
                fontWeight: 500,
                fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" },
                letterSpacing: "-0.01em",
                cursor: "pointer",
                textDecoration: "none",
                padding: { xs: "10px", sm: "6px" },
                borderRadius: "6px",
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.2,
                "&:hover": {
                  opacity: 0.8,
                },
                "&:active": {
                  opacity: 0.6,
                },
                transition: "opacity 0.2s ease",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              SorboNexus
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: isActive(item.path)
                      ? "#3b82f6"
                      : "rgba(255, 255, 255, 0.75)",
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                    fontWeight: 500,
                    px: 3.5,
                    py: 1.8,
                    borderRadius: 2.5,
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(59, 130, 246, 0.08)",
                      color: "#fff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
              {alumniUser ? (
                <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                  <Button
                    onClick={handleProfileClick}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(59,130,246,0.3)",
                      color: "#fff",
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2.5,
                      boxShadow: "0 2px 8px rgba(59,130,246,0.06)",
                      textTransform: "none",
                      fontSize: { xs: "0.9rem", sm: "0.95rem" },
                      letterSpacing: "0.02em",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(59,130,246,0.12)",
                        borderColor: "#3b82f6",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontWeight: 700,
                        background: alumniUser.color || "#3b82f6",
                        color: "#fff",
                        mr: 1,
                      }}
                    >
                      {alumniUser.avatar}
                    </Avatar>
                    {alumniUser.name.split(" ")[0]}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  component={Link}
                  to="/connexion"
                  sx={{
                    ml: 3,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    px: 4,
                    py: 1.6,
                    borderRadius: 2.5,
                    boxShadow: "0 4px 16px rgba(59,130,246,0.12)",
                    textTransform: "none",
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
                      color: "#fff",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Connexion
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      {/* Spacer for fixed navbar */}
      <Toolbar />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
            border: "none",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Alumni Profile Modal */}
      <Modal
        open={isAlumniProfileModalOpen}
        onClose={() => setIsAlumniProfileModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "transparent",
            p: 0,
            borderRadius: 2,
            minWidth: { xs: "auto", sm: "auto", md: "420px" },
            width: { xs: "95vw", sm: "90vw", md: "600px" },
            maxWidth: { xs: "95vw", sm: "90vw", md: "600px" },
            maxHeight: { xs: "90vh", sm: "85vh", md: "90vh" },
            overflowY: "auto",
            boxShadow: 24,
            scrollBehavior: "smooth",
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {alumniUser ? (
            <AlumniProfileCard
              alum={alumniUser}
              isAdmin={alumniUser.isAdmin}
              onClose={() => setIsAlumniProfileModalOpen(false)}
              handleEditClick={() => {
                setIsAlumniProfileModalOpen(false);
                openEditSelfModal([alumniUser]);
              }}
            />
          ) : null}
        </Box>
      </Modal>

      {/* Add Alumni Modal */}
      <Modal
        open={isAddAlumniModalOpen}
        onClose={() => setIsAddAlumniModalOpen(false)}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "rgba(30, 41, 59, 0.95)",
              backdropFilter: "blur(20px)",
              p: { xs: 2, sm: 3, md: 5 },
              borderRadius: 3,
              minWidth: { xs: "auto", sm: "auto", md: "360px" },
              width: { xs: "95vw", sm: "90vw", md: "640px" },
              maxWidth: { xs: "95vw", sm: "90vw", md: "640px" },
              maxHeight: { xs: "90vh", sm: "85vh", md: "85vh" },
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              scrollBehavior: "smooth",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <IconButton
              onClick={() => setIsAddAlumniModalOpen(false)}
              sx={{
                position: "absolute",
                top: { xs: 12, sm: 14, md: 16 },
                right: { xs: 12, sm: 14, md: 16 },
                zIndex: 10,
                color: "rgba(255, 255, 255, 0.6)",
                background: "rgba(0, 0, 0, 0.2)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                width: { xs: 36, sm: 38, md: 40 },
                height: { xs: 36, sm: 38, md: 40 },
                borderRadius: 2.5,
                "&:hover": {
                  color: "#fff",
                  background: "rgba(0, 0, 0, 0.4)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <CloseIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontSize: "1.4rem",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              Ajouter un alumni
            </Typography>
            <form onSubmit={handleAddAlumniSubmit}>
              <TextField
                label="Nom"
                name="name"
                value={addAlumniForm.name}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                required
              />
              <TextField
                label="Diplôme"
                name="degree"
                value={addAlumniForm.degree}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                required
              />
              <TextField
                label="Poste actuel"
                name="position"
                value={addAlumniForm.position}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.8rem",
                    fontWeight: 400,
                  },
                }}
                required
                helperText={
                  'Indiquez "Etudiant" si vous n\'avez pas de poste actuel.'
                }
              />
              <FormControl
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              >
                <InputLabel id="domaines-label">Domaines</InputLabel>
                <Select
                  labelId="domaines-label"
                  multiple
                  value={addAlumniForm.field || []}
                  onChange={(e) =>
                    setAddAlumniForm((prev) => ({
                      ...prev,
                      field: e.target.value,
                    }))
                  }
                  input={<OutlinedInput label="Domaines" />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "rgba(30, 41, 59, 0.98)",
                        color: "#fff",
                        borderRadius: 2.5,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                    },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          sx={{
                            background: "#3b82f6",
                            color: "#fff",
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            borderRadius: 2,
                            "& .MuiChip-label": {
                              px: 1.5,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  required
                >
                  {DOMAINES.map((domaine) => (
                    <MenuItem
                      key={domaine}
                      value={domaine}
                      sx={
                        addAlumniForm.field &&
                        addAlumniForm.field.includes(domaine)
                          ? {
                              background: "#3b82f6",
                              color: "#fff",
                              fontWeight: 500,
                              borderRadius: 1.5,
                              mx: 0.5,
                              "&:hover": { background: "#2563eb" },
                            }
                          : {
                              "&:hover": {
                                background: "rgba(59, 130, 246, 0.1)",
                                borderRadius: 1.5,
                                mx: 0.5,
                              },
                            }
                      }
                    >
                      {addAlumniForm.field &&
                      addAlumniForm.field.includes(domaine) ? (
                        <span style={{ marginRight: 8, fontWeight: 600 }}>
                          ✓
                        </span>
                      ) : null}
                      {domaine}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Email"
                name="email"
                value={addAlumniForm.email}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                required
              />
              <TextField
                label="LinkedIn"
                name="linkedin"
                value={addAlumniForm.linkedin}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                required
              />
              <TextField
                label="Avatar (lettres)"
                name="avatar"
                value={addAlumniForm.avatar}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                required
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Poste actuel"
                  name="currentPosition"
                  value={addAlumniForm.currentPosition}
                  onChange={handleAddAlumniChange}
                  fullWidth
                  required
                  sx={{
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
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      fontSize: "0.95rem",
                      letterSpacing: "0.02em",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.8rem",
                      fontWeight: 400,
                    },
                  }}
                  helperText={
                    'Indiquez "Etudiant" si vous n\'avez pas de poste actuel.'
                  }
                />
              </FormControl>
              {/* Grades */}
              <Typography
                variant="subtitle1"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "#fff",
                  letterSpacing: "0.02em",
                }}
              >
                Notes/Diplômes
              </Typography>
              {addAlumniGrades.map((g, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                  <TextField
                    label="Diplôme"
                    value={g.key}
                    onChange={(e) =>
                      handleAddAlumniGradeChange(idx, "key", e.target.value)
                    }
                    size="small"
                    sx={{
                      flex: 1,
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
                        color: "#fff",
                        fontSize: "0.9rem",
                        letterSpacing: "0.02em",
                      },
                    }}
                    required
                  />
                  <TextField
                    label="Note"
                    value={g.value}
                    onChange={(e) =>
                      handleAddAlumniGradeChange(idx, "value", e.target.value)
                    }
                    size="small"
                    sx={{
                      flex: 1,
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
                        color: "#fff",
                        fontSize: "0.9rem",
                        letterSpacing: "0.02em",
                      },
                    }}
                    required
                  />
                  <Button
                    onClick={() => handleAddAlumniRemoveGrade(idx)}
                    color="error"
                    size="small"
                    sx={{
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      letterSpacing: "0.02em",
                      textTransform: "none",
                      "&:hover": {
                        background: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    Supprimer
                  </Button>
                </Box>
              ))}
              <Button
                onClick={handleAddAlumniAddGrade}
                size="small"
                sx={{
                  mt: 1,
                  mb: 3,
                  color: "#3b82f6",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2.5,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Ajouter une note
              </Button>
              {/* Schools */}
              <Typography
                variant="subtitle1"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "#fff",
                  letterSpacing: "0.02em",
                }}
              >
                Écoles demandées
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "#3b82f6",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  letterSpacing: "0.02em",
                  lineHeight: 1.4,
                }}
              >
                L'ordre des écoles est important : la première école (rang 1)
                correspond à la Licence/BSc, la deuxième (rang 2) au
                Master/École actuelle, et les suivantes sont les écoles ou
                masters demandés. Vous pouvez réorganiser l'ordre en déplaçant
                les écoles.
              </Typography>
              {addAlumniSchools.map((s, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <TextField
                      label={`École (rang ${idx + 1})`}
                      value={s.name}
                      onChange={(e) =>
                        handleAddAlumniSchoolChange(idx, "name", e.target.value)
                      }
                      size="small"
                      sx={{
                        flex: 2,
                        minWidth: 250,
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
                          color: "#fff",
                          fontSize: "0.9rem",
                          letterSpacing: "0.02em",
                        },
                      }}
                      required
                    />
                    <TextField
                      select
                      label="Statut"
                      value={s.status}
                      onChange={(e) =>
                        handleAddAlumniSchoolChange(
                          idx,
                          "status",
                          e.target.value
                        )
                      }
                      size="small"
                      sx={{
                        flex: 1,
                        minWidth: 120,
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
                          color: "#fff",
                          fontSize: "0.9rem",
                          letterSpacing: "0.02em",
                        },
                      }}
                      SelectProps={{ native: true }}
                      required
                    >
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Refusé</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Button
                      onClick={() => handleAddAlumniRemoveSchool(idx)}
                      color="error"
                      size="small"
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        letterSpacing: "0.02em",
                        textTransform: "none",
                        "&:hover": {
                          background: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      Supprimer
                    </Button>
                    <Button
                      onClick={() => {
                        if (idx > 0) {
                          setAddAlumniSchools((prev) => {
                            const schools = [...prev];
                            [schools[idx - 1], schools[idx]] = [
                              schools[idx],
                              schools[idx - 1],
                            ];
                            return schools;
                          });
                        }
                      }}
                      size="small"
                      disabled={idx === 0}
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        letterSpacing: "0.02em",
                        textTransform: "none",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.08)",
                        },
                        "&:disabled": {
                          color: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      ↑
                    </Button>
                    <Button
                      onClick={() => {
                        if (idx < addAlumniSchools.length - 1) {
                          setAddAlumniSchools((prev) => {
                            const schools = [...prev];
                            [schools[idx], schools[idx + 1]] = [
                              schools[idx + 1],
                              schools[idx],
                            ];
                            return schools;
                          });
                        }
                      }}
                      size="small"
                      disabled={idx === addAlumniSchools.length - 1}
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        letterSpacing: "0.02em",
                        textTransform: "none",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.08)",
                        },
                        "&:disabled": {
                          color: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      ↓
                    </Button>
                  </Box>
                </Box>
              ))}
              <Button
                onClick={handleAddAlumniAddSchool}
                size="small"
                sx={{
                  mt: 1,
                  mb: 3,
                  color: "#3b82f6",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  borderRadius: 2.5,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Ajouter une école
              </Button>
              {/* Conseil (optionnel) */}
              <TextField
                label="Conseil (optionnel)"
                name="conseil"
                value={
                  showFullConseil || !conseilIsLong
                    ? addAlumniForm.conseil || ""
                    : conseilPreview
                }
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1.5,
                  },
                }}
                multiline
                minRows={2}
                InputProps={{
                  endAdornment: conseilIsLong ? (
                    <IconButton
                      onClick={() => setShowFullConseil((v) => !v)}
                      size="small"
                      tabIndex={-1}
                      aria-label={showFullConseil ? "Réduire" : "Voir plus"}
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        "&:hover": {
                          color: "#fff",
                        },
                      }}
                    >
                      {showFullConseil ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  ) : null,
                  readOnly: false,
                }}
              />
              <TextField
                label="Nationalités (séparées par des virgules)"
                name="nationalities"
                value={addAlumniForm.nationalities || ""}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              />
              <TextField
                label="Stages, entreprises, concours, extrascolaire (texte libre)"
                name="stagesWorkedContestsExtracurriculars"
                value={addAlumniForm.stagesWorkedContestsExtracurriculars || ""}
                onChange={handleAddAlumniChange}
                fullWidth
                multiline
                minRows={2}
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                    lineHeight: 1.5,
                  },
                }}
              />
              <TextField
                label="Projets futurs (métiers, masters, écoles visés...)"
                name="futureGoals"
                value={addAlumniForm.futureGoals || ""}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              />
              <TextField
                label="Année de fin de L3 (4 chiffres)"
                name="anneeFinL3"
                value={addAlumniForm.anneeFinL3 || ""}
                onChange={handleAddAlumniChange}
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                inputProps={{ maxLength: 4, pattern: "\\d{4}" }}
              />
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Nom d'utilisateur"
                  value={addAlumniForm.username}
                  onChange={(e) =>
                    setAddAlumniForm((f) => ({
                      ...f,
                      username: e.target.value,
                    }))
                  }
                  sx={{
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
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      fontSize: "0.95rem",
                      letterSpacing: "0.02em",
                    },
                  }}
                  required
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Mot de passe"
                  type="password"
                  value={addAlumniForm.password}
                  onChange={(e) =>
                    setAddAlumniForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
                  }
                  sx={{
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
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      fontSize: "0.95rem",
                      letterSpacing: "0.02em",
                    },
                  }}
                  required
                />
              </FormControl>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!addAlumniForm.color}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAddAlumniForm((prev) => ({ ...prev, color: "" }));
                        } else {
                          setAddAlumniForm((prev) => ({
                            ...prev,
                            color: "#ff80ab",
                          }));
                        }
                      }}
                      sx={{
                        color: "#3b82f6",
                        "&.Mui-checked": {
                          color: "#3b82f6",
                        },
                      }}
                    />
                  }
                  label="Utiliser la couleur par défaut (domaines)"
                  sx={{
                    mb: 2,
                    "& .MuiFormControlLabel-label": {
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                  }}
                />
                <TextField
                  label="Couleur personnalisée (hex)"
                  name="color"
                  value={addAlumniForm.color || ""}
                  onChange={handleAddAlumniChange}
                  fullWidth
                  sx={{
                    mt: 1,
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
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      fontSize: "0.95rem",
                      letterSpacing: "0.02em",
                    },
                  }}
                  disabled={!addAlumniForm.color}
                  placeholder="#ff80ab"
                  InputProps={{
                    endAdornment: (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: addAlumniForm.color || "#eee",
                          borderRadius: "50%",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          ml: 1,
                        }}
                      />
                    ),
                  }}
                />
                {addAlumniForm.color && (
                  <Box sx={{ mt: 2 }}>
                    <SketchPicker
                      color={addAlumniForm.color}
                      onChange={(color) =>
                        setAddAlumniForm((prev) => ({
                          ...prev,
                          color: color.hex,
                        }))
                      }
                      disableAlpha
                    />
                  </Box>
                )}
              </Box>
              <FormControl
                fullWidth
                sx={{
                  mb: 3,
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
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              >
                <InputLabel id="gradient-select-label">Dégradé</InputLabel>
                <Select
                  labelId="gradient-select-label"
                  value={gradientSelect}
                  label="Dégradé"
                  onChange={(e) => {
                    setGradientSelect(e.target.value);
                    setAddAlumniForm((f) => ({
                      ...f,
                      gradient:
                        e.target.value === "custom" ? "" : e.target.value,
                    }));
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "rgba(30, 41, 59, 0.98)",
                        color: "#fff",
                        borderRadius: 2.5,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                    },
                  }}
                >
                  {gradientOptions.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      sx={{
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1)",
                          borderRadius: 1.5,
                          mx: 0.5,
                        },
                      }}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {gradientSelect === "custom" && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <TextField
                    label="Dégradé personnalisé (CSS linear-gradient)"
                    name="gradient"
                    value={addAlumniForm.gradient}
                    onChange={handleAddAlumniChange}
                    placeholder="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
                    fullWidth
                    sx={{
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
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      },
                      "& .MuiInputBase-input": {
                        color: "#fff",
                        fontSize: "0.95rem",
                        letterSpacing: "0.02em",
                      },
                    }}
                  />
                </FormControl>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addAlumniForm.hidden}
                    onChange={(e) =>
                      setAddAlumniForm((f) => ({
                        ...f,
                        hidden: e.target.checked,
                      }))
                    }
                    name="hidden"
                    color="primary"
                    sx={{
                      color: "#3b82f6",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label="Masquer la carte (carte non visible publiquement)"
                sx={{
                  mb: 3,
                  "& .MuiFormControlLabel-label": {
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addAlumniForm.isAdmin}
                    onChange={(e) =>
                      setAddAlumniForm((f) => ({
                        ...f,
                        isAdmin: e.target.checked,
                      }))
                    }
                    name="isAdmin"
                    color="primary"
                    sx={{
                      color: "#3b82f6",
                      "&.Mui-checked": {
                        color: "#3b82f6",
                      },
                    }}
                  />
                }
                label="Statut admin (donne accès à l'administration)"
                sx={{
                  mb: 3,
                  "& .MuiFormControlLabel-label": {
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 4,
                }}
              >
                <Button
                  onClick={() => setIsAddAlumniModalOpen(false)}
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2.5,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    "&:hover": {
                      color: "#fff",
                      background: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2.5,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.12)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Créer
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
