/* =========================================================
   PERSONAL DATA
========================================================= */

const personalInfo = {
  name: "nathan",

  resume: "/resume.pdf",

  email: "your@email.com",

  location: "Nigeria",
};


/* =========================================================
   ROLES
   Used throughout the portfolio.
========================================================= */

const roles = [
  "Frontend Developer",
  "React Developer",
  "UI Developer",
  "Creative Developer",
];


/* =========================================================
   SITE TEXT
   All reusable website content lives here.
========================================================= */

const siteText = {

  /* =======================================================
     HOME
  ======================================================= */

  home: {

    greeting:
      "Hi, I'm",

    subtitle1:
      "I build modern digital experiences.",

    description1:
      "I create responsive, interactive and visually engaging websites using modern frontend technologies.",

    button1:
      "View My Work",

    button2:
      "Download Resume",

    scroll:
      "Scroll to explore",

  },


  /* =======================================================
     ABOUT
  ======================================================= */

  about: {

    subtitle1:
      "A developer focused on creating meaningful digital experiences.",

    description1:
      "I enjoy turning ideas into clean, responsive and interactive websites.",

  },


  /* =======================================================
     SKILLS
  ======================================================= */

  skills: {

    subtitle1:
      "Technologies I use to build digital experiences.",

    description1:
      "I work with modern frontend technologies and tools to create responsive and engaging websites.",

  },


  /* =======================================================
     PROJECTS
  ======================================================= */

  projects: {

    subtitle1:
      "Some of the things I've built.",

    description1:
      "Explore projects that demonstrate my skills, creativity and approach to frontend development.",

  },


  /* =======================================================
     CONTACT
  ======================================================= */

  contact: {

    subtitle1:
      "Let's build something together.",

    description1:
      "Have a project or idea in mind? I'd love to hear about it.",

    button1:
      "Get In Touch",

  },

};


/* =========================================================
   NAVIGATION
========================================================= */

const navLinks = [

  {
    id: "home",
    name: "Home",
    href: "#home",
  },

  {
    id: "about",
    name: "About",
    href: "#about",
  },

  {
    id: "skills",
    name: "Skills",
    href: "#skills",
  },

  {
    id: "projects",
    name: "Projects",
    href: "#projects",
  },

  {
    id: "contact",
    name: "Contact",
    href: "#contact",
  },

];


/* =========================================================
   GET DATA
   Single entry point for all website data.
========================================================= */

export function getData() {

  return {
    personalInfo,
    roles,
    siteText,
    navLinks,
  };

}