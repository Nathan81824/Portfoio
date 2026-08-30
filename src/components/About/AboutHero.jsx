/* =========================================================
   ABOUT HERO
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/About/AboutHero/AboutHero.jsx

   Uses:
   - getData()
   - framer-motion
   - lucide-react
   - React Router
========================================================= */

import { useEffect, useState } from "react";

import {
  ArrowRight,
  Mail,
  MapPin,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { Link } from "react-router-dom";

import { getData } from "../../javascript/data/data.js";

import image from "../../assets/images/my-image.jpg";


/* =========================================================
   ABOUT HERO
========================================================= */

export default function AboutHero() {

  /* =======================================================
     DATA
  ======================================================= */

  const {
    personalInfo = {},
    roles = [],
  } = getData();


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
    Array.isArray(roles) && roles.length > 0
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

    if (availableRoles.length <= 1) {
      return;
    }

    const interval = setInterval(() => {

      setRoleIndex((previousIndex) => {

        return (
          (previousIndex + 1) %
          availableRoles.length
        );

      });

    }, 3000);


    return () => {
      clearInterval(interval);
    };

  }, [availableRoles.length]);


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const currentRole =
    availableRoles[
      roleIndex % availableRoles.length
    ] || "Frontend Developer";


  /* =======================================================
     IMAGE FALLBACK
  ======================================================= */

  const handleImageError = (event) => {

    event.currentTarget.style.display = "none";

    const fallback =
      event.currentTarget.nextElementSibling;

    if (fallback) {
      fallback.style.display = "flex";
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

          initial={{
            opacity: 0,
            x: -35,
          }}

          whileInView={{
            opacity: 1,
            x: 0,
          }}

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
            className="about-hero-eyebrow"

            initial={{
              opacity: 0,
              y: 15,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

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
            initial={{
              opacity: 0,
              y: 25,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >

            Hi, I'm{" "}

            <span className="about-hero-name">
              {displayName}
            </span>

          </motion.h1>


          {/* ===============================================
              SUBTITLE
          =============================================== */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

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
            className="about-hero-description"

            initial={{
              opacity: 0,
              y: 20,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

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
            className="about-hero-meta"

            initial={{
              opacity: 0,
              y: 15,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

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
                />

                {location}

              </span>

            )}


            {email && (

              <span>

                <Mail
                  size={15}
                  strokeWidth={1.8}
                />

                {email}

              </span>

            )}

          </motion.div>


          {/* ===============================================
              ACTIONS
          =============================================== */}

          <motion.div
            className="about-hero-actions"

            initial={{
              opacity: 0,
              y: 20,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: 0.5,
            }}
          >

            <Link
              to="/skills"
              className="btn btn-primary"
            >

              <span>
                Behind the Code
              </span>

              <ArrowRight
                size={18}
                strokeWidth={2}
              />

            </Link>


            <Link
              to="/contact"
              className="btn btn-secondary"
            >

              <span>
                Get In Touch
              </span>

              <Mail
                size={17}
                strokeWidth={2}
              />

            </Link>

          </motion.div>

        </motion.div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <motion.div
          className="about-hero-visual"

          initial={{
            opacity: 0,
            x: 40,
            scale: 0.96,
          }}

          whileInView={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}

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

          <div className="about-hero-card">


            {/* =============================================
                IMAGE AREA
            ============================================= */}

            <div className="about-hero-image-wrapper">

              <img
                src={image}
                alt={`${displayName} - ${currentRole}`}
                className="about-hero-image"
                onError={handleImageError}
              />


              {/* ===========================================
                  IMAGE FALLBACK
              =========================================== */}

              <div
                className="about-hero-image-fallback"
                aria-hidden="true"
              >
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>


              {/* ===========================================
                  ROLE STATUS
              =========================================== */}

              <div
                className="about-hero-role"
                aria-live="polite"
              >

                {/* Glowing status dot */}

                <span
                  className="
                    about-hero-role-glow
                    animate-status
                  "
                  aria-hidden="true"
                />


                {/* Rotating role */}

                <AnimatePresence
                  mode="wait"
                  initial={false}
                >

                  <motion.span
                    key={currentRole}

                    className="about-hero-role-text"

                    initial={{
                      opacity: 0,
                      y: 8,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    exit={{
                      opacity: 0,
                      y: -8,
                    }}

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

            <div className="about-hero-card-content">

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