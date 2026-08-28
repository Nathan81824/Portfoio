import { useEffect, useState } from "react";

import {
  ArrowDown,
  ArrowRight,
  Download,
} from "lucide-react";

import { motion } from "framer-motion";

import video from "../../assets/videos/hero-background.mp4";

import Button from "../Shared/Button/Button";

import { getData } from "../../javascript/data/data";
import { formatName } from "../../javascript/utils/formaters";


export default function Hero() {

  /* =======================================================
     GET WEBSITE DATA
  ======================================================= */

  const {
    personalInfo,
    roles,
    siteText,
  } = getData();


  /* =======================================================
     FORMAT NAME
  ======================================================= */

  const formattedName =
    formatName(personalInfo.name);


  /* =======================================================
     ROLE ROTATION
  ======================================================= */

  const [roleIndex, setRoleIndex] =
    useState(0);


  useEffect(() => {

    if (!roles || roles.length <= 1) {
      return;
    }


    const interval =
      setInterval(() => {

        setRoleIndex((previousIndex) => {

          return (
            (previousIndex + 1) %
            roles.length
          );

        });

      }, 3000);


    return () => {
      clearInterval(interval);
    };

  }, [roles]);


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const currentRole =
    roles?.[roleIndex] ||
    "Developer";


  /* =======================================================
     HOME CONTENT
  ======================================================= */

  const homeText =
    siteText?.home || {};


  /* =======================================================
     HERO
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
        className="hero-glow hero-glow-one"
        aria-hidden="true"
      />

      <div
        className="hero-glow hero-glow-two"
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

          initial={{
            opacity: 0,
            y: 25,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >


          {/* ===============================================
              CURRENT ROLE
          =============================================== */}

          <motion.span
            key={currentRole}
            className="hero-eyebrow"

            initial={{
              opacity: 0,
              x: -20,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >

            {currentRole}

          </motion.span>


          {/* ===============================================
              MAIN HEADING
          =============================================== */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
          >

            {homeText.greeting || "Hi, I'm"}{" "}

            <span className="hero-name">
              {formattedName}.
            </span>

          </motion.h1>


          {/* ===============================================
              SUBTITLE
          =============================================== */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >

            {homeText.subtitle1}

          </motion.h2>


          {/* ===============================================
              DESCRIPTION
          =============================================== */}

          <motion.p
            className="hero-description"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.5,
            }}
          >

            {homeText.description1}

          </motion.p>


          {/* ===============================================
              HERO BUTTONS
          =============================================== */}

          <motion.div
            className="hero-actions"

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.6,
            }}
          >


            {/* =============================================
                PRIMARY BUTTON
            ============================================= */}

            <Button
              href="#projects"
              variant="primary"
              size="lg"
              icon={ArrowRight}
            >

              {homeText.button1}

            </Button>


            {/* =============================================
                SECONDARY BUTTON
            ============================================= */}

            <Button
              href={personalInfo.resume}
              variant="secondary"
              size="lg"
              icon={Download}
              download
            >

              {homeText.button2}

            </Button>


          </motion.div>

        </motion.div>


        {/* =================================================
            SCROLL INDICATOR
        ================================================= */}

        <motion.a
          href="#about"
          className="hero-scroll"

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 1.2,
            duration: 0.6,
          }}
        >

          <span>
            {homeText.scroll}
          </span>


          <motion.div
            animate={{
              y: [0, 7, 0],
            }}

            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <ArrowDown
              size={18}
              strokeWidth={2}
            />

          </motion.div>

        </motion.a>


      </div>

    </section>
  );
}