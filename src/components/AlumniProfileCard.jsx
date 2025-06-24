import React from "react";
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
} from "@mui/material";
import { LinkedIn, Mail } from "@mui/icons-material";
import BusinessIcon from "@mui/icons-material/Business";
import GradeIcon from "@mui/icons-material/Grade";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

export default function AlumniProfileCard({
  alum,
  isAdmin,
  alumniId,
  handleEditClick,
}) {
  // Support both alum.profile and flat alum for backward compatibility
  const profile = alum.profile || alum;
  return (
    <Card
      sx={{
        borderRadius: 4,
        background: "linear-gradient(145deg, #232323 0%, #111 100%)",
        border: "none",
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        color: "#fff",
        minHeight: 340,
        position: "relative",
        overflow: "visible",
      }}
    >
      <Box
        sx={{
          height: 120,
          background: alum.color,
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
            background: alum.color,
            border: "4px solid rgba(255, 255, 255, 0.1)",
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          {alum.avatar}
        </Avatar>
      </Box>
      <CardContent sx={{ p: 4, pt: 8 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
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
            letterSpacing: alum.isAdmin && isAdmin ? 1.5 : undefined,
          }}
        >
          {alum.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#3b82f6", fontWeight: 600, mb: 2 }}
        >
          {alum.degree}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 3, lineHeight: 1.5 }}
        >
          {alum.position}
        </Typography>
        {(isAdmin || alum._id === alumniId) && (
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: alum.isAdmin ? "#fff" : "#3b82f6",
              background: alum.isAdmin ? "#3b82f6" : "rgba(255,255,255,0.08)",
              boxShadow: alum.isAdmin ? "0 0 8px 2px #fff" : undefined,
              zIndex: 20,
              "&:hover": {
                background: "#1e40af",
                color: "#fff",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(alum);
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M16.474 5.474a2.5 2.5 0 1 1 3.536 3.536l-9.193 9.193a2 2 0 0 1-.707.464l-3.5 1.167a.5.5 0 0 1-.633-.633l1.167-3.5a2 2 0 0 1 .464-.707l9.192-9.192Z"
              />
            </svg>
          </IconButton>
        )}
        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />
        {/* Contact Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 600, mb: 2 }}
          >
            Contact
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {profile.email && (
              <Button
                startIcon={<Mail />}
                href={`mailto:${profile.email}`}
                sx={{
                  color: "#3b82f6",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid #3b82f6",
                  },
                }}
              >
                Email
              </Button>
            )}
            {profile.linkedin && (
              <Button
                startIcon={<LinkedIn />}
                href={profile.linkedin}
                target="_blank"
                sx={{
                  color: "#0077b5",
                  border: "1px solid rgba(0, 119, 181, 0.3)",
                  "&:hover": {
                    background: "rgba(0, 119, 181, 0.1)",
                    border: "1px solid #0077b5",
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
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 2 }}
            >
              Poste actuel
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessIcon sx={{ color: "#3b82f6" }} />
              <Typography
                variant="body1"
                sx={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                {profile.currentPosition}
              </Typography>
            </Box>
          </Box>
        )}
        {/* Notes obtenues Section */}
        {profile.grades && Object.keys(profile.grades).length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 2 }}
            >
              Notes obtenues
            </Typography>
            <List dense>
              {Object.entries(profile.grades).map(([program, grade]) => (
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
              ))}
            </List>
          </Box>
        )}
        {/* Écoles demandées Section */}
        {profile.schoolsApplied && profile.schoolsApplied.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 2 }}
            >
              Écoles demandées
            </Typography>
            <List dense>
              {profile.schoolsApplied.map((school) => (
                <ListItem key={school.name} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {school.status === "accepted" ? (
                      <CheckCircleOutlineIcon sx={{ color: "#10b981" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={school.name}
                    secondary={
                      school.status === "accepted" ? "Accepté" : "Refusé"
                    }
                    primaryTypographyProps={{
                      sx: { color: "white", fontWeight: 500 },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color:
                          school.status === "accepted" ? "#10b981" : "#ef4444",
                        fontWeight: 600,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        {/* Conseil Section */}
        {alum.conseil && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 600, mb: 2 }}
            >
              Conseil de cet alumni
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", opacity: 0.9 }}>
              {alum.conseil}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
