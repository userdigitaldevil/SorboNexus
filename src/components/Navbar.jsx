import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  // Admin edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    degree: "",
    position: "",
    field: "",
    email: "",
    linkedin: "",
    avatar: "",
    conseil: "",
    profile: { grades: {}, currentPosition: "", schoolsApplied: [] },
  });

  // Fetch admin data from database
  useEffect(() => {
    if (isAdmin) {
      fetch("http://localhost:5001/api/alumni")
        .then((res) => res.json())
        .then((data) => {
          const admin = data.find((a) => a.isAdmin);
          if (admin) {
            setAdminAlumni(admin);
            setEditData({
              ...admin,
              profile: {
                ...admin.profile,
                grades: { ...admin.profile.grades },
                schoolsApplied: [...admin.profile.schoolsApplied],
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
        });
    }
  }, [isAdmin]);

  const handleEditCard = () => {
    handleProfileClose();
    setIsEditModalOpen(true);
  };
  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };
  const handleProfileChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };
  const handleGradeChange = (gradeKey, value) => {
    setEditData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        grades: { ...prev.profile.grades, [gradeKey]: value },
      },
    }));
  };
  const handleSchoolChange = (idx, field, value) => {
    setEditData((prev) => {
      const schools = [...prev.profile.schoolsApplied];
      schools[idx] = { ...schools[idx], [field]: value };
      return { ...prev, profile: { ...prev.profile, schoolsApplied: schools } };
    });
  };
  const handleAddGrade = () => {
    setEditData((prev) => {
      const grades = { ...prev.profile.grades, "": "" };
      return { ...prev, profile: { ...prev.profile, grades } };
    });
  };
  const handleRemoveGrade = (gradeKey) => {
    setEditData((prev) => {
      const grades = { ...prev.profile.grades };
      delete grades[gradeKey];
      return { ...prev, profile: { ...prev.profile, grades } };
    });
  };
  const handleAddSchool = () => {
    setEditData((prev) => {
      const schools = [
        ...prev.profile.schoolsApplied,
        { name: "", status: "accepted" },
      ];
      return { ...prev, profile: { ...prev.profile, schoolsApplied: schools } };
    });
  };
  const handleRemoveSchool = (idx) => {
    setEditData((prev) => {
      const schools = [...prev.profile.schoolsApplied];
      schools.splice(idx, 1);
      return { ...prev, profile: { ...prev.profile, schoolsApplied: schools } };
    });
  };
  const handleEditModalClose = () => setIsEditModalOpen(false);

  const handleEditSave = async () => {
    if (!adminAlumni) return;

    try {
      const avatar = editData.name ? editData.name[0].toUpperCase() : "";
      const formToSend = {
        ...editData,
        avatar,
      };
      delete formToSend.color;
      delete formToSend.gradient;
      delete formToSend.isAdmin;

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5001/api/alumni/${adminAlumni._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formToSend),
        }
      );

      if (res.ok) {
        setIsEditModalOpen(false);
        // Refresh admin data
        const updatedRes = await fetch("http://localhost:5001/api/alumni");
        const updatedData = await updatedRes.json();
        const updatedAdmin = updatedData.find((a) => a.isAdmin);
        if (updatedAdmin) {
          setAdminAlumni(updatedAdmin);
        }
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

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

  // Add state for modals and edit form for alumni user
  const [isAlumniProfileModalOpen, setIsAlumniProfileModalOpen] =
    useState(false);
  const [isAlumniEditModalOpen, setIsAlumniEditModalOpen] = useState(false);
  const [alumniEditForm, setAlumniEditForm] = useState(null);

  // Open edit modal with alumniUser data
  const handleAlumniEditClick = () => {
    setAlumniEditForm({
      name: alumniUser.name || "",
      degree: alumniUser.degree || "",
      position: alumniUser.position || "",
      field: alumniUser.field || "",
      email: alumniUser.email || "",
      avatar: alumniUser.avatar || "",
      color: alumniUser.color || "",
      gradient: alumniUser.gradient || "",
      conseil: alumniUser.conseil || "",
      profile: {
        email: alumniUser.profile?.email || "",
        linkedin: alumniUser.profile?.linkedin || "",
        currentPosition: alumniUser.profile?.currentPosition || "",
        grades: alumniUser.profile?.grades || {},
        schoolsApplied: alumniUser.profile?.schoolsApplied || [],
      },
      isAdmin: alumniUser.isAdmin || false,
    });
    setIsAlumniEditModalOpen(true);
    handleProfileClose();
  };
  const handleAlumniEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("profile.")) {
      const key = name.split(".")[1];
      setAlumniEditForm((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: value,
        },
      }));
    } else {
      setAlumniEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Grades/schools helpers (same as Alumnis.jsx)
  const handleAlumniGradeChange = (key, value) => {
    setAlumniEditForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        grades: { ...prev.profile.grades, [key]: value },
      },
    }));
  };
  const handleAlumniAddGrade = () => {
    setAlumniEditForm((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        grades: { ...prev.profile.grades, "": "" },
      },
    }));
  };
  const handleAlumniRemoveGrade = (key) => {
    setAlumniEditForm((prev) => {
      const grades = { ...prev.profile.grades };
      delete grades[key];
      return {
        ...prev,
        profile: { ...prev.profile, grades: grades },
      };
    });
  };
  const handleAlumniSchoolChange = (idx, field, value) => {
    setAlumniEditForm((prev) => {
      const schools = [...(prev.profile.schoolsApplied || [])];
      schools[idx] = { ...schools[idx], [field]: value };
      return {
        ...prev,
        profile: { ...prev.profile, schoolsApplied: schools },
      };
    });
  };
  const handleAlumniAddSchool = () => {
    setAlumniEditForm((prev) => ({
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
  const handleAlumniRemoveSchool = (idx) => {
    setAlumniEditForm((prev) => {
      const schools = [...(prev.profile.schoolsApplied || [])];
      schools.splice(idx, 1);
      return {
        ...prev,
        profile: { ...prev.profile, schoolsApplied: schools },
      };
    });
  };
  // Submit edit
  const handleAlumniEditSubmit = async (e) => {
    e.preventDefault();
    // Auto-generate avatar from name
    const avatar = alumniEditForm.name
      ? alumniEditForm.name[0].toUpperCase()
      : "";
    const formToSend = {
      ...alumniEditForm,
      avatar,
    };
    delete formToSend.color;
    delete formToSend.gradient;
    delete formToSend.isAdmin;
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:5001/api/alumni/${alumniUser._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formToSend),
      }
    );
    if (res.ok) {
      setIsAlumniEditModalOpen(false);
      // Optionally, refresh alumniUser data here
      fetch(`http://localhost:5001/api/alumni/${alumniUser._id}`)
        .then((res) => res.json())
        .then((data) => setAlumniUser(data));
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  // Helper for conseil links/formatting (reuse from Alumnis.jsx if needed)
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
              <MenuItem onClick={handleEditCard}>Modifier ma carte</MenuItem>
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
              <MenuItem onClick={handleAlumniEditClick}>
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
                    <MenuItem onClick={handleEditCard}>
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
                      <MenuItem onClick={handleAlumniEditClick}>
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

      {/* Admin Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
      >
        <Box
          sx={{
            minWidth: 400,
            width: "100%",
            maxWidth: 540,
            maxHeight: "90vh",
            bgcolor: "rgba(30, 41, 59, 0.95)",
            borderRadius: 4,
            boxShadow: "0 0 40px 10px #3b82f6, 0 0 80px 20px #8b5cf6",
            border: "2.5px solid #fff",
            p: 4,
            position: "relative",
            backdropFilter: "blur(24px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "#fff",
              textAlign: "center",
              letterSpacing: 1.5,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: "0 2px 24px 2px #fff6",
              fontFamily: "monospace",
            }}
          >
            Modifier ma carte
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nom"
              value={editData?.name || ""}
              onChange={(e) => handleEditChange("name", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Diplôme"
              value={editData?.degree || ""}
              onChange={(e) => handleEditChange("degree", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Poste actuel"
              value={editData?.position || ""}
              onChange={(e) => handleEditChange("position", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Domaine"
              value={editData?.field || ""}
              onChange={(e) => handleEditChange("field", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Email"
              value={editData?.email || ""}
              onChange={(e) => handleEditChange("email", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="LinkedIn"
              value={editData?.linkedin || ""}
              onChange={(e) => handleEditChange("linkedin", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Avatar"
              value={editData?.avatar || ""}
              onChange={(e) => handleEditChange("avatar", e.target.value)}
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            <TextField
              label="Conseil"
              value={editData?.conseil || ""}
              onChange={(e) => handleEditChange("conseil", e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={2}
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            {/* Grades */}
            <Typography variant="subtitle1" sx={{ color: "#3b82f6", mt: 2 }}>
              Notes/Diplômes
            </Typography>
            {editData?.profile?.grades &&
              Object.entries(editData.profile.grades).map(
                ([key, value], idx) => (
                  <Box
                    key={key + idx}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <TextField
                      label="Diplôme"
                      value={
                        editingGradeKeys[key] !== undefined
                          ? editingGradeKeys[key]
                          : key
                      }
                      onChange={(e) =>
                        handleGradeKeyChange(key, e.target.value)
                      }
                      onBlur={() => handleGradeKeyBlur(key)}
                      size="small"
                      sx={{
                        input: { color: "#fff" },
                        label: { color: "#3b82f6" },
                      }}
                    />
                    <TextField
                      label="Note"
                      value={value}
                      onChange={(e) => {
                        // Only allow integers 0-20
                        let val = e.target.value.replace(/[^0-9]/g, "");
                        if (val !== "") {
                          let intVal = Math.min(20, Math.max(0, parseInt(val)));
                          val = intVal.toString();
                        }
                        handleGradeChange(key, val);
                      }}
                      size="small"
                      sx={{
                        input: { color: "#fff" },
                        label: { color: "#3b82f6" },
                      }}
                      InputProps={{
                        endAdornment: (
                          <span style={{ color: "#888", marginLeft: 4 }}>
                            /20
                          </span>
                        ),
                        inputProps: {
                          min: 0,
                          max: 20,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        },
                      }}
                    />
                    <Button
                      onClick={() => handleRemoveGrade(key)}
                      size="small"
                      color="error"
                    >
                      Supprimer
                    </Button>
                  </Box>
                )
              )}
            <Button
              onClick={handleAddGrade}
              size="small"
              color="primary"
              sx={{ mb: 2 }}
            >
              Ajouter un diplôme
            </Button>
            {/* Current Position */}
            <TextField
              label="Poste actuel (détail)"
              value={editData?.profile?.currentPosition || ""}
              onChange={(e) =>
                handleProfileChange("currentPosition", e.target.value)
              }
              fullWidth
              size="small"
              sx={{ input: { color: "#fff" }, label: { color: "#3b82f6" } }}
            />
            {/* Schools Applied */}
            <Typography variant="subtitle1" sx={{ color: "#3b82f6", mt: 2 }}>
              Écoles postulées
            </Typography>
            {editData?.profile?.schoolsApplied &&
              editData.profile.schoolsApplied.map((school, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <TextField
                    label="École"
                    value={school.name}
                    onChange={(e) =>
                      handleSchoolChange(idx, "name", e.target.value)
                    }
                    size="small"
                    sx={{
                      input: { color: "#fff" },
                      label: { color: "#3b82f6" },
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel sx={{ color: "#3b82f6" }}>Statut</InputLabel>
                    <Select
                      value={school.status}
                      label="Statut"
                      onChange={(e) =>
                        handleSchoolChange(idx, "status", e.target.value)
                      }
                      sx={{ color: "#fff" }}
                    >
                      <MenuItem value="accepted">Accepté</MenuItem>
                      <MenuItem value="rejected">Refusé</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    onClick={() => handleRemoveSchool(idx)}
                    size="small"
                    color="error"
                  >
                    Supprimer
                  </Button>
                </Box>
              ))}
            <Button
              onClick={handleAddSchool}
              size="small"
              color="primary"
              sx={{ mb: 2 }}
            >
              Ajouter une école
            </Button>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              onClick={handleEditModalClose}
              color="secondary"
              variant="outlined"
            >
              Annuler
            </Button>
            <Button
              onClick={handleEditSave}
              color="primary"
              variant="contained"
            >
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Modal>

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
            <Card sx={{ bgcolor: "#18181b", borderRadius: 2, boxShadow: 8 }}>
              <CardContent>
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      background: alumniUser.color || "#3b82f6",
                      fontWeight: 700,
                      fontSize: "2rem",
                      mr: 3,
                    }}
                  >
                    {alumniUser.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "white", mb: 1 }}
                    >
                      {alumniUser.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#3b82f6", fontWeight: 600 }}
                    >
                      {alumniUser.position}
                    </Typography>
                  </Box>
                </Box>
                <Divider
                  sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.1)" }}
                />
                {/* Contact */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600, mb: 2 }}
                  >
                    Contact
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      startIcon={<EmailIcon />}
                      href={`mailto:${alumniUser.profile?.email}`}
                      sx={{
                        color: "#3b82f6",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        "&:hover": {
                          background: "rgba(59, 130, 246, 0.1)",
                          border: "1px solid #3b82f6",
                        },
                      }}
                    >
                      Email
                    </Button>
                    <Button
                      startIcon={<LinkedInIcon />}
                      href={alumniUser.profile?.linkedin}
                      target="_blank"
                      sx={{
                        color: "#0077b5",
                        border: "1px solid rgba(0, 119, 181, 0.3)",
                        "&:hover": {
                          background: "rgba(0, 119, 181, 0.1)",
                          border: "1px solid #0077b5",
                        },
                      }}
                    >
                      LinkedIn
                    </Button>
                  </Box>
                </Box>
                {/* Current Position */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600, mb: 2 }}
                  >
                    Poste actuel
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BusinessIcon sx={{ color: "#3b82f6" }} />
                    <Typography
                      variant="body1"
                      sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      {alumniUser.profile?.currentPosition}
                    </Typography>
                  </Box>
                </Box>
                {/* Grades */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600, mb: 2 }}
                  >
                    Notes obtenues
                  </Typography>
                  <List dense>
                    {Object.entries(alumniUser.profile?.grades || {}).map(
                      ([program, grade]) => (
                        <ListItem key={program} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <GradeIcon sx={{ color: "#3b82f6" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={program}
                            secondary={grade}
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: { color: "#3b82f6", fontWeight: 600 },
                            }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
                {/* Schools Applied */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600, mb: 2 }}
                  >
                    Écoles demandées
                  </Typography>
                  <List dense>
                    {(alumniUser.profile?.schoolsApplied || []).map(
                      (school) => (
                        <ListItem key={school.name} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {school.status === "accepted" ? (
                              <CheckCircleOutlineIcon
                                sx={{ color: "#10b981" }}
                              />
                            ) : (
                              <CancelIcon sx={{ color: "#ef4444" }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={school.name}
                            secondary={
                              school.status === "accepted"
                                ? "Accepté"
                                : "Refusé"
                            }
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color:
                                  school.status === "accepted"
                                    ? "#10b981"
                                    : "#ef4444",
                                fontWeight: 600,
                              },
                            }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </Box>
                {/* Conseil */}
                {alumniUser.conseil && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: 600, mb: 2 }}
                    >
                      Conseil de cet alumni
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255, 255, 255, 0.85)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {renderConseilWithLinks(alumniUser.conseil)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button onClick={() => setIsAlumniProfileModalOpen(false)}>
                    Fermer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <></>
        )}
      </Modal>

      {/* Alumni Edit Modal */}
      <Modal
        open={isAlumniEditModalOpen}
        onClose={() => setIsAlumniEditModalOpen(false)}
      >
        {alumniEditForm ? (
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
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Modifier ma carte
            </Typography>
            <form onSubmit={handleAlumniEditSubmit}>
              <TextField
                label="Nom"
                name="name"
                value={alumniEditForm.name}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Diplôme"
                name="degree"
                value={alumniEditForm.degree}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Poste"
                name="position"
                value={alumniEditForm.position}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Domaine"
                name="field"
                value={alumniEditForm.field}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="LinkedIn"
                name="profile.linkedin"
                value={alumniEditForm.profile?.linkedin || ""}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={alumniEditForm.email || ""}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Profile Email"
                name="profile.email"
                value={alumniEditForm.profile?.email || ""}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Profile Poste Actuel"
                name="profile.currentPosition"
                value={alumniEditForm.profile?.currentPosition || ""}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* Grades Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Notes / Diplômes</Typography>
                {Object.entries(alumniEditForm.profile?.grades || {}).map(
                  ([key, value], idx) => (
                    <Box
                      key={key + idx}
                      sx={{ display: "flex", gap: 1, mb: 1 }}
                    >
                      <TextField
                        label="Diplôme"
                        value={
                          alumniEditingGradeKeys[key] !== undefined
                            ? alumniEditingGradeKeys[key]
                            : key
                        }
                        onChange={(e) =>
                          handleAlumniGradeKeyChange(key, e.target.value)
                        }
                        onBlur={() => handleAlumniGradeKeyBlur(key)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Note"
                        value={value}
                        onChange={(e) => {
                          // Only allow integers 0-20
                          let val = e.target.value.replace(/[^0-9]/g, "");
                          if (val !== "") {
                            let intVal = Math.min(
                              20,
                              Math.max(0, parseInt(val))
                            );
                            val = intVal.toString();
                          }
                          handleAlumniGradeChange(key, val);
                        }}
                        size="small"
                        sx={{ flex: 1 }}
                        InputProps={{
                          endAdornment: (
                            <span style={{ color: "#888", marginLeft: 4 }}>
                              /20
                            </span>
                          ),
                          inputProps: {
                            min: 0,
                            max: 20,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                          },
                        }}
                      />
                      <Button
                        onClick={() => handleAlumniRemoveGrade(key)}
                        color="error"
                        size="small"
                      >
                        Supprimer
                      </Button>
                    </Box>
                  )
                )}
                <Button
                  onClick={handleAlumniAddGrade}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Ajouter un diplôme/note
                </Button>
              </Box>
              {/* Schools Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Écoles demandées</Typography>
                {(alumniEditForm.profile?.schoolsApplied || []).map(
                  (school, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        label="École"
                        value={school.name}
                        onChange={(e) =>
                          handleAlumniSchoolChange(idx, "name", e.target.value)
                        }
                        size="small"
                        sx={{ flex: 2 }}
                      />
                      <TextField
                        select
                        label="Statut"
                        value={school.status}
                        onChange={(e) =>
                          handleAlumniSchoolChange(
                            idx,
                            "status",
                            e.target.value
                          )
                        }
                        size="small"
                        sx={{ flex: 1 }}
                        SelectProps={{ native: true }}
                      >
                        <option value="accepted">Accepté</option>
                        <option value="rejected">Refusé</option>
                      </TextField>
                      <Button
                        onClick={() => handleAlumniRemoveSchool(idx)}
                        color="error"
                        size="small"
                      >
                        Supprimer
                      </Button>
                    </Box>
                  )
                )}
                <Button
                  onClick={handleAlumniAddSchool}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Ajouter une école
                </Button>
              </Box>
              <TextField
                label="Conseil"
                name="conseil"
                value={alumniEditForm.conseil || ""}
                onChange={handleAlumniEditFormChange}
                fullWidth
                sx={{ mb: 2 }}
                multiline
                minRows={4}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button onClick={() => setIsAlumniEditModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" variant="contained">
                  Enregistrer
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <></>
        )}
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
