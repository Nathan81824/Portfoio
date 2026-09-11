import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { useTheme } from "../../context/ThemeContext";



function ThemeTransition() {
  const { theme } = useTheme();

  const [displayTheme, setDisplayTheme] = useState(theme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("right");


  useEffect(() => {
    if (theme === displayTheme) return;

    const nextDirection =
      theme === "light"
        ? "right"
        : "left";

    setDirection(nextDirection);
    setIsTransitioning(true);


    const timer = setTimeout(() => {
      setDisplayTheme(theme);
    }, 400);


    const finishTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);


    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };

  }, [theme, displayTheme]);


  const variants = {

    initial: {
      x:
        direction === "right"
          ? "-100%"
          : "100%",
    },

    animate: {
      x: "0%",
    },

    exit: {
      x:
        direction === "right"
          ? "100%"
          : "-100%",
    },

  };


  return (
    <AnimatePresence>
      {isTransitioning && (

        <motion.div
          className={`theme-transition theme-transition-${displayTheme}`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
        >

          <div className="theme-transition-glow" />

          <div className="theme-transition-content">

            <span className="theme-transition-label">
              {theme === "light"
                ? "LIGHT MODE"
                : "DARK MODE"}
            </span>

          </div>

        </motion.div>

      )}
    </AnimatePresence>
  );
}


export default ThemeTransition;