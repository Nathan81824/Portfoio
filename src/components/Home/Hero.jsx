/* =========================================================
   HERO
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/Home/Hero.jsx

   Uses:
   - Central website data
   - Central site text
   - Central media
   - Personal information
   - Framer Motion
   - Lucide React
   - Reusable Button component
   - MagneticButton
   - Background video
========================================================= */


/* =========================================================
   REACT
========================================================= */

import {
  useEffect,
  useState,
} from "react";


/* =========================================================
   ICONS
========================================================= */

import {
  ArrowRight,
  Download,
} from "lucide-react";


/* =========================================================
   FRAMER MOTION
========================================================= */

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";


/* =========================================================
   BUTTONS
========================================================= */

import Button, {
  MagneticButton,
} from "../Shared/Button/Button.jsx";



/* =========================================================
   CENTRAL DATA
========================================================= */

import {
  personalInfo,
  siteText,
  media,
} from "../../javascript/index.js";


/* =========================================================
   HERO
========================================================= */

export default function Hero() {


  /* =======================================================
     REDUCED MOTION
  ======================================================= */

  const shouldReduceMotion =
    useReducedMotion();


  /* =======================================================
     HOME TEXT
  ======================================================= */

  const homeText =
    siteText.home;


  /* =======================================================
     HERO TEXT

     homeText structure:

     home
     ├── hero
     │   ├── eyebrow
     │   ├── greeting
     │   ├── name
     │   ├── heading
     │   │   └── rotatingRoles
     │   ├── description
     │   ├── actions
     │   └── scroll
     │
     └── aboutPreview
  ======================================================= */

  const heroText =
    homeText.hero;


  /* =======================================================
     HERO VIDEO

     Loaded from the central media system.
  ======================================================= */

  const heroVideo =
    media.videos.heroBackground;


  /* =======================================================
     ROTATING ROLES
  ======================================================= */

  const roles =
    heroText.heading.rotatingRoles;


  /* =======================================================
     ROLE INDEX
  ======================================================= */

  const [
    roleIndex,
    setRoleIndex,
  ] = useState(0);


  /* =======================================================
     ROLE ROTATION
  ======================================================= */

  useEffect(() => {

    if (
      shouldReduceMotion ||
      roles.length <= 1
    ) {
      return;
    }


    const interval =
      window.setInterval(
        () => {

          setRoleIndex(
            (previousIndex) =>
              (
                previousIndex + 1
              ) % roles.length
          );

        },
        3000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    roles.length,
    shouldReduceMotion,
  ]);


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const currentRole =
    roles[
      roleIndex % roles.length
    ];


  /* =======================================================
     DISPLAY NAME
  ======================================================= */

  const displayName =
    personalInfo.displayName;


  /* =======================================================
     RESUME URL
  ======================================================= */

  const resumeUrl =
    heroText.actions.secondary.link;


  /* =======================================================
     PROJECTS URL
  ======================================================= */

  const projectsUrl =
    heroText.actions.primary.link;


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="hero"
      id="home"
    >


      {/* ===================================================
          BACKGROUND VIDEO
      =================================================== */}

      <div
        className="hero-video"
        aria-hidden="true"
      >

        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

      </div>


      {/* ===================================================
          VIDEO OVERLAY
      =================================================== */}

      <div
        className="hero-overlay"
        aria-hidden="true"
      />


      {/* ===================================================
          AMBIENT GLOW ONE
      =================================================== */}

      <div
        className="
          hero-glow
          hero-glow-one
        "
        aria-hidden="true"
      />


      {/* ===================================================
          AMBIENT GLOW TWO
      =================================================== */}

      <div
        className="
          hero-glow
          hero-glow-two
        "
        aria-hidden="true"
      />


      {/* ===================================================
          HERO CONTAINER
      =================================================== */}

      <div className="hero-container">


        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div className="hero-content">


          {/* ===============================================
              EYEBROW

              Direction:
              TOP → CENTER
          =============================================== */}

          <motion.div

            className="hero-eyebrow"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -45,
                    scale: 0.96,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
            }

            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}

            aria-live="polite"
          >

            <span
              className="
                hero-eyebrow-dot
                animate-status
              "
              aria-hidden="true"
            />


            <AnimatePresence
              mode="wait"
              initial={false}
            >

              <motion.span

                key={currentRole}

                className="hero-eyebrow-text"

                initial={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: 10,
                      }
                }

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: -10,
                      }
                }

                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >

                {currentRole}

              </motion.span>

            </AnimatePresence>

          </motion.div>


          {/* ===============================================
              MAIN HEADING

              Direction:
              LEFT → CENTER
          =============================================== */}

          <motion.h1

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -90,
                    scale: 0.97,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
            }

            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {heroText.greeting.text}

            {" "}

            <span className="hero-name">

              {displayName}.

            </span>

          </motion.h1>


          {/* ===============================================
              SUBTITLE

              Direction:
              RIGHT → CENTER
          =============================================== */}

          <motion.h2

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 90,
                    scale: 0.97,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
            }

            transition={{
              duration: 0.9,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <AnimatePresence
              mode="wait"
              initial={false}
            >

              <motion.span

                key={currentRole}

                initial={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                        y: 10,
                      }
                }

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                        y: -10,
                      }
                }

                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >

                {currentRole}

              </motion.span>

            </AnimatePresence>

          </motion.h2>


          {/* ===============================================
              DESCRIPTION

              Direction:
              LEFT → CENTER
          =============================================== */}

          <motion.p

            className="hero-description"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -70,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            transition={{
              duration: 0.85,
              delay: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {heroText.description.text}

          </motion.p>


          {/* ===============================================
              HERO ACTIONS

              Direction:
              BOTTOM → CENTER
          =============================================== */}

          <motion.div

            className="hero-actions"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 60,
                    scale: 0.96,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }
            }

            transition={{
              duration: 0.9,
              delay: 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
          >


            {/* =============================================
                VIEW MY WORK

                MAGNETIC BUTTON
            ============================================= */}

            <MagneticButton

              href={projectsUrl}

              variant="primary"

              size="lg"

              icon={ArrowRight}
            >

              {heroText.actions.primary.text}

            </MagneticButton>


            {/* =============================================
                DOWNLOAD CV

                NORMAL BUTTON
            ============================================= */}

            <Button

              href={resumeUrl}

              variant="secondary"

              size="lg"

              icon={Download}

              download
            >

              {heroText.actions.secondary.text}

            </Button>


          </motion.div>


          {/* ===============================================
              SCROLL TO EXPLORE
          =============================================== */}

          <motion.a

            href={
              heroText.scroll.link
            }

            className="hero-scroll"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <span
              className="hero-scroll-line"
              aria-hidden="true"
            />

            <span className="hero-scroll-text">

              {heroText.scroll.text}

            </span>

          </motion.a>


        </div>

      </div>


      {/* ===================================================
          BOTTOM GRADIENT
      =================================================== */}

      <div
        className="hero-bottom-gradient"
        aria-hidden="true"
      />


    </section>

  );
}