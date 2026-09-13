// portfolioCheck.js

import { getData } from "../data/data.js";

const portfolioState = {
  started: false,
  finished: false,
  dataLoaded: false,
  pagesLoaded: false,
  imagesLoaded: false,
  videosLoaded: false,
  errors: [],
};

const addError = (name, error) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error || "Unknown error");

  portfolioState.errors.push({
    name,
    message,
  });

  console.warn(`Portfolio check failed: ${name}`, error);
};

const safeImport = async (name, importer) => {
  try {
    await importer();
    return true;
  } catch (error) {
    addError(name, error);
    return false;
  }
};

const loadData = async () => {
  try {
    const data = await Promise.resolve(getData());

    portfolioState.dataLoaded = true;

    return data;
  } catch (error) {
    addError("Portfolio data", error);

    return null;
  }
};

const collectAssets = (value, assets = new Set()) => {
  if (!value) {
    return assets;
  }

  if (typeof value === "string") {
    const cleanValue = value.split("?")[0].toLowerCase();

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
      imageExtensions.some((extension) =>
        cleanValue.endsWith(extension)
      )
    ) {
      assets.add(value);
    }

    if (
      videoExtensions.some((extension) =>
        cleanValue.endsWith(extension)
      )
    ) {
      assets.add(value);
    }

    return assets;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      collectAssets(item, assets);
    });

    return assets;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((item) => {
      collectAssets(item, assets);
    });
  }

  return assets;
};

const isImage = (src) => {
  const cleanSrc = src.split("?")[0].toLowerCase();

  return [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".svg",
    ".avif",
  ].some((extension) =>
    cleanSrc.endsWith(extension)
  );
};

const isVideo = (src) => {
  const cleanSrc = src.split("?")[0].toLowerCase();

  return [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
  ].some((extension) =>
    cleanSrc.endsWith(extension)
  );
};

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
      console.warn("Image could not be loaded:", src);
      finish(false);
    };

    image.src = src;

    window.setTimeout(() => {
      finish(false);
    }, 10000);
  });
};

const preloadVideo = (src) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");

    let finished = false;

    const finish = (result) => {
      if (finished) {
        return;
      }

      finished = true;

      video.onloadeddata = null;
      video.onerror = null;

      resolve(result);
    };

    video.preload = "metadata";

    video.onloadeddata = () => {
      finish(true);
    };

    video.onerror = () => {
      console.warn("Video could not be loaded:", src);
      finish(false);
    };

    video.src = src;
    video.load();

    window.setTimeout(() => {
      finish(false);
    }, 10000);
  });
};

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

    const imageAssets = assets.filter(isImage);
    const videoAssets = assets.filter(isVideo);

    await Promise.all(
      imageAssets.map((src) =>
        preloadImage(src)
      )
    );

    portfolioState.imagesLoaded = true;

    await Promise.all(
      videoAssets.map((src) =>
        preloadVideo(src)
      )
    );

    portfolioState.videosLoaded = true;
  } catch (error) {
    addError("Portfolio assets", error);

    /*
      Assets failing must NEVER prevent
      the portfolio from opening.
    */
    portfolioState.imagesLoaded = true;
    portfolioState.videosLoaded = true;
  }
};

const loadPages = async () => {
  const pages = [
    [
      "Home",
      () => import("../../pages/Home.jsx"),
    ],
    [
      "About",
      () => import("../../pages/About.jsx"),
    ],
    [
      "Skills",
      () => import("../../pages/Skills.jsx"),
    ],
    [
      "Projects",
      () => import("../../pages/Projects.jsx"),
    ],
    [
      "Contact",
      () => import("../../pages/Contact.jsx"),
    ],
    [
      "NotFound",
      () => import("../../pages/NotFound.jsx"),
    ],
  ];

  try {
    await Promise.all(
      pages.map(([name, importer]) =>
        safeImport(
          `Page: ${name}`,
          importer
        )
      )
    );

    portfolioState.pagesLoaded = true;
  } catch (error) {
    addError("Portfolio pages", error);

    /*
      A page import problem must not
      redirect or stop the application.
    */
    portfolioState.pagesLoaded = true;
  }
};

const portfolioCheck = async () => {
  if (portfolioState.started) {
    return {
      ...portfolioState,
      errors: [...portfolioState.errors],
    };
  }

  portfolioState.started = true;

  try {
    console.log("Starting portfolio checks...");

    /*
      Load your existing data.js.

      We do NOT create or replace data.js.
    */
    const data = await loadData();

    /*
      Load pages and assets independently.
      One failure cannot stop the other.
    */
    await Promise.all([
      loadPages(),
      loadAssets(data),
    ]);
  } catch (error) {
    addError(
      "Unexpected portfolio check",
      error
    );
  }

  /*
    Always mark the checker as finished.

    There is:
    - no Supabase startup request
    - no server check
    - no server-error redirect
    - no navigate()
    - no fatal rejection
  */
  portfolioState.finished = true;

  console.log(
    "Portfolio checks finished."
  );

  if (portfolioState.errors.length > 0) {
    console.warn(
      "Some portfolio checks had problems, but the portfolio will continue.",
      portfolioState.errors
    );
  }

  return {
    ...portfolioState,
    errors: [...portfolioState.errors],
  };
};

export const getPortfolioCheckState = () => {
  return {
    ...portfolioState,
    errors: [...portfolioState.errors],
  };
};

export const isPortfolioReady = () => {
  return portfolioState.finished;
};

/*
  IMPORTANT:
  Loader.jsx uses:

  import portfolioCheck from
  "../../../javascript/utils/portfolioCheck";

  Therefore this MUST be a default export.
*/
export default portfolioCheck;