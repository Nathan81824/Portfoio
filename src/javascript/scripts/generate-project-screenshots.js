/* =========================================================
   GENERATE PROJECT SCREENSHOTS
   Nathan — Frontend Developer Portfolio

   PURPOSE
   ---------------------------------------------------------
   1. Fetch Nathan81824's public GitHub repositories
   2. Find repositories with GitHub Pages enabled
   3. Ignore forked repositories
   4. Open each GitHub Pages website
   5. Capture a desktop screenshot
   6. Save screenshots to:
      public/project-screenshots/
   7. Generate project screenshot data
========================================================= */


/* =========================================================
   IMPORTS
========================================================= */

import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";


/* =========================================================
   CONFIGURATION
========================================================= */

const GITHUB_USERNAME = "Nathan81824";

const GITHUB_API =
  `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

const OUTPUT_DIRECTORY =
  path.resolve(
    "public",
    "project-screenshots"
  );

const OUTPUT_FILE =
  path.join(
    OUTPUT_DIRECTORY,
    "projects-screenshots.json"
  );


/* =========================================================
   SCREENSHOT SETTINGS
========================================================= */

const VIEWPORT = {
  width: 1440,
  height: 900,
};

const PAGE_TIMEOUT = 30_000;

const WAIT_AFTER_LOAD = 1500;


/* =========================================================
   CREATE SAFE FILE NAME
========================================================= */

function createSafeFileName(name) {

  return String(name || "")

    .toLowerCase()

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      "");

}


/* =========================================================
   CREATE GITHUB PAGES URL
========================================================= */

function createGitHubPagesUrl(repository) {

  if (
    repository?.homepage
  ) {

    return repository.homepage;

  }


  const owner =
    repository?.owner?.login ||
    GITHUB_USERNAME;


  return (
    `https://${owner}.github.io/${repository.name}/`
  );

}


/* =========================================================
   FETCH GITHUB REPOSITORIES
========================================================= */

async function fetchRepositories() {

  console.log(
    "\nFetching GitHub repositories..."
  );


  const response =
    await fetch(
      `${GITHUB_API}?per_page=100&sort=updated`,
      {
        method: "GET",

        headers: {
          Accept:
            "application/vnd.github+json",

          "User-Agent":
            "Nathan-Portfolio",
        },
      }
    );


  /* =======================================================
     GITHUB ERROR
  ======================================================= */

  if (!response.ok) {

    const remaining =
      response.headers.get(
        "x-ratelimit-remaining"
      );

    const reset =
      response.headers.get(
        "x-ratelimit-reset"
      );


    console.error(
      `GitHub API returned ${response.status}`
    );


    if (
      remaining !== null
    ) {

      console.error(
        `Remaining requests: ${remaining}`
      );

    }


    if (
      reset !== null
    ) {

      const resetDate =
        new Date(
          Number(reset) * 1000
        );


      console.error(
        `Rate limit reset: ${resetDate.toLocaleString()}`
      );

    }


    throw new Error(
      `GitHub returned ${response.status}`
    );

  }


  const repositories =
    await response.json();


  if (
    !Array.isArray(
      repositories
    )
  ) {

    throw new Error(
      "GitHub returned invalid repository data."
    );

  }


  console.log(
    `Found ${repositories.length} repositories.`
  );


  return repositories;

}


/* =========================================================
   FIND GITHUB PAGES PROJECTS
========================================================= */

function findGitHubPagesProjects(
  repositories
) {

  return repositories

    /* -----------------------------------------------------
       Ignore forks
    ----------------------------------------------------- */

    .filter(
      (repository) =>
        !repository.fork
    )

    /* -----------------------------------------------------
       Only GitHub Pages repositories
    ----------------------------------------------------- */

    .filter(
      (repository) =>
        repository.has_pages === true
    )

    /* -----------------------------------------------------
       Convert repository data
    ----------------------------------------------------- */

    .map(
      (repository) => {

        const liveUrl =
          createGitHubPagesUrl(
            repository
          );


        const safeName =
          createSafeFileName(
            repository.name
          );


        return {

          id:
            `github-${repository.id}`,

          name:
            repository.name,

          title:
            repository.name,

          description:
            repository.description ||
            "A web project built with modern technologies.",

          language:
            repository.language ||
            "Web",

          githubUrl:
            repository.html_url,

          github:
            repository.html_url,

          liveUrl,

          homepage:
            liveUrl,

          demo:
            liveUrl,

          stars:
            repository.stargazers_count ||
            0,

          forks:
            repository.forks_count ||
            0,

          watchers:
            repository.watchers_count ||
            0,

          updatedAt:
            repository.updated_at ||
            null,

          createdAt:
            repository.created_at ||
            null,

          screenshot:
            `/project-screenshots/${safeName}.png`,

          screenshotFile:
            `${safeName}.png`,

          source:
            "github-pages",

        };

      }
    );

}


/* =========================================================
   OPEN WEBSITE
========================================================= */

async function openWebsite(
  page,
  url
) {

  try {

    console.log(
      `Opening: ${url}`
    );


    const response =
      await page.goto(
        url,
        {
          waitUntil:
            "domcontentloaded",

          timeout:
            PAGE_TIMEOUT,
        }
      );


    if (!response) {

      return false;

    }


    const status =
      response.status();


    if (
      status >= 400
    ) {

      console.warn(
        `Website returned HTTP ${status}`
      );


      return false;

    }


    return true;

  } catch (error) {

    console.warn(
      `Could not open ${url}`
    );


    console.warn(
      error?.message ||
      error
    );


    return false;

  }

}


/* =========================================================
   PREPARE PAGE
========================================================= */

async function preparePage(
  page
) {

  /* -------------------------------------------------------
     Wait for network activity
  ------------------------------------------------------- */

  await page

    .waitForLoadState(
      "networkidle",
      {
        timeout:
          15_000,
      }
    )

    .catch(
      () => {}
    );


  /* -------------------------------------------------------
     Give animations time to render
  ------------------------------------------------------- */

  await page.waitForTimeout(
    WAIT_AFTER_LOAD
  );


  /* -------------------------------------------------------
     Hide scrollbars
  ------------------------------------------------------- */

  await page.addStyleTag({

    content: `

      html {
        scrollbar-width: none !important;
      }

      body {
        scrollbar-width: none !important;
      }

      ::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

    `,

  });


  /* -------------------------------------------------------
     Disable animations
  ------------------------------------------------------- */

  await page.addStyleTag({

    content: `

      *,
      *::before,
      *::after {

        animation:
          none !important;

        transition:
          none !important;

        scroll-behavior:
          auto !important;

      }

    `,

  });

}


/* =========================================================
   TAKE SCREENSHOT
========================================================= */

async function captureScreenshot(
  page,
  project
) {

  console.log(
    `\nCapturing: ${project.name}`
  );


  /* -------------------------------------------------------
     Open website
  ------------------------------------------------------- */

  const websiteLoaded =
    await openWebsite(
      page,
      project.liveUrl
    );


  if (!websiteLoaded) {

    console.warn(
      `Skipped: ${project.name}`
    );


    return null;

  }


  /* -------------------------------------------------------
     Prepare page
  ------------------------------------------------------- */

  await preparePage(
    page
  );


  /* -------------------------------------------------------
     Screenshot filename
  ------------------------------------------------------- */

  const screenshotPath =
    path.join(
      OUTPUT_DIRECTORY,
      project.screenshotFile
    );


  /* -------------------------------------------------------
     Take screenshot
  ------------------------------------------------------- */

  try {

    await page.screenshot({

      path:
        screenshotPath,

      fullPage:
        true,

      type:
        "png",

      animations:
        "disabled",

    });


    console.log(
      `Saved: ${project.screenshotFile}`
    );


    return project;

  } catch (error) {

    console.warn(
      `Screenshot failed: ${project.name}`
    );


    console.warn(
      error?.message ||
      error
    );


    return null;

  }

}


/* =========================================================
   CLEAN OLD SCREENSHOTS
========================================================= */

async function cleanOldScreenshots(
  projects
) {

  const files =
    await fs.readdir(
      OUTPUT_DIRECTORY
    );


  const validFiles =
    new Set(
      projects.map(
        (project) =>
          project.screenshotFile
      )
    );


  for (
    const file of files
  ) {

    /* -----------------------------------------------------
       Never delete project data file
    ----------------------------------------------------- */

    if (
      file ===
      "projects-screenshots.json"
    ) {

      continue;

    }


    /* -----------------------------------------------------
       Only remove PNG files
    ----------------------------------------------------- */

    if (
      !file.endsWith(
        ".png"
      )
    ) {

      continue;

    }


    if (
      !validFiles.has(
        file
      )
    ) {

      const filePath =
        path.join(
          OUTPUT_DIRECTORY,
          file
        );


      await fs.unlink(
        filePath
      );


      console.log(
        `Removed old screenshot: ${file}`
      );

    }

  }

}


/* =========================================================
   SAVE PROJECT DATA
========================================================= */

async function saveProjectData(
  projects
) {

  await fs.writeFile(

    OUTPUT_FILE,

    JSON.stringify(
      projects,
      null,
      2
    ),

    "utf8"

  );


  console.log(
    "\nProject screenshot data saved."
  );

}


/* =========================================================
   MAIN FUNCTION
========================================================= */

async function generateProjectScreenshots() {

  console.log(
    "\n=========================================="
  );

  console.log(
    "   PROJECT SCREENSHOT GENERATOR"
  );

  console.log(
    "=========================================="
  );


  /* =======================================================
     CREATE OUTPUT DIRECTORY
  ======================================================= */

  await fs.mkdir(

    OUTPUT_DIRECTORY,

    {
      recursive:
        true,
    }

  );


  /* =======================================================
     FETCH REPOSITORIES
  ======================================================= */

  let repositories;


  try {

    repositories =
      await fetchRepositories();

  } catch (error) {

    console.error(
      "\nUnable to fetch GitHub repositories."
    );


    console.error(
      error?.message ||
      error
    );


    console.error(
      "\nThe existing projects.js data should be used"
    );

    console.error(
      "as the React application's fallback."
    );


    process.exitCode =
      1;


    return;

  }


  /* =======================================================
     FIND PROJECTS
  ======================================================= */

  const projects =
    findGitHubPagesProjects(
      repositories
    );


  console.log(
    `\nGitHub Pages projects: ${projects.length}`
  );


  if (
    projects.length === 0
  ) {

    console.log(
      "\nNo GitHub Pages repositories found."
    );


    await saveProjectData(
      []
    );


    return;

  }


  /* =======================================================
     LIST PROJECTS
  ======================================================= */

  console.log(
    "\nProjects:"
  );


  projects.forEach(
    (
      project,
      index
    ) => {

      console.log(
        `${index + 1}. ${project.name}`
      );

    }
  );


  /* =======================================================
     START PLAYWRIGHT
  ======================================================= */

  console.log(
    "\nStarting Chromium..."
  );


  const browser =
    await chromium.launch({

      headless:
        true,

    });


  const context =
    await browser.newContext({

      viewport:
        VIEWPORT,

      deviceScaleFactor:
        1,

      colorScheme:
        "dark",

      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36",

    });


  const page =
    await context.newPage();


  /* =======================================================
     CAPTURE PROJECTS
  ======================================================= */

  const successfulProjects = [];


  for (
    const project of projects
  ) {

    const result =
      await captureScreenshot(
        page,
        project
      );


    if (
      result
    ) {

      successfulProjects.push(
        result
      );

    }

  }


  /* =======================================================
     CLOSE PLAYWRIGHT
  ======================================================= */

  await browser.close();


  /* =======================================================
     REMOVE OLD SCREENSHOTS
  ======================================================= */

  await cleanOldScreenshots(
    successfulProjects
  );


  /* =======================================================
     SAVE DATA
  ======================================================= */

  await saveProjectData(
    successfulProjects
  );


  /* =======================================================
     COMPLETE
  ======================================================= */

  console.log(
    "\n=========================================="
  );

  console.log(
    "   COMPLETE"
  );

  console.log(
    "=========================================="
  );

  console.log(
    `Screenshots generated: ${successfulProjects.length}`
  );

  console.log(
    `Location: ${OUTPUT_DIRECTORY}`
  );

  console.log(
    `Data file: ${OUTPUT_FILE}`
  );

}


/* =========================================================
   RUN
========================================================= */

generateProjectScreenshots()

  .catch(
    (error) => {

      console.error(
        "\nUnexpected error:"
      );

      console.error(
        error
      );


      process.exitCode =
        1;

    }
  );