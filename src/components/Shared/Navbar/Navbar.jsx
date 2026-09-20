import { useEffect, useState } from "react";

import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import clsx from "clsx";

import {
  personalInfo,
  navigation,
  useTheme,
} from "../../../javascript/index.js";

import Button, {
  MagneticButton,
} from "../Button/Button.jsx";

import {
  TextScramble,
} from "../../Detection/Effects/Effects.jsx";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const navLinks =
    navigation?.main ||
    navigation ||
    [];

  const resumeUrl =
    `${import.meta.env.BASE_URL}resume.pdf`;

  const logoName =
    personalInfo?.name ||
    "Portfolio";

  const logoLetter =
    logoName.charAt(0).toUpperCase();


  /* =========================================================
     SCROLL STATE
  ========================================================= */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  /* =========================================================
     CLOSE MENU WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  /* =========================================================
     LOCK BODY SCROLL
  ========================================================= */

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);


  /* =========================================================
     MENU CONTROLS
  ========================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((previous) => !previous);
  };


  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };


  /* =========================================================
     NAVBAR ANIMATION
  ========================================================= */

  const navbarTransition = {
    duration: 0.45,
    ease: [0.76, 0, 0.24, 1],
  };


  /* =========================================================
     MOBILE MENU ANIMATION
  ========================================================= */

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,

      transition: {
        duration: 0.3,
        ease: [0.76, 0, 0.24, 1],
      },
    },

    open: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.55,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };


  /* =========================================================
     MOBILE LINK ANIMATION
  ========================================================= */

  const mobileLinkVariants = {
    closed: {
      opacity: 0,
      x: -25,
    },

    open: (index) => ({
      opacity: 1,
      x: 0,

      transition: {
        duration: 0.5,
        delay: 0.08 + index * 0.06,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <motion.header
      className={clsx(
        "navbar",
        scrolled
          ? "navbar-scrolled"
          : "navbar-top"
      )}

      animate={{
        y: 0,
        opacity: 1,
      }}

      transition={navbarTransition}
    >

      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="navbar-container">


        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="Go to homepage"
        >

          <motion.span
            className="navbar-logo-mark"

            whileHover={{
              rotate: 8,
              scale: 1.06,
            }}

            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
            }}
          >
            {logoLetter}
          </motion.span>


          <span className="navbar-logo-name">
            <TextScramble
              text={logoName}
              duration={700}
              delay={100}
              className="text-scramble"
            />
          </span>

        </Link>


        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >

          {navLinks.map((item) => {
            const path =
              item.path ||
              item.href ||
              "/";

            const label =
              item.label ||
              item.name ||
              "";

            const active =
              isActive(path);

            return (
              <Link
                key={path}
                to={path}
                className={clsx(
                  "navbar-link",
                  active &&
                    "navbar-link-active"
                )}
              >

                <motion.span
                  initial={false}
                  animate={{
                    y: active ? -1 : 0,
                  }}

                  transition={{
                    duration: 0.25,
                  }}
                >
                  {label}
                </motion.span>


                {/* ACTIVE INDICATOR */}

                <AnimatePresence>
                  {active && (
                    <motion.span
                      className="navbar-link-indicator"

                      layoutId="navbar-active-indicator"

                      initial={{
                        opacity: 0,
                        scaleX: 0,
                      }}

                      animate={{
                        opacity: 1,
                        scaleX: 1,
                      }}

                      exit={{
                        opacity: 0,
                        scaleX: 0,
                      }}

                      transition={{
                        duration: 0.35,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    />
                  )}
                </AnimatePresence>

              </Link>
            );
          })}

        </nav>


        {/* ===================================================
            RIGHT CONTROLS
        =================================================== */}

        <div className="navbar-right">


          {/* =================================================
              THEME BUTTON
          ================================================= */}

          <MagneticButton
            type="button"

            className="navbar-theme"

            strength={0.2}
            duration={0.3}

            onClick={toggleTheme}

            aria-label={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }

            title={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >

            <AnimatePresence
              mode="wait"
              initial={false}
            >

              {darkMode ? (

                <motion.span
                  key="sun"

                  initial={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.6,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.6,
                  }}

                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Sun
                    size={18}
                    strokeWidth={2}
                  />
                </motion.span>

              ) : (

                <motion.span
                  key="moon"

                  initial={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.6,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.6,
                  }}

                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Moon
                    size={18}
                    strokeWidth={2}
                  />
                </motion.span>

              )}

            </AnimatePresence>

          </MagneticButton>


          {/* =================================================
              DESKTOP RESUME
          ================================================= */}

          <div className="navbar-resume-desktop">

            <Button
              as="a"

              href={resumeUrl}

              download

              magnetic

              magneticStrength={0.15}

              className="navbar-resume"
            >

              <Download
                size={17}
                strokeWidth={2}
                className="navbar-resume-icon"
              />

              <span>
                Resume
              </span>

            </Button>

          </div>


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <MagneticButton
            type="button"

            className="navbar-menu-button"

            strength={0.2}
            duration={0.3}

            onClick={toggleMenu}

            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }

            aria-expanded={menuOpen}
          >

            <AnimatePresence
              mode="wait"
              initial={false}
            >

              {menuOpen ? (

                <motion.span
                  key="close"

                  initial={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.7,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.7,
                  }}

                  transition={{
                    duration: 0.25,
                  }}
                >
                  <X
                    size={24}
                    strokeWidth={2}
                  />
                </motion.span>

              ) : (

                <motion.span
                  key="menu"

                  initial={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.7,
                  }}

                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.7,
                  }}

                  transition={{
                    duration: 0.25,
                  }}
                >
                  <Menu
                    size={24}
                    strokeWidth={2}
                  />
                </motion.span>

              )}

            </AnimatePresence>

          </MagneticButton>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div
            className="navbar-mobile-menu navbar-mobile-menu-open"

            variants={mobileMenuVariants}

            initial="closed"
            animate="open"
            exit="closed"

            data-lenis-prevent
          >


            {/* ===============================================
                MOBILE HEADER
            =============================================== */}

            <div className="navbar-mobile-header">

              <div className="navbar-mobile-title">

                <span>
                  <TextScramble
                    text="Navigation"
                    duration={500}
                    className="text-scramble"
                  />
                </span>

                <span>
                  <TextScramble
                    text="Menu"
                    duration={600}
                    delay={100}
                    className="text-scramble"
                  />
                </span>

              </div>


              <MagneticButton
                type="button"

                className="navbar-mobile-close"

                strength={0.18}
                duration={0.3}

                onClick={closeMenu}

                aria-label="Close navigation menu"
              >

                <X
                  size={22}
                  strokeWidth={2}
                />

              </MagneticButton>

            </div>


            {/* ===============================================
                MOBILE LINKS
            =============================================== */}

            <nav
              className="navbar-mobile-links"
              aria-label="Mobile navigation"
            >

              {navLinks.map(
                (item, index) => {

                  const path =
                    item.path ||
                    item.href ||
                    "/";

                  const label =
                    item.label ||
                    item.name ||
                    "";

                  const active =
                    isActive(path);

                  return (

                    <motion.div
                      key={path}

                      custom={index}

                      variants={
                        mobileLinkVariants
                      }

                      initial="closed"

                      animate="open"
                    >

                      <Link
                        to={path}

                        className={clsx(
                          "navbar-mobile-link",

                          active &&
                            "navbar-mobile-link-active"
                        )}

                        onClick={closeMenu}
                      >

                        <span className="navbar-mobile-number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>


                        <motion.span
                          className="navbar-mobile-text"

                          whileHover={{
                            x: 8,
                          }}

                          transition={{
                            duration: 0.25,
                          }}
                        >
                          {label}
                        </motion.span>

                      </Link>

                    </motion.div>

                  );
                }
              )}

            </nav>


            {/* ===============================================
                MOBILE RESUME
            =============================================== */}

            <motion.div
              className="navbar-resume-mobile"

              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.5,
                delay: 0.35,
                ease: [0.76, 0, 0.24, 1],
              }}
            >

              <Button
                as="a"

                href={resumeUrl}

                download

                magnetic

                magneticStrength={0.15}

                className="navbar-resume"

                onClick={closeMenu}
              >

                <Download
                  size={17}
                  strokeWidth={2}
                  className="navbar-resume-icon"
                />

                <span>
                  Download Resume
                </span>

              </Button>

            </motion.div>


            {/* ===============================================
                MOBILE FOOTER
            =============================================== */}

            <motion.div
              className="navbar-mobile-footer"

              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              transition={{
                duration: 0.5,
                delay: 0.45,
              }}
            >

              <span className="navbar-mobile-footer-dot" />

              <span>
                {personalInfo?.profession ||
                  personalInfo?.role ||
                  "Frontend Developer"}
              </span>

              <span>
                •
              </span>

              <span>
                {logoName}
              </span>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.header>
  );
}


export default Navbar;