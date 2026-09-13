import { getData } from "../data/data.js";


/* =====================================================
   PORTFOLIO CHECK STATE
===================================================== */

const portfolioState = {
  started: false,
  finished: false,

  dataLoaded: false,
  pagesLoaded: false,
  imagesLoaded: false,
  videosLoaded: false,

  errors: [],
};


/* =====================================================
   ERROR HANDLER
===================================================== */

const addError = (name, error) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error || "Unknown error");

  portfolioState.errors.push({
    name,
    message,
  });

  console.warn(
    `Portfolio check warning: ${name}`,
    error
  );
};


/* =====================================================
   LOAD PORTFOLIO DATA
===================================================== */

const loadData = async () => {
  try {
    const data = await Promise.resolve(
      getData()
    );

    portfolioState.dataLoaded = true;

    console.log(
      "✓ Portfolio data loaded successfully."
    );

    return data;
  } catch (error) {
    addError(
      "Portfolio data",
      error
    );

    return null;
  }
};


/* =====================================================
   COLLECT ASSETS
===================================================== */

const collectAssets = (
  value,
  assets = new Set()
) => {
  if (!value) {
    return assets;
  }

  if (typeof value === "string") {
    const cleanValue =
      value
        .split("?")[0]
        .toLowerCase();

    const imageExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".gif",
      ".svg",
      ".avif",
    ];

    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
    ];

    if (
      imageExtensions.some(
        (extension) =>
          cleanValue.endsWith(extension)
      )
    ) {
      assets.add({
        src: value,
        type: "image",
      });
    }

    if (
      videoExtensions.some(
        (extension) =>
          cleanValue.endsWith(extension)
      )
    ) {
      assets.add({
        src: value,
        type: "video",
      });
    }

    return assets;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectAssets(
        item,
        assets
      );
    });

    return assets;
  }

  if (typeof value === "object") {
    Object.values(value).forEach(
      (item) => {
        collectAssets(
          item,
          assets
        );
      }
    );
  }

  return assets;
};


/* =====================================================
   IMAGE LOADER
===================================================== */

const preloadImage = (src) => {
  return new Promise((resolve) => {
    const image = new Image();

    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      image.onload = null;
      image.onerror = null;

      resolve(result);
    };

    image.onload = () => {
      finish(true);
    };

    image.onerror = () => {
      console.warn(
        "Image could not be loaded:",
        src
      );

      finish(false);
    };

    image.src = src;

    window.setTimeout(() => {
      finish(false);
    }, 8000);
  });
};


/* =====================================================
   VIDEO LOADER
===================================================== */

const preloadVideo = (src) => {
  return new Promise((resolve) => {
    const video =
      document.createElement("video");

    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      video.onloadedmetadata = null;
      video.onloadeddata = null;
      video.onerror = null;

      video.removeAttribute("src");

      try {
        video.load();
      } catch {
        // Ignore cleanup errors.
      }

      resolve(result);
    };

    /*
      We only need metadata here.

      The checker should NOT wait for
      the entire video to download.
    */

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      finish(true);
    };

    video.onloadeddata = () => {
      finish(true);
    };

    video.onerror = () => {
      console.warn(
        "Video could not be loaded:",
        src
      );

      finish(false);
    };

    video.src = src;

    try {
      video.load();
    } catch (error) {
      finish(false);
    }

    /*
      Video loading is optional.

      If it is slow, the portfolio
      continues normally.
    */

    window.setTimeout(() => {
      console.warn(
        "Video preload timed out. Continuing portfolio:",
        src
      );

      finish(false);
    }, 5000);
  });
};


/* =====================================================
   LOAD ASSETS
===================================================== */

const loadAssets = async (data) => {
  try {
    if (!data) {
      portfolioState.imagesLoaded = true;
      portfolioState.videosLoaded = true;

      return;
    }

    const assets = [
      ...collectAssets(data),
    ];

    const imageAssets =
      assets.filter(
        (asset) =>
          asset.type === "image"
      );

    const videoAssets =
      assets.filter(
        (asset) =>
          asset.type === "video"
      );


    /* =================================================
       IMAGES
    ================================================= */

    const imageResults =
      await Promise.all(
        imageAssets.map(
          async (asset) => {
            const loaded =
              await preloadImage(
                asset.src
              );

            return {
              ...asset,
              loaded,
            };
          }
        )
      );


    imageResults.forEach(
      (result) => {
        if (result.loaded) {
          console.log(
            "✓ Image loaded:",
            result.src
          );
        } else {
          addError(
            `Image: ${result.src}`,
            new Error(
              "Image failed to load."
            )
          );
        }
      }
    );


    portfolioState.imagesLoaded = true;


    /* =================================================
       VIDEOS
    ================================================= */

    const videoResults =
      await Promise.all(
        videoAssets.map(
          async (asset) => {
            const loaded =
              await preloadVideo(
                asset.src
              );

            return {
              ...asset,
              loaded,
            };
          }
        )
      );


    videoResults.forEach(
      (result) => {
        if (result.loaded) {
          console.log(
            "✓ Video loaded:",
            result.src
          );
        } else {
          console.warn(
            "⚠ Video skipped:",
            result.src
          );
        }
      }
    );


    /*
      Videos are never allowed to
      block the portfolio.
    */

    portfolioState.videosLoaded = true;

  } catch (error) {
    addError(
      "Portfolio assets",
      error
    );

    /*
      Even if the asset checker itself
      crashes, the portfolio continues.
    */

    portfolioState.imagesLoaded = true;
    portfolioState.videosLoaded = true;
  }
};


/* =====================================================
   PAGE CHECK
===================================================== */

const checkPages = () => {
  try {
    /*
      IMPORTANT:

      These pages are already statically
      imported by App.jsx.

      Do NOT dynamically import them here.

      Doing both creates Vite's:

      INEFFECTIVE_DYNAMIC_IMPORT

      warning.
    */

    const pages = [
      "Home",
      "About",
      "Skills",
      "Projects",
      "Contact",
      "NotFound",
    ];

    console.log(
      "✓ Pages registered:",
      pages.join(", ")
    );

    portfolioState.pagesLoaded = true;

    return true;
  } catch (error) {
    addError(
      "Portfolio pages",
      error
    );

    /*
      A page-check problem should never
      redirect or stop the portfolio.
    */

    portfolioState.pagesLoaded = true;

    return false;
  }
};


/* =====================================================
   PORTFOLIO CHECK
===================================================== */

const portfolioCheck = async () => {
  /*
    Prevent duplicate startup checks.
  */

  if (portfolioState.started) {
    return {
      ...portfolioState,

      errors: [
        ...portfolioState.errors,
      ],
    };
  }


  portfolioState.started = true;


  console.log(
    "===================================="
  );

  console.log(
    "PORTFOLIO STARTUP CHECK"
  );

  console.log(
    "===================================="
  );


  try {
    /* ================================================
       DATA
    ================================================ */

    const data =
      await loadData();


    /* ================================================
       PAGES
    ================================================ */

    checkPages();


    /* ================================================
       ASSETS

       Asset checking runs separately so
       a slow asset cannot block page
       registration.
    ================================================ */

    await loadAssets(
      data
    );

  } catch (error) {
    addError(
      "Unexpected portfolio check",
      error
    );
  }


  /* =================================================
     ALWAYS FINISH
  ================================================= */

  portfolioState.finished = true;


  console.log(
    "===================================="
  );

  console.log(
    "PORTFOLIO STARTUP CHECK COMPLETE"
  );

  console.log(
    "===================================="
  );


  if (
    portfolioState.errors.length > 0
  ) {
    console.warn(
      "Some optional portfolio checks failed.",
      portfolioState.errors
    );

    console.warn(
      "The portfolio will continue normally."
    );
  } else {
    console.log(
      "✓ All portfolio checks completed successfully."
    );
  }


  return {
    ...portfolioState,

    errors: [
      ...portfolioState.errors,
    ],
  };
};


/* =====================================================
   GET CHECK STATE
===================================================== */

export const getPortfolioCheckState = () => {
  return {
    ...portfolioState,

    errors: [
      ...portfolioState.errors,
    ],
  };
};


/* =====================================================
   PORTFOLIO READY
===================================================== */

export const isPortfolioReady = () => {
  return portfolioState.finished;
};


/* =====================================================
   RESET
===================================================== */

export const resetPortfolioCheck = () => {
  portfolioState.started = false;
  portfolioState.finished = false;

  portfolioState.dataLoaded = false;
  portfolioState.pagesLoaded = false;
  portfolioState.imagesLoaded = false;
  portfolioState.videosLoaded = false;

  portfolioState.errors = [];
};


/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default portfolioCheck;