import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Stack } from "@mui/material";
import { Email, LinkedIn, GitHub } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Box
        component="footer"
        sx={{
          background:
            "linear-gradient(135deg, rgba(24, 28, 38, 0.95) 0%, rgba(35, 40, 59, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          py: { xs: 4, md: 6 },
          color: "#fff",
          mt: 8,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
          },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 0 }}
            alignItems="center"
            justifyContent={{ xs: "center", md: "space-between" }}
            sx={{ width: "100%" }}
          >
            {/* Slogan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  width: { xs: "100%", md: 240 },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 300,
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    letterSpacing: "0.02em",
                    lineHeight: 1.4,
                  }}
                >
                  Connecter · Inspirer · Évoluer
                </Typography>
              </Box>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Stack
                direction={{ xs: "row", md: "row" }}
                spacing={3}
                alignItems="center"
                justifyContent="center"
                sx={{
                  flexGrow: 1,
                  flexWrap: { xs: "wrap", md: "nowrap" },
                  width: "100%",
                  maxWidth: "100vw",
                  overflowX: "auto",
                }}
              >
                {[
                  { label: "Accueil", path: "/" },
                  { label: "Ressources", path: "/ressources" },
                  { label: "Alumni", path: "/alumni" },
                  { label: "Conseils", path: "/conseils" },
                  { label: "Liens Utiles", path: "/liens-utiles" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        cursor: "pointer",
                        color: "rgba(255, 255, 255, 0.8)",
                        fontWeight: 400,
                        fontSize: { xs: "0.85rem", md: "0.95rem" },
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        textAlign: "center",
                        letterSpacing: "0.01em",
                        "&:hover": {
                          color: "#3b82f6",
                          background: "rgba(59, 130, 246, 0.1)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {item.label}
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: { xs: "100%", md: 240 },
                  justifyContent: { xs: "center", md: "flex-end" },
                  flexWrap: "wrap",
                  maxWidth: "100vw",
                  overflowX: "auto",
                  mt: { xs: 2, md: 0 },
                }}
              >
                {[
                  {
                    icon: <Email />,
                    href: "mailto:sethaguila@icloud.com",
                    hoverColor: "#3b82f6",
                  },
                  {
                    icon: <LinkedIn />,
                    href: "https://www.linkedin.com/in/sethaguila/",
                    hoverColor: "#0077b5",
                  },
                  {
                    icon: <GitHub />,
                    href: "https://github.com/userdigitaldevil",
                    hoverColor: "#3b82f6",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                          p: 1.5,
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          "&:hover": {
                            color: social.hoverColor,
                            background: "rgba(255, 255, 255, 0.1)",
                            borderColor: social.hoverColor,
                            transform: "translateY(-2px)",
                          },
                          "& svg": {
                            fontSize: { xs: "1.3rem", md: "1.4rem" },
                          },
                        }}
                      >
                        {social.icon}
                      </Box>
                    </a>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Stack>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: 300,
                  display: "block",
                  mb: 2,
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                }}
              >
                <strong
                  style={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Réglementation :
                </strong>{" "}
                Ce site respecte la réglementation en vigueur concernant la
                protection des données personnelles (RGPD) et la propriété
                intellectuelle. Les informations partagées ici sont destinées à
                la communauté étudiante et alumni, dans un cadre non commercial
                et éducatif.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: 300,
                  display: "block",
                  mb: 2,
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                }}
              >
                <strong
                  style={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Politiques d'utilisation :
                </strong>{" "}
                L'utilisation de SorboNexus implique le respect de la
                bienveillance, de l'entraide et de la confidentialité. Toute
                utilisation abusive, spam, ou publication de contenu inapproprié
                entraînera la suppression du compte ou des messages concernés.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.6)",
                  fontWeight: 300,
                  display: "block",
                  mb: 2,
                  fontStyle: "italic",
                  fontSize: { xs: "0.75rem", md: "0.8rem" },
                  lineHeight: 1.6,
                  letterSpacing: "0.01em",
                }}
              >
                <strong
                  style={{ fontWeight: 500, color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Disclaimer :
                </strong>{" "}
                Ce site n'est pas un site officiel de Sorbonne Université et
                n'est ni affilié ni validé par l'établissement. Il s'agit d'une
                initiative indépendante à but non lucratif.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Link
                  to="/terms"
                  style={{
                    color: "#3b82f6",
                    marginRight: 16,
                    textDecoration: "none",
                    fontSize: "0.85em",
                    fontWeight: 400,
                    transition: "all 0.2s ease",
                  }}
                >
                  Terms of Use
                </Link>
                <Link
                  to="/privacy"
                  style={{
                    color: "#3b82f6",
                    textDecoration: "none",
                    fontSize: "0.85em",
                    fontWeight: 400,
                    transition: "all 0.2s ease",
                  }}
                >
                  Privacy Policy
                </Link>
              </Box>
            </Box>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 300,
                fontSize: { xs: "0.8rem", md: "0.85rem" },
                letterSpacing: "0.02em",
                textAlign: "center",
                display: "block",
                mt: 4,
                lineHeight: 1.4,
              }}
            >
              © 2025 Seth Aguila - Développé avec &lt;3 pour la communauté
              Sorbonne Sciences Jussieu
            </Typography>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
}
