import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const DOMAIN_COLORS = {
  Chimie: "#ffb300", // vivid amber
  Électronique: "#8e24aa", // deep purple
  Informatique: "#ff80ab", // lighter pink
  Mathématiques: "#e53935", // matte red
  Mécanique: "#43a047", // strong green
  Physique: "#009688", // teal
  "Sciences de la Terre": "#3949ab", // strong blue-violet
  "Sciences de la vie": "#00bcd4", // strong cyan
};

// Helper to normalize domain names
function normalizeDomain(str) {
  return str
    ? str
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim()
        .toLowerCase()
    : "";
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function averageColors(colors) {
  const rgbs = colors.map(hexToRgb);
  const avg = [0, 1, 2].map((i) =>
    Math.round(rgbs.reduce((sum, rgb) => sum + rgb[i], 0) / colors.length)
  );
  return rgbToHex(avg);
}

const AlumniCard = ({
  alum,
  index,
  onCardClick,
  adminGlow = {},
  isAdmin = false,
  onEditClick,
  alumniId,
  activeFilters = [],
  filters = [],
}) => {
  // Compute alumFields as array
  let alumFields = Array.isArray(alum.field)
    ? alum.field
    : typeof alum.field === "string" && alum.field.includes(",")
    ? alum.field.split(",").map((f) => f.trim())
    : alum.field
    ? [alum.field]
    : [];
  // Sort alumFields alphabetically for gradient order
  const sortedAlumFields = [...alumFields].sort((a, b) => a.localeCompare(b));
  const profileColors = sortedAlumFields.map(
    (f) => DOMAIN_COLORS[f.trim()] || "#888"
  );
  let domainBg;
  if (alum.color && alum.color.trim() !== "") {
    domainBg = alum.color;
  } else if (profileColors.length === 0) {
    domainBg = "rgba(255,255,255,0.08)";
  } else if (profileColors.length === 1) {
    domainBg = profileColors[0];
  } else {
    domainBg = `linear-gradient(90deg, ${profileColors.join(", ")})`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ height: "100%" }}
    >
      <Card
        onClick={() => onCardClick(alum)}
        sx={{
          transform: "scale(1)",
          transformOrigin: "top center",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.3s ease",
          minHeight: { xs: 260, sm: 260, md: 320 },
          height: "100%",
          minWidth: { xs: 260, sm: 260, md: 320 },
          maxWidth: { xs: 260, sm: 260, md: 320 },
          width: { xs: 260, sm: 260, md: 320 },
          mx: 2,
          display: "flex",
          flexDirection: "column",
          opacity: alum.hidden ? 0.5 : 1,
          ...(alum.isAdmin
            ? adminGlow
            : {
                boxShadow: undefined,
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                },
              }),
        }}
      >
        {/* Edit Button for Admins or Self */}
        {(isAdmin ||
          String(alum._id) === String(alumniId) ||
          String(alum.id) === String(alumniId)) && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEditClick(alum);
            }}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 20,
              background: "rgba(59, 130, 246, 0.9)",
              color: "white",
              width: 40,
              height: 40,
              border: "2px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
              "&:hover": {
                background: "rgba(59, 130, 246, 1)",
                transform: "scale(1.15)",
                boxShadow: "0 6px 16px rgba(59, 130, 246, 0.6)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <EditIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        )}
        <Box
          sx={{
            height: { xs: 60, sm: 80, md: 100 },
            background: domainBg,
            position: "relative",
          }}
        />
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2, md: 2.5 },
            pt: { xs: 4, sm: 5, md: 6 },
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: { xs: 35, sm: 60, md: 70 },
              left: { xs: 12, sm: 16, md: 20 },
              zIndex: 10,
            }}
          >
            <Avatar
              sx={{
                width: { xs: 40, sm: 48, md: 56 },
                height: { xs: 40, sm: 48, md: 56 },
                background: domainBg,
                border: "4px solid rgba(255, 255, 255, 0.1)",
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                fontWeight: 700,
              }}
            >
              {alum.avatar}
            </Avatar>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "white",
              fontSize: { xs: "0.8rem", sm: "1.25rem" },
            }}
          >
            {alum.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
              fontWeight: 500,
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: "0.65rem", sm: "0.875rem" },
            }}
          >
            {alum.degree}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#a1a1aa",
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: "0.65rem", sm: "0.875rem" },
            }}
          >
            {alum.position}
          </Typography>
          {/* Année de fin L3 */}
          {alum.anneeFinL3 && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 400,
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: "0.65rem", sm: "0.875rem" },
              }}
            >
              <span style={{ fontWeight: 700 }}>Annee de fin de L3:</span>{" "}
              {alum.anneeFinL3}
            </Typography>
          )}
          {/* Future Goals */}
          {alum.futureGoals && (
            <Box
              sx={{
                mt: 1,
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.85rem",
                lineHeight: 1.4,
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                fontFamily: "inherit",
                minHeight: 32,
                maxHeight: 64,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.65rem", sm: "0.8rem" },
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Objectifs:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.6rem", sm: "0.75rem" },
                  lineHeight: 1.3,
                }}
              >
                {alum.futureGoals}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 1.5 },
              mt: "auto",
            }}
          >
            {alum.linkedin && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(alum.linkedin, "_blank");
                }}
                sx={{
                  color: "#0077b5",
                  background: "rgba(0, 119, 181, 0.1)",
                  "&:hover": {
                    background: "rgba(0, 119, 181, 0.2)",
                  },
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                }}
              >
                <LinkedInIcon
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                />
              </IconButton>
            )}
            {alum.email && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`mailto:${alum.email}`, "_blank");
                }}
                sx={{
                  color: "#ea4335",
                  background: "rgba(234, 67, 53, 0.1)",
                  "&:hover": {
                    background: "rgba(234, 67, 53, 0.2)",
                  },
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                }}
              >
                <EmailIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlumniCard;
