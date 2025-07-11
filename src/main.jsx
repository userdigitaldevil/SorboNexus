import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

// Check if we should enable ice-skating scroll effect
// This adds a momentum effect that feels like gliding on ice
const ENABLE_ICE_SCROLL = false; // Disabled to use native scrolling like Apple

// Dynamically import scroll inertia only if enabled
// This approach prevents unused code from being bundled
if (ENABLE_ICE_SCROLL) {
  // Use dynamic import to load the scroll inertia utility only when needed
  import("./utils/scrollInertia.js")
    .then((module) => {
      const scrollInertia = module.default;

      // Log that ice-like scrolling is enabled
      console.log("✨ Ice-skating scroll effect enabled");

      // Configure for mobile-friendly scrolling with reduced sensitivity
      scrollInertia.options.damping = 0.15; // Higher = less inertia, more responsive
      scrollInertia.options.wheelMultiplier = 0.8; // Higher = more responsive wheel scrolling
      scrollInertia.options.touchMultiplier = 1.2; // Higher = more responsive touch scrolling
      scrollInertia.options.maxSpeed = 15; // Lower max speed for better control
      scrollInertia.options.minVelocityToAnimate = 0.1; // Stop animating sooner
    })
    .catch((err) => {
      console.warn("Could not load ice-skating scroll effect:", err);
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
