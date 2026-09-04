/* =========================================================
   PROJECTS
   Nathan — Frontend Developer Portfolio

   SOURCE:
   → GitHub public repositories

   FILTER:
   → GitHub Pages projects only

   EXCLUDED:
   → Portfoio

   SCREENSHOTS:
   → Automatically generated with Thumb.io

   NO:
   → Vercel
   → Netlify
========================================================= */


/* =========================================================
   IMPORTS
========================================================= */

import {
  fetchGitHubProjects,
} from "./github.js";


/* =========================================================
   FALLBACK PROJECTS
========================================================= */

export const projects = [];


/* =========================================================
   CONFIGURATION
========================================================= */

const PROJECT_CONFIG = {

  onlyGitHubPages: true,

  excludedRepositories: [
    "Portfoio",
  ],

};


/* =========================================================
   NORMALIZE NAME
========================================================= */

function normalizeName(value = "") {

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


/* =========================================================
   CHECK EXCLUDED PROJECT
========================================================= */

function isExcludedRepository(project) {

  if (!project) {
    return true;
  }


  const name =
    project.name ||
    project.title ||
    "";


  const normalizedName =
    normalizeName(name);


  return PROJECT_CONFIG
    .excludedRepositories
    .some(
      (excluded) =>
        normalizeName(excluded) ===
        normalizedName
    );

}


/* =========================================================
   CHECK GITHUB PAGES
========================================================= */

function isGitHubPagesProject(project) {

  if (!project) {
    return false;
  }


  const pagesUrl =
    project.pagesUrl ||
    project.liveUrl ||
    project.homepage ||
    "";


  return String(pagesUrl)
    .toLowerCase()
    .includes("github.io");

}


/* =========================================================
   NORMALIZE PROJECT
========================================================= */

function normalizeProject(project) {

  if (!project) {
    return null;
  }


  const title =
    project.title ||
    project.name ||
    "Untitled Project";


  const liveUrl =
    project.liveUrl ||
    project.pagesUrl ||
    project.homepage ||
    "";


  return {

    ...project,

    id:
      project.id ||
      project.name ||
      title,

    name:
      project.name ||
      title,

    title:
      title,

    description:
      project.description ||
      "A frontend project built with modern web technologies.",

    githubUrl:
      project.githubUrl ||
      project.repository?.html_url ||
      "",

    liveUrl:
      liveUrl,

    homepage:
      liveUrl,

    pagesUrl:
      liveUrl,

    visible:
      project.visible !== false,

    featured:
      Boolean(
        project.featured
      ),

    source:
      "github-pages",

    technologies:
      Array.isArray(
        project.technologies
      )
        ? project.technologies
        : project.language
          ? [project.language]
          : [],

  };

}


/* =========================================================
   AUTOMATIC THUMB.IO SCREENSHOT
========================================================= */

function getAutomaticScreenshotUrl(
  liveUrl
) {

  if (!liveUrl) {
    return "";
  }


  /*
    Thumb.io captures the deployed
    GitHub Pages website automatically.

    No image needs to be stored
    inside the project.
  */

  return (
    `https://image.thum.io/get/` +
    `width/1400/` +
    `crop/900/` +
    `noanimate/` +
    liveUrl
  );

}


/* =========================================================
   ADD AUTOMATIC SCREENSHOT
========================================================= */

function addProjectScreenshot(project) {

  if (!project) {
    return null;
  }


  const liveUrl =
    project.liveUrl ||
    project.pagesUrl ||
    project.homepage ||
    "";


  return {

    ...project,

    screenshotUrl:
      getAutomaticScreenshotUrl(
        liveUrl
      ),

  };

}


/* =========================================================
   FETCH PROJECTS
========================================================= */

export async function fetchProjects() {

  try {

    const githubProjects =
      await fetchGitHubProjects();


    if (
      !Array.isArray(
        githubProjects
      )
    ) {

      return [];

    }


    const filteredProjects =
      githubProjects

        /* -----------------------------------------------
           EXCLUDE PORTFOIO
        ----------------------------------------------- */

        .filter(
          (project) =>
            !isExcludedRepository(
              project
            )
        )

        /* -----------------------------------------------
           GITHUB PAGES ONLY
        ----------------------------------------------- */

        .filter(
          (project) =>
            !PROJECT_CONFIG.onlyGitHubPages ||
            isGitHubPagesProject(
              project
            )
        )


        /* -----------------------------------------------
           NORMALIZE
        ----------------------------------------------- */

        .map(
          normalizeProject
        )

        .filter(
          Boolean
        )


        /* -----------------------------------------------
           AUTOMATIC SCREENSHOTS
        ----------------------------------------------- */

        .map(
          addProjectScreenshot
        )

        .filter(
          Boolean
        );


    return filteredProjects;

  } catch (error) {

    console.error(
      "Failed to fetch GitHub Pages projects:",
      error
    );


    return [];

  }

}


/* =========================================================
   REMOTE PROJECTS
========================================================= */

export async function getRemoteProjects() {

  return fetchProjects();

}


/* =========================================================
   VISIBLE PROJECTS
========================================================= */

export function visibleProjects(
  projectList = projects
) {

  return (
    Array.isArray(projectList)
      ? projectList
      : []
  ).filter(
    (project) =>
      project &&
      project.visible !== false
  );

}


/* =========================================================
   FEATURED PROJECTS
========================================================= */

export function featuredProjects(
  projectList = projects
) {

  return visibleProjects(
    projectList
  ).filter(
    (project) =>
      project.featured === true
  );

}


/* =========================================================
   GET PROJECT BY ID
========================================================= */

export function getProjectById(
  projectList = projects,
  id
) {

  return (
    projectList.find(
      (project) =>
        String(project.id) ===
        String(id)
    ) ||
    null
  );

}


/* =========================================================
   GET PROJECT BY NAME
========================================================= */

export function getProjectByName(
  projectList = projects,
  name
) {

  const normalizedName =
    normalizeName(name);


  return (
    projectList.find(
      (project) =>
        normalizeName(
          project.name ||
          project.title ||
          ""
        ) ===
        normalizedName
    ) ||
    null
  );

}


/* =========================================================
   GITHUB URL
========================================================= */

export function getProjectGitHubUrl(
  project
) {

  return (
    project?.githubUrl ||
    project?.repository?.html_url ||
    ""
  );

}


/* =========================================================
   LIVE URL
========================================================= */

export function getProjectLiveUrl(
  project
) {

  return (
    project?.liveUrl ||
    project?.pagesUrl ||
    project?.homepage ||
    ""
  );

}


/* =========================================================
   TECHNOLOGIES
========================================================= */

export function getProjectTechnologies(
  project
) {

  return (
    project?.technologies ||
    []
  );

}


/* =========================================================
   IMAGE
========================================================= */

export function getProjectImage(
  project
) {

  return (
    project?.screenshotUrl ||
    project?.image ||
    project?.thumbnail ||
    ""
  );

}


/* =========================================================
   SCREENSHOT URL
========================================================= */

export function getProjectScreenshotUrl(
  project
) {

  return (
    project?.screenshotUrl ||
    ""
  );

}


/* =========================================================
   DEPLOYMENT
========================================================= */

export function getProjectDeployment(
  project
) {

  return (
    project?.liveUrl ||
    project?.pagesUrl ||
    project?.homepage ||
    ""
  );

}


/* =========================================================
   PROJECT COUNT
========================================================= */

export function getProjectCount(
  projectList = projects
) {

  return visibleProjects(
    projectList
  ).length;

}


/* =========================================================
   SEARCH PROJECTS
========================================================= */

export function searchProjects(
  projectList = projects,
  query = ""
) {

  if (
    !Array.isArray(
      projectList
    )
  ) {

    return [];

  }


  const search =
    String(query)
      .trim()
      .toLowerCase();


  if (!search) {
    return projectList;
  }


  return projectList.filter(
    (project) => {

      const title =
        String(
          project.title || ""
        ).toLowerCase();


      const description =
        String(
          project.description || ""
        ).toLowerCase();


      const technologies =
        getProjectTechnologies(
          project
        )
          .join(" ")
          .toLowerCase();


      return (
        title.includes(search) ||
        description.includes(search) ||
        technologies.includes(search)
      );

    }
  );

}


/* =========================================================
   IS PROJECT VISIBLE
========================================================= */

export function isProjectVisible(project) {

  return Boolean(
    project &&
    project.visible !== false
  );

}


/* =========================================================
   SORT PROJECTS
========================================================= */

export function sortProjects(
  projectList = projects,
  sort = "updated"
) {

  if (
    !Array.isArray(
      projectList
    )
  ) {

    return [];

  }


  const sorted = [
    ...projectList,
  ];


  switch (sort) {

    case "name":

      return sorted.sort(
        (a, b) =>
          String(
            a.title || ""
          ).localeCompare(
            String(
              b.title || ""
            )
          )
      );


    case "created":

      return sorted.sort(
        (a, b) =>
          new Date(
            a.created_at || 0
          ) -
          new Date(
            b.created_at || 0
          )
      );


    case "updated":

    default:

      return sorted.sort(
        (a, b) =>
          new Date(
            b.updated_at || 0
          ) -
          new Date(
            a.updated_at || 0
          )
      );

  }

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  projects,

  fetchProjects,

  getRemoteProjects,

  visibleProjects,

  featuredProjects,

  getProjectById,

  getProjectByName,

  getProjectGitHubUrl,

  getProjectLiveUrl,

  getProjectTechnologies,

  getProjectImage,

  getProjectScreenshotUrl,

  getProjectDeployment,

  getProjectCount,

  searchProjects,

  isProjectVisible,

  sortProjects,

};