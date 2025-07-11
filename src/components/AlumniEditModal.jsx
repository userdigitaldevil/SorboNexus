import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SketchPicker } from "react-color";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function AlumniEditModal({
  open,
  onClose,
  alumni,
  setAlumni,
  isAdmin,
}) {
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");
  const [showFullConseil, setShowFullConseil] = useState(false);
  const conseilMaxLength = 180;
  const conseilIsLong = (editForm.conseil || "").length > conseilMaxLength;
  const conseilPreview =
    conseilIsLong && !showFullConseil
      ? (editForm.conseil || "").slice(0, conseilMaxLength) + "..."
      : editForm.conseil || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock scrolling when modal is open
  useEffect(() => {
    if (open) {
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
  }, [open]);

  useEffect(() => {
    if (alumni) {
      setEditForm({
        name: alumni.name || "",
        degree: alumni.degree || "",
        position: alumni.position || "",
        field: Array.isArray(alumni.field)
          ? alumni.field
          : alumni.field
          ? alumni.field
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        linkedin: alumni.linkedin || "",
        email: alumni.email || "",
        avatar: alumni.avatar || "",
        color: alumni.color || "",
        gradient: alumni.gradient || "",
        conseil: alumni.conseil || "",
        grades: Array.isArray(alumni.grades) ? alumni.grades : [],
        schoolsApplied: Array.isArray(alumni.schoolsApplied)
          ? alumni.schoolsApplied
          : [],
        isAdmin: alumni.isAdmin || false,
        hidden: alumni.hidden || false,
        nationalities: Array.isArray(alumni.nationalities)
          ? alumni.nationalities.join(", ")
          : alumni.nationalities || "",
        stagesWorkedContestsExtracurriculars:
          alumni.stagesWorkedContestsExtracurriculars || "",
        futureGoals: alumni.futureGoals || "",
        anneeFinL3: alumni.anneeFinL3 || "",
        username: alumni.username || "",
        newPassword: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
      });
    }
  }, [alumni]);

  // Grades/notes handlers
  const handleGradeChange = (idx, field, value) => {
    setEditForm((prev) => {
      const newGrades = [...(prev.grades || [])];
      newGrades[idx] = { ...newGrades[idx], [field]: value };
      return { ...prev, grades: newGrades };
    });
  };
  const handleAddGrade = () => {
    setEditForm((prev) => ({
      ...prev,
      grades: [...(prev.grades || []), { subject: "", value: "" }],
    }));
  };
  const handleRemoveGrade = (idx) => {
    setEditForm((prev) => {
      const newGrades = [...(prev.grades || [])];
      newGrades.splice(idx, 1);
      return { ...prev, grades: newGrades };
    });
  };
  // Schools handlers
  const handleSchoolChange = (idx, field, value) => {
    setEditForm((prev) => {
      const schools = [...(prev.schoolsApplied || [])];
      schools[idx] = { ...schools[idx], [field]: value };
      return { ...prev, schoolsApplied: schools };
    });
  };
  const handleAddSchool = () => {
    setEditForm((prev) => ({
      ...prev,
      schoolsApplied: [
        ...(prev.schoolsApplied || []),
        { name: "", status: "accepted" },
      ],
    }));
  };
  const handleRemoveSchool = (idx) => {
    setEditForm((prev) => {
      const schools = [...(prev.schoolsApplied || [])];
      schools.splice(idx, 1);
      return { ...prev, schoolsApplied: schools };
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setIsSubmitting(true);
    // Validate password change if provided
    if (editForm.newPassword || editForm.confirmPassword) {
      if (!editForm.newPassword) {
        setEditError("Veuillez saisir un nouveau mot de passe");
        return;
      }
      if (!editForm.confirmPassword) {
        setEditError("Veuillez confirmer le nouveau mot de passe");
        return;
      }
      if (editForm.newPassword !== editForm.confirmPassword) {
        setEditError("Les mots de passe ne correspondent pas");
        return;
      }
      if (editForm.newPassword.length < 8) {
        setEditError("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
    }
    // Build payload
    const stringFields = [
      "name",
      "degree",
      "position",
      "field",
      "linkedin",
      "email",
      "avatar",
      "color",
      "gradient",
      "conseil",
    ];
    const payload = {
      ...stringFields.reduce(
        (acc, key) => ({ ...acc, [key]: editForm[key] || "" }),
        {}
      ),
      field: Array.isArray(editForm.field)
        ? editForm.field.join(",")
        : editForm.field || "",
      isAdmin: !!editForm.isAdmin,
      hidden: !!editForm.hidden,
      nationalities: (editForm.nationalities || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stagesWorkedContestsExtracurriculars:
        editForm.stagesWorkedContestsExtracurriculars || "",
      futureGoals: editForm.futureGoals || "",
      anneeFinL3: editForm.anneeFinL3 || "",
      grades: (editForm.grades || []).map(({ subject, value }) => ({
        subject,
        value,
      })),
      schoolsApplied: (editForm.schoolsApplied || []).map(
        ({ name, status }) => ({ name, status })
      ),
      updatedAt: new Date(),
    };
    if (
      editForm.newPassword &&
      editForm.confirmPassword &&
      editForm.newPassword === editForm.confirmPassword
    ) {
      payload.newPassword = editForm.newPassword;
    }
    if (isAdmin && editForm.username) {
      payload.username = editForm.username;
    }
    // Send to backend
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/alumni/${alumni.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      setEditError("");
      setIsSubmitting(false);
      onClose();
      // Optionally, you can trigger a global refresh event here
      localStorage.setItem("profileUpdated", Date.now().toString());
      window.dispatchEvent(new Event("profileUpdated"));
    } else {
      const err = await response.json();
      setEditError(err.error || "Erreur lors de la mise à jour.");
      setIsSubmitting(false);
    }
  };

  if (open && (!alumni || !editForm.name)) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            bgcolor: "rgba(24,24,27,0.7)",
          }}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      </Modal>
    );
  }

  if (isSubmitting) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            bgcolor: "rgba(24,24,27,0.7)",
          }}
        >
          <CircularProgress color="secondary" size={60} />
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{ position: "relative", width: "100%", height: "100%" }}
        onClick={onClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            p: 5,
            borderRadius: 3,
            minWidth: 360,
            maxWidth: 480,
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            scrollBehavior: "smooth",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
              color: "rgba(255, 255, 255, 0.6)",
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              width: 40,
              height: 40,
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
          <form onSubmit={handleEditSubmit}>
            {/* Admins can edit username */}
            {isAdmin && (
              <TextField
                label="Nom d'utilisateur"
                name="username"
                value={editForm.username || ""}
                onChange={handleEditFormChange}
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
            )}
            <TextField
              label="Nom"
              name="name"
              value={editForm.name}
              onChange={handleEditFormChange}
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
              label="Diplôme"
              name="degree"
              value={editForm.degree}
              onChange={handleEditFormChange}
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
              label="Poste"
              name="position"
              value={editForm.position}
              onChange={handleEditFormChange}
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
                value={editForm.field || []}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, field: e.target.value }))
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
              >
                {DOMAINES.map((domaine) => (
                  <MenuItem
                    key={domaine}
                    value={domaine}
                    sx={
                      editForm.field && editForm.field.includes(domaine)
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
                    {editForm.field && editForm.field.includes(domaine) ? (
                      <span style={{ marginRight: 8, fontWeight: 600 }}>✓</span>
                    ) : null}
                    {domaine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="LinkedIn"
              name="linkedin"
              value={editForm.linkedin || ""}
              onChange={handleEditFormChange}
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
              label="Email"
              name="email"
              value={editForm.email || ""}
              onChange={handleEditFormChange}
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
            {/* Hide profile option for admin or self */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!editForm.hidden}
                  onChange={handleEditFormChange}
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
              label="Masquer ma carte (seuls les admins peuvent la voir)"
              sx={{
                mb: 3,
                "& .MuiFormControlLabel-label": {
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                },
              }}
            />
            <TextField
              label={
                <span>
                  Conseils/Retours/Témoignages/Messages{" "}
                  <span style={{ color: "#ef4444", fontWeight: 500 }}>
                    (important)
                  </span>
                </span>
              }
              name="conseil"
              value={
                showFullConseil || !conseilIsLong
                  ? editForm.conseil || ""
                  : conseilPreview
              }
              onChange={handleEditFormChange}
              fullWidth
              multiline
              minRows={3}
              sx={{
                mb: 1,
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
                    {showFullConseil ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                ) : null,
                readOnly: false,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#3b82f6",
                mb: 2,
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              Astuce : la syntaxe <b>Markdown</b> est supportée (listes, gras,
              italique, etc.)
            </Typography>
            <TextField
              label="Nationalités (séparées par des virgules)"
              name="nationalities"
              value={editForm.nationalities || ""}
              onChange={handleEditFormChange}
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
              value={editForm.stagesWorkedContestsExtracurriculars || ""}
              onChange={handleEditFormChange}
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
              value={editForm.futureGoals || ""}
              onChange={handleEditFormChange}
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
              value={editForm.anneeFinL3 || ""}
              onChange={handleEditFormChange}
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
            {/* Grades Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: "#fff",
                  letterSpacing: "0.02em",
                }}
              >
                Notes / Diplômes
              </Typography>
              {(editForm.grades || []).map((grade, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                  <TextField
                    label="Diplôme"
                    value={grade.subject || ""}
                    onChange={(e) =>
                      handleGradeChange(idx, "subject", e.target.value)
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
                  />
                  <TextField
                    label="Note"
                    value={grade.value || ""}
                    onChange={(e) =>
                      handleGradeChange(idx, "value", e.target.value)
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
                  />
                  <Button
                    onClick={() => handleRemoveGrade(idx)}
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
                onClick={handleAddGrade}
                size="small"
                sx={{
                  mt: 1,
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
                Ajouter un diplôme/note
              </Button>
            </Box>
            {/* Schools Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
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
              {(editForm.schoolsApplied || []).map((school, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <TextField
                      label={`École (rang ${idx + 1})`}
                      value={school.name || ""}
                      onChange={(e) =>
                        handleSchoolChange(idx, "name", e.target.value)
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
                    />
                    <TextField
                      select
                      label="Statut"
                      value={school.status || "accepted"}
                      onChange={(e) =>
                        handleSchoolChange(idx, "status", e.target.value)
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
                    >
                      <option value="accepted">Accepté</option>
                      <option value="rejected">Refusé</option>
                    </TextField>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                    <Button
                      onClick={() => handleRemoveSchool(idx)}
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
                          setEditForm((prev) => {
                            const schools = [...(prev.schoolsApplied || [])];
                            [schools[idx - 1], schools[idx]] = [
                              schools[idx],
                              schools[idx - 1],
                            ];
                            return { ...prev, schoolsApplied: schools };
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
                        if (idx < editForm.schoolsApplied.length - 1) {
                          setEditForm((prev) => {
                            const schools = [...(prev.schoolsApplied || [])];
                            [schools[idx], schools[idx + 1]] = [
                              schools[idx + 1],
                              schools[idx],
                            ];
                            return { ...prev, schoolsApplied: schools };
                          });
                        }
                      }}
                      size="small"
                      disabled={idx === editForm.schoolsApplied.length - 1}
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
                onClick={handleAddSchool}
                size="small"
                sx={{
                  mt: 1,
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
            </Box>
            {/* Password Change Section */}
            <Box
              sx={{
                mb: 3,
                p: 3,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2.5,
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  letterSpacing: "0.02em",
                }}
              >
                Changer le mot de passe
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.02em",
                }}
              >
                Laissez vide pour ne pas changer le mot de passe
              </Typography>
              <TextField
                label="Nouveau mot de passe"
                name="newPassword"
                type={editForm.showPassword ? "text" : "password"}
                value={editForm.newPassword}
                onChange={handleEditFormChange}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        edge="end"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          "&:hover": {
                            color: "#fff",
                          },
                        }}
                      >
                        {editForm.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Minimum 8 caractères, 1 majuscule, 1 chiffre, 1 symbole"
              />
              <TextField
                label="Confirmer le nouveau mot de passe"
                name="confirmPassword"
                type={editForm.showConfirmPassword ? "text" : "password"}
                value={editForm.confirmPassword}
                onChange={handleEditFormChange}
                fullWidth
                sx={{
                  mb: 1,
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
                    color: "#ef4444",
                    fontSize: "0.8rem",
                    fontWeight: 400,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        edge="end"
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          "&:hover": {
                            color: "#fff",
                          },
                        }}
                      >
                        {editForm.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  editForm.newPassword &&
                  editForm.confirmPassword &&
                  editForm.newPassword !== editForm.confirmPassword
                }
                helperText={
                  editForm.newPassword &&
                  editForm.confirmPassword &&
                  editForm.newPassword !== editForm.confirmPassword
                    ? "Les mots de passe ne correspondent pas"
                    : ""
                }
              />
            </Box>
            {/* Only admins can edit color, gradient, avatar, and admin status */}
            {isAdmin ? (
              <>
                <TextField
                  label="Avatar (lettres)"
                  name="avatar"
                  value={editForm.avatar}
                  onChange={handleEditFormChange}
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
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!editForm.color}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm((prev) => ({ ...prev, color: "" }));
                          } else {
                            setEditForm((prev) => ({
                              ...prev,
                              color: "#ff80ab",
                            })); // Default to a visible color when enabling
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
                    value={editForm.color || ""}
                    onChange={handleEditFormChange}
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
                    disabled={!editForm.color}
                    placeholder="#ff80ab"
                    InputProps={{
                      endAdornment: (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: editForm.color || "#eee",
                            borderRadius: "50%",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            ml: 1,
                          }}
                        />
                      ),
                    }}
                  />
                  {editForm.color && (
                    <Box sx={{ mt: 2 }}>
                      <SketchPicker
                        color={editForm.color}
                        onChange={(color) =>
                          setEditForm((prev) => ({ ...prev, color: color.hex }))
                        }
                        disableAlpha
                      />
                    </Box>
                  )}
                </Box>
                <TextField
                  label="Dégradé (gradient)"
                  name="gradient"
                  value={editForm.gradient}
                  onChange={handleEditFormChange}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!editForm.isAdmin}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
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
                  label="Donner le statut administrateur à cet utilisateur"
                  sx={{
                    mb: 3,
                    "& .MuiFormControlLabel-label": {
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    },
                  }}
                />
              </>
            ) : (
              <TextField
                label="Avatar (lettres) (modifiable uniquement par un admin)"
                name="avatar"
                value={editForm.avatar}
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
                InputProps={{ readOnly: true }}
              />
            )}
            {alumni && alumni.createdAt && (
              <TextField
                label="Date de création du compte"
                value={new Date(alumni.createdAt).toLocaleString("fr-FR")}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputBase-input": {
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.02em",
                  },
                }}
              />
            )}
            {editError && (
              <Typography
                color="error"
                sx={{
                  mb: 3,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {editError}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                onClick={onClose}
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
                Enregistrer
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
