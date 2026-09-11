import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * Glitchy / techy asymmetric shutter page transition.
 *
 * Uses the colors from theme.css.
 */

const BARS = 6;
const SHARP_EASE = [0.83, 0, 0.17, 1];

const contentVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },

  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

export default function PageTransition({ children, label }) {
  const location = useLocation();

  const [glitching, setGlitching] = useState(false);

  const pageLabel =
    label ||
    (location.pathname === "/"
      ? "Home"
      : location.pathname.replace("/", "").toUpperCase());

  useEffect(() => {
    setGlitching(true);

    const timer = setTimeout(() => {
      setGlitching(false);
    }, 550);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        style={{
          position: "relative",
        }}
      >
        {/* =====================================================
            SHUTTER BARS
        ===================================================== */}

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: BARS }).map((_, i) => {
            const fromTop = i % 2 === 0;
            const delay = i * 0.045;

            return (
              <motion.div
                key={i}
                initial={{
                  scaleY: 1,
                }}
                animate={{
                  scaleY: 0,
                  transition: {
                    duration: 0.85,
                    delay,
                    ease: SHARP_EASE,
                  },
                }}
                exit={{
                  scaleY: 1,
                  transition: {
                    duration: 0.6,
                    delay: (BARS - i) * 0.03,
                    ease: SHARP_EASE,
                  },
                }}
                style={{
                  flex: 1,

                  background:
                    i % 3 === 0
                      ? "var(--bg-primary)"
                      : i % 3 === 1
                      ? "var(--bg-secondary)"
                      : "var(--bg-tertiary)",

                  transformOrigin: fromTop
                    ? "top"
                    : "bottom",

                  borderRight:
                    i < BARS - 1
                      ? "1px solid var(--border-accent)"
                      : "none",
                }}
              />
            );
          })}
        </div>

        {/* =====================================================
            ACCENT SCANLINE
        ===================================================== */}

        <motion.div
          initial={{
            top: "-5%",
            opacity: 0,
          }}
          animate={{
            top: "105%",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.9,
            ease: "linear",
          }}
          exit={{
            opacity: 0,
          }}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            height: "2px",
            zIndex: 1001,

            background:
              "linear-gradient(90deg, transparent, var(--accent-secondary), var(--accent-primary), var(--accent-hover), var(--accent-primary), var(--accent-secondary), transparent)",

            boxShadow:
              "var(--shadow-accent)",

            pointerEvents: "none",
          }}
        />

        {/* =====================================================
            PAGE LABEL
        ===================================================== */}

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            style={{
              position: "relative",
            }}
          >
            {/* =================================================
                MAIN PAGE NAME
            ================================================= */}

            <motion.span
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -25],
                scale: [0.96, 1, 1, 1.02],
              }}
              transition={{
                duration: 0.85,
                times: [0, 0.25, 0.68, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
              style={{
                position: "relative",
                display: "inline-block",

                fontWeight: 800,
                fontSize: "clamp(2rem, 7vw, 5.5rem)",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",

                color: "var(--text-primary)",

                textShadow:
                  "0 0 20px var(--border-accent)",
              }}
            >
              {pageLabel}
            </motion.span>

            {/* =================================================
                GLITCH LAYERS
            ================================================= */}

            {glitching && (
              <>
                <span
                  aria-hidden="true"
                  className="glitch-layer glitch-accent"
                >
                  {pageLabel}
                </span>

                <span
                  aria-hidden="true"
                  className="glitch-layer glitch-secondary"
                >
                  {pageLabel}
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>

        {/* =====================================================
            GLITCH STYLES
        ===================================================== */}

        <style>{`
          .glitch-layer {
            position: absolute;
            top: 0;
            left: 0;

            display: inline-block;
            width: 100%;

            font-weight: 800;
            font-size: clamp(2rem, 7vw, 5.5rem);
            letter-spacing: -0.02em;
            text-transform: uppercase;

            mix-blend-mode: screen;
            opacity: 0.85;

            pointer-events: none;
          }

          .glitch-accent {
            color: var(--accent-primary);

            animation:
              glitchShiftA
              0.5s
              steps(2, jump-none)
              1;

            clip-path:
              polygon(
                0 0,
                100% 0,
                100% 45%,
                0 45%
              );
          }

          .glitch-secondary {
            color: var(--accent-secondary);

            animation:
              glitchShiftB
              0.5s
              steps(2, jump-none)
              1;

            clip-path:
              polygon(
                0 55%,
                100% 55%,
                100% 100%,
                0 100%
              );
          }

          @keyframes glitchShiftA {
            0% {
              transform: translate(0, 0);
              opacity: 0;
            }

            20% {
              transform: translate(-6px, -2px);
              opacity: 0.9;
            }

            40% {
              transform: translate(5px, 1px);
              opacity: 0.7;
            }

            60% {
              transform: translate(-3px, 0);
              opacity: 0.9;
            }

            100% {
              transform: translate(0, 0);
              opacity: 0;
            }
          }

          @keyframes glitchShiftB {
            0% {
              transform: translate(0, 0);
              opacity: 0;
            }

            20% {
              transform: translate(6px, 2px);
              opacity: 0.9;
            }

            40% {
              transform: translate(-5px, -1px);
              opacity: 0.7;
            }

            60% {
              transform: translate(3px, 0);
              opacity: 0.9;
            }

            100% {
              transform: translate(0, 0);
              opacity: 0;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}