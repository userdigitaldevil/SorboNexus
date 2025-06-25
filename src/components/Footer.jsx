import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Email, LinkedIn, GitHub } from "@mui/icons-material";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Navigate first, then scroll to top after a short delay
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <Box
      component="footer"
      sx={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "center", md: "space-between" }}
            justifyContent="space-between"
            sx={{ mb: 3 }}
          >
            {/* Left: Slogan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: 1,
                  textAlign: { xs: "center", md: "left" },
                  fontSize: "0.875rem",
                }}
              >
                Connecter · Inspirer · Évoluer
              </Typography>
            </motion.div>

            {/* Center: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 3 }}
                alignItems="center"
                sx={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: 3,
                  px: 3,
                  py: 2,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    onClick={() => handleNavigation("/")}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b82f6";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Accueil
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    onClick={() => handleNavigation("/ressources")}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b82f6";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Ressources
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    onClick={() => handleNavigation("/alumnis")}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b82f6";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Alumnis
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    onClick={() => handleNavigation("/conseils")}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b82f6";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Conseils
                  </Box>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="mailto:sethaguila@icloud.com"
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      textDecoration: "none",
                      fontWeight: 500,
                      transition: "all 0.3s ease",
                      display: "block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b82f6";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Contact
                  </a>
                </motion.div>
              </Stack>
            </motion.div>

            {/* Right: Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Stack direction="row" spacing={2}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Box
                    component="a"
                    href="mailto:sethaguila@icloud.com"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      color: "rgba(255, 255, 255, 0.8)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 1,
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#3b82f6",
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Email />
                  </Box>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Box
                    component="a"
                    href="https://www.linkedin.com/in/sethaguila/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      color: "rgba(255, 255, 255, 0.8)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 1,
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#0077b5",
                        background: "rgba(0, 119, 181, 0.1)",
                        border: "1px solid rgba(0, 119, 181, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <LinkedIn />
                  </Box>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Box
                    component="a"
                    href="https://github.com/userdigitaldevil"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      color: "rgba(255, 255, 255, 0.8)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 1,
                      cursor: "pointer",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#3b82f6",
                        background: "rgba(59, 130, 246, 0.1)",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <GitHub />
                  </Box>
                </motion.div>
              </Stack>
            </motion.div>
          </Stack>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            style={{ textAlign: "center" }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 300,
                fontSize: "0.75rem",
                letterSpacing: 0.5,
              }}
            >
              © 2025 Seth Aguila - Développé avec &lt;3 pour la communauté
              Sorbonne Sciences Jussieu
            </Typography>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
