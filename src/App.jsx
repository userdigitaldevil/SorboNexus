import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Ressources from "./pages/Ressources";
import Conseils from "./pages/Conseils";
import Alumni from "./pages/Alumni";
import LiensUtiles from "./pages/LiensUtiles";
import Connexion from "./pages/Connexion";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { AlumniEditModalProvider } from "./components/AlumniEditModalContext";

// Create a dark theme inspired by Cursor AI
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1e40af",
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
    },
    background: {
      default: "#0a0a0a",
      paper: "rgba(255, 255, 255, 0.05)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 16,
        },
      },
    },
  },
});

// Component to handle title changes
function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "SorboNexus - Accueil",
      "/ressources": "SorboNexus - Ressources",
      "/conseils": "SorboNexus - Conseils des Alumni",
      "/alumni": "SorboNexus - Alumni",
      "/liens-utiles": "SorboNexus - Liens Utiles",
      "/connexion": "SorboNexus - Connexion",
      "/terms": "SorboNexus - Conditions d'utilisation",
      "/privacy": "SorboNexus - Politique de confidentialité",
    };

    const title = titles[location.pathname] || "SorboNexus";
    document.title = title;
  }, [location.pathname]);

  return null;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.4,
};

// Animated page wrapper component
const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{
      minHeight: "100vh",
      width: "100%",
    }}
  >
    {children}
  </motion.div>
);

function App() {
  // Add smooth scrolling to the entire app
  useEffect(() => {
    // Enable smooth scrolling for the entire document
    document.documentElement.style.scrollBehavior = "smooth";

    // Add custom scroll behavior for better performance
    const handleScroll = () => {
      // This will be used for scroll-triggered animations
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AlumniEditModalProvider>
          <div
            className="smooth-scroll-all"
            style={{
              scrollBehavior: "smooth",
              overflowX: "hidden", // Prevent horizontal scroll during animations
            }}
          >
            <TitleUpdater />
            <Navbar />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AnimatedPage>
                      <Home />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/ressources"
                  element={
                    <AnimatedPage>
                      <Ressources />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/conseils"
                  element={
                    <AnimatedPage>
                      <Conseils />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/alumni"
                  element={
                    <AnimatedPage>
                      <Alumni />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/liens-utiles"
                  element={
                    <AnimatedPage>
                      <LiensUtiles />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/connexion"
                  element={
                    <AnimatedPage>
                      <Connexion />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <AnimatedPage>
                      <Terms />
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <AnimatedPage>
                      <Privacy />
                    </AnimatedPage>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AlumniEditModalProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
