import { useEffect } from "react";
import Lenis from "lenis";

function SmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.5,

      easing: (t) =>
        1 - Math.pow(1 - t, 4),

      lerp: 0.075,

      smoothWheel: true,

      syncTouch: false,

      wheelMultiplier: 0.82,

      touchMultiplier: 1,

      autoRaf: false,
    });

    let animationFrame;

    const raf = (time) => {
      lenis.raf(time);

      animationFrame =
        requestAnimationFrame(raf);
    };

    animationFrame =
      requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);

      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;