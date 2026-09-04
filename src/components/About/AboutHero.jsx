/* =========================================================
   ABOUT HERO
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/About/AboutHero/AboutHero.jsx

   Uses:
   - Central website data
   - Framer Motion
   - Lucide React
   - Reusable Button component
   - Background image
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
  Mail,
  MapPin,
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
   CENTRAL DATA
========================================================= */

import {
  getData,
} from "../../javascript/data/data.js";


/* =========================================================
   BUTTON
========================================================= */

import Button from "../Shared/Button/Button.jsx";


/* =========================================================
   IMAGE
========================================================= */

import image from "../../assets/images/my-image.jpg";




/* =========================================================
   ABOUT HERO
========================================================= */

export default function AboutHero() {

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


  /* =======================================================
     PERSONAL INFORMATION
  ======================================================= */

  const displayName =
    personalInfo.displayName ||
    personalInfo.name ||
    "Nathan";


  const location =
    personalInfo.location ||
    "";


  const email =
    personalInfo.email ||
    "";


  const bio =
    personalInfo.bio ||
    "I build modern, responsive and interactive digital experiences using modern frontend technologies.";


  /* =======================================================
     ROLE LIST
  ======================================================= */

  const availableRoles =
    roles.length > 0

      ? roles

      : [
          personalInfo.role ||
          "Frontend Developer",
        ];


  /* =======================================================
     ROLE STATE
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
      availableRoles.length <= 1
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
              ) %
              availableRoles.length
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
    availableRoles.length,
    shouldReduceMotion,
  ]);


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const currentRole =
    availableRoles[
      roleIndex %
      availableRoles.length
    ] ||
    "Frontend Developer";


  /* =======================================================
     IMAGE FALLBACK
  ======================================================= */

  const handleImageError = (
    event
  ) => {

    event.currentTarget.style.display =
      "none";


    const fallback =
      event.currentTarget
        .nextElementSibling;


    if (fallback) {

      fallback.style.display =
        "flex";

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="about-hero"
      id="about"
    >


      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="about-hero-background"
        aria-hidden="true"
      >

        <div
          className="
            about-hero-glow
            about-hero-glow-one
          "
        />

        <div
          className="
            about-hero-glow
            about-hero-glow-two
          "
        />

      </div>


      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <div className="about-hero-container">


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <motion.div

          className="about-hero-content"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -35,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                }
          }

          viewport={{
            once: true,
            amount: 0.2,
          }}

          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >


          {/* ===============================================
              EYEBROW
          =============================================== */}

          <motion.div

            className="
              about-hero-eyebrow
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.6,
            }}
          >

            ABOUT ME

          </motion.div>


          {/* ===============================================
              HEADING
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

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >

            Hi, I'm{" "}

            <span
              className="about-hero-name"
            >

              {displayName}

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
                    y: 20,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >

            I create modern digital
            experiences for the web.

          </motion.h2>


          {/* ===============================================
              DESCRIPTION
          =============================================== */}

          <motion.p

            className="
              about-hero-description
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
          >

            {bio}

          </motion.p>


          {/* ===============================================
              META INFORMATION
          =============================================== */}

          <motion.div

            className="
              about-hero-meta
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
          >

            {location && (

              <span>

                <MapPin
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {location}

              </span>

            )}


            {email && (

              <a
                href={`mailto:${email}`}
              >

                <Mail
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {email}

              </a>

            )}

          </motion.div>


          {/* ===============================================
              ACTIONS
          =============================================== */}

          <motion.div

            className="
              about-hero-actions
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.5,
            }}
          >


            {/* =============================================
                SKILLS
            ============================================= */}

            <Button
              href="/skills"
              variant="primary"
              size="lg"
              icon={ArrowRight}
            >

              Behind the Code

            </Button>


            {/* =============================================
                CONTACT
            ============================================= */}

            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              icon={Mail}
            >

              Get In Touch

            </Button>

          </motion.div>

        </motion.div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <motion.div

          className="
            about-hero-visual
          "

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 40,
                  scale: 0.96,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }
          }

          viewport={{
            once: true,
            amount: 0.2,
          }}

          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
        >

          <div
            className="
              about-hero-card
            "
          >


            {/* =============================================
                IMAGE AREA
            ============================================= */}

            <div
              className="
                about-hero-image-wrapper
              "
            >

              <img
                src={image}
                alt={
                  `${displayName} — ${currentRole}`
                }
                className="
                  about-hero-image
                "
                onError={
                  handleImageError
                }
              />


              {/* ===========================================
                  IMAGE FALLBACK
              =========================================== */}

              <div
                className="
                  about-hero-image-fallback
                "
                aria-hidden="true"
              >

                {
                  displayName
                    .charAt(0)
                    .toUpperCase()
                }

              </div>


              {/* ===========================================
                  ROLE STATUS
              =========================================== */}

              <div
                className="
                  about-hero-role
                "
                aria-live="polite"
              >

                <span
                  className="
                    about-hero-role-glow
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
                      about-hero-role-text
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
                    }}
                  >

                    {currentRole}

                  </motion.span>

                </AnimatePresence>

              </div>

            </div>


            {/* =============================================
                CARD CONTENT
            ============================================= */}

            <div
              className="
                about-hero-card-content
              "
            >

              <span>
                Currently
              </span>

              <strong>
                {currentRole}
              </strong>

              <p>
                Building modern and engaging
                digital experiences.
              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>

  );

}