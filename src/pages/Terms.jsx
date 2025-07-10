import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Terms() {
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
                Conditions d'Utilisation
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
                Bienvenue sur SorboNexus. En accédant et en utilisant ce site,
                vous acceptez de vous conformer à ces Conditions d'Utilisation.
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
              Bienvenue sur SorboNexus. En accédant et en utilisant ce site,
              vous acceptez de vous conformer à ces Conditions d'Utilisation. Si
              vous n'êtes pas d'accord, veuillez ne pas utiliser le site.
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
              1. Nature du Site
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
              SorboNexus est une plateforme indépendante et non officielle pour
              les alumni et étudiants de Sorbonne Sciences Jussieu. Elle n'est
              pas affiliée à ou approuvée par Sorbonne Université.
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
              2. Comptes Utilisateur
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
              Vous êtes responsable de maintenir la confidentialité de votre
              compte et de votre mot de passe. Vous acceptez de fournir des
              informations exactes et de les mettre à jour selon les besoins.
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
              3. Conduite de l'Utilisateur
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: { xs: "0.95rem", md: "1rem" },
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                fontWeight: 400,
              }}
            >
              Vous acceptez d'utiliser le site de manière respectueuse et
              légale. Les actions interdites incluent :
            </Typography>
            <List
              sx={{
                mb: 4,
                pl: 2,
                "& .MuiListItem-root": {
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.7,
                  letterSpacing: "0.01em",
                  fontWeight: 400,
                  py: 0.5,
                },
              }}
            >
              <ListItem>
                Harcèlement, spam ou publication de contenu illégal ou offensant
              </ListItem>
              <ListItem>Usurpation d'identité d'autres personnes</ListItem>
              <ListItem>
                Partage de contenu dont vous n'avez pas les droits
              </ListItem>
            </List>

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
              4. Propriété du Contenu
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
              Vous conservez les droits sur votre propre contenu mais accordez à
              SorboNexus une licence pour l'afficher sur le site. Vous êtes
              responsable du contenu que vous publiez.
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
              5. Contenu Généré par l'Utilisateur
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
              Vous êtes entièrement responsable du contenu que vous publiez. Le
              Site n'approuve ni ne garantit l'exactitude du contenu
              utilisateur. Le créateur se réserve le droit de supprimer tout
              contenu à sa discrétion, surtout s'il viole ces Conditions ou la
              loi applicable.
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
              6. Modération et Suppression
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
              Les administrateurs du site se réservent le droit de supprimer
              tout contenu ou compte qui viole ces conditions ou est jugé
              inapproprié.
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
              7. Confidentialité
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
              SorboNexus n'utilise pas de cookies pour le suivi ou la publicité.
              Les tokens d'authentification sont stockés dans le localStorage
              pour la gestion de session. Pour plus d'informations, consultez
              notre Politique de Confidentialité.
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
              8. Exclusion de Garanties
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
              Le Site et tout son contenu sont fournis "en l'état" et "selon
              disponibilité" sans aucune garantie d'aucune sorte, expresse ou
              implicite. Nous ne garantissons pas que le Site sera exempt
              d'erreurs, sécurisé ou ininterrompu. Dans toute la mesure permise
              par la loi, nous excluons toutes les garanties, y compris mais
              sans s'y limiter, les garanties de commercialisation, d'adéquation
              à un usage particulier et de non-violation.
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
              9. Limitation de Responsabilité
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
              Dans toute la mesure permise par la loi applicable, en aucun cas
              le créateur, les contributeurs ou les affiliés ne seront
              responsables de tout dommage indirect, accessoire, spécial,
              consécutif ou punitif, ou de toute perte de profits ou de revenus,
              qu'ils soient encourus directement ou indirectement, ou de toute
              perte de données, d'utilisation, de clientèle ou d'autres pertes
              intangibles, résultant de (a) votre utilisation ou incapacité
              d'utiliser le Site ; (b) tout accès non autorisé à ou utilisation
              de nos serveurs et/ou de toute information personnelle stockée
              dans ceux-ci.
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
              10. Indemnisation
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
              Vous acceptez d'indemniser, de défendre et de dégager de toute
              responsabilité le créateur, les contributeurs et les affiliés
              contre toute réclamation, dommage, obligation, perte,
              responsabilité, coût ou dette, et dépense (y compris mais sans s'y
              limiter, les frais d'avocat) découlant de votre utilisation du
              Site, de votre violation de ces Conditions, ou de votre violation
              de tout droit d'un tiers.
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
              11. Propriété Intellectuelle
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
              Sauf pour le contenu contribué par les utilisateurs, tout le
              contenu, la conception et le code sur SorboNexus sont la propriété
              intellectuelle du créateur. Vous ne pouvez pas copier, reproduire
              ou distribuer aucune partie du Site sans permission expresse, sauf
              selon les licences open-source applicables.
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
              12. Résiliation
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
              Le créateur se réserve le droit de suspendre ou de résilier votre
              accès au Site à tout moment, pour toute raison, sans préavis.
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
              13. Juridiction et Droit Applicable
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
              Ces Conditions sont régies et interprétées conformément aux lois
              de la France et de l'Union Européenne. Tout litige découlant de
              ces Conditions ou de votre utilisation du Site sera soumis à la
              juridiction exclusive des tribunaux de Paris, France.
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
              14. Aucun Conseil Professionnel
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
              Les informations et conseils partagés sur SorboNexus sont à des
              fins informatives uniquement et ne constituent pas des conseils
              professionnels, académiques ou juridiques.
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
              15. Modifications du Site et des Conditions
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
              Le créateur se réserve le droit de modifier, suspendre ou
              interrompre toute partie du Site à tout moment sans préavis. Ces
              Conditions peuvent être mises à jour à tout moment ; l'utilisation
              continue du Site constitue l'acceptation des nouvelles Conditions.
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
              16. Contact
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
              Pour des questions ou commentaires, contactez :
              sethaguila@icloud.com
            </Typography>
          </Box>
        </Container>
      </motion.section>
    </div>
  );
}
