import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * SmoothScrollSection - A component that provides buttery smooth scrolling to its children
 * This component can be used to add glass-like smooth scrolling to specific sections
 */
const SmoothScrollSection = ({
  children,
  className = "",
  speed = 0.09,
  direction = "vertical",
  enabled = true,
  tag: Tag = "div",
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const targetScrollRef = useRef({ x: 0, y: 0 });
  const currentScrollRef = useRef({ x: 0, y: 0 });

  // Linear interpolation function
  const lerp = (start, end, factor) => start * (1 - factor) + end * factor;

  // Setup smooth scrolling
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    // Add data attribute for potential CSS targeting
    container.setAttribute("data-smooth-scroll", "");

    // Setup content for smooth scrolling
    content.style.position = direction === "vertical" ? "absolute" : "static";
    content.style.width = "100%";
    content.style.height = direction === "vertical" ? "auto" : "100%";
    content.style.top = "0";
    content.style.left = "0";
    content.style.willChange = "transform";
    content.style.transition = "none";
    content.style.zIndex = "1";

    // Set initial scroll positions
    targetScrollRef.current = {
      x: direction === "horizontal" ? container.scrollLeft : 0,
      y: direction === "vertical" ? container.scrollTop : 0,
    };
    currentScrollRef.current = { ...targetScrollRef.current };

    // Handle scroll events to update target scroll position
    const handleScroll = () => {
      targetScrollRef.current = {
        x: direction === "horizontal" ? container.scrollLeft : 0,
        y: direction === "vertical" ? container.scrollTop : 0,
      };
    };

    // Animation loop for smooth scrolling
    const animate = (time) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      // Smooth scroll with lerp
      currentScrollRef.current.y = lerp(
        currentScrollRef.current.y,
        targetScrollRef.current.y,
        speed
      );

      currentScrollRef.current.x = lerp(
        currentScrollRef.current.x,
        targetScrollRef.current.x,
        speed
      );

      // Apply transform for smooth movement
      if (direction === "vertical") {
        content.style.transform = `translate3d(0, ${-currentScrollRef.current
          .y}px, 0)`;
      } else {
        content.style.transform = `translate3d(${-currentScrollRef.current
          .x}px, 0, 0)`;
      }

      // Continue animation
      requestRef.current = requestAnimationFrame(animate);
    };

    // Start animation and add event listener
    requestRef.current = requestAnimationFrame(animate);
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial content height/width calculation
    const setContainerSize = () => {
      if (direction === "vertical") {
        container.style.height = window.innerHeight + "px";
        container.style.overflowY = "auto";
        container.style.overflowX = "hidden";
        container.scrollTop = targetScrollRef.current.y;

        // Set container scrollHeight to match content height
        const contentHeight = content.offsetHeight;
        container.style.height = window.innerHeight + "px";
        container.style.minHeight = contentHeight + "px";
      } else {
        container.style.width = "100%";
        container.style.overflowX = "auto";
        container.style.overflowY = "hidden";
        container.scrollLeft = targetScrollRef.current.x;

        // Set container scrollWidth to match content width
        const contentWidth = content.offsetWidth;
        container.style.width = "100%";
        container.style.minWidth = contentWidth + "px";
      }
    };

    // Initial setup
    setContainerSize();

    // Handle resize
    const handleResize = () => {
      setContainerSize();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, direction, enabled]);

  // Apply custom styles for smooth scrolling container
  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "auto",
    overflow: "hidden",
    ...style,
  };

  // If smooth scrolling is disabled, just render children normally
  if (!enabled) {
    return (
      <Tag className={className} style={style} ref={containerRef} {...props}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`smooth-scroll-container ${className}`}
      style={containerStyle}
      ref={containerRef}
      {...props}
    >
      <div className="smooth-scroll-content" ref={contentRef}>
        {children}
      </div>
    </Tag>
  );
};

SmoothScrollSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  speed: PropTypes.number,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
  enabled: PropTypes.bool,
  tag: PropTypes.string,
  style: PropTypes.object,
};

export default SmoothScrollSection;
