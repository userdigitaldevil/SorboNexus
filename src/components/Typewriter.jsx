import React, { useState, useEffect } from "react";
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

  // Default sequence if none provided
  const defaultSequence = [
    { text: "Sorbonne Sciences", action: "type" },
    { text: "Sorbonne Sciences", action: "delete", target: "Sorbo" },
    { text: "SorboNexus", action: "type", startFrom: "Sorbo" },
    { text: "SorboNexus", action: "pause", duration: 2000 },
    { text: "SorboNexus", action: "delete", target: "" },
  ];

  const sequenceToUse = sequence || defaultSequence;

  useEffect(() => {
    if (isComplete && !repeat) return;

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

    const timeout = setTimeout(
      () => {
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
  ]);

  return (
    <motion.span
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          background: "currentColor",
          marginLeft: "2px",
          verticalAlign: "text-top",
        }}
      />
    </motion.span>
  );
};

export default Typewriter;
