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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function AlumniEditModal({
  open,
  onClose,
  alumni,
  setAlumni,
  isAdmin,
}) {
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (alumni) {
      setEditForm({
        name: alumni.name || "",
        degree: alumni.degree || "",
        position: alumni.position || "",
        field: alumni.field || "",
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
      `${process.env.VITE_API_URL}/api/alumni/${alumni.id}`,
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
      onClose();
      // Optionally, you can trigger a global refresh event here
      localStorage.setItem("profileUpdated", Date.now().toString());
      window.dispatchEvent(new Event("profileUpdated"));
    } else {
      const err = await response.json();
      setEditError(err.error || "Erreur lors de la mise à jour.");
    }
  };

  if (!alumni) return null;

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
            bgcolor: "#18181b",
            p: 4,
            borderRadius: 2,
            minWidth: 320,
            maxWidth: 420,
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: 24,
            scrollBehavior: "smooth",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              width: 36,
              height: 36,
              "&:hover": {
                color: "#fff",
                background: "rgba(0, 0, 0, 0.5)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: "1.2rem" }} />
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
                sx={{ mb: 2 }}
              />
            )}
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
              name="linkedin"
              value={editForm.linkedin || ""}
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
            {/* Hide profile option for admin or self */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!editForm.hidden}
                  onChange={handleEditFormChange}
                  name="hidden"
                  color="primary"
                />
              }
              label="Masquer ma carte (seuls les admins peuvent la voir)"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Conseil"
              name="conseil"
              value={editForm.conseil || ""}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nationalités (séparées par des virgules)"
              name="nationalities"
              value={editForm.nationalities || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Stages, entreprises, concours, extrascolaire (texte libre)"
              name="stagesWorkedContestsExtracurriculars"
              value={editForm.stagesWorkedContestsExtracurriculars || ""}
              onChange={handleEditFormChange}
              fullWidth
              multiline
              minRows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Projets futurs (métiers, masters, écoles visés...)"
              name="futureGoals"
              value={editForm.futureGoals || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Année de fin de L3 (4 chiffres)"
              name="anneeFinL3"
              value={editForm.anneeFinL3 || ""}
              onChange={handleEditFormChange}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 4, pattern: "\\d{4}" }}
            />
            {/* Grades Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Notes / Diplômes</Typography>
              {(editForm.grades || []).map((grade, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="Diplôme"
                    value={grade.subject || ""}
                    onChange={(e) =>
                      handleGradeChange(idx, "subject", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Note"
                    value={grade.value || ""}
                    onChange={(e) =>
                      handleGradeChange(idx, "value", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    onClick={() => handleRemoveGrade(idx)}
                    color="error"
                    size="small"
                  >
                    Supprimer
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddGrade} size="small" sx={{ mt: 1 }}>
                Ajouter un diplôme/note
              </Button>
            </Box>
            {/* Schools Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Écoles demandées</Typography>
              {(editForm.schoolsApplied || []).map((school, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="École"
                    value={school.name || ""}
                    onChange={(e) =>
                      handleSchoolChange(idx, "name", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    select
                    label="Statut"
                    value={school.status || "accepted"}
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
              ))}
              <Button onClick={handleAddSchool} size="small" sx={{ mt: 1 }}>
                Ajouter une école
              </Button>
            </Box>
            {/* Password Change Section */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, color: "#3b82f6", fontWeight: 600 }}
              >
                Changer le mot de passe
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "rgba(255, 255, 255, 0.7)" }}
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
                sx={{ mb: 2 }}
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
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
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
                sx={{ mb: 1 }}
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
                        sx={{ color: "rgba(255, 255, 255, 0.5)" }}
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
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Couleur (hex)"
                  name="color"
                  value={editForm.color}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Dégradé (gradient)"
                  name="gradient"
                  value={editForm.gradient}
                  onChange={handleEditFormChange}
                  fullWidth
                  sx={{ mb: 2 }}
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
                    />
                  }
                  label="Donner le statut administrateur à cet utilisateur"
                  sx={{ mb: 2 }}
                />
              </>
            ) : (
              <TextField
                label="Avatar (lettres) (modifiable uniquement par un admin)"
                name="avatar"
                value={editForm.avatar}
                fullWidth
                sx={{ mb: 2 }}
                InputProps={{ readOnly: true }}
              />
            )}
            {alumni && alumni.createdAt && (
              <TextField
                label="Date de création du compte"
                value={new Date(alumni.createdAt).toLocaleString("fr-FR")}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            )}
            {editError && (
              <Typography color="error" sx={{ mb: 2 }}>
                {editError}
              </Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={onClose}>Annuler</Button>
              <Button type="submit" variant="contained">
                Enregistrer
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}
