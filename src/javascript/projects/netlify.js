/* =========================================================
   NETLIFY PROJECTS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/projects/netlify.js

   PURPOSE
   ---------------------------------------------------------
   Handles Netlify project information for the Projects
   section.

   IMPORTANT
   ---------------------------------------------------------
   The Netlify REST API requires authentication for
   retrieving your account's sites.

   Do NOT place a Netlify personal access token inside
   frontend React code.

   This module provides:
   - Netlify configuration
   - Netlify URL helpers
   - Project normalization
   - Safe public-project matching
   - Optional API fetching through a secure backend
========================================================= */


/* =========================================================
   NETLIFY CONFIGURATION
========================================================= */

export const netlifyConfig = {

  /* =======================================================
     TEAM
  ======================================================= */

  teamUrl:
    "https://app.netlify.com/teams/free-7fi-wym/projects",


  /* =======================================================
     API
  ======================================================= */

  apiUrl:
    "https://api.netlify.com/api/v1",

  sitesEndpoint:
    "https://api.netlify.com/api/v1/sites",


  /* =======================================================
     DEFAULT SETTINGS
  ======================================================= */

  perPage:
    100,

};


/* =========================================================
   NETLIFY TEAM URL
========================================================= */

export const netlifyTeamUrl =
  netlifyConfig.teamUrl;


/* =========================================================
   NORMALIZE NETLIFY URL
========================================================= */

export function normalizeNetlifyUrl(
  url
) {

  if (
    !url ||
    typeof url !== "string"
  ) {

    return "#";

  }


  return url.trim();

}


/* =========================================================
   GET SITE URL
========================================================= */

export function getNetlifySiteUrl(
  site
) {

  if (
    !site ||
    typeof site !== "object"
  ) {

    return "#";

  }


  /*
    Netlify normally provides the public
    deployment URL through `url`.
  */

  if (
    typeof site.url === "string" &&
    site.url.trim()
  ) {

    return normalizeNetlifyUrl(
      site.url
    );

  }


  /*
    Fallback using the Netlify site name.
  */

  if (
    typeof site.name === "string" &&
    site.name.trim()
  ) {

    return (
      `https://${site.name}.netlify.app`
    );

  }


  return "#";

}


/* =========================================================
   GET NETLIFY ADMIN URL
========================================================= */

export function getNetlifyAdminUrl(
  site
) {

  if (
    !site ||
    typeof site !== "object"
  ) {

    return "#";

  }


  return (
    site.admin_url ||
    "#"
  );

}


/* =========================================================
   CHECK NETLIFY SITE
========================================================= */

export function isNetlifyProject(
  site
) {

  if (
    !site ||
    typeof site !== "object"
  ) {

    return false;

  }


  /*
    A site must have a usable public URL.
  */

  const url =
    getNetlifySiteUrl(
      site
    );


  if (
    url === "#"
  ) {

    return false;

  }


  return true;

}


/* =========================================================
   GET REPOSITORY INFORMATION
========================================================= */

export function getNetlifyRepository(
  site
) {

  if (
    !site ||
    typeof site !== "object"
  ) {

    return null;

  }


  if (
    !site.repo ||
    typeof site.repo !== "object"
  ) {

    return null;

  }


  return site.repo;

}


/* =========================================================
   GET REPOSITORY NAME
========================================================= */

export function getNetlifyRepositoryName(
  site
) {

  const repo =
    getNetlifyRepository(
      site
    );


  if (
    !repo
  ) {

    return "";

  }


  return (
    repo.repo_path ||
    repo.name ||
    ""
  );

}


/* =========================================================
   CONVERT NETLIFY SITE TO PROJECT
========================================================= */

export function netlifySiteToProject(
  site
) {

  if (
    !isNetlifyProject(
      site
    )
  ) {

    return null;

  }


  const liveUrl =
    getNetlifySiteUrl(
      site
    );


  const repository =
    getNetlifyRepository(
      site
    );


  const repositoryName =
    getNetlifyRepositoryName(
      site
    );


  return {

    /* -----------------------------------------------------
       ID
    ----------------------------------------------------- */

    id:
      `netlify-${site.id || site.name}`,


    /* -----------------------------------------------------
       NAME
    ----------------------------------------------------- */

    name:
      site.name ||
      "Netlify Project",

    title:
      site.name ||
      "Netlify Project",


    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    description:
      site.description ||
      "A project deployed with Netlify.",


    /* -----------------------------------------------------
       LIVE URL
    ----------------------------------------------------- */

    liveUrl,

    homepage:
      liveUrl,

    demo:
      liveUrl,


    /* -----------------------------------------------------
       NETLIFY
    ----------------------------------------------------- */

    netlifyUrl:
      liveUrl,

    netlifyAdminUrl:
      getNetlifyAdminUrl(
        site
      ),


    /* -----------------------------------------------------
       REPOSITORY
    ----------------------------------------------------- */

    repository:
      repositoryName,

    repositoryProvider:
      repository?.provider ||
      "",


    /* -----------------------------------------------------
       SOURCE
    ----------------------------------------------------- */

    source:
      "netlify",


    /* -----------------------------------------------------
       NETLIFY DATA
    ----------------------------------------------------- */

    siteId:
      site.id ||
      null,

    createdAt:
      site.created_at ||
      null,

    updatedAt:
      site.updated_at ||
      null,

  };

}


/* =========================================================
   CONVERT NETLIFY SITES
========================================================= */

export function normalizeNetlifyProjects(
  sites
) {

  if (
    !Array.isArray(
      sites
    )
  ) {

    return [];

  }


  return sites

    .filter(
      isNetlifyProject
    )

    .map(
      netlifySiteToProject
    )

    .filter(
      Boolean
    );

}


/* =========================================================
   FETCH NETLIFY SITES
   ---------------------------------------------------------
   IMPORTANT:

   This function expects an authenticated endpoint.

   Do NOT put your Netlify token in this browser code.

   A secure backend/serverless function should call the
   Netlify API and return only safe public project data.
========================================================= */

export async function fetchNetlifySites(
  endpoint = netlifyConfig.sitesEndpoint
) {

  if (
    !endpoint
  ) {

    throw new Error(
      "Netlify API endpoint is missing."
    );

  }


  const response =
    await fetch(
      endpoint
    );


  if (
    !response.ok
  ) {

    const error =
      new Error(
        `Netlify returned ${response.status}.`
      );


    error.status =
      response.status;


    throw error;

  }


  const sites =
    await response.json();


  if (
    !Array.isArray(
      sites
    )
  ) {

    throw new Error(
      "Netlify returned invalid site data."
    );

  }


  return sites;

}


/* =========================================================
   FETCH NETLIFY PROJECTS
========================================================= */

export async function fetchNetlifyProjects(
  endpoint
) {

  const sites =
    await fetchNetlifySites(
      endpoint
    );


  return normalizeNetlifyProjects(
    sites
  );

}


/* =========================================================
   GET PROJECT NETLIFY URL
========================================================= */

export function getProjectNetlifyUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  return (
    project.netlifyUrl ||
    project.liveUrl ||
    project.homepage ||
    project.demo ||
    "#"
  );

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default netlifyConfig;