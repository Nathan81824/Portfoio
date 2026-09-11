/* =========================================================
   HERO
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/Home/Hero.jsx

   Uses:
   - Central website data
   - Framer Motion
   - Lucide React
   - Reusable Button component
   - MagneticButton
   - Background video
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
   VIDEO
========================================================= */

import video from "../../assets/videos/hero-background.mp4";


/* =========================================================
   BUTTON
========================================================= */

import Button, {
  MagneticButton,
} from "../Shared/Button/Button.jsx";


/* =========================================================
   CENTRAL DATA
========================================================= */

import {
  getData,
} from "../../javascript/data/data.js";


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
     WEBSITE DATA
  ======================================================= */

  const data =
    getData();


  const personalInfo =
    data?.personalInfo || {};


  const roles =
    Array.isArray(data?.roles)
      ? data.roles
      : [];


  const siteText =
    data?.siteText || {};


  /* =======================================================
     HOME TEXT
  ======================================================= */

  const homeText =
    siteText?.home || {};


  /* =======================================================
     DISPLAY NAME
  ======================================================= */

  const displayName =
    personalInfo.displayName ||
    personalInfo.name ||
    "Nathan";


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
    roles.length > 0
      ? roles[
          roleIndex % roles.length
        ]
      : "Frontend Developer";


  /* =======================================================
     RESUME URL
  ======================================================= */

  const resumeUrl =
    personalInfo.resume ||
    `${import.meta.env.BASE_URL}resume.pdf`;


  /* =======================================================
     PROJECTS URL
  ======================================================= */

  const projectsUrl =
    `${import.meta.env.BASE_URL}projects`;


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
          src={video}
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

                className="
                  hero-eyebrow-text
                "

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

            {
              homeText.greeting ||
              "Hi, I'm"
            }

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

            {
              homeText.subtitle1 ||
              "I build modern digital experiences."
            }

          </motion.h2>


          {/* ===============================================
              DESCRIPTION

              Direction:
              LEFT → CENTER
          =============================================== */}

          <motion.p

            className="
              hero-description
            "

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

            {
              homeText.description1 ||
              personalInfo.bio ||
              "I create responsive, interactive and visually engaging websites using modern frontend technologies."
            }

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

                ONE MAGNETIC BUTTON
            ============================================= */}

            <MagneticButton

              href={projectsUrl}

              variant="primary"

              size="lg"

              icon={ArrowRight}
            >

              {
                homeText.button1 ||
                "View My Work"
              }

            </MagneticButton>


            {/* =============================================
                DOWNLOAD RESUME

                NORMAL BUTTON
            ============================================= */}

            <Button

              href={resumeUrl}

              variant="secondary"

              size="lg"

              icon={Download}

              download
            >

              {
                homeText.button2 ||
                "Download Resume"
              }

            </Button>

          </motion.div>


        </div>

      </div>

    </section>

  );
}