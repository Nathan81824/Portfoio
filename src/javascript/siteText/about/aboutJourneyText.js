/* =========================================================
   MY JOURNEY TEXT
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/siteText/about/myJourneyText.js

   Stores all text used by the My Journey section.
========================================================= */


/* =========================================================
   MY JOURNEY
========================================================= */

const myJourneyText = {


  /* =======================================================
     SECTION
  ======================================================= */

  number: "02",

  label: "MY JOURNEY",


  /* =======================================================
     HEADING
  ======================================================= */

  heading: {

    main:
      "From learning the basics.",

    accent:
      " To building real experiences.",

  },


  /* =======================================================
     INTRO
  ======================================================= */

  intro:
    "My journey in frontend development has been about learning, experimenting, building, and improving. Each stage has helped me understand more about how the web works and how I can turn ideas into experiences people can actually use.",


  /* =======================================================
     JOURNEY STEPS
  ======================================================= */

  steps: [

    {
      id: "foundations",

      number: "01",

      period: "THE BEGINNING",

      title:
        "Learning the Foundations",

      description:
        "I started by learning HTML and CSS, understanding how websites are structured, styled, and made responsive. These fundamentals gave me the foundation I needed to start building my own interfaces.",

      skills: [
        "HTML",
        "CSS",
        "Responsive Design",
      ],
    },


    {
      id: "javascript",

      number: "02",

      period: "THE NEXT STEP",

      title:
        "Discovering JavaScript",

      description:
        "After learning the fundamentals, I moved into JavaScript. This introduced me to logic, interaction, state, events, and the ability to make websites behave like real applications.",

      skills: [
        "JavaScript",
        "DOM",
        "Logic",
      ],
    },


    {
      id: "react",

      number: "03",

      period: "GOING FURTHER",

      title:
        "Building with React",

      description:
        "React opened up a new way of thinking about frontend development. I started building reusable components, managing state, working with routing, and creating more interactive applications.",

      skills: [
        "React",
        "Components",
        "State",
      ],
    },


    {
      id: "modern",

      number: "04",

      period: "TODAY",

      title:
        "Creating Modern Experiences",

      description:
        "Now I'm exploring modern frontend tools, animations, responsive interfaces, APIs, state management, and creative interactions while continuing to build projects that challenge me to improve.",

      skills: [
        "React",
        "Framer Motion",
        "GSAP",
        "Zustand",
      ],
    },


  ],


  /* =======================================================
     BOTTOM TEXT
  ======================================================= */

  bottomText:
    "The journey is still going — and there is always something new to build.",

};


/* =========================================================
   EXPORT
========================================================= */

export default myJourneyText;