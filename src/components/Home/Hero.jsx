import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Download } from "lucide-react";

import Button, {
  MagneticButton,
} from "../Shared/Button/Button.jsx";

import TextScramble from "../Detection/Effects/Effects.jsx";

import {
  siteText,
  media,
} from "../../javascript/index.js";


function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const heroText = siteText.home.hero;

  const roles =
    heroText.eyebrow?.rotatingRoles || [];

  const fallbackRole =
    heroText.eyebrow?.text || "Frontend Developer";

  const [roleIndex, setRoleIndex] = useState(0);

  const [scrambleActive, setScrambleActive] =
    useState(true);


  /*
   * -------------------------------------------------------
   * CURRENT ROLE
   * -------------------------------------------------------
   */

  const currentRole =
    roles[roleIndex] || fallbackRole;


  /*
   * -------------------------------------------------------
   * ROTATE ROLE
   *
   * IMPORTANT:
   * We do NOT use a key on TypeAnimation.
   * We do NOT conditionally mount/unmount it.
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (
      shouldReduceMotion ||
      roles.length <= 1
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setRoleIndex((previousIndex) => {
        return (
          (previousIndex + 1) %
          roles.length
        );
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    roles.length,
    shouldReduceMotion,
  ]);


  /*
   * -------------------------------------------------------
   * TEXT SCRAMBLE
   *
   * It runs when the role changes.
   * The component itself stays mounted.
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (shouldReduceMotion) {
      setScrambleActive(false);
      return;
    }

    setScrambleActive(true);

    const timeout =
      window.setTimeout(() => {
        setScrambleActive(false);
      }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    currentRole,
    shouldReduceMotion,
  ]);


  /*
   * -------------------------------------------------------
   * HERO VIDEO
   * -------------------------------------------------------
   */

  const heroVideo =
    media?.videos?.heroBackground;


  /*
   * -------------------------------------------------------
   * BUTTON LINKS
   * -------------------------------------------------------
   */

  const projectsLink =
    heroText.actions?.primary?.link ||
    "/projects";

  const resumeLink =
    heroText.actions?.secondary?.link ||
    "/resume.pdf";


  /*
   * -------------------------------------------------------
   * REDUCED MOTION ROLE
   * -------------------------------------------------------
   */

  const staticRole =
    roles[0] || fallbackRole;


  /*
   * -------------------------------------------------------
   * RENDER
   * -------------------------------------------------------
   */

  return (
    <section
      className="hero"
      id="home"
    >

      {/* ================================================
          BACKGROUND VIDEO
      ================================================ */}

      {heroVideo && (
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
      )}


      {/* ================================================
          BACKGROUND OVERLAY
      ================================================ */}

      <div
        className="hero-overlay"
        aria-hidden="true"
      />


      {/* ================================================
          BACKGROUND GLOWS
      ================================================ */}

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


      {/* ================================================
          HERO CONTAINER
      ================================================ */}

      <div className="hero-container">

        <div className="hero-content">


          {/* ============================================
              EYEBROW
          ============================================ */}

          <motion.div
            className="hero-eyebrow"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -30,
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
              delay: 0.1,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {/* STATUS DOT */}

            <span
              className="
                hero-eyebrow-dot
                animate-status
              "
              aria-hidden="true"
            />


            {/* ========================================
                ANIMATION AREA
            ======================================== */}

            <span
              className="
                hero-eyebrow-animation
              "
            >

              {/* ======================================
                  TEXT SCRAMBLE
              ====================================== */}

              {!shouldReduceMotion && (
                <span
                  className={`
                    hero-eyebrow-scramble
                    ${
                      scrambleActive
                        ? "is-active"
                        : ""
                    }
                  `}
                  aria-hidden="true"
                >

                  <TextScramble
                    text={currentRole}
                    duration={900}
                    delay={0}
                    trigger={
                      scrambleActive
                    }
                  />

                </span>
              )}


              {/* ======================================
                  TYPE ANIMATION
              ====================================== */}

              <span
                className="
                  hero-eyebrow-type
                "
              >

                {shouldReduceMotion ? (

                  <span>
                    {staticRole}
                  </span>

                ) : (

                  <TypeAnimation
                    sequence={
                      roles.length > 0
                        ? [
                            ...roles.flatMap(
                              (role) => [
                                role,
                                2500,
                              ]
                            ),
                          ]
                        : [
                            fallbackRole,
                            2500,
                          ]
                    }

                    wrapper="span"

                    speed={55}

                    deletionSpeed={70}

                    repeat={Infinity}

                    cursor={true}

                    preRenderFirstString
                  />

                )}

              </span>

            </span>

          </motion.div>


          {/* ============================================
              GREETING + NAME
          ============================================ */}

          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -60,
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
              duration: 0.8,
              delay: 0.35,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {heroText.greeting.text}

            {" "}

            <span className="hero-name">
              {heroText.name.text}.
            </span>

          </motion.h1>


          {/* ============================================
              MAIN HEADING
          ============================================ */}

          <motion.h2
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 60,
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
              duration: 0.8,
              delay: 0.5,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {heroText.heading.text}

          </motion.h2>


          {/* ============================================
              DESCRIPTION
          ============================================ */}

          <motion.p
            className="hero-description"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 30,
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
              delay: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {heroText.description.text}

          </motion.p>


          {/* ============================================
              ACTION BUTTONS
          ============================================ */}

          <motion.div
            className="hero-actions"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 40,
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
              delay: 0.9,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {/* ========================================
                VIEW MY WORK
            ======================================== */}

            <MagneticButton
              href={projectsLink}
              variant="primary"
              size="lg"
            >

              {heroText.actions.primary.text}

              <ArrowRight
                size={18}
                aria-hidden="true"
              />

            </MagneticButton>


            {/* ========================================
                DOWNLOAD CV
            ======================================== */}

            <Button
              href={resumeLink}
              variant="secondary"
              size="lg"
              download
            >

              {heroText.actions.secondary.text}

              <Download
                size={18}
                aria-hidden="true"
              />

            </Button>

          </motion.div>


        </div>

      </div>


      {/* ================================================
          BOTTOM GRADIENT
      ================================================ */}

      <div
        className="
          hero-bottom-gradient
        "
        aria-hidden="true"
      />

    </section>
  );
}


export default Hero;