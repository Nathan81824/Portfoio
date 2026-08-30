/* =========================================================
   PROJECT SCREENSHOTS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/projects/screenshot.js

   PURPOSE
   ---------------------------------------------------------
   Central screenshot configuration and helpers.

   Used by:
   - ProjectsHero.jsx
   - Project cards
   - Project preview components
   - Generated screenshot system

   IMPORTANT
   ---------------------------------------------------------
   This file does NOT generate screenshots.

   Screenshot generation belongs in:

   src/javascript/scripts/
   generate-project-screenshots.js

   That script can use Playwright to visit the live
   project and save an actual screenshot.
========================================================= */


/* =========================================================
   SCREENSHOT CONFIGURATION
========================================================= */

export const screenshotConfig = {

  /* =======================================================
     STORAGE
  ======================================================= */

  basePath:
    "/project-screenshots/",


  /* =======================================================
     DEFAULT IMAGE
  ======================================================= */

  defaultScreenshot:
    "/project-screenshots/default.png",


  /* =======================================================
     IMAGE FORMAT
  ======================================================= */

  extension:
    ".png",


  /* =======================================================
     SCREENSHOT SIZE
  ======================================================= */

  width:
    1440,

  height:
    900,


  /* =======================================================
     DEVICE SCALE
  ======================================================= */

  deviceScaleFactor:
    1,


  /* =======================================================
     SCREENSHOT QUALITY
  ======================================================= */

  fullPage:
    false,


  /* =======================================================
     IMAGE LOADING
  ======================================================= */

  loading:
    "lazy",


  /* =======================================================
     FALLBACK
  ======================================================= */

  fallback:
    true,

};


/* =========================================================
   SANITIZE PROJECT NAME
========================================================= */

export function sanitizeProjectName(
  name
) {

  if (
    !name ||
    typeof name !== "string"
  ) {

    return "project";

  }


  return name

    .trim()

    .toLowerCase()

    .replace(
      /[^a-z0-9]+/g,
      "-"
    )

    .replace(
      /^-+|-+$/g,
      ""

    ) || "project";

}


/* =========================================================
   CREATE SCREENSHOT FILENAME
========================================================= */

export function getScreenshotFilename(
  project
) {

  if (
    !project
  ) {

    return "project.png";

  }


  const name =
    project.slug ||
    project.name ||
    project.title ||
    project.id ||
    "project";


  return (
    `${sanitizeProjectName(name)}${screenshotConfig.extension}`
  );

}


/* =========================================================
   CREATE SCREENSHOT PATH
========================================================= */

export function getScreenshotPath(
  project
) {

  const filename =
    getScreenshotFilename(
      project
    );


  return (
    `${screenshotConfig.basePath}${filename}`
  );

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

    return screenshotConfig.defaultScreenshot;

  }


  /*
    Prefer the explicitly assigned screenshot.
  */

  if (
    typeof project.screenshot === "string" &&
    project.screenshot.trim()
  ) {

    return project.screenshot;

  }


  /*
    Then try image.
  */

  if (
    typeof project.image === "string" &&
    project.image.trim()
  ) {

    return project.image;

  }


  /*
    Then try thumbnail.
  */

  if (
    typeof project.thumbnail === "string" &&
    project.thumbnail.trim()
  ) {

    return project.thumbnail;

  }


  /*
    Finally generate the expected screenshot path.
  */

  return getScreenshotPath(
    project
  );

}


/* =========================================================
   CHECK SCREENSHOT
========================================================= */

export function hasProjectScreenshot(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return false;

  }


  return Boolean(
    project.screenshot ||
    project.image ||
    project.thumbnail
  );

}


/* =========================================================
   PROJECT SCREENSHOT DATA
========================================================= */

export function getScreenshotData(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return {

      src:
        screenshotConfig.defaultScreenshot,

      alt:
        "Project screenshot",

    };

  }


  const name =
    project.name ||
    project.title ||
    "Project";


  return {

    src:
      getProjectScreenshot(
        project
      ),

    alt:
      `${name} project screenshot`,

    loading:
      screenshotConfig.loading,

  };

}


/* =========================================================
   CHECK IF SCREENSHOT SHOULD BE GENERATED
========================================================= */

export function shouldGenerateScreenshot(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return false;

  }


  /*
    A project needs a live URL before the screenshot
    generator can visit it.
  */

  const liveUrl =
    project.liveUrl ||
    project.homepage ||
    project.demo ||
    project.url;


  if (
    !liveUrl ||
    liveUrl === "#"
  ) {

    return false;

  }


  /*
    Don't regenerate an explicitly assigned screenshot
    unless the project requests regeneration.
  */

  if (
    project.screenshot &&
    project.regenerateScreenshot !== true
  ) {

    return false;

  }


  return true;

}


/* =========================================================
   GET LIVE PROJECT URL
========================================================= */

export function getScreenshotSourceUrl(
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
   CREATE SCREENSHOT JOB
========================================================= */

export function createScreenshotJob(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return null;

  }


  const sourceUrl =
    getScreenshotSourceUrl(
      project
    );


  if (
    sourceUrl === "#"
  ) {

    return null;

  }


  return {

    id:
      project.id ||
      sanitizeProjectName(
        project.name ||
        project.title
      ),

    name:
      project.name ||
      project.title ||
      "Project",

    url:
      sourceUrl,

    output:
      getScreenshotPath(
        project
      ),

    width:
      screenshotConfig.width,

    height:
      screenshotConfig.height,

    deviceScaleFactor:
      screenshotConfig.deviceScaleFactor,

    fullPage:
      screenshotConfig.fullPage,

  };

}


/* =========================================================
   CREATE SCREENSHOT JOBS
========================================================= */

export function createScreenshotJobs(
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
      shouldGenerateScreenshot
    )

    .map(
      createScreenshotJob
    )

    .filter(
      Boolean
    );

}


/* =========================================================
   PROJECT IMAGE ERROR FALLBACK
========================================================= */

export function getScreenshotFallback(
  project
) {

  if (
    project?.fallbackScreenshot
  ) {

    return project.fallbackScreenshot;

  }


  return screenshotConfig.defaultScreenshot;

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default screenshotConfig;
