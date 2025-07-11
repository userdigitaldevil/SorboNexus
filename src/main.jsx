import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

// Check if we should enable ice-skating scroll effect
// This adds a momentum effect that feels like gliding on ice
const ENABLE_ICE_SCROLL = true;

// Dynamically import scroll inertia only if enabled
// This approach prevents unused code from being bundled
if (ENABLE_ICE_SCROLL) {
  // Use dynamic import to load the scroll inertia utility only when needed
  import("./utils/scrollInertia.js")
    .then((module) => {
      const scrollInertia = module.default;

      // Log that ice-like scrolling is enabled
      console.log("✨ Ice-skating scroll effect enabled");

      // Configure for perfect ice-skating feel with reduced sensitivity
      scrollInertia.options.damping = 0.055; // Lower = longer glide (0.04-0.06 is very ice-like)
      scrollInertia.options.wheelMultiplier = 0.2; // Much lower sensitivity on initial movement
      scrollInertia.options.touchMultiplier = 0.4; // Much reduced touch sensitivity
      scrollInertia.options.maxSpeed = 28; // Lower maximum speed for better control
      scrollInertia.options.minVelocityToAnimate = 0.025; // Keep animating for longer
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
