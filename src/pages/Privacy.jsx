import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="glassy-bg min-h-screen smooth-scroll-all">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
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
                  mb: { xs: 2, md: 3 },
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
                Politique de Confidentialité
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
                SorboNexus s'engage à protéger votre vie privée. Cette politique
                explique comment nous traitons vos données conformément au RGPD
                et à la loi française.
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </motion.section>

      {/* Content Section */}
      <motion.section
        className="py-12 px-4 z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 4,
              p: { xs: 3, md: 5 },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 4,
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.6)",
                fontWeight: 400,
                fontSize: { xs: "0.9rem", md: "1rem" },
                letterSpacing: "0.02em",
              }}
            >
              Dernière mise à jour : Juillet 2024
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              SorboNexus s'engage à protéger votre vie privée. Cette politique
              explique comment nous traitons vos données lorsque vous utilisez
              notre site, conformément au Règlement Général sur la Protection
              des Données (RGPD) et à la loi française.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              1. Responsable du Traitement
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Le responsable du traitement des données pour SorboNexus est Seth
              Aguila (sethaguila@icloud.com), basé en France.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              2. Aucun Cookie ou Suivi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              SorboNexus n'utilise pas de cookies pour le suivi, l'analyse ou la
              publicité. Nous n'utilisons pas de traceurs tiers ou de réseaux
              publicitaires.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              3. Authentification et Stockage Local
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Les tokens d'authentification sont stockés dans le localStorage de
              votre navigateur pour vous maintenir connecté. Aucune information
              sensible n'est stockée dans le localStorage au-delà de ce qui est
              nécessaire pour l'authentification.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              4. Données que Vous Fournissez
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Lorsque vous créez ou mettez à jour votre profil alumni, vous
              fournissez des informations telles que votre nom, diplôme, email
              et détails professionnels. Ces informations ne sont utilisées que
              pour afficher votre profil aux autres utilisateurs et ne sont pas
              partagées avec des tiers.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              5. Base Légale du Traitement
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              La base légale du traitement de vos données est votre consentement
              et l'intérêt légitime de fournir une plateforme communautaire pour
              les alumni et les étudiants.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              6. Droits des Personnes Concernées (RGPD)
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Conformément au RGPD, vous avez le droit d'accéder, de rectifier,
              d'effacer, de restreindre ou de vous opposer au traitement de vos
              données personnelles. Vous pouvez également demander une copie de
              vos données ou retirer votre consentement à tout moment. Pour
              exercer ces droits, contactez sethaguila@icloud.com.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              7. Sécurité des Données
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Nous prenons des mesures raisonnables pour protéger vos données,
              mais aucun site web ne peut garantir une sécurité absolue.
              Veuillez utiliser un mot de passe fort et ne pas partager vos
              identifiants de connexion.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              8. Conservation des Données
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Vos données sont conservées uniquement le temps nécessaire pour
              fournir le service ou selon les exigences légales. Vous pouvez
              demander la suppression de votre profil à tout moment.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              9. Transferts Internationaux de Données
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Vos données sont stockées dans l'Union Européenne. Nous ne
              transférons pas vos données en dehors de l'UE.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              10. Site Non Officiel de Sorbonne Université
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              SorboNexus est une plateforme indépendante et non officielle et
              n'est pas affiliée à ou approuvée par Sorbonne Université.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              11. Modifications de Cette Politique
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Cette politique peut être mise à jour à tout moment. L'utilisation
              continue du site constitue l'acceptation de la nouvelle politique.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mt: 5,
                mb: 2,
                color: "#3b82f6",
                fontSize: { xs: "1.2rem", md: "1.4rem" },
                letterSpacing: "-0.01em",
              }}
            >
              12. Contact
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Pour toute question ou demande concernant vos données, contactez :
              sethaguila@icloud.com
            </Typography>
          </Box>
        </Container>
      </motion.section>
    </div>
  );
}
