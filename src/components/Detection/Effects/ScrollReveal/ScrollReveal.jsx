import { useEffect, useRef } from "react";
import gsap from "gsap";

function ScrollReveal({
  children,
  direction = "up",
  duration = 0.8,
  delay = 0,
  distance = 50,
  once = true,
  className = "",
}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const directions = {
      up: {
        x: 0,
        y: distance,
      },
      down: {
        x: 0,
        y: -distance,
      },
      left: {
        x: distance,
        y: 0,
      },
      right: {
        x: -distance,
        y: 0,
      },
      fade: {
        x: 0,
        y: 0,
      },
    };

    const initialPosition =
      directions[direction] || directions.up;

    gsap.set(element, {
      opacity: 0,
      x: initialPosition.x,
      y: initialPosition.y,
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        gsap.to(element, {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          clearProps: "transform",
        });

        if (once) {
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(element);
    };
  }, [
    direction,
    duration,
    delay,
    distance,
    once,
  ]);

  return (
    <div
      ref={elementRef}
      className={className}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;