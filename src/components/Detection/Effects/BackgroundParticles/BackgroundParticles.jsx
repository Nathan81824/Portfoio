import { useEffect, useRef } from "react";
import gsap from "gsap";

function BackgroundParticles({
  count = 45,
  color,
  maxDistance = 130,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) return;

    let animationFrame;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles = [];

    /* =====================================================
       THEME COLORS
    ===================================================== */

    const getThemeColors = () => {
      const styles = getComputedStyle(
        document.documentElement
      );

      const primary =
        styles
          .getPropertyValue("--accent-primary")
          .trim();

      const secondary =
        styles
          .getPropertyValue("--accent-secondary")
          .trim();

      return {
        primary: primary || "#ff9f00",
        secondary: secondary || "#ff8a00",
      };
    };

    let themeColors = getThemeColors();

    /* =====================================================
       CONVERT HEX → RGB
    ===================================================== */

    const hexToRgb = (hex) => {
      const cleanHex = hex.replace("#", "");

      if (cleanHex.length !== 6) {
        return "255, 159, 0";
      }

      const red = parseInt(
        cleanHex.substring(0, 2),
        16
      );

      const green = parseInt(
        cleanHex.substring(2, 4),
        16
      );

      const blue = parseInt(
        cleanHex.substring(4, 6),
        16
      );

      return `${red}, ${green}, ${blue}`;
    };

    /* =====================================================
       RESOLVE COLORS
    ===================================================== */

    const getColors = () => {
      /*
        If a custom color was provided,
        use it for the particles.

        Otherwise use the theme variables.
      */

      const particleColor = color
        ? color
        : hexToRgb(themeColors.primary);

      const connectionColor =
        hexToRgb(themeColors.secondary);

      return {
        particleColor,
        connectionColor,
      };
    };

    /* =====================================================
       CANVAS SIZE
    ===================================================== */

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        width * pixelRatio;

      canvas.height =
        height * pixelRatio;

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    /* =====================================================
       CREATE PARTICLES
    ===================================================== */

    const createParticles = () => {
      particles.length = 0;

      const particleCount = Math.min(
        count,
        Math.floor(
          (width * height) / 25000
        )
      );

      for (
        let index = 0;
        index < particleCount;
        index++
      ) {
        particles.push({
          x:
            Math.random() *
            width,

          y:
            Math.random() *
            height,

          radius:
            Math.random() * 1.5 + 0.5,

          opacity:
            Math.random() * 0.35 + 0.1,

          velocityX:
            (Math.random() - 0.5) *
            0.25,

          velocityY:
            (Math.random() - 0.5) *
            0.25,

          pulse:
            Math.random() *
            Math.PI *
            2,
        });
      }
    };

    createParticles();

    /* =====================================================
       DETECT THEME CHANGES
    ===================================================== */

    const themeObserver =
      new MutationObserver(() => {
        themeColors =
          getThemeColors();
      });

    themeObserver.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: [
          "class",
          "data-theme",
        ],
      }
    );

    /* =====================================================
       PARTICLE ANIMATION
    ===================================================== */

    const animateParticles = () => {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      const {
        particleColor,
        connectionColor,
      } = getColors();

      /* =================================================
         DRAW PARTICLES
      ================================================= */

      particles.forEach(
        (particle) => {
          particle.x +=
            particle.velocityX;

          particle.y +=
            particle.velocityY;

          particle.pulse += 0.01;

          /* =============================================
             WRAP AROUND SCREEN
          ============================================= */

          if (particle.x < -10) {
            particle.x =
              width + 10;
          }

          if (
            particle.x >
            width + 10
          ) {
            particle.x = -10;
          }

          if (particle.y < -10) {
            particle.y =
              height + 10;
          }

          if (
            particle.y >
            height + 10
          ) {
            particle.y = -10;
          }

          /* =============================================
             PULSE
          ============================================= */

          const pulseOpacity =
            particle.opacity +
            Math.sin(
              particle.pulse
            ) * 0.08;

          /* =============================================
             DRAW PARTICLE
          ============================================= */

          context.beginPath();

          context.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
          );

          context.fillStyle =
            `rgba(${particleColor}, ${Math.max(
              pulseOpacity,
              0
            )})`;

          context.fill();
        }
      );

      /* =================================================
         CONNECT NEARBY PARTICLES
      ================================================= */

      for (
        let first = 0;
        first < particles.length;
        first++
      ) {
        for (
          let second = first + 1;
          second < particles.length;
          second++
        ) {
          const particleA =
            particles[first];

          const particleB =
            particles[second];

          const distanceX =
            particleA.x -
            particleB.x;

          const distanceY =
            particleA.y -
            particleB.y;

          const distance =
            Math.sqrt(
              distanceX *
                distanceX +
                distanceY *
                distanceY
            );

          if (
            distance <
            maxDistance
          ) {
            const opacity =
              (1 -
                distance /
                  maxDistance) *
              0.08;

            context.beginPath();

            context.moveTo(
              particleA.x,
              particleA.y
            );

            context.lineTo(
              particleB.x,
              particleB.y
            );

            context.strokeStyle =
              `rgba(${connectionColor}, ${opacity})`;

            context.lineWidth = 0.5;

            context.stroke();
          }
        }
      }

      animationFrame =
        requestAnimationFrame(
          animateParticles
        );
    };

    animationFrame =
      requestAnimationFrame(
        animateParticles
      );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      themeObserver.disconnect();

      gsap.killTweensOf(
        canvas
      );

      context.clearRect(
        0,
        0,
        width,
        height
      );
    };
  }, [count, color, maxDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="background-particles"
      aria-hidden="true"
    />
  );
}

export default BackgroundParticles;