/* =========================================================
   PROJECT SCREENSHOTS API
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/api/screenshots/screenshots.js

   PURPOSE
   ---------------------------------------------------------
   Provides project screenshot helpers.

   SCREENSHOT SYSTEM
   ---------------------------------------------------------
   GitHub / Vercel / Netlify
        ↓
   Project liveUrl
        ↓
   Thumb.io
        ↓
   Project screenshot URL

   IMPORTANT
   ---------------------------------------------------------
   This file does NOT use Playwright.

   This file does NOT generate or store local PNG files.

   Thumb.io generates the project preview image from
   the project's public live URL.
========================================================= */


/* =========================================================
   THUMB.IO CONFIGURATION
========================================================= */

export const screenshotConfig = {

  /* =======================================================
     PROVIDER
  ======================================================= */

  provider:
    "thumb.io",


  /* =======================================================
     BASE URL
  ======================================================= */

  baseUrl:
    "https://image.thum.io/get/",


  /* =======================================================
     DEFAULT SCREENSHOT
  ======================================================= */

  defaultScreenshot:
    "",


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
   NORMALIZE URL
========================================================= */

export function normalizeScreenshotUrl(
  url
) {

  if (
    !url ||
    typeof url !== "string"
  ) {

    return "";

  }


  return url.trim();

}


/* =========================================================
   GET PROJECT LIVE URL
========================================================= */

export function getScreenshotSourceUrl(
  project
) {

  if (
    !project ||
    typeof project !== "object"
  ) {

    return "";

  }


  return (
    project.liveUrl ||
    project.homepage ||
    project.demo ||
    project.url ||
    ""
  );

}


/* =========================================================
   CREATE THUMB.IO URL
========================================================= */

export function getThumbIoScreenshot(
  url
) {

  const normalizedUrl =
    normalizeScreenshotUrl(
      url
    );


  if (
    !normalizedUrl
  ) {

    return "";

  }


  if (
    normalizedUrl === "#"
  ) {

    return "";

  }


  return (
    `${screenshotConfig.baseUrl}` +
    `${normalizedUrl}`
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

    return (
      screenshotConfig.defaultScreenshot
    );

  }


  /* =======================================================
     EXPLICIT SCREENSHOT
  ======================================================= */

  if (
    typeof project.screenshot === "string" &&
    project.screenshot.trim()
  ) {

    return (
      project.screenshot.trim()
    );

  }


  /* =======================================================
     IMAGE
  ======================================================= */

  if (
    typeof project.image === "string" &&
    project.image.trim()
  ) {

    return (
      project.image.trim()
    );

  }


  /* =======================================================
     THUMBNAIL
  ======================================================= */

  if (
    typeof project.thumbnail === "string" &&
    project.thumbnail.trim()
  ) {

    return (
      project.thumbnail.trim()
    );

  }


  /* =======================================================
     THUMB.IO
  ======================================================= */

  const liveUrl =
    getScreenshotSourceUrl(
      project
    );


  return (
    getThumbIoScreenshot(
      liveUrl
    ) ||
    screenshotConfig.defaultScreenshot
  );

}


/* =========================================================
   CHECK PROJECT SCREENSHOT
========================================================= */

export function hasProjectScreenshot(
  project
) {

  const screenshot =
    getProjectScreenshot(
      project
    );


  return Boolean(
    screenshot
  );

}


/* =========================================================
   GET SCREENSHOT DATA
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

      loading:
        screenshotConfig.loading,

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
   CHECK IF SCREENSHOT CAN BE GENERATED
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


  const liveUrl =
    getScreenshotSourceUrl(
      project
    );


  if (
    !liveUrl ||
    liveUrl === "#"
  ) {

    return false;

  }


  return true;

}


/* =========================================================
   CREATE SCREENSHOT JOB
========================================================= */

export function createScreenshotJob(
  project
) {

  if (
    !shouldGenerateScreenshot(
      project
    )
  ) {

    return null;

  }


  const sourceUrl =
    getScreenshotSourceUrl(
      project
    );


  const screenshotUrl =
    getThumbIoScreenshot(
      sourceUrl
    );


  if (
    !screenshotUrl
  ) {

    return null;

  }


  return {

    id:
      project.id ||
      project.name ||
      project.title ||
      "project",

    name:
      project.name ||
      project.title ||
      "Project",

    sourceUrl,

    screenshotUrl,

    provider:
      screenshotConfig.provider,

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
   GET SCREENSHOT FALLBACK
========================================================= */

export function getScreenshotFallback(
  project
) {

  if (
    project?.fallbackScreenshot
  ) {

    return (
      project.fallbackScreenshot
    );

  }


  return (
    screenshotConfig.defaultScreenshot
  );

}


/* =========================================================
   BUILD PROJECT SCREENSHOT URL
========================================================= */

export function buildProjectScreenshot(
  project
) {

  const screenshot =
    getProjectScreenshot(
      project
    );


  return {

    screenshot,

    sourceUrl:
      getScreenshotSourceUrl(
        project
      ),

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default screenshotConfig;