import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Grid,
  Card,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Microsoft,
  Login,
  School,
  Security,
  Person,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

// Admin credentials from environment
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function Connexion() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]:
        field === "rememberMe" ? event.target.checked : event.target.value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'identifiant est requis";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call backend for login
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.user.isAdmin ? "true" : "false");
        window.location.href = "/";
      } else {
        setErrors({ password: data.error || "Identifiants invalides" });
      }
    } catch (err) {
      setErrors({ password: "Erreur de connexion au serveur" });
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div
      className="glassy-bg min-h-screen"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
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
        <Security size={24} />
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
        <School size={20} />
      </motion.div>

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 4,
              p: { xs: 3, sm: 5 },
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              transition: "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                opacity: 0.8,
              },
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 5 }}>
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
                    margin: "0 auto 20px",
                    color: "white",
                    fontSize: "2rem",
                    boxShadow: "0 4px 24px rgba(59,130,246,0.18)",
                  }}
                >
                  <Person />
                </Box>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "2rem", sm: "2.3rem" },
                    lineHeight: 1.15,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <span style={{ display: "block", fontWeight: 300 }}>
                    Connexion à
                  </span>
                  <span style={{ display: "block", fontWeight: 600 }}>
                    SorboNexus
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.75)",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    lineHeight: 1.5,
                  }}
                >
                  Accédez à votre espace étudiant
                </Typography>
              </motion.div>
            </Box>

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Identifiant"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="Votre identifiant"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 2.5,
                      color: "white",
                      fontWeight: 400,
                      fontSize: { xs: "1rem", sm: "1.05rem" },
                      letterSpacing: "0.01em",
                      transition: "border 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        border: "1px solid rgba(59, 130, 246, 0.18)",
                      },
                      "&.Mui-focused": {
                        border: "1.5px solid #3b82f6",
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.13)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontWeight: 400,
                      fontSize: { xs: "1rem", sm: "1.05rem" },
                      letterSpacing: "0.01em",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={!!errors.password}
                  helperText={errors.password}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "rgba(255, 255, 255, 0.5)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 2.5,
                      color: "white",
                      fontWeight: 400,
                      fontSize: { xs: "1rem", sm: "1.05rem" },
                      letterSpacing: "0.01em",
                      transition: "border 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        border: "1px solid rgba(59, 130, 246, 0.18)",
                      },
                      "&.Mui-focused": {
                        border: "1.5px solid #3b82f6",
                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.13)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      "&.Mui-focused": {
                        color: "#3b82f6",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontWeight: 400,
                      fontSize: { xs: "1rem", sm: "1.05rem" },
                      letterSpacing: "0.01em",
                      "&::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 1.5,
                  }}
                >
                  <Link
                    component="button"
                    variant="body2"
                    sx={{
                      color: "#3b82f6",
                      textDecoration: "none",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      "&:hover": {
                        color: "#1e40af",
                      },
                    }}
                  >
                    Mot de passe oublié?
                  </Link>
                </Box>
              </Box>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ marginTop: "8px" }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={<Login />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2.5,
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    letterSpacing: "0.01em",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.13)",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.18)",
                    },
                  }}
                >
                  Se connecter
                </Button>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  Si vous voulez créer un compte, envoyez un message à{" "}
                  <b>sethaguila@icloud.com</b> ou contactez <b>Seth Aguila</b>{" "}
                  sur LinkedIn.
                </Typography>
              </Box>
            </motion.div>
          </Card>
        </motion.div>

        {/* Terms and Privacy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              En vous connectant, vous acceptez nos{" "}
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1e40af",
                  },
                }}
              >
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#1e40af",
                  },
                }}
              >
                Politique de confidentialité
              </Link>
              .
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
}
