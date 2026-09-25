/* =========================================================
   HERO TEXT
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/siteText/home/heroText.js

   PURPOSE
   ---------------------------------------------------------
   Central text content for the Home Hero.

   PERSONAL DATA
   ---------------------------------------------------------
   Personal information and roles come from:

   src/javascript/data/data.js

   This keeps Nathan's personal information and roles
   centralized inside personal.js.
========================================================= */


/* =========================================================
   DATA
========================================================= */

import {
  personalInfo,
  roles,
} from "../../data/data.js";


/* =========================================================
   HERO TEXT
========================================================= */

const heroText = {


  /* =======================================================
     EYEBROW
  ======================================================= */

  eyebrow: {
    text: personalInfo.role,

    rotatingRoles: roles,
  },


  /* =======================================================
     GREETING
  ======================================================= */

  greeting: {
    text: "Hi, I'm",
  },


  /* =======================================================
     NAME
  ======================================================= */

  name: {
    text: personalInfo.displayName,
  },


  /* =======================================================
     MAIN HEADING
  ======================================================= */

  heading: {
    text:
      "I build modern digital experiences.",
  },


  /* =======================================================
     DESCRIPTION
  ======================================================= */

  description: {
    text:
      "I create responsive, interactive and modern digital experiences with a strong focus on clean design, usability and performance.",
  },


  /* =======================================================
     ACTIONS
  ======================================================= */

  actions: {

    /* =====================================================
       PRIMARY ACTION
    ===================================================== */

    primary: {
      text: "View My Work",
      link: "/projects",
    },


    /* =====================================================
       SECONDARY ACTION
    ===================================================== */

    secondary: {
      text: "Download Resume",
      link: personalInfo.resume,
    },

  },


  /* =======================================================
     SCROLL
  ======================================================= */

  scroll: {
    text: "Scroll to explore",
    link: "/about",
  },

};


/* =========================================================
   EXPORT
========================================================= */

export default heroText;