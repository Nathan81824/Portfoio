/* =========================================================
   HOW I BUILD TEXT

   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/siteText/about/howIBuildText.js

   Stores all text used by the How I Build section.
========================================================= */

const howIBuildText = {

  number: "04",

  label: "HOW I BUILD",

  heading: {
    main: "From an idea.",
    accent: " To a finished experience.",
  },

  intro:
    "I like breaking ideas into clear steps, building with purpose, and refining every detail until the experience feels right.",

  steps: [

    {
      id: "explore",

      number: "01",

      title: "Explore",

      description:
        "I start by understanding the idea, the goal, and the people who will use the experience.",

      keyword: "UNDERSTAND",
    },

    {
      id: "plan",

      number: "02",

      title: "Plan",

      description:
        "I break the idea into sections, components, interactions, and a structure that makes sense.",

      keyword: "STRUCTURE",
    },

    {
      id: "build",

      number: "03",

      title: "Build",

      description:
        "I turn the plan into a working interface using clean, reusable code and modern frontend technologies.",

      keyword: "CREATE",
    },

    {
      id: "refine",

      number: "04",

      title: "Refine",

      description:
        "I test the experience, fix problems, improve responsiveness, and add the details that make it feel polished.",

      keyword: "IMPROVE",
    },

    {
      id: "launch",

      number: "05",

      title: "Launch",

      description:
        "Once everything is working properly, I prepare the project for deployment and make it ready for people to use.",

      keyword: "SHIP",
    },

  ],

  bottomText:
    "Every project is an opportunity to learn something new and build something better.",

};

export default howIBuildText;