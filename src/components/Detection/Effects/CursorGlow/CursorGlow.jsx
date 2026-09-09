import { useEffect, useRef } from "react";
import gsap from "gsap";

function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;

    if (!glow) return;

    // Don't run the cursor effect on touch devices.
    const isTouchDevice =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isTouchDevice) return;

    const handleMouseMove = (event) => {
      gsap.to(glow, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.killTweensOf(glow);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      aria-hidden="true"
    />
  );
}

export default CursorGlow;