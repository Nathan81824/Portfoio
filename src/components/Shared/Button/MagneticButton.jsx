import { useEffect, useRef } from "react";
import gsap from "gsap";

function MagneticButton({
  children,
  strength = 0.25,
  duration = 0.35,
  className = "",
  ...props
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) return;

    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (event) => {
      const rect = button.getBoundingClientRect();

      const buttonCenterX =
        rect.left + rect.width / 2;

      const buttonCenterY =
        rect.top + rect.height / 2;

      const distanceX =
        event.clientX - buttonCenterX;

      const distanceY =
        event.clientY - buttonCenterY;

      gsap.to(button, {
        x: distanceX * strength,
        y: distanceY * strength,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.03,
        duration,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: duration + 0.1,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    button.addEventListener(
      "mousemove",
      handleMouseMove
    );

    button.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    button.addEventListener(
      "mouseleave",
      handleMouseLeave
    );

    return () => {
      button.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      button.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      button.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      gsap.killTweensOf(button);
    };
  }, [strength, duration]);

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default MagneticButton;