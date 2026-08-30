/* =========================================================
   VERCEL PROJECTS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/projects/vercel.js

   PURPOSE
   ---------------------------------------------------------
   Handles Vercel project information for the Projects
   section.

   Handles:
   - Vercel configuration
   - Vercel project URLs
   - Deployment URLs
   - Repository information
   - Project normalization
   - Optional API fetching

   IMPORTANT
   ---------------------------------------------------------
   Never put a Vercel personal access token inside
   frontend React code.

   Authenticated Vercel API requests should eventually
   go through a server/serverless endpoint.
========================================================= */


/* =========================================================
   VERCEL CONFIGURATION
========================================================= */

export const vercelConfig = {

  /* =======================================================
     ACCOUNT
  ======================================================= */

  username:
    "nathanmoses81824",


  /* =======================================================
     PROFILE
  ======================================================= */

  profileUrl:
    "https://vercel.com/nathanmoses81824",


  /* =======================================================
     API
  ======================================================= */

  apiUrl:
    "https://api.vercel.com",


  projectsEndpoint:
    "https://api.vercel.com/v9/projects",


  /* =======================================================
     SETTINGS
  ======================================================= */

  projectLimit:
    100,

};


/* =========================================================
   VERCEL PROFILE URL
========================================================= */

export const vercelProfileUrl =
  vercelConfig.profileUrl;


/* =========================================================
   NORMALIZE URL
========================================================= */

export function normalizeVercelUrl(
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
   GET VERCEL PROJECT URL
========================================================= */

export function getVercelProjectUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  /*
    Prefer an explicitly supplied live URL.
  */

  if (
    typeof project.liveUrl === "string" &&
    project.liveUrl.trim()
  ) {

    return normalizeVercelUrl(
      project.liveUrl
    );

  }


  /*
    Vercel API can provide a list of aliases.
  */

  if (
    Array.isArray(
      project.alias
    ) &&
    project.alias.length > 0
  ) {

    const alias =
      project.alias[0];


    if (
      typeof alias === "string" &&
      alias.trim()
    ) {

      return (
        `https://${alias.trim()}`
      );

    }

  }


  /*
    Vercel project name fallback.
  */

  if (
    typeof project.name === "string" &&
    project.name.trim()
  ) {

    return (
      `https://${project.name}.vercel.app`
    );

  }


  return "#";

}


/* =========================================================
   GET VERCEL DASHBOARD URL
========================================================= */

export function getVercelDashboardUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  /*
    If the API already provides a dashboard URL,
    use it.
  */

  if (
    typeof project.dashboardUrl === "string" &&
    project.dashboardUrl.trim()
  ) {

    return project.dashboardUrl.trim();

  }


  /*
    Construct the standard Vercel dashboard URL.
  */

  if (
    project.name
  ) {

    return (
      `https://vercel.com/${vercelConfig.username}/${project.name}`
    );

  }


  return "#";

}


/* =========================================================
   GET REPOSITORY INFORMATION
========================================================= */

export function getVercelRepository(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return null;

  }


  if (
    !project.link ||
    typeof project.link !== "object"
  ) {

    return null;

  }


  if (
    project.link.type !== "github"
  ) {

    return null;

  }


  return project.link;

}


/* =========================================================
   GET GITHUB REPOSITORY NAME
========================================================= */

export function getVercelRepositoryName(
  project
) {

  const repository =
    getVercelRepository(
      project
    );


  if (
    !repository
  ) {

    return "";

  }


  return (
    repository.repo ||
    ""
  );

}


/* =========================================================
   GET REPOSITORY URL
========================================================= */

export function getVercelRepositoryUrl(
  project
) {

  const repository =
    getVercelRepository(
      project
    );


  if (
    !repository ||
    !repository.org ||
    !repository.repo
  ) {

    return "#";

  }


  return (
    `https://github.com/${repository.org}/${repository.repo}`
  );

}


/* =========================================================
   CHECK VERCEL PROJECT
========================================================= */

export function isVercelProject(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return false;

  }


  if (
    !project.name
  ) {

    return false;

  }


  const liveUrl =
    getVercelProjectUrl(
      project
    );


  return (
    liveUrl !== "#"
  );

}


/* =========================================================
   NORMALIZE VERCEL FRAMEWORK
========================================================= */

export function normalizeVercelFramework(
  framework
) {

  if (
    !framework ||
    typeof framework !== "string"
  ) {

    return "Web";

  }


  const frameworkMap = {

    nextjs:
      "Next.js",

    react:
      "React",

    vite:
      "Vite",

    vue:
      "Vue",

    nuxtjs:
      "Nuxt",

    svelte:
      "Svelte",

    angular:
      "Angular",

    remix:
      "Remix",

  };


  return (
    frameworkMap[
      framework.toLowerCase()
    ] ||
    framework
  );

}


/* =========================================================
   PROJECT → NORMALIZED PROJECT
========================================================= */

export function vercelProjectToProject(
  project
) {

  if (
    !isVercelProject(
      project
    )
  ) {

    return null;

  }


  const liveUrl =
    getVercelProjectUrl(
      project
    );


  const githubUrl =
    getVercelRepositoryUrl(
      project
    );


  const repositoryName =
    getVercelRepositoryName(
      project
    );


  return {

    /* -----------------------------------------------------
       ID
    ----------------------------------------------------- */

    id:
      `vercel-${project.id || project.name}`,


    /* -----------------------------------------------------
       NAME
    ----------------------------------------------------- */

    name:
      project.name,

    title:
      project.name,


    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    description:
      project.description ||
      "A project deployed with Vercel.",


    /* -----------------------------------------------------
       TECHNOLOGY
    ----------------------------------------------------- */

    language:
      normalizeVercelFramework(
        project.framework
      ),


    framework:
      normalizeVercelFramework(
        project.framework
      ),


    /* -----------------------------------------------------
       LIVE URL
    ----------------------------------------------------- */

    liveUrl,

    homepage:
      liveUrl,

    demo:
      liveUrl,


    /* -----------------------------------------------------
       VERCEL
    ----------------------------------------------------- */

    vercelUrl:
      liveUrl,

    vercelDashboardUrl:
      getVercelDashboardUrl(
        project
      ),


    /* -----------------------------------------------------
       GITHUB
    ----------------------------------------------------- */

    githubUrl,

    github:
      githubUrl,


    /* -----------------------------------------------------
       REPOSITORY
    ----------------------------------------------------- */

    repository:
      repositoryName,


    /* -----------------------------------------------------
       SOURCE
    ----------------------------------------------------- */

    source:
      "vercel",


    /* -----------------------------------------------------
       VERCEL DATA
    ----------------------------------------------------- */

    projectId:
      project.id ||
      null,

    createdAt:
      project.createdAt ||
      null,

    updatedAt:
      project.updatedAt ||
      null,

  };

}


/* =========================================================
   NORMALIZE VERCEL PROJECTS
========================================================= */

export function normalizeVercelProjects(
  projects
) {

  if (
    !Array.isArray(
      projects
    )
  ) {

    return [];

  }


  return projects

    .filter(
      isVercelProject
    )

    .map(
      vercelProjectToProject
    )

    .filter(
      Boolean
    );

}


/* =========================================================
   FETCH VERCEL PROJECTS
   ---------------------------------------------------------
   IMPORTANT:

   This function expects an authenticated endpoint.

   Do not add a Vercel token here.

   A secure backend/serverless function should make the
   authenticated Vercel API request and return the safe
   public project information to React.
========================================================= */

export async function fetchVercelProjects(
  endpoint = vercelConfig.projectsEndpoint
) {

  if (
    !endpoint
  ) {

    throw new Error(
      "Vercel API endpoint is missing."
    );

  }


  const response =
    await fetch(
      endpoint
    );


  if (
    response.status === 401 ||
    response.status === 403
  ) {

    const error =
      new Error(
        `Vercel authorization failed (${response.status}).`
      );


    error.status =
      response.status;


    error.code =
      "VERCEL_AUTH_ERROR";


    throw error;

  }


  if (
    !response.ok
  ) {

    const error =
      new Error(
        `Vercel returned ${response.status}.`
      );


    error.status =
      response.status;


    throw error;

  }


  const data =
    await response.json();


  /*
    Vercel's projects endpoint returns an object
    containing a `projects` array.
  */

  const projects =
    Array.isArray(
      data?.projects
    )
      ? data.projects
      : Array.isArray(data)
        ? data
        : [];


  return normalizeVercelProjects(
    projects
  );

}


/* =========================================================
   GET PROJECT LIVE URL
========================================================= */

export function getProjectVercelUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "#";

  }


  return (
    project.vercelUrl ||
    project.liveUrl ||
    project.homepage ||
    project.demo ||
    "#"
  );

}


/* =========================================================
   GET PROJECT GITHUB URL
========================================================= */

export function getVercelProjectGitHubUrl(
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
   DEFAULT EXPORT
========================================================= */

export default vercelConfig;
