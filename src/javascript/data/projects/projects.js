/* =========================================================
   PROJECT DATA
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/projects/projects.js

   PURPOSE
   ---------------------------------------------------------
   Manual / fallback project data.

   Used when:
   - GitHub API returns 403
   - GitHub is temporarily unavailable
   - Vercel data is unavailable
   - Netlify data is unavailable
   - A project needs custom information

   IMPORTANT
   ---------------------------------------------------------
   API-generated projects should use the same structure
   defined below so ProjectsHero.jsx can treat all projects
   consistently.
========================================================= */


/* =========================================================
   PROJECTS
========================================================= */

export const projects = [

  /* =======================================================
     HEALTH CARE LOGISTICS
  ======================================================= */

  {
    id:
      "health-care-logistics",

    name:
      "Health Care Logistics",

    title:
      "Health Care Logistics",

    description:
      "A responsive healthcare logistics website designed to present medical transportation and logistics services.",

    language:
      "React",

    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Responsive Design",
    ],

    github:
      "https://github.com/Nathan81824/health-care-logistics",

    githubUrl:
      "https://github.com/Nathan81824/health-care-logistics",

    liveUrl:
      "https://health-care-logistics.vercel.app/",

    homepage:
      "https://health-care-logistics.vercel.app/",

    demo:
      "https://health-care-logistics.vercel.app/",

    vercelUrl:
      "https://health-care-logistics.vercel.app/",

    netlifyUrl:
      "",

    source:
      "manual",

    deployment:
      "vercel",

    featured:
      true,

    show:
      true,

    order:
      1,

    screenshot:
      "/project-screenshots/health-care-logistics.png",

  },


  /* =======================================================
     TO-DO APP
  ======================================================= */

  {
    id:
      "todo-app",

    name:
      "Study Planner",

    title:
      "Study Planner",

    description:
      "A personal study planning application for organizing topics, schedules, progress, and daily learning tasks.",

    language:
      "React",

    technologies: [
      "React",
      "JavaScript",
      "CSS",
      "Local Storage",
      "Responsive Design",
    ],

    github:
      "https://github.com/Nathan81824/TO_DO_APP",

    githubUrl:
      "https://github.com/Nathan81824/TO_DO_APP",

    liveUrl:
      "https://nathan81824.github.io/TO_DO_APP/",

    homepage:
      "https://nathan81824.github.io/TO_DO_APP/",

    demo:
      "https://nathan81824.github.io/TO_DO_APP/",

    vercelUrl:
      "",

    netlifyUrl:
      "",

    source:
      "manual",

    deployment:
      "github-pages",

    featured:
      true,

    show:
      true,

    order:
      2,

    screenshot:
      "/project-screenshots/todo-app.png",

  },


  /* =======================================================
     CALCULATOR
  ======================================================= */

  {
    id:
      "calculator",

    name:
      "Calculator",

    title:
      "Calculator",

    description:
      "A responsive calculator application with a clean interface and interactive controls.",

    language:
      "JavaScript",

    technologies: [
      "JavaScript",
      "HTML",
      "CSS",
      "Responsive Design",
    ],

    github:
      "https://github.com/Nathan81824/Caculator",

    githubUrl:
      "https://github.com/Nathan81824/Caculator",

    liveUrl:
      "https://nathan81824.github.io/Caculator/",

    homepage:
      "https://nathan81824.github.io/Caculator/",

    demo:
      "https://nathan81824.github.io/Caculator/",

    vercelUrl:
      "",

    netlifyUrl:
      "",

    source:
      "manual",

    deployment:
      "github-pages",

    featured:
      false,

    show:
      true,

    order:
      3,

    screenshot:
      "/project-screenshots/calculator.png",

  },

];


/* =========================================================
   VISIBLE PROJECTS
========================================================= */

export const visibleProjects =
  projects

    .filter(
      (project) =>
        project &&
        project.show !== false
    )

    .sort(
      (a, b) =>
        (a.order || 999) -
        (b.order || 999)
    );


/* =========================================================
   FEATURED PROJECTS
========================================================= */

export const featuredProjects =
  visibleProjects.filter(
    (project) =>
      project.featured === true
  );


/* =========================================================
   FIND PROJECT BY ID
========================================================= */

export function getProjectById(
  id
) {

  return projects.find(
    (project) =>
      project.id === id
  );

}


/* =========================================================
   FIND PROJECT BY NAME
========================================================= */

export function getProjectByName(
  name
) {

  if (
    !name ||
    typeof name !== "string"
  ) {

    return undefined;

  }


  return projects.find(
    (project) =>
      project.name?.toLowerCase() ===
      name.toLowerCase()
  );

}


/* =========================================================
   GET PROJECT GITHUB URL
========================================================= */

export function getProjectGitHubUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  return (
    project.githubUrl ||
    project.github ||
    "#"
  );

}


/* =========================================================
   GET PROJECT LIVE URL
========================================================= */

export function getProjectLiveUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  return (
    project.liveUrl ||
    project.homepage ||
    project.demo ||
    project.url ||
    "#"
  );

}


/* =========================================================
   GET PROJECT TECHNOLOGIES
========================================================= */

export function getProjectTechnologies(
  project
) {

  if (
    !project ||
    !Array.isArray(
      project.technologies
    )
  ) {

    return [];

  }


  return project.technologies;

}


/* =========================================================
   GET PROJECT SCREENSHOT
========================================================= */

export function getProjectScreenshot(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "";

  }


  return (
    project.screenshot ||
    project.image ||
    project.thumbnail ||
    ""
  );

}


/* =========================================================
   GET PROJECT DEPLOYMENT
========================================================= */

export function getProjectDeployment(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "";

  }


  return (
    project.deployment ||
    ""
  );

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default projects;
