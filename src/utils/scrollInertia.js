/**
 * ScrollInertia - Ice-like smooth scroll effect
 * Adds subtle inertia to scrolling that feels like skating on ice
 */

class ScrollInertia {
  constructor(options = {}) {
    // Default options
    this.options = {
      damping: 0.055, // Lower = more ice-like inertia (0.04-0.06 is good for ice feeling)
      wheelMultiplier: 0.2, // Lower = less initial scroll per wheel movement
      touchMultiplier: 0.4, // Lower = less sensitive touch scrolling
      maxSpeed: 28, // Lower max speed for more control
      minVelocityToAnimate: 0.025, // Keep animating until very slow
      ...options,
    };

    // State
    this.velocity = 0;
    this.lastScrollTop = 0;
    this.isScrolling = false;
    this.rafId = null;
    this.enabled = true;
    this.targetY = window.scrollY;
    this.wheelBuffer = []; // Buffer for averaging wheel inputs

    this.init();
  }

  init() {
    // Check if smooth scrolling is supported
    if ("scrollBehavior" in document.documentElement.style) {
      // Remember original scroll behavior to restore later if needed
      this.originalScrollBehavior =
        document.documentElement.style.scrollBehavior;

      // Temporarily disable built-in smooth scrolling
      document.documentElement.style.scrollBehavior = "auto";

      // Start animation
      this.animate();

      // Add event listeners
      window.addEventListener("wheel", this.onWheel.bind(this), {
        passive: true,
      });
      window.addEventListener("scroll", this.onScroll.bind(this), {
        passive: true,
      });
      window.addEventListener("resize", this.onResize.bind(this), {
        passive: true,
      });
      window.addEventListener("touchstart", this.onTouchStart.bind(this), {
        passive: true,
      });
      window.addEventListener("touchmove", this.onTouchMove.bind(this), {
        passive: true,
      });
      window.addEventListener("touchend", this.onTouchEnd.bind(this), {
        passive: true,
      });

      // Add visibility change to pause when tab is not visible
      document.addEventListener(
        "visibilitychange",
        this.onVisibilityChange.bind(this)
      );

      console.log("✨ Ice-like scroll effect enabled");
    } else {
      console.warn("Smooth scrolling not supported in this browser");
    }
  }

  destroy() {
    // Clean up
    this.enabled = false;
    cancelAnimationFrame(this.rafId);

    // Restore original scroll behavior
    if (this.originalScrollBehavior) {
      document.documentElement.style.scrollBehavior =
        this.originalScrollBehavior;
    } else {
      document.documentElement.style.scrollBehavior = "";
    }

    // Remove event listeners
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  pause() {
    this.enabled = false;
    cancelAnimationFrame(this.rafId);
  }

  resume() {
    this.enabled = true;
    this.animate();
  }

  onScroll() {
    // Update target when user scrolls manually
    this.targetY = window.scrollY;
  }

  onResize() {
    // Reset when window resizes
    cancelAnimationFrame(this.rafId);
    this.velocity = 0;
    this.targetY = window.scrollY;
    this.animate();
  }

  // Add a method to average wheel inputs for smoother experience
  addToWheelBuffer(value) {
    // Add new value to buffer
    this.wheelBuffer.push(value);

    // Keep buffer at manageable size
    if (this.wheelBuffer.length > 5) {
      this.wheelBuffer.shift();
    }

    // Calculate average of wheel buffer (except for very small movements)
    if (Math.abs(value) < 2) return value; // Small movements pass through directly

    // Only average if we have enough data
    if (this.wheelBuffer.length < 2) return value;

    // Calculate weighted average (more recent = more weight)
    let sum = 0;
    let weights = 0;

    for (let i = 0; i < this.wheelBuffer.length; i++) {
      const weight = i + 1; // More recent = higher weight
      sum += this.wheelBuffer[i] * weight;
      weights += weight;
    }

    return sum / weights;
  }

  onWheel(e) {
    // Discard very small movements to reduce sensitivity
    if (Math.abs(e.deltaY) < 3) return;

    // Get normalized delta with reduced sensitivity
    const normalizedRaw =
      Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY * 0.4), 16);

    // Add to averaging buffer for smoother movement
    const normalized = this.addToWheelBuffer(normalizedRaw);

    // Apply reduced multiplier for less initial movement but more ice-like feel
    this.velocity += normalized * this.options.wheelMultiplier;

    // Clamp velocity to maintain control
    this.velocity = Math.max(
      -this.options.maxSpeed,
      Math.min(this.options.maxSpeed, this.velocity)
    );

    // Ensure animation is running
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.animate();
    }
  }

  onTouchStart(e) {
    this.touchY = e.touches[0].clientY;
    this.touchStartY = this.touchY;
    this.touchStartTime = Date.now();
    this.lastTouchY = this.touchY;
    this.touchMovements = [];

    // Stop momentum when user touches the screen
    // But preserve a small amount for smooth continuation
    this.velocity *= 0.4;
  }

  onTouchMove(e) {
    if (this.touchY === undefined) return;

    const currentY = e.touches[0].clientY;
    const deltaY = this.touchY - currentY;

    // Update touch position
    this.touchY = currentY;

    // Track touch movements for smoother momentum
    this.touchMovements.push({
      delta: deltaY,
      time: Date.now(),
    });

    // Keep array at manageable size
    if (this.touchMovements.length > 10) {
      this.touchMovements.shift();
    }

    // Require a minimum movement to register (reduces sensitivity)
    if (Math.abs(deltaY) < 1.5) return;

    // Apply reduced multiplier for less sensitivity
    const adjustedDelta = deltaY * 0.45; // Reduce direct movement during touch
    this.velocity += adjustedDelta * this.options.touchMultiplier;

    // Clamp velocity
    this.velocity = Math.max(
      -this.options.maxSpeed,
      Math.min(this.options.maxSpeed, this.velocity)
    );

    // Ensure animation is running
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.animate();
    }
  }

  onTouchEnd(e) {
    if (this.touchStartY === undefined || this.touchMovements.length < 2) {
      this.touchY = undefined;
      this.touchStartY = undefined;
      this.touchMovements = [];
      return;
    }

    // Calculate momentum effect with ice-like feeling based on recent movements
    const touchDuration = Date.now() - this.touchStartTime;
    const touchDistance = this.touchStartY - this.touchY;

    // Calculate velocity based on recent touch movements
    let recentVelocity = 0;
    const recentMovements = this.touchMovements.slice(-5); // Use last 5 movements

    if (recentMovements.length >= 2) {
      const first = recentMovements[0];
      const last = recentMovements[recentMovements.length - 1];
      const deltaTime = last.time - first.time;

      if (deltaTime > 0) {
        // Calculate pixels per millisecond
        let totalDelta = 0;
        recentMovements.forEach((move) => {
          totalDelta += move.delta;
        });

        recentVelocity = totalDelta / deltaTime;
      }
    }

    // Only apply momentum for quick flicks, but with smooth transition
    if (touchDuration < 500 && Math.abs(touchDistance) > 5) {
      // Calculate momentum with reduced initial impact but longer glide
      const momentum = recentVelocity * 10;

      // Add to existing velocity for smooth transition
      this.velocity += momentum * this.options.touchMultiplier;

      // Clamp velocity
      this.velocity = Math.max(
        -this.options.maxSpeed,
        Math.min(this.options.maxSpeed, this.velocity)
      );
    }

    this.touchY = undefined;
    this.touchStartY = undefined;
    this.touchMovements = [];
  }

  animate() {
    if (!this.enabled) return;

    // Apply gentle damping for ice-like deceleration
    this.velocity *= 1 - this.options.damping;

    // Update target scroll position
    if (Math.abs(this.velocity) > this.options.minVelocityToAnimate) {
      this.targetY += this.velocity;

      // Clamp to valid scroll range
      this.targetY = Math.max(
        0,
        Math.min(
          this.targetY,
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      // Apply scroll
      window.scrollTo(0, Math.round(this.targetY));
      this.isScrolling = true;
    } else {
      this.velocity = 0;
      this.isScrolling = false;
    }

    // Continue animation loop
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }

  // Public API to scroll to element or position
  scrollTo(target, options = {}) {
    // Get target position
    let targetPosition;

    if (typeof target === "number") {
      targetPosition = target;
    } else if (typeof target === "string") {
      const element = document.querySelector(target);
      if (element) {
        const rect = element.getBoundingClientRect();
        targetPosition = rect.top + window.pageYOffset;
      }
    } else if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      targetPosition = rect.top + window.pageYOffset;
    }

    // Apply offset if provided
    if (options.offset) {
      targetPosition += options.offset;
    }

    // Set target and velocity for smooth movement
    if (targetPosition !== undefined) {
      // Calculate distance and set appropriate velocity
      const distance = targetPosition - window.pageYOffset;

      // Slower initial velocity but longer deceleration for smooth ice-like effect
      const speed = Math.min(Math.abs(distance) * 0.025, 15);
      this.velocity = Math.sign(distance) * speed;
      this.targetY = window.pageYOffset;

      // Ensure animation is running
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.animate();
      }
    }

    return this;
  }
}

// Create and export singleton instance
const scrollInertia = new ScrollInertia();
export default scrollInertia;
