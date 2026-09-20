/* =========================================================
   WHO I AM TEXT
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/siteText/about/whoIAmText.js

   Stores all text used by the Who I Am section.
========================================================= */


import {
  personalInfo,
} from "../../data/data.js";


/* =========================================================
   WHO I AM
========================================================= */

const whoIAmText = {


  /* =======================================================
     SECTION
  ======================================================= */

  number: "01",

  label: "WHO I AM",


  /* =======================================================
     HEADING
  ======================================================= */

  heading: {

    main:
      "Building with curiosity.",

    accent:
      " Creating with purpose.",

  },


  /* =======================================================
     PARAGRAPHS
  ======================================================= */

  paragraphs: [

    `I'm ${personalInfo.displayName}, a frontend developer who enjoys turning ideas into interactive digital experiences. I started with the fundamentals of HTML and CSS, then moved into JavaScript and React as I wanted to build more dynamic and engaging interfaces.`,

    "I enjoy experimenting with animations, responsive layouts, modern UI, and different technologies to understand how things work. Every project gives me something new to learn and another opportunity to improve how I build.",

    "For me, frontend development isn't just about making a page look good. It's about creating experiences that feel intuitive, responsive, and enjoyable to use.",

  ],


  /* =======================================================
     HIGHLIGHTS
  ======================================================= */

  highlights: {

    frontend: {

      title:
        "Frontend Developer",

      description:
        "Building responsive interfaces",

    },


    react: {

      title:
        "React Developer",

      description:
        "Creating interactive experiences",

    },


    creative: {

      title:
        "Creative Builder",

      description:
        "Turning ideas into digital experiences",

    },

  },


  /* =======================================================
     IMAGE
  ======================================================= */

  imageAlt:
    `${personalInfo.displayName} in a futuristic frontend development workspace.`,


  /* =======================================================
     FLOATING CARD
  ======================================================= */

  card: {

    title:
      "Always learning",

    description:
      "Always building",

  },

};


/* =========================================================
   EXPORT
========================================================= */

export default whoIAmText;