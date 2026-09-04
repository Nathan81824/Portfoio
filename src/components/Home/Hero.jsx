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
   - React Router
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
  ArrowDown,
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

import Button from "../Shared/Button/Button.jsx";


/* =========================================================
   CENTRAL DATA
========================================================= */

import {
  getData,
} from "../../javascript/data/data.js";


/* =========================================================
   ROUTER
========================================================= */

import {
  Link,
} from "react-router-dom";





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
     ROLE ROTATION
  ======================================================= */

  const [
    roleIndex,
    setRoleIndex,
  ] = useState(0);


  /* =======================================================
     ROLE ROTATION EFFECT
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
          AMBIENT GLOWS
      =================================================== */}

      <div
        className="
          hero-glow
          hero-glow-one
        "
        aria-hidden="true"
      />

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

        <motion.div

          className="hero-content"

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
            ease: "easeOut",
          }}
        >


          {/* ===============================================
              ROTATING ROLE
          =============================================== */}

          <div
            className="hero-eyebrow"
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
                        y: 8,
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
                        y: -8,
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

          </div>


          {/* ===============================================
              MAIN HEADING
          =============================================== */}

          <motion.h1

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
              duration: 0.7,
              delay: 0.3,
              ease: "easeOut",
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
          =============================================== */}

          <motion.h2

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
              duration: 0.7,
              delay: 0.45,
              ease: "easeOut",
            }}
          >

            {
              homeText.subtitle1 ||
              "I build modern digital experiences."
            }

          </motion.h2>


          {/* ===============================================
              DESCRIPTION
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
                    y: 20,
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
              duration: 0.7,
              delay: 0.55,
              ease: "easeOut",
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
          =============================================== */}

          <motion.div

            className="hero-actions"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
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
              duration: 0.7,
              delay: 0.65,
              ease: "easeOut",
            }}
          >


            {/* =============================================
                VIEW MY WORK
            ============================================= */}

            <Button
              href="/projects"
              variant="primary"
              size="lg"
              icon={ArrowRight}
            >

              {
                homeText.button1 ||
                "View My Work"
              }

            </Button>


            {/* =============================================
                DOWNLOAD RESUME
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

        </motion.div>


        {/* =================================================
            SCROLL INDICATOR
        ================================================= */}

        <Link
          to="/"
          className="hero-scroll"
          aria-label="Scroll to About section"
          onClick={(event) => {

            event.preventDefault();

            document
              .getElementById("about")
              ?.scrollIntoView({
                behavior:
                  shouldReduceMotion
                    ? "auto"
                    : "smooth",
              });

          }}
        >

          <span>

            {
              homeText.scroll ||
              "Scroll to explore"
            }

          </span>


          <motion.div

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, 7, 0],
                  }
            }

            transition={{
              duration: 1.5,

              repeat:
                shouldReduceMotion
                  ? 0
                  : Infinity,

              ease: "easeInOut",
            }}
          >

            <ArrowDown
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />

          </motion.div>

        </Link>

      </div>

    </section>

  );

}