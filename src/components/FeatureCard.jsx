import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

const FeatureCard = ({
  feature,
  index,
  variant = "full",
  onCardClick,
  fixedSize = false,
}) => {
  const isMini = variant === "mini";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
        y: -5,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <Card
        onClick={onCardClick}
        sx={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 3,
          transition: "all 0.3s ease",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          height: fixedSize
            ? { xs: 96, sm: 120 }
            : isMini
            ? "auto"
            : variant === "full"
            ? { xs: 220, sm: 240, md: 260 }
            : "100%",
          width: fixedSize
            ? { xs: 80, sm: 100 }
            : isMini
            ? "100%"
            : variant === "full"
            ? { xs: 200, sm: 260, md: 280 }
            : "100%",
          maxWidth: fixedSize
            ? { xs: 80, sm: 100 }
            : isMini
            ? "none"
            : variant === "full"
            ? { xs: 200, sm: 260, md: 280 }
            : { xs: "200px", sm: "280px", md: "320px", lg: "280px" },
          "&:hover": {
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)",
            transform: "translateY(-2px)",
            "& .feature-icon": {
              transform: "scale(1.1) rotate(5deg)",
              boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
            },
            "& .feature-title": {
              background: feature.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: feature.gradient,
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
        }}
      >
        <CardContent
          sx={{
            p: isMini ? { xs: 1.5, sm: 2 } : 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            height: "100%",
            justifyContent: fixedSize || isMini ? "center" : undefined,
          }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              className="feature-icon"
              sx={{
                width: fixedSize
                  ? { xs: 36, sm: 48 }
                  : isMini
                  ? { xs: 32, sm: 40 }
                  : { xs: 48, sm: 60 },
                height: fixedSize
                  ? { xs: 36, sm: 48 }
                  : isMini
                  ? { xs: 32, sm: 40 }
                  : { xs: 48, sm: 60 },
                borderRadius: "50%",
                background: feature.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: isMini ? { xs: 0.5, sm: 1 } : 2,
                transition: "all 0.3s ease",
                color: "white",
                fontSize: isMini ? { xs: "0.8rem", sm: "1rem" } : "1.5rem",
              }}
            >
              {feature.icon}
            </Box>
          </motion.div>

          <Typography
            variant={isMini ? "h6" : "h5"}
            className="feature-title"
            sx={{
              fontWeight: 600,
              mb: isMini ? { xs: 0.25, sm: 0.5 } : 1,
              transition: "all 0.3s ease",
              fontSize: isMini
                ? { xs: "0.75rem", sm: "0.9rem" }
                : { xs: "1rem", sm: "1.25rem" },
              ...(fixedSize || isMini
                ? {
                    height: { xs: 32, sm: 40 }, // Fixed height for 2 lines
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }
                : {}),
            }}
          >
            {feature.title}
          </Typography>

          {!isMini && !fixedSize && (
            <Typography
              variant="body2"
              sx={{
                color: "#a1a1aa",
                lineHeight: 1.6,
                flex: 1,
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              {feature.description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
