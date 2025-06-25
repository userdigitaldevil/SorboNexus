import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    { name: "Alumnis", path: "/alumnis" },
    { name: "Liens Utiles", path: "/liens-utiles" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Admin state and alumni
  const isAdmin =
    typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";
  const [adminAlumni, setAdminAlumni] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  // Fetch admin data from database
  useEffect(() => {
    if (isAdmin) {
      fetch("http://localhost:5001/api/alumni")
        .then((res) => res.json())
        .then((data) => {
          const admin = data.find((a) => a.isAdmin);
          if (admin) {
            setAdminAlumni(admin);
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Alumni state
  const [alumniUser, setAlumniUser] = useState(null);

  // Function to fetch alumni user data
  const fetchAlumniUser = async () => {
    if (!isAdmin && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.alumniId) {
            const res = await fetch(
              `http://localhost:5001/api/alumni/${decoded.alumniId}`
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
    } else {
      setAlumniUser(null);
    }
  };

  useEffect(() => {
    fetchAlumniUser();
  }, [isAdmin]);

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
  }, [isAdmin]);

  // Periodic refresh every 30 seconds to ensure data is up to date
  useEffect(() => {
    if (!isAdmin && alumniUser) {
      const interval = setInterval(() => {
        fetchAlumniUser();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isAdmin, alumniUser]);

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
          className="sorbonne-gradient"
          sx={{ fontWeight: 700, fontSize: 22 }}
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
            onClick={handleDrawerToggle}
            sx={{
              color: isActive(item.path) ? theme.palette.primary.main : "white",
              borderRadius: 2,
              mx: 2,
              my: 0.5,
              minHeight: 48,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
            button
          >
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                sx: {
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: 18,
                  letterSpacing: 0.5,
                },
              }}
            />
          </ListItem>
        ))}
        {isAdmin && adminAlumni ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: 3, mt: 2 }}>
            <Button
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                background: "rgba(255,255,255,0.10)",
                border: "1.5px solid #3b82f6",
                color: "#fff",
                fontWeight: 700,
                px: 2.5,
                py: 1.2,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  background: "rgba(59,130,246,0.15)",
                  borderColor: "#2563eb",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontWeight: 700,
                  background: "#3b82f6",
                  color: "#fff",
                  mr: 1,
                }}
              >
                {adminAlumni.avatar}
              </Avatar>
              {adminAlumni.name.split(" ")[0]}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              TransitionComponent={Grow}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                  minWidth: 180,
                  mt: 1,
                  background: "rgba(30, 41, 59, 0.98)",
                  color: "#fff",
                  p: 0.5,
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
                  navigate("/alumnis?editSelf=1");
                  handleProfileClose();
                }}
              >
                Modifier ma carte
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsAddAlumniModalOpen(true);
                  handleProfileClose();
                }}
              >
                Ajouter un alumni
              </MenuItem>
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Box>
        ) : alumniUser ? (
          <Box sx={{ display: "flex", alignItems: "center", ml: 3, mt: 2 }}>
            <Button
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                background: "rgba(255,255,255,0.10)",
                border: "1.5px solid #3b82f6",
                color: "#fff",
                fontWeight: 700,
                px: 2.5,
                py: 1.2,
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  background: "rgba(59,130,246,0.15)",
                  borderColor: "#2563eb",
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
                  borderRadius: 3,
                  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                  minWidth: 180,
                  mt: 1,
                  background: "rgba(30, 41, 59, 0.98)",
                  color: "#fff",
                  p: 0.5,
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
              >
                Voir ma carte
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/alumnis?editSelf=1");
                  handleProfileClose();
                }}
              >
                Modifier ma carte
              </MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("isAdmin");
                  window.location.reload();
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
                fontWeight: 700,
                fontSize: 18,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                textTransform: "none",
                letterSpacing: 0.5,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
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
    field: "",
    email: "",
    linkedin: "",
    avatar: "",
    conseil: "",
    color: "",
    gradient: "",
    username: "",
    password: "",
    isAdmin: false,
    profile: {
      currentPosition: "",
      grades: {},
      schoolsApplied: [],
      email: "",
      linkedin: "",
    },
    anneeFinL3: "",
    futureGoals: "",
    nationalities: "",
    stagesWorkedContestsExtracurriculars: "",
  });
  const [addAlumniGrades, setAddAlumniGrades] = useState([
    { key: "", value: "" },
  ]);
  const [addAlumniSchools, setAddAlumniSchools] = useState([
    { name: "", status: "accepted" },
  ]);

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
    // Build grades and schools objects
    const gradesObj = {};
    addAlumniGrades.forEach((g) => {
      if (g.key && g.value) gradesObj[g.key] = g.value;
    });
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
      "profile.currentPosition",
      "username",
      "password",
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
    if (Object.keys(gradesObj).length === 0) {
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
    // Build alumni object
    const alumniToSend = {
      ...addAlumniForm,
      avatar: addAlumniForm.name ? addAlumniForm.name[0].toUpperCase() : "",
      profile: {
        ...addAlumniForm.profile,
        grades: gradesObj,
        schoolsApplied: schoolsArr,
      },
      isAdmin: addAlumniForm.isAdmin,
      nationalities: nationalitiesArr,
      anneeFinL3: addAlumniForm.anneeFinL3,
      futureGoals: addAlumniForm.futureGoals,
      stagesWorkedContestsExtracurriculars:
        addAlumniForm.stagesWorkedContestsExtracurriculars,
    };
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/alumni", {
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
          field: "",
          email: "",
          linkedin: "",
          avatar: "",
          conseil: "",
          color: "",
          gradient: "",
          username: "",
          password: "",
          isAdmin: false,
          profile: {
            currentPosition: "",
            grades: {},
            schoolsApplied: [],
            email: "",
            linkedin: "",
          },
          anneeFinL3: "",
          futureGoals: "",
          nationalities: "",
          stagesWorkedContestsExtracurriculars: "",
        });
        setAddAlumniGrades([{ key: "", value: "" }]);
        setAddAlumniSchools([{ name: "", status: "accepted" }]);
        // Optionally, refresh alumni data in parent
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

  function renderConseilWithLinks(text) {
    if (!text) return null;
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
    <>
      <AppBar
        position="fixed"
        className="glass"
        sx={{
          background: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.13)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          zIndex: 1000,
          borderRadius: 0,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 4, md: 6, lg: 8 },
            py: 1.5,
            minHeight: "72px",
            height: "72px",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              className="gradient-text"
              sx={{ fontWeight: 800, fontSize: "2rem", letterSpacing: 1 }}
            >
              SorboNexus
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path)
                      ? "#3b82f6"
                      : "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(59, 130, 246, 0.10)",
                      color: "#fff",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
              {isAdmin && adminAlumni ? (
                <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                  <Button
                    onClick={handleProfileClick}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      background: "rgba(255,255,255,0.10)",
                      border: "1.5px solid #3b82f6",
                      color: "#fff",
                      fontWeight: 700,
                      px: 2.5,
                      py: 1.2,
                      borderRadius: 3,
                      boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        background: "rgba(59,130,246,0.15)",
                        borderColor: "#2563eb",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontWeight: 700,
                        background: "#3b82f6",
                        color: "#fff",
                        mr: 1,
                      }}
                    >
                      {adminAlumni.avatar}
                    </Avatar>
                    {adminAlumni.name.split(" ")[0]}
                  </Button>
                </Box>
              ) : (
                alumniUser && (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
                    <Button
                      onClick={handleProfileClick}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        background: "rgba(255,255,255,0.10)",
                        border: "1.5px solid #3b82f6",
                        color: "#fff",
                        fontWeight: 700,
                        px: 2.5,
                        py: 1.2,
                        borderRadius: 3,
                        boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                        textTransform: "none",
                        fontSize: "1rem",
                        "&:hover": {
                          background: "rgba(59,130,246,0.15)",
                          borderColor: "#2563eb",
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
                )
              )}
              {isAdmin && adminAlumni ? null : alumniUser ? null : (
                <Button
                  variant="contained"
                  component={Link}
                  to="/connexion"
                  sx={{
                    ml: 3,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    px: 3.5,
                    py: 1.3,
                    borderRadius: 3,
                    boxShadow: "0 4px 16px rgba(59,130,246,0.18)",
                    textTransform: "none",
                    letterSpacing: 0.5,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)",
                      color: "#fff",
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

      {/* Spacer for fixed navbar */}
      <Toolbar />

      {/* Alumni Profile Modal */}
      <Modal
        open={isAlumniProfileModalOpen}
        onClose={() => setIsAlumniProfileModalOpen(false)}
      >
        {alumniUser ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "transparent",
              p: 0,
              borderRadius: 2,
              minWidth: 420,
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: 24,
            }}
          >
            <AlumniProfileCard alum={alumniUser} isAdmin={alumniUser.isAdmin} />
          </Box>
        ) : null}
      </Modal>

      {/* Add Alumni Modal */}
      <Modal
        open={isAddAlumniModalOpen}
        onClose={() => setIsAddAlumniModalOpen(false)}
      >
        <Box
          sx={{
            minWidth: 340,
            maxWidth: 420,
            bgcolor: "#18181b",
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ajouter un alumni
          </Typography>
          <form onSubmit={handleAddAlumniSubmit}>
            <TextField
              label="Nom"
              name="name"
              value={addAlumniForm.name}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Diplôme"
              name="degree"
              value={addAlumniForm.degree}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Poste actuel"
              name="position"
              value={addAlumniForm.position}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Domaine"
              name="field"
              value={addAlumniForm.field}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Email"
              name="email"
              value={addAlumniForm.email}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="LinkedIn"
              name="linkedin"
              value={addAlumniForm.linkedin}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Avatar (lettres)"
              name="avatar"
              value={addAlumniForm.avatar}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Poste actuel (profile)"
              name="profile.currentPosition"
              value={addAlumniForm.profile.currentPosition}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            {/* Grades */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Notes/Diplômes
            </Typography>
            {addAlumniGrades.map((g, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  label="Diplôme"
                  value={g.key}
                  onChange={(e) =>
                    handleAddAlumniGradeChange(idx, "key", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                  required
                />
                <TextField
                  label="Note"
                  value={g.value}
                  onChange={(e) =>
                    handleAddAlumniGradeChange(idx, "value", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                  required
                />
                <Button
                  onClick={() => handleAddAlumniRemoveGrade(idx)}
                  color="error"
                  size="small"
                >
                  Supprimer
                </Button>
              </Box>
            ))}
            <Button
              onClick={handleAddAlumniAddGrade}
              size="small"
              sx={{ mt: 1, mb: 2 }}
            >
              Ajouter une note
            </Button>
            {/* Schools */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Écoles demandées
            </Typography>
            {addAlumniSchools.map((s, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  label="École"
                  value={s.name}
                  onChange={(e) =>
                    handleAddAlumniSchoolChange(idx, "name", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 2 }}
                  required
                />
                <TextField
                  select
                  label="Statut"
                  value={s.status}
                  onChange={(e) =>
                    handleAddAlumniSchoolChange(idx, "status", e.target.value)
                  }
                  size="small"
                  sx={{ flex: 1 }}
                  SelectProps={{ native: true }}
                  required
                >
                  <option value="accepted">Accepté</option>
                  <option value="rejected">Refusé</option>
                </TextField>
                <Button
                  onClick={() => handleAddAlumniRemoveSchool(idx)}
                  color="error"
                  size="small"
                >
                  Supprimer
                </Button>
              </Box>
            ))}
            <Button
              onClick={handleAddAlumniAddSchool}
              size="small"
              sx={{ mt: 1, mb: 2 }}
            >
              Ajouter une école
            </Button>
            {/* Conseil (optional) */}
            <TextField
              label="Conseil (optionnel)"
              name="conseil"
              value={addAlumniForm.conseil}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              multiline
              minRows={2}
            />
            <TextField
              label="Nom d'utilisateur"
              name="username"
              value={addAlumniForm.username}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Mot de passe"
              name="password"
              value={addAlumniForm.password}
              onChange={handleAddAlumniChange}
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={addAlumniForm.isAdmin}
                  onChange={handleAddAlumniChange}
                  name="isAdmin"
                  color="primary"
                />
              }
              label="Donner le statut administrateur à cet utilisateur"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Couleur (hex)"
              name="color"
              value={addAlumniForm.color}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Dégradé (gradient)"
              name="gradient"
              value={addAlumniForm.gradient}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nationalités (séparées par des virgules)"
              name="nationalities"
              value={addAlumniForm.nationalities || ""}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stages, entreprises, concours, extrascolaire (texte libre)"
              name="stagesWorkedContestsExtracurriculars"
              value={addAlumniForm.stagesWorkedContestsExtracurriculars || ""}
              onChange={handleAddAlumniChange}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Projets futurs (métiers, masters, écoles visés...)"
              name="futureGoals"
              value={addAlumniForm.futureGoals || ""}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Année de fin de L3 (4 chiffres)"
              name="anneeFinL3"
              value={addAlumniForm.anneeFinL3 || ""}
              onChange={handleAddAlumniChange}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 4, pattern: "\\d{4}" }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={() => setIsAddAlumniModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="contained">
                Créer
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Navbar;
