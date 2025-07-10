import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Grade as GradeIcon,
  Business as BusinessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
} from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { renderTextWithLinks } from "../utils/textUtils.jsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Add DOMAIN_COLORS and color logic at the top
const DOMAIN_COLORS = {
  Chimie: "#ffb300", // vivid amber
  Électronique: "#8e24aa", // deep purple
  Informatique: "#ff80ab", // lighter pink
  Mathématiques: "#e53935", // matte red
  Mécanique: "#43a047", // strong green
  Physique: "#009688", // teal
  "Sciences de la Terre": "#3949ab", // strong blue-violet
  "Sciences de la vie": "#00bcd4", // strong cyan
};

export default function AlumniProfileCard({
  alum,
  isAdmin,
  alumniId,
  handleEditClick,
  handleDeleteClick,
  onClose,
  isBookmarked = false,
  onToggleBookmark,
}) {
  // Support both alum.profile and flat alum for backward compatibility
  const profile = alum.profile || alum;

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

  // Subtle glow for admin
  const adminGlow = alum.isAdmin
    ? {
        boxShadow: "0 0 36px 8px #3b82f6cc",
        transition: "filter 0.3s, box-shadow 0.3s",
        filter: "none",
        "&:hover": {
          filter: "hue-rotate(30deg)",
        },
      }
    : {};

  // Conseil section with expandable/collapsible logic
  const [showFullConseil, setShowFullConseil] = useState(false);
  const conseilMaxLength = 180;
  const conseilIsLong = alum.conseil && alum.conseil.length > conseilMaxLength;
  const conseilPreview = conseilIsLong
    ? alum.conseil.slice(0, conseilMaxLength) + "..."
    : alum.conseil;

  // When displaying schools, use:
  const licence =
    alum.schoolsApplied && alum.schoolsApplied[0]
      ? alum.schoolsApplied[0].name
      : "—";
  const masterOrEcole =
    alum.schoolsApplied && alum.schoolsApplied[1]
      ? alum.schoolsApplied[1].name
      : "—";

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          background: alum.hidden
            ? "linear-gradient(145deg, #444 0%, #222 100%)"
            : "linear-gradient(145deg, #232323 0%, #111 100%)",
          border: "none",
          color: "#fff",
          minHeight: 340,
          position: "relative",
          overflow: "visible",
          boxShadow: alum.isAdmin ? undefined : "0 16px 40px rgba(0,0,0,0.5)",
          filter: alum.hidden ? "grayscale(0.7) brightness(0.7)" : undefined,
          opacity: alum.hidden ? 0.7 : 1,
          ...adminGlow,
        }}
      >
        {/* Close button */}
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: { xs: 12, sm: 16 },
              right: { xs: 12, sm: 16 },
              color: "rgba(255, 255, 255, 0.7)",
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 30,
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
              minWidth: { xs: 32, sm: 36 },
              minHeight: { xs: 32, sm: 36 },
              "&:hover": {
                color: "#fff",
                background: "rgba(0, 0, 0, 0.5)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }} />
          </IconButton>
        )}

        {/* Action Buttons Container */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, sm: 16 },
            right: onClose ? { xs: 56, sm: 64 } : { xs: 12, sm: 16 },
            zIndex: 30,
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          {/* Bookmark Button - Hide for user's own profile */}
          {onToggleBookmark &&
            String(alum._id) !== String(alumniId) &&
            String(alum.id) !== String(alumniId) && (
              <IconButton
                onClick={() => onToggleBookmark()}
                sx={{
                  color: isBookmarked ? "#f59e0b" : "rgba(255, 255, 255, 0.7)",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  width: { xs: 32, sm: 36 },
                  height: { xs: 32, sm: 36 },
                  minWidth: { xs: 32, sm: 36 },
                  minHeight: { xs: 32, sm: 36 },
                  "&:hover": {
                    color: isBookmarked ? "#d97706" : "#f59e0b",
                    background: "rgba(0, 0, 0, 0.5)",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
                title={
                  isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"
                }
              >
                {isBookmarked ? (
                  <BookmarkFilledIcon
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                  />
                ) : (
                  <BookmarkIcon
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
                  />
                )}
              </IconButton>
            )}

          {/* Edit Button */}
          {(alum._id === alumniId || isAdmin) && (
            <IconButton
              size="medium"
              sx={{
                color: "#fff",
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                minWidth: { xs: 32, sm: 36 },
                minHeight: { xs: 32, sm: 36 },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  color: "#fff",
                  transform: "scale(1.1)",
                  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.6)",
                },
                transition: "all 0.2s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(alum);
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M16.474 5.474a2.5 2.5 0 1 1 3.536 3.536l-9.193 9.193a2 2 0 0 1-.707.464l-3.5 1.167a.5.5 0 0 1-.633-.633l1.167-3.5a2 2 0 0 1 .464-.707l9.192-9.192Z"
                />
              </svg>
            </IconButton>
          )}
        </Box>

        {/* Hidden profile indicator */}
        {alum.hidden && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 30,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(30,30,30,0.85)",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              boxShadow: "0 2px 8px #0006",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              style={{ marginRight: 4 }}
            >
              <path
                stroke="#aaa"
                strokeWidth="2"
                d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
              />
              <circle cx="12" cy="12" r="3" stroke="#aaa" strokeWidth="2" />
            </svg>
            <Typography
              variant="caption"
              sx={{ color: "#aaa", fontWeight: 700 }}
            >
              {alum._id === alumniId ? "Ton profil est caché" : "Profil caché"}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            height: 120,
            background: domainBg,
            position: "relative",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 80,
            left: 24,
            zIndex: 10,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              background: alum.hidden ? "#555" : domainBg,
              border: "4px solid rgba(255, 255, 255, 0.1)",
              fontSize:
                alum.avatar && alum.avatar.length > 4
                  ? "0.9rem"
                  : alum.avatar && alum.avatar.length > 2
                  ? "1.1rem"
                  : "1.5rem",
              fontWeight: 700,
              filter: alum.hidden ? "grayscale(1) brightness(0.8)" : undefined,
            }}
          >
            {alum.avatar}
          </Avatar>
        </Box>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 7, sm: 8 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: alum.isAdmin && isAdmin ? "#fff" : "white",
              background:
                alum.isAdmin && isAdmin ? "rgba(255,255,255,0.18)" : undefined,
              borderRadius: alum.isAdmin && isAdmin ? 2 : undefined,
              px: alum.isAdmin && isAdmin ? 2 : undefined,
              py: alum.isAdmin && isAdmin ? 1 : undefined,
              boxShadow:
                alum.isAdmin && isAdmin ? "0 2px 24px 2px #fff6" : undefined,
              backdropFilter: alum.isAdmin && isAdmin ? "blur(8px)" : undefined,
              fontFamily: alum.isAdmin && isAdmin ? "monospace" : undefined,
              letterSpacing: alum.isAdmin && isAdmin ? "0.15em" : "-0.02em",
              fontSize: { xs: "1.4rem", sm: "1.6rem" },
              lineHeight: 1.3,
            }}
          >
            {alum.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
              fontWeight: 500,
              mb: 2.5,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              letterSpacing: "0.02em",
              lineHeight: 1.4,
            }}
          >
            {alum.degree}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              mb: 3.5,
              lineHeight: 1.5,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {alum.position}
          </Typography>

          {isAdmin && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: { xs: 12, sm: 16 },
                right: {
                  xs: onClose
                    ? alum._id === alumniId || isAdmin
                      ? 96
                      : 52
                    : alum._id === alumniId || isAdmin
                    ? 52
                    : 12,
                  sm: onClose
                    ? alum._id === alumniId || isAdmin
                      ? 108
                      : 60
                    : alum._id === alumniId || isAdmin
                    ? 60
                    : 16,
                },
                zIndex: 20,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                minWidth: { xs: "auto", sm: "auto" },
              }}
              onClick={() => handleDeleteClick(alum)}
            >
              Supprimer
            </Button>
          )}
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />
          {/* Contact Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 2.5,
                fontSize: { xs: "1.1rem", sm: "1.2rem" },
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {profile.email && (
                <Button
                  startIcon={<EmailIcon />}
                  href={`mailto:${profile.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#3b82f6",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid #3b82f6",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  Email
                </Button>
              )}
              {profile.linkedin && (
                <Button
                  startIcon={<LinkedInIcon />}
                  href={profile.linkedin}
                  target="_blank"
                  sx={{
                    color: "#0077b5",
                    border: "1px solid rgba(0, 119, 181, 0.3)",
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "rgba(0, 119, 181, 0.1)",
                      border: "1px solid #0077b5",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  LinkedIn
                </Button>
              )}
            </Box>
          </Box>
          {/* Poste actuel Section */}
          {profile.currentPosition && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 2.5,
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                Poste actuel
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <BusinessIcon sx={{ color: "#3b82f6" }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    lineHeight: 1.4,
                  }}
                >
                  {profile.currentPosition}
                </Typography>
              </Box>
            </Box>
          )}
          {/* Notes obtenues Section */}
          {profile.grades &&
            (Array.isArray(profile.grades)
              ? profile.grades.length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 2.5,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      Notes obtenues
                    </Typography>
                    <List dense>
                      {profile.grades.map((grade, idx) => (
                        <ListItem key={grade.id || idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <GradeIcon sx={{ color: "#3b82f6" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={grade.subject}
                            secondary={grade.value}
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: { color: "#3b82f6", fontWeight: 600 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              : Object.keys(profile.grades).length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 2.5,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      Notes obtenues
                    </Typography>
                    <List dense>
                      {Object.entries(profile.grades).map(
                        ([program, grade]) => (
                          <ListItem key={program} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <GradeIcon sx={{ color: "#3b82f6" }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={program}
                              secondary={grade}
                              primaryTypographyProps={{
                                sx: { color: "white", fontWeight: 500 },
                              }}
                              secondaryTypographyProps={{
                                sx: { color: "#3b82f6", fontWeight: 600 },
                              }}
                            />
                          </ListItem>
                        )
                      )}
                    </List>
                  </Box>
                ))}
          {/* Écoles demandées Section */}
          {profile.schoolsApplied &&
            (Array.isArray(profile.schoolsApplied)
              ? profile.schoolsApplied.length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 2.5,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      Écoles demandées
                    </Typography>
                    <List dense>
                      {profile.schoolsApplied.map((school, idx) => (
                        <ListItem
                          key={school.id || school.name || idx}
                          sx={{ px: 0 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {school.status === "accepted" ? (
                              <CheckCircleOutlineIcon
                                sx={{ color: "#10b981" }}
                              />
                            ) : (
                              <CancelIcon sx={{ color: "#ef4444" }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={school.name}
                            secondary={
                              school.status === "accepted"
                                ? "Accepté"
                                : "Refusé"
                            }
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color:
                                  school.status === "accepted"
                                    ? "#10b981"
                                    : "#ef4444",
                                fontWeight: 600,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              : profile.schoolsApplied.length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        mb: 2.5,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                      }}
                    >
                      Écoles demandées
                    </Typography>
                    <List dense>
                      {profile.schoolsApplied.map((school, idx) => (
                        <ListItem key={school.name || idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {school.status === "accepted" ? (
                              <CheckCircleOutlineIcon
                                sx={{ color: "#10b981" }}
                              />
                            ) : (
                              <CancelIcon sx={{ color: "#ef4444" }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={school.name}
                            secondary={
                              school.status === "accepted"
                                ? "Accepté"
                                : "Refusé"
                            }
                            primaryTypographyProps={{
                              sx: { color: "white", fontWeight: 500 },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color:
                                  school.status === "accepted"
                                    ? "#10b981"
                                    : "#ef4444",
                                fontWeight: 600,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
          {/* Nationalities */}
          {alum.nationalities && alum.nationalities.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  letterSpacing: "0.02em",
                  mb: 1,
                }}
              >
                Nationalités
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
                }}
              >
                {Array.isArray(alum.nationalities)
                  ? alum.nationalities.join(", ")
                  : alum.nationalities}
              </Typography>
            </Box>
          )}
          {/* Stages/Extrascolaire/Associations/Expérience Pro */}
          {alum.stagesWorkedContestsExtracurriculars && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  letterSpacing: "0.02em",
                  mb: 1,
                }}
              >
                Stages / Extrascolaire / Associations / Expérience Pro
              </Typography>
              <Box
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  mt: 1,
                  lineHeight: 1.5,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {alum.stagesWorkedContestsExtracurriculars}
                </ReactMarkdown>
              </Box>
            </Box>
          )}
          {/* Future Goals */}
          {alum.futureGoals && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  letterSpacing: "0.02em",
                  mb: 1,
                }}
              >
                Projets futurs (métiers, masters, écoles visés...)
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
                }}
              >
                {alum.futureGoals}
              </Typography>
            </Box>
          )}
          {/* Année de fin de L3 */}
          {alum.anneeFinL3 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  letterSpacing: "0.02em",
                  mb: 1,
                }}
              >
                Année de fin de L3
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
                }}
              >
                {alum.anneeFinL3}
              </Typography>
            </Box>
          )}
          {/* Account creation and last updated dates (side by side, left and right) */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {alum.accountCreationDate && (
              <Typography
                variant="caption"
                sx={{
                  color: "gray",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  display: "inline-block",
                  textAlign: "left",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {`Compte créé le ${new Date(
                  alum.accountCreationDate
                ).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}`}
              </Typography>
            )}
            {alum.updatedAt && (
              <Typography
                variant="caption"
                sx={{
                  color: "gray",
                  display: "inline-block",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  textAlign: "right",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}
              >
                {`Dernière modification le ${new Date(
                  alum.updatedAt
                ).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}`}
              </Typography>
            )}
          </Box>
          {/* Conseil Section */}
          {alum.conseil && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#3b82f6",
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  letterSpacing: "0.02em",
                }}
              >
                Conseil
              </Typography>
              <Box
                className="markdown-content"
                sx={{
                  background: "rgba(59, 130, 246, 0.05)",
                  borderRadius: 2.5,
                  p: { xs: 2.5, sm: 3 },
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  color: "#fff",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  fontFamily: "inherit",
                  minHeight: 48,
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.5,
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {alum.conseil}
                </ReactMarkdown>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}
