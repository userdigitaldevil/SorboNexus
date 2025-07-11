/**
 * SmoothScroll - Ultra smooth scrolling utility for SorboNexus
 * Provides glass-like scrolling experience with custom physics
 */

// Lerp (Linear Interpolation) function for smooth scrolling
const lerp = (start, end, factor) => start * (1 - factor) + end * factor;

// Default options
const defaultOptions = {
  smooth: 0.075, // Lower = smoother but slower
  lerp: true, // Enable linear interpolation for extra smoothness
  normalizeWheel: true, // Normalize wheel speeds across browsers
  touchMultiplier: 2, // Touch speed multiplier
  acceleration: 1.5, // Acceleration factor
  damping: 0.9, // Damping factor (lower = more resistance)
};

class SmoothScroll {
  constructor(options = {}) {
    // Merge options with defaults
    this.options = { ...defaultOptions, ...options };

    // Scroll state
    this.targetY = 0;
    this.currentY = 0;
    this.scrollY = 0;
    this.velocity = 0;
    this.isScrolling = false;
    this.rafId = null;
    this.lastScrollTop = 0;
    this.scrollDirection = "down";

    // Elements
    this.html = document.documentElement;
    this.body = document.body;
    this.scrollElements = [];

    // Initialize
    this.init();
  }

  init() {
    // Disable native smooth scrolling
    this.html.style.scrollBehavior = "auto";

    // Add event listeners
    window.addEventListener("scroll", this.onScroll.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this.onResize.bind(this), {
      passive: true,
    });
    window.addEventListener("mousewheel", this.onWheel.bind(this), {
      passive: false,
    });
    window.addEventListener("wheel", this.onWheel.bind(this), {
      passive: false,
    });
    window.addEventListener("touchstart", this.onTouchStart.bind(this), {
      passive: true,
    });
    window.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true,
    });

    // Start animation loop
    this.animate();

    // Find all scrollable elements with data-smooth-scroll attribute
    this.scrollElements = [
      ...document.querySelectorAll("[data-smooth-scroll]"),
    ];

    // Initial setup
    this.targetY = window.scrollY;
    this.currentY = window.scrollY;
    this.onResize();
  }

  destroy() {
    // Remove event listeners
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousewheel", this.onWheel);
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);

    // Cancel animation frame
    cancelAnimationFrame(this.rafId);

    // Re-enable native smooth scrolling
    this.html.style.scrollBehavior = "smooth";
  }

  onScroll(e) {
    this.targetY = window.scrollY;

    // Detect scroll direction
    const st = window.scrollY;
    this.scrollDirection = st > this.lastScrollTop ? "down" : "up";
    this.lastScrollTop = st <= 0 ? 0 : st;

    // Update attributes for any CSS that needs scroll direction
    this.html.setAttribute("data-scroll-direction", this.scrollDirection);
  }

  onResize() {
    // Update any size-dependent values
  }

  onWheel(e) {
    if (this.options.lerp) {
      e.preventDefault();

      // Normalize wheel speed across browsers
      const normalized = this.options.normalizeWheel
        ? this.normalizeWheel(e)
        : e.deltaY;

      // Apply acceleration and direction
      this.velocity += normalized * this.options.acceleration;

      // Start animation if not already running
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.animate();
      }
    }
  }

  onTouchStart(e) {
    this.touchStart = e.touches[0].clientY;
  }

  onTouchMove(e) {
    if (this.options.lerp && this.touchStart !== undefined) {
      const touch = e.touches[0];
      const delta = this.touchStart - touch.clientY;

      // Only prevent default if we're handling the scroll
      if (Math.abs(delta) > 10) {
        e.preventDefault();
        this.velocity += delta * this.options.touchMultiplier;
        this.touchStart = touch.clientY;

        // Start animation if not already running
        if (!this.isScrolling) {
          this.isScrolling = true;
          this.animate();
        }
      }
    }
  }

  onTouchEnd() {
    this.touchStart = undefined;
  }

  normalizeWheel(e) {
    // Normalize wheel delta across browsers
    let delta = e.deltaY;

    // Apply multiplier for smoother scrolling
    if (delta === 0) return 0;

    delta = Math.sign(delta) * Math.min(Math.abs(delta), 60);

    return delta;
  }

  animate() {
    // Update velocity with damping
    this.velocity *= this.options.damping;

    // Apply velocity to target scroll position
    this.targetY += this.velocity;

    // Clamp target to valid scroll range
    this.targetY = Math.max(
      0,
      Math.min(this.targetY, this.body.scrollHeight - window.innerHeight)
    );

    // Smooth scroll with lerp
    this.currentY = lerp(this.currentY, this.targetY, this.options.smooth);

    // Apply scroll
    window.scrollTo(0, Math.round(this.currentY));

    // Update scroll state
    this.scrollY = window.scrollY;

    // Continue animation if still scrolling
    if (
      Math.abs(this.velocity) > 0.1 ||
      Math.abs(this.targetY - this.currentY) > 0.1
    ) {
      this.isScrolling = true;
      this.rafId = requestAnimationFrame(this.animate.bind(this));
    } else {
      this.isScrolling = false;
    }
  }

  // Public method to scroll to a specific position or element
  scrollTo(target, options = {}) {
    let targetY = 0;

    // Handle element or selector
    if (typeof target === "string") {
      const element = document.querySelector(target);
      if (element) {
        targetY = element.getBoundingClientRect().top + window.scrollY;
      }
    } else if (target instanceof HTMLElement) {
      targetY = target.getBoundingClientRect().top + window.scrollY;
    } else if (typeof target === "number") {
      targetY = target;
    }

    // Apply offset if provided
    if (options.offset) {
      targetY += options.offset;
    }

    // Set target position
    this.targetY = targetY;

    // Start animation if not already running
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.animate();
    }

    return this;
  }
}

// Create and export a singleton instance
const smoothScroll = new SmoothScroll();

export default smoothScroll;
