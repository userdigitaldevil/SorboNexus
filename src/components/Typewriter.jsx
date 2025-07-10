import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Typewriter = ({
  text,
  speed = 100,
  deleteSpeed = 50,
  delay = 1000,
  repeat = true,
  className = "",
  style = {},
  sequence = null,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const componentRef = useRef(null);

  // Default sequence if none provided
  const defaultSequence = [
    { text: "Sorbonne Sciences", action: "type" },
    { text: "Sorbonne Sciences", action: "delete", target: "Sorbo" },
    { text: "SorboNexus", action: "type", startFrom: "Sorbo" },
    { text: "SorboNexus", action: "pause", duration: 2000 },
    { text: "SorboNexus", action: "delete", target: "" },
  ];

  const sequenceToUse = sequence || defaultSequence;

  // Intersection Observer to detect when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);

        // Reset animation when coming back into view
        if (entry.isIntersecting && isComplete) {
          setCurrentStep(0);
          setCurrentIndex(0);
          setIsDeleting(false);
          setDisplayText("");
          setIsComplete(false);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: "50px", // Add some margin for better detection
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, [isComplete]);

  // Pause typewriter when scrolling to improve performance
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsPaused(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 150); // Resume after 150ms of no scrolling
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    // Don't animate if not in view, paused, or complete (and not repeating)
    if (!isInView || isPaused || (isComplete && !repeat)) return;

    const currentSequence = sequenceToUse[currentStep];
    if (!currentSequence) {
      // Reset to beginning if repeating
      if (repeat) {
        setCurrentStep(0);
        setCurrentIndex(0);
        setIsDeleting(false);
        setDisplayText("");
      } else {
        setIsComplete(true);
      }
      return;
    }

    // Use requestAnimationFrame for better performance and to avoid blocking scrolling
    const animate = () => {
      if (currentSequence.action === "type") {
        // Typing phase
        if (currentSequence.startFrom) {
          // Start typing from a specific point (like "Sorbo")
          const startLength = currentSequence.startFrom.length;
          const remainingText = currentSequence.text.slice(startLength);

          if (currentIndex < remainingText.length) {
            setDisplayText(
              currentSequence.startFrom +
                remainingText.slice(0, currentIndex + 1)
            );
            setCurrentIndex(currentIndex + 1);
          } else {
            // Finished typing this sequence - immediately start next step
            setCurrentStep(currentStep + 1);
            setCurrentIndex(0);
            setIsDeleting(false);
          }
        } else {
          // Normal typing from beginning
          if (currentIndex < currentSequence.text.length) {
            setDisplayText(currentSequence.text.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          } else {
            // Finished typing this sequence - immediately start next step
            setCurrentStep(currentStep + 1);
            setCurrentIndex(0);
            setIsDeleting(false);
          }
        }
      } else if (currentSequence.action === "delete") {
        // Deleting phase
        const targetText = currentSequence.target || "";
        if (displayText.length > targetText.length) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Finished deleting to target - immediately start next step
          setCurrentStep(currentStep + 1);
          setCurrentIndex(0);
          setIsDeleting(false);
        }
      } else if (currentSequence.action === "pause") {
        // Pause phase - wait for specified duration then move to next step
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setCurrentIndex(0);
          setIsDeleting(false);
        }, currentSequence.duration || 1000);
      }
    };

    // Use a more efficient timeout that doesn't block scrolling
    const timeout = setTimeout(
      () => {
        requestAnimationFrame(animate);
      },
      currentSequence.action === "delete" ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    currentStep,
    displayText,
    sequenceToUse,
    speed,
    deleteSpeed,
    delay,
    repeat,
    isComplete,
    isInView,
    isPaused,
  ]);

  return (
    <motion.span
      ref={componentRef}
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "currentColor",
          marginLeft: "2px",
          verticalAlign: "text-top",
          willChange: "opacity", // Optimize for animation
        }}
      />
    </motion.span>
  );
};

export default Typewriter;
