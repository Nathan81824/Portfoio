/* =========================================================
   SCREENSHOT GENERATOR
   Nathan — Frontend Developer Portfolio

   PURPOSE
   ---------------------------------------------------------
   1. Fetch public GitHub repositories
   2. Find repositories with GitHub Pages
   3. Open each live website with Playwright
   4. Capture a desktop screenshot
   5. Save screenshots to:
      public/project-screenshots/
   6. Generate:
      public/project-screenshots/projects-screenshots.json

   RUN FROM PROJECT ROOT:

   node src/javascript/scripts/screenshot.js
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

const GITHUB_USERNAME =
  "Nathan81824";


const GITHUB_API =
  `https://api.github.com/users/${GITHUB_USERNAME}/repos`;


const OUTPUT_DIRECTORY =
  path.resolve(
    "public",
    "project-screenshots"
  );


const OUTPUT_DATA_FILE =
  path.join(
    OUTPUT_DIRECTORY,
    "projects-screenshots.json"
  );


/* =========================================================
   BROWSER SETTINGS
========================================================= */

const VIEWPORT = {
  width: 1440,
  height: 900,
};


const PAGE_TIMEOUT =
  30_000;


const AFTER_LOAD_DELAY =
  1500;


/* =========================================================
   SAFE FILE NAME
========================================================= */

function createSafeFileName(
  name
) {

  return name

    .toLowerCase()

    .trim()

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      "");

}


/* =========================================================
   GITHUB PAGES URL
========================================================= */

function getGitHubPagesUrl(
  repository
) {

  return (
    `https://${repository.owner.login}.github.io/${repository.name}/`
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

        method:
          "GET",

        headers: {

          Accept:
            "application/vnd.github+json",

          "User-Agent":
            "Nathan-Portfolio-Screenshot-Generator",

        },

      }

    );


  /* =======================================================
     HANDLE GITHUB ERRORS
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
        `Rate limit remaining: ${remaining}`
      );

    }


    if (
      reset !== null
    ) {

      const resetTime =
        new Date(
          Number(reset) * 1000
        );


      console.error(
        `Rate limit reset: ${resetTime.toLocaleString()}`
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
       Only repositories with GitHub Pages
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
          getGitHubPagesUrl(
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
            repository.homepage ||
            liveUrl,

          demo:
            liveUrl,

          stars:
            repository.stargazers_count ||
            0,

          updatedAt:
            repository.updated_at,

          source:
            "github-pages",

          screenshot:
            `/project-screenshots/${safeName}.png`,

          screenshotFile:
            `${safeName}.png`,

        };

      }
    );

}


/* =========================================================
   CHECK WEBSITE
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
      `Could not open website: ${url}`
    );


    console.warn(
      error.message
    );


    return false;

  }

}


/* =========================================================
   PREPARE WEBSITE
========================================================= */

async function preparePage(
  page
) {

  /* -------------------------------------------------------
     Wait for network
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
     Allow website animations/content to settle
  ------------------------------------------------------- */

  await page.waitForTimeout(
    AFTER_LOAD_DELAY
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
        width: 0 !important;
        height: 0 !important;
        display: none !important;
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
     Open project
  ------------------------------------------------------- */

  const loaded =
    await openWebsite(
      page,
      project.liveUrl
    );


  if (!loaded) {

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
     Screenshot path
  ------------------------------------------------------- */

  const screenshotPath =
    path.join(

      OUTPUT_DIRECTORY,

      project.screenshotFile

    );


  /* -------------------------------------------------------
     Capture
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
      `✓ Saved ${project.screenshotFile}`
    );


    return project;

  } catch (error) {

    console.warn(
      `✗ Screenshot failed: ${project.name}`
    );


    console.warn(
      error.message
    );


    return null;

  }

}


/* =========================================================
   REMOVE OLD SCREENSHOTS
========================================================= */

async function removeOldScreenshots(
  projects
) {

  const files =
    await fs.readdir(
      OUTPUT_DIRECTORY
    );


  const currentFiles =
    new Set(

      projects.map(
        (project) =>
          project.screenshotFile
      )

    );


  for (
    const file
    of files
  ) {

    /* -----------------------------------------------------
       Keep JSON data
    ----------------------------------------------------- */

    if (
      file ===
      "projects-screenshots.json"
    ) {

      continue;

    }


    /* -----------------------------------------------------
       Only process PNG files
    ----------------------------------------------------- */

    if (
      !file.endsWith(
        ".png"
      )
    ) {

      continue;

    }


    if (
      !currentFiles.has(
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

    OUTPUT_DATA_FILE,

    JSON.stringify(
      projects,
      null,
      2
    ),

    "utf8"

  );


  console.log(
    "✓ Project screenshot data saved."
  );

}


/* =========================================================
   MAIN
========================================================= */

async function generateScreenshots() {

  console.log(
    "\n=========================================="
  );

  console.log(
    "     PROJECT SCREENSHOT GENERATOR"
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
      "\n✗ GitHub repository fetch failed."
    );


    console.error(
      error.message
    );


    console.error(
      "\nYour React application can still use"
    );

    console.error(
      "projects.js as its fallback."
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
    `\nGitHub Pages projects found: ${projects.length}`
  );


  if (
    projects.length === 0
  ) {

    console.log(
      "No GitHub Pages projects found."
    );


    await saveProjectData(
      []
    );


    return;

  }


  /* =======================================================
     DISPLAY PROJECTS
  ======================================================= */

  console.log(
    "\nProjects to screenshot:"
  );


  projects.forEach(
    (
      project,
      index
    ) => {

      console.log(
        `${index + 1}. ${project.name}`
      );

      console.log(
        `   ${project.liveUrl}`
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

    });


  const page =
    await context.newPage();


  /* =======================================================
     CAPTURE PROJECTS
  ======================================================= */

  const successfulProjects = [];


  for (
    const project
    of projects
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
     CLOSE BROWSER
  ======================================================= */

  await browser.close();


  /* =======================================================
     REMOVE OLD SCREENSHOTS
  ======================================================= */

  await removeOldScreenshots(
    successfulProjects
  );


  /* =======================================================
     SAVE JSON
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
    "     SCREENSHOTS COMPLETE"
  );

  console.log(
    "=========================================="
  );


  console.log(
    `Generated: ${successfulProjects.length}`
  );


  console.log(
    `Directory: ${OUTPUT_DIRECTORY}`
  );


  console.log(
    `Data: ${OUTPUT_DATA_FILE}`
  );

}


/* =========================================================
   RUN
========================================================= */

generateScreenshots()

  .catch(
    (error) => {

      console.error(
        "\n✗ Unexpected screenshot error:"
      );


      console.error(
        error
      );


      process.exitCode =
        1;

    }
  );

