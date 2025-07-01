import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Stack } from "@mui/material";
import { Email, LinkedIn, GitHub } from "@mui/icons-material";

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
    <Box
      component="footer"
      sx={{
        background: "#18181b",
        borderTop: "1px solid #232323",
        py: { xs: 3, md: 4 },
        color: "#fff",
        mt: 6,
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
          <Box
            sx={{
              width: { xs: "100%", md: 240 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#fff",
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Connecter · Inspirer · Évoluer
            </Typography>
          </Box>

          {/* Navigation Links */}
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
              { label: "Alumnis", path: "/alumnis" },
              { label: "Conseils", path: "/conseils" },
              { label: "Liens Utiles", path: "/liens-utiles" },
            ].map((item) => (
              <Box
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", md: "1.05rem" },
                  transition: "all 0.2s",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  textAlign: "center",
                  "&:hover": {
                    color: "#3b82f6",
                    background: "rgba(59,130,246,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Stack>

          {/* Social Links */}
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
            <a
              href="mailto:sethaguila@icloud.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  transition: "all 0.2s",
                  p: 1,
                  "&:hover": {
                    color: "#3b82f6",
                    background: "rgba(59,130,246,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Email sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </Box>
            </a>
            <a
              href="https://www.linkedin.com/in/sethaguila/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  transition: "all 0.2s",
                  p: 1,
                  "&:hover": {
                    color: "#0077b5",
                    background: "rgba(0,119,181,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <LinkedIn sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </Box>
            </a>
            <a
              href="https://github.com/userdigitaldevil"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  transition: "all 0.2s",
                  p: 1,
                  "&:hover": {
                    color: "#3b82f6",
                    background: "rgba(59,130,246,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <GitHub sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </Box>
            </a>
          </Stack>
        </Stack>
        <Box sx={{ mt: 3, mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "#aaa", fontWeight: 400, display: "block", mb: 0.5 }}
          >
            <strong>Réglementation :</strong> Ce site respecte la réglementation
            en vigueur concernant la protection des données personnelles (RGPD)
            et la propriété intellectuelle. Les informations partagées ici sont
            destinées à la communauté étudiante et alumni, dans un cadre non
            commercial et éducatif.
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#aaa", fontWeight: 400, display: "block", mb: 0.5 }}
          >
            <strong>Politiques d'utilisation :</strong> L'utilisation de
            SorboNexus implique le respect de la bienveillance, de l'entraide et
            de la confidentialité. Toute utilisation abusive, spam, ou
            publication de contenu inapproprié entraînera la suppression du
            compte ou des messages concernés. Les utilisateurs sont invités à
            partager uniquement des ressources et conseils dont ils détiennent
            les droits ou l'autorisation.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#aaa",
              fontWeight: 400,
              display: "block",
              mb: 0.5,
              fontStyle: "italic",
            }}
          >
            <strong>Disclaimer :</strong> Ce site n'est pas un site officiel de
            Sorbonne Université et n'est ni affilié ni validé par
            l'établissement. Il s'agit d'une initiative indépendante à but non
            lucratif, créée par et pour la communauté Sorbonne Sciences Jussieu.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link
              to="/terms"
              style={{
                color: "#3b82f6",
                marginRight: 16,
                textDecoration: "underline",
                fontSize: "0.95em",
              }}
            >
              Terms of Use
            </Link>
            <Link
              to="/privacy"
              style={{
                color: "#3b82f6",
                textDecoration: "underline",
                fontSize: "0.95em",
              }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: "#aaa",
            fontWeight: 300,
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            letterSpacing: 0.5,
            textAlign: "center",
            display: "block",
            mt: 3,
          }}
        >
          © 2025 Seth Aguila - Développé avec &lt;3 pour la communauté Sorbonne
          Sciences Jussieu
        </Typography>
      </Container>
    </Box>
  );
}
