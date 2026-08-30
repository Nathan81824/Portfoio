/* =========================================================
   PERSONAL DATA
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/data/personal/personal.js

   PURPOSE
   ---------------------------------------------------------
   Central personal information used throughout the website.

   Keep personal data here.
   Keep site configuration inside:
   constants/siteConfig.js
========================================================= */


/* =========================================================
   PERSONAL INFORMATION
========================================================= */

export const personalInfo = {

  /* =======================================================
     NAME
  ======================================================= */

  name: "nathan",

  displayName: "Nathan",


  /* =======================================================
     PROFESSIONAL INFORMATION
  ======================================================= */

  role: "Frontend Developer",

  profession: "Frontend Developer",


  /* =======================================================
     CONTACT
  ======================================================= */

  email: "nathanmose.u@gmail.com",

  location: "Nigeria",


  /* =======================================================
     RESUME
  ======================================================= */

  resume: "/resume.pdf",


  /* =======================================================
     AVAILABILITY
  ======================================================= */

  availability: {
    available: true,

    availableText:
      "Available for projects",

    unavailableText:
      "Not available for projects",
  },

};


/* =========================================================
   ROLES
   Used for:

   - Hero
   - About
   - Animations
   - Typewriter effects
   - Page metadata
========================================================= */

export const roles = [

  "Frontend Developer",

  "React Developer",

  "UI Developer",

  "Creative Developer",

];


/* =========================================================
   PROFILE
========================================================= */

export const profile = {

  profession:
    "Frontend Developer",

  availability:
    "Available for projects",

  experience:
    "Building modern web experiences",

  focus: [

    "Frontend Development",

    "React",

    "Responsive Design",

    "UI Development",

    "Interactive Web Experiences",

  ],

};


/* =========================================================
   PERSONAL LINKS
========================================================= */
export const personalLinks = {
  github: "https://github.com/Nathan81824",

  linkedin: "https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME/",

  vercel: "https://vercel.com/nathanmoses81824",

  netlify:
    "https://app.netlify.com/teams/free-7fi-wym/projects",
};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default personalInfo;