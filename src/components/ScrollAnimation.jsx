import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Scroll animation variants
const scrollVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const slideLeftVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const slideRightVariants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const scaleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const staggerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Scroll Animation Component
export const ScrollAnimation = ({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: threshold,
    margin: "0px 0px -100px 0px",
  });

  const getVariants = () => {
    switch (animation) {
      case "slideLeft":
        return slideLeftVariants;
      case "slideRight":
        return slideRightVariants;
      case "scale":
        return scaleVariants;
      case "stagger":
        return staggerVariants;
      default:
        return scrollVariants;
    }
  };

  const variants = getVariants();

  // Add delay to the transition
  if (delay > 0) {
    variants.visible.transition.delay = delay;
  }

  if (duration !== 0.6) {
    variants.visible.transition.duration = duration;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Animation Component for lists
export const StaggerAnimation = ({ children, className = "", ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: "0px 0px -100px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerVariants}
      className={className}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div variants={itemVariants} custom={index}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Parallax Scroll Component
export const ParallaxScroll = ({
  children,
  speed = 0.5,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <motion.div
      ref={ref}
      style={{ transform: `translateY(${offset}px)` }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
