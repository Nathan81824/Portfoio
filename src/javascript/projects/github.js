/* =========================================================
   GITHUB PROJECTS
   GitHub Pages projects only

   Responsibilities:
   - Fetch public GitHub repositories
   - Exclude the portfolio repository
   - Exclude forks
   - Exclude archived repositories
   - Detect GitHub Pages projects
   - Convert repositories into project objects
========================================================= */


/* =========================================================
   GITHUB CONFIGURATION
========================================================= */

export const GITHUB_CONFIG = {

  username: "Nathan81824",

  apiUrl: "https://api.github.com",

  repositoryLimit: 100,

  sort: "updated",

  onlyPublic: true,

  ignoreForks: true,

  ignoreArchived: true,

  onlyGitHubPages: true,

  excludedRepositories: [
    "Portfoio",
  ],

};


/* =========================================================
   NORMALIZE NAME
========================================================= */

function normalizeName(
  name = ""
) {

  return String(name)
    .trim()
    .toLowerCase();

}


/* =========================================================
   CHECK EXCLUDED REPOSITORY
========================================================= */

function isExcludedRepository(
  repository
) {

  if (
    !repository?.name
  ) {

    return true;

  }


  const repositoryName =
    normalizeName(
      repository.name
    );


  return GITHUB_CONFIG
    .excludedRepositories
    .some(
      (excludedName) =>
        normalizeName(
          excludedName
        ) === repositoryName
    );

}


/* =========================================================
   CHECK GITHUB PAGES URL
========================================================= */

function isGitHubPagesUrl(
  url = ""
) {

  return (
    typeof url === "string" &&
    url.includes("github.io")
  );

}


/* =========================================================
   BUILD GITHUB PAGES URL
========================================================= */

/*
  IMPORTANT:
  This is the internal helper.

  It is intentionally named differently from
  the exported getGitHubPagesUrl() function
  so there is no duplicate declaration.
*/

function buildGitHubPagesUrl(
  repository
) {

  if (!repository) {

    return "";

  }


  /* =======================================================
     USE HOMEPAGE WHEN AVAILABLE
  ======================================================= */

  if (
    isGitHubPagesUrl(
      repository.homepage
    )
  ) {

    return repository.homepage;

  }


  /* =======================================================
     USE GITHUB PAGES FLAG
  ======================================================= */

  if (
    repository.has_pages === true
  ) {

    const owner =
      repository.owner?.login ||
      GITHUB_CONFIG.username;


    return (
      `https://${owner}.github.io/` +
      `${repository.name}/`
    );

  }


  return "";

}


/* =========================================================
   BUILD GITHUB REPOSITORY URL
========================================================= */

function buildGitHubRepositoryUrl(
  repository
) {

  if (
    repository?.html_url
  ) {

    return repository.html_url;

  }


  if (
    repository?.owner?.login &&
    repository?.name
  ) {

    return (
      `https://github.com/` +
      `${repository.owner.login}/` +
      `${repository.name}`
    );

  }


  return "";

}


/* =========================================================
   GITHUB API REQUEST
========================================================= */

async function githubRequest(
  endpoint,
  options = {}
) {

  const response =
    await fetch(
      `${GITHUB_CONFIG.apiUrl}${endpoint}`,
      {
        ...options,

        headers: {

          Accept:
            "application/vnd.github+json",

          ...options.headers,

        },

      }
    );


  if (
    !response.ok
  ) {

    let message =
      `GitHub API error: ${response.status}`;


    try {

      const errorData =
        await response.json();


      if (
        errorData?.message
      ) {

        message =
          errorData.message;

      }

    } catch {

      /*
        Ignore JSON parsing errors.
      */

    }


    throw new Error(
      message
    );

  }


  return response.json();

}


/* =========================================================
   FETCH GITHUB REPOSITORIES
========================================================= */

export async function fetchGitHubRepositories() {

  const username =
    encodeURIComponent(
      GITHUB_CONFIG.username
    );


  const endpoint =
    `/users/${username}/repos` +
    `?per_page=${GITHUB_CONFIG.repositoryLimit}` +
    `&sort=${GITHUB_CONFIG.sort}` +
    `&direction=desc`;


  return githubRequest(
    endpoint
  );

}


/* =========================================================
   FILTER GITHUB PAGES REPOSITORIES
========================================================= */

export function filterGitHubPagesRepositories(
  repositories = []
) {

  if (
    !Array.isArray(
      repositories
    )
  ) {

    return [];

  }


  return repositories.filter(
    (repository) => {

      if (
        !repository ||
        typeof repository !== "object"
      ) {

        return false;

      }


      /* ===================================================
         PUBLIC ONLY
      =================================================== */

      if (
        GITHUB_CONFIG.onlyPublic &&
        repository.private
      ) {

        return false;

      }


      /* ===================================================
         IGNORE FORKS
      =================================================== */

      if (
        GITHUB_CONFIG.ignoreForks &&
        repository.fork
      ) {

        return false;

      }


      /* ===================================================
         IGNORE ARCHIVED
      =================================================== */

      if (
        GITHUB_CONFIG.ignoreArchived &&
        repository.archived
      ) {

        return false;

      }


      /* ===================================================
         EXCLUDE PORTFOLIO
      =================================================== */

      if (
        isExcludedRepository(
          repository
        )
      ) {

        return false;

      }


      /* ===================================================
         CHECK GITHUB PAGES
      =================================================== */

      const pagesUrl =
        buildGitHubPagesUrl(
          repository
        );


      if (
        GITHUB_CONFIG.onlyGitHubPages &&
        !pagesUrl
      ) {

        return false;

      }


      return true;

    }
  );

}


/* =========================================================
   CONVERT REPOSITORY TO PROJECT
========================================================= */

export function repositoryToProject(
  repository
) {

  if (
    !repository ||
    typeof repository !== "object"
  ) {

    return null;

  }


  const liveUrl =
    buildGitHubPagesUrl(
      repository
    );


  if (
    GITHUB_CONFIG.onlyGitHubPages &&
    !liveUrl
  ) {

    return null;

  }


  return {

    /* =====================================================
       BASIC INFORMATION
    ===================================================== */

    id:
      repository.id,

    name:
      repository.name,

    title:
      repository.name,

    description:
      repository.description ||
      "A project built with modern web technologies.",


    /* =====================================================
       URLS
    ===================================================== */

    liveUrl:

      liveUrl,

    homepage:

      liveUrl,

    pagesUrl:

      liveUrl,

    githubUrl:

      buildGitHubRepositoryUrl(
        repository
      ),


    /* =====================================================
       SCREENSHOT
    ===================================================== */

    screenshotUrl:
      "",


    /* =====================================================
       TECHNOLOGIES
    ===================================================== */

    technologies:
      Array.isArray(
        repository.topics
      )
        ? repository.topics
        : [],

    topics:
      Array.isArray(
        repository.topics
      )
        ? repository.topics
        : [],

    language:
      repository.language ||
      "",


    /* =====================================================
       GITHUB INFORMATION
    ===================================================== */

    stars:
      repository.stargazers_count ||
      0,

    forks:
      repository.forks_count ||
      0,

    createdAt:
      repository.created_at ||
      null,

    updatedAt:
      repository.updated_at ||
      null,

    visibility:
      repository.visibility ||
      "public",

    archived:
      Boolean(
        repository.archived
      ),

    fork:
      Boolean(
        repository.fork
      ),


    /* =====================================================
       SOURCE
    ===================================================== */

    source:
      "github-pages",

  };

}


/* =========================================================
   FETCH GITHUB PAGES PROJECTS
========================================================= */

export async function fetchGitHubProjects() {

  const repositories =
    await fetchGitHubRepositories();


  const githubPagesRepositories =
    filterGitHubPagesRepositories(
      repositories
    );


  const projectList =
    githubPagesRepositories
      .map(
        repositoryToProject
      )
      .filter(Boolean);


  /* =======================================================
     DEBUG INFORMATION
  ======================================================= */

  console.log(
    "GitHub repositories:",
    repositories
  );


  console.log(
    "GitHub Pages repositories:",
    githubPagesRepositories
  );


  console.log(
    "GitHub projects:",
    projectList
  );


  return projectList;

}


/* =========================================================
   GET PROJECT BY NAME
========================================================= */

export async function getGitHubProjectByName(
  name
) {

  if (!name) {

    return null;

  }


  const projectList =
    await fetchGitHubProjects();


  const searchName =
    normalizeName(
      name
    );


  return (
    projectList.find(
      (project) =>
        normalizeName(
          project.name
        ) ===
        searchName
    ) ||
    null
  );

}


/* =========================================================
   GET PROJECT BY ID
========================================================= */

export async function getGitHubProjectById(
  id
) {

  if (
    id === undefined ||
    id === null
  ) {

    return null;

  }


  const projectList =
    await fetchGitHubProjects();


  return (
    projectList.find(
      (project) =>
        String(
          project.id
        ) ===
        String(id)
    ) ||
    null
  );

}


/* =========================================================
   GET GITHUB REPOSITORY URL
========================================================= */

export function getGitHubRepositoryUrl(
  repository
) {

  if (
    typeof repository === "string"
  ) {

    return repository;

  }


  return buildGitHubRepositoryUrl(
    repository
  );

}


/* =========================================================
   GET GITHUB PAGES URL
========================================================= */

export function getGitHubPagesUrl(
  repository
) {

  if (
    typeof repository === "string"
  ) {

    return isGitHubPagesUrl(
      repository
    )
      ? repository
      : "";

  }


  return buildGitHubPagesUrl(
    repository
  );

}


/* =========================================================
   GET PROJECT COUNT
========================================================= */

export async function getGitHubProjectCount() {

  const projectList =
    await fetchGitHubProjects();


  return projectList.length;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const github = {

  GITHUB_CONFIG,

  fetchGitHubRepositories,

  filterGitHubPagesRepositories,

  repositoryToProject,

  fetchGitHubProjects,

  getGitHubProjectByName,

  getGitHubProjectById,

  getGitHubRepositoryUrl,

  getGitHubPagesUrl,

  getGitHubProjectCount,

};


export default github;
