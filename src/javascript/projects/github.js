
/* =========================================================
   GITHUB PROJECTS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/projects/github.js

   PURPOSE
   ---------------------------------------------------------
   Handles:

   - GitHub repository fetching
   - Public repository filtering
   - Fork filtering
   - GitHub Pages detection
   - Repository → project conversion
   - GitHub / Live Demo URLs
   - GitHub API 403 handling
========================================================= */


/* =========================================================
   GITHUB CONFIGURATION
========================================================= */

export const githubConfig = {

  username:
    "Nathan81824",

  apiUrl:
    "https://api.github.com",

  repositoryLimit:
    100,

  sort:
    "updated",

  onlyPublic:
    true,

  ignoreForks:
    true,

  onlyGitHubPages:
    true,

};


/* =========================================================
   GITHUB PROFILE
========================================================= */

export const githubProfileUrl =
  `https://github.com/${githubConfig.username}`;


/* =========================================================
   GITHUB REPOSITORIES PAGE
========================================================= */

export const githubRepositoriesUrl =
  `https://github.com/${githubConfig.username}?tab=repositories`;


/* =========================================================
   CREATE API URL
========================================================= */

export function getGitHubRepositoriesUrl() {

  const params =
    new URLSearchParams({

      per_page:
        String(
          githubConfig.repositoryLimit
        ),

      sort:
        githubConfig.sort,

    });


  return (
    `${githubConfig.apiUrl}/users/${githubConfig.username}/repos?${params}`
  );

}


/* =========================================================
   CREATE REPOSITORY URL
========================================================= */

export function getGitHubRepositoryUrl(
  repositoryName
) {

  if (
    !repositoryName
  ) {

    return "#";

  }


  return (
    `https://github.com/${githubConfig.username}/${repositoryName}`
  );

}


/* =========================================================
   CREATE GITHUB PAGES URL
========================================================= */

export function getGitHubPagesUrl(
  repository
) {

  if (
    !repository ||
    !repository.name
  ) {

    return "#";

  }


  /*
    GitHub can provide the actual Pages URL through
    repository.homepage.

    We prefer it when available.
  */

  if (
    typeof repository.homepage === "string" &&
    repository.homepage.trim()
  ) {

    return repository.homepage.trim();

  }


  /*
    Standard GitHub Pages fallback.
  */

  const owner =
    repository.owner?.login ||
    githubConfig.username;


  return (
    `https://${owner}.github.io/${repository.name}/`
  );

}


/* =========================================================
   CHECK IF REPOSITORY IS PUBLIC
========================================================= */

export function isPublicRepository(
  repository
) {

  if (
    !repository ||
    typeof repository !== "object"
  ) {

    return false;

  }


  return (
    repository.private !== true
  );

}


/* =========================================================
   CHECK IF REPOSITORY IS A FORK
========================================================= */

export function isOriginalRepository(
  repository
) {

  if (
    !repository ||
    typeof repository !== "object"
  ) {

    return false;

  }


  return (
    repository.fork !== true
  );

}


/* =========================================================
   CHECK GITHUB PAGES
========================================================= */

export function hasGitHubPages(
  repository
) {

  if (
    !repository ||
    typeof repository !== "object"
  ) {

    return false;

  }


  return (
    repository.has_pages === true
  );

}


/* =========================================================
   CHECK IF REPOSITORY SHOULD BE SHOWN
========================================================= */

export function isGitHubProject(
  repository
) {

  if (
    !repository ||
    typeof repository !== "object"
  ) {

    return false;

  }


  /*
    Public repositories only.
  */

  if (
    githubConfig.onlyPublic &&
    !isPublicRepository(
      repository
    )
  ) {

    return false;

  }


  /*
    Ignore forks.
  */

  if (
    githubConfig.ignoreForks &&
    !isOriginalRepository(
      repository
    )
  ) {

    return false;

  }


  /*
    GitHub Pages only.
  */

  if (
    githubConfig.onlyGitHubPages &&
    !hasGitHubPages(
      repository
    )
  ) {

    return false;

  }


  return true;

}


/* =========================================================
   NORMALIZE LANGUAGE
========================================================= */

export function normalizeLanguage(
  language
) {

  if (
    !language ||
    typeof language !== "string"
  ) {

    return "Web";

  }


  return language;

}


/* =========================================================
   NORMALIZE TOPICS
========================================================= */

export function normalizeTopics(
  topics
) {

  if (
    !Array.isArray(
      topics
    )
  ) {

    return [];

  }


  return topics.filter(
    (topic) =>
      typeof topic === "string"
  );

}


/* =========================================================
   REPOSITORY → PROJECT
========================================================= */

export function repositoryToProject(
  repository
) {

  if (
    !isGitHubProject(
      repository
    )
  ) {

    return null;

  }


  const githubUrl =
    repository.html_url ||
    getGitHubRepositoryUrl(
      repository.name
    );


  const liveUrl =
    getGitHubPagesUrl(
      repository
    );


  return {

    /* -----------------------------------------------------
       ID
    ----------------------------------------------------- */

    id:
      `github-${repository.id}`,


    /* -----------------------------------------------------
       NAME
    ----------------------------------------------------- */

    name:
      repository.name,

    title:
      repository.name,


    /* -----------------------------------------------------
       DESCRIPTION
    ----------------------------------------------------- */

    description:
      repository.description ||
      "A web project built with modern web technologies.",


    /* -----------------------------------------------------
       TECHNOLOGY
    ----------------------------------------------------- */

    language:
      normalizeLanguage(
        repository.language
      ),


    /* -----------------------------------------------------
       GITHUB
    ----------------------------------------------------- */

    githubUrl,

    github:
      githubUrl,


    /* -----------------------------------------------------
       LIVE WEBSITE
    ----------------------------------------------------- */

    liveUrl,

    homepage:
      liveUrl,

    demo:
      liveUrl,


    /* -----------------------------------------------------
       GITHUB INFORMATION
    ----------------------------------------------------- */

    stars:
      repository.stargazers_count ||
      0,

    forks:
      repository.forks_count ||
      0,

    watchers:
      repository.watchers_count ||
      0,


    /* -----------------------------------------------------
       TOPICS
    ----------------------------------------------------- */

    topics:
      normalizeTopics(
        repository.topics
      ),


    /* -----------------------------------------------------
       DATES
    ----------------------------------------------------- */

    createdAt:
      repository.created_at ||
      null,

    updatedAt:
      repository.updated_at ||
      null,


    /* -----------------------------------------------------
       SOURCE
    ----------------------------------------------------- */

    source:
      "github-pages",

  };

}


/* =========================================================
   FETCH PUBLIC REPOSITORIES
========================================================= */

export async function fetchGitHubRepositories() {

  const apiUrl =
    getGitHubRepositoriesUrl();


  let response;


  try {

    response =
      await fetch(
        apiUrl,
        {

          method:
            "GET",

          headers: {

            Accept:
              "application/vnd.github+json",

          },

        }
      );

  } catch (error) {

    throw new Error(
      "Unable to connect to GitHub."
    );

  }


  /* =======================================================
     HANDLE 403
  ======================================================= */

  if (
    response.status === 403
  ) {

    const rateLimitRemaining =
      response.headers.get(
        "x-ratelimit-remaining"
      );


    const rateLimitReset =
      response.headers.get(
        "x-ratelimit-reset"
      );


    const error =
      new Error(
        "GitHub API rate limit exceeded."
      );


    error.code =
      "GITHUB_RATE_LIMIT";


    error.status =
      403;


    error.rateLimitRemaining =
      rateLimitRemaining;


    error.rateLimitReset =
      rateLimitReset;


    throw error;

  }


  /* =======================================================
     HANDLE OTHER ERRORS
  ======================================================= */

  if (
    !response.ok
  ) {

    const error =
      new Error(
        `GitHub returned ${response.status}.`
      );


    error.status =
      response.status;


    throw error;

  }


  /* =======================================================
     PARSE RESPONSE
  ======================================================= */

  let repositories;


  try {

    repositories =
      await response.json();

  } catch (error) {

    throw new Error(
      "GitHub returned invalid JSON."
    );

  }


  /* =======================================================
     VALIDATE RESPONSE
  ======================================================= */

  if (
    !Array.isArray(
      repositories
    )
  ) {

    throw new Error(
      "GitHub returned invalid repository data."
    );

  }


  return repositories;

}


/* =========================================================
   FETCH GITHUB PAGES PROJECTS
========================================================= */

export async function fetchGitHubPagesProjects() {

  const repositories =
    await fetchGitHubRepositories();


  const projects =
    repositories

      .filter(
        isGitHubProject
      )

      .map(
        repositoryToProject
      )

      .filter(
        Boolean
      );


  return projects;

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
    project.html_url ||
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
   GET PROJECT LANGUAGE
========================================================= */

export function getProjectLanguage(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "Web";

  }


  return (
    project.language ||
    "Web"
  );

}


/* =========================================================
   GET PROJECT TOPICS
========================================================= */

export function getProjectTopics(
  project
) {

  if (
    !project ||
    !Array.isArray(
      project.topics
    )
  ) {

    return [];

  }


  return project.topics;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default githubConfig;
