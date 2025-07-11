import { useEffect } from "react";

/**
 * Locks the entire page scroll when `locked` is true.
 * Restores scroll and styles when `locked` is false.
 * Prevents all scroll, wheel, and touchmove events on window/document.
 *
 * @param {boolean} locked - Whether to lock the page scroll
 */
export default function usePageScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;

    // Save scroll position
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalTop = document.body.style.top;
    const originalLeft = document.body.style.left;

    // Lock body
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100vw";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;

    // Prevent scroll events
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("scroll", preventScroll, { passive: false });

    // Cleanup
    return () => {
      // Restore styles
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = originalTop;
      document.body.style.left = originalLeft;
      // Restore scroll position
      window.scrollTo(scrollX, scrollY);
      // Remove listeners
      window.removeEventListener("wheel", preventScroll, { passive: false });
      window.removeEventListener("touchmove", preventScroll, {
        passive: false,
      });
      window.removeEventListener("scroll", preventScroll, { passive: false });
      document.removeEventListener("wheel", preventScroll, { passive: false });
      document.removeEventListener("touchmove", preventScroll, {
        passive: false,
      });
      document.removeEventListener("scroll", preventScroll, { passive: false });
    };
  }, [locked]);
}
