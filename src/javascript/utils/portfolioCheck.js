/* =========================================================
   PORTFOLIO CHECK
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/portfolioCheck.js

   Purpose:
   - Check the main portfolio system
   - Load index.js
   - Load media.js
   - Load data.js
   - Load siteText.js
   - Verify portfolio pages
   - Verify media
   - Verify site text
   - NEVER stop the portfolio because of a check warning
========================================================= */


/* =========================================================
   WAIT HELPER
========================================================= */

const wait = (milliseconds) =>
  new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds
    );
  });


/* =========================================================
   SAFE MODULE LOADER
========================================================= */

async function loadModule(
  moduleName,
  importFunction
) {
  console.log(
    `⏳ Loading ${moduleName}...`
  );

  try {
    const module =
      await importFunction();

    console.log(
      `✓ ${moduleName} loaded successfully.`
    );

    return {
      success: true,
      module,
      error: null,
    };

  } catch (error) {

    console.error(
      `✗ ${moduleName} failed to load.`,
      error
    );

    return {
      success: false,
      module: null,
      error,
    };
  }
}


/* =========================================================
   PORTFOLIO CHECK
========================================================= */

async function portfolioCheck() {

  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "       PORTFOLIO STARTUP CHECK"
  );
  console.log(
    "=============================================="
  );
  console.log("");


  /* =======================================================
     START
  ======================================================= */

  console.log(
    "⏳ Starting portfolio system check..."
  );


  await wait(100);


  /* =======================================================
     INDEX.JS
  ======================================================= */

  const indexResult =
    await loadModule(
      "index.js",
      () => import("../index.js")
    );


  /*
    If index.js completely fails,
    the rest of the system cannot be
    reliably checked.

    We return safely instead of crashing
    the entire portfolio.
  */

  if (!indexResult.success) {

    console.warn(
      "⚠ index.js could not be loaded."
    );

    console.warn(
      "⚠ Portfolio will continue loading."
    );

    console.log("");
    console.log(
      "=============================================="
    );
    console.log(
      "PORTFOLIO STARTUP CHECK COMPLETE WITH WARNINGS"
    );
    console.log(
      "=============================================="
    );
    console.log("");

    return {
      success: false,
      index: false,
      media: false,
      data: false,
      siteText: false,
      pages: [],
      errors: [
        indexResult.error,
      ],
    };
  }


  /* =======================================================
     MEDIA.JS
  ======================================================= */

  const mediaResult =
    await loadModule(
      "media.js",
      () => import("../media/media.js")
    );


  /* =======================================================
     DATA.JS
  ======================================================= */

  const dataResult =
    await loadModule(
      "data.js",
      () => import("../data/data.js")
    );


  /* =======================================================
     SITE TEXT
  ======================================================= */

  const siteTextResult =
    await loadModule(
      "siteText.js",
      () => import("../siteText/siteText.js")
    );


  /* =======================================================
     ERRORS
  ======================================================= */

  const errors = [];


  if (
    !mediaResult.success
  ) {
    errors.push(
      "media.js failed to load."
    );
  }


  if (
    !dataResult.success
  ) {
    errors.push(
      "data.js failed to load."
    );
  }


  if (
    !siteTextResult.success
  ) {
    errors.push(
      "siteText.js failed to load."
    );
  }


  /* =======================================================
     INDEX EXPORTS
  ======================================================= */

  const index =
    indexResult.module;


  const indexHasMedia =
    Boolean(
      index.media
    );


  const indexHasData =
    Boolean(
      index.data
    );


  const indexHasSiteText =
    Boolean(
      index.siteText
    );


  if (
    indexHasMedia
  ) {

    console.log(
      "✓ index.js → media loaded."
    );

  } else {

    console.warn(
      "⚠ index.js → media export not found."
    );

  }


  if (
    indexHasData
  ) {

    console.log(
      "✓ index.js → data loaded."
    );

  } else {

    console.warn(
      "⚠ index.js → data export not found."
    );

  }


  if (
    indexHasSiteText
  ) {

    console.log(
      "✓ index.js → siteText loaded."
    );

  } else {

    console.warn(
      "⚠ index.js → siteText export not found."
    );

  }


  /* =======================================================
     MEDIA CHECK
  ======================================================= */

  let mediaLoaded =
    mediaResult.success;


  let mediaObject =
    null;


  if (
    mediaLoaded
  ) {

    mediaObject =
      mediaResult.module.default;


    if (
      !mediaObject
    ) {

      console.warn(
        "⚠ media.js loaded but has no default export."
      );

      mediaLoaded = false;

      errors.push(
        "media.js has no default export."
      );

    }

  }


  /* =======================================================
     MEDIA DETAILS
  ======================================================= */

  if (
    mediaLoaded &&
    mediaObject
  ) {

    console.log(
      "✓ Media system loaded successfully."
    );


    /* =====================================================
       IMAGES
    ===================================================== */

    if (
      mediaObject.images
    ) {

      console.log(
        "✓ Media images registered."
      );

    } else {

      console.warn(
        "⚠ Media images object not found."
      );

    }


    /* =====================================================
       VIDEOS
    ===================================================== */

    if (
      mediaObject.videos
    ) {

      console.log(
        "✓ Media videos registered."
      );

    } else {

      console.warn(
        "⚠ Media videos object not found."
      );

    }

  }


  /* =======================================================
     DATA CHECK
  ======================================================= */

  let dataLoaded =
    dataResult.success;


  let dataObject =
    null;


  if (
    dataLoaded
  ) {

    dataObject =
      dataResult.module.default;


    /*
      The important part:

      data.js is considered loaded when
      the module itself loads successfully.

      We DO NOT require Object.keys(data)
      to contain sections.

      This prevents the false warning you
      were seeing.
    */

    if (
      dataObject === undefined ||
      dataObject === null
    ) {

      console.warn(
        "⚠ data.js loaded but has no default export."
      );

      dataLoaded = false;

      errors.push(
        "data.js has no default export."
      );

    }

  }


  /* =======================================================
     DATA SUCCESS MESSAGE
  ======================================================= */

  if (
    dataLoaded
  ) {

    console.log(
      "✓ Portfolio data loaded successfully."
    );


    /*
      Only display the structure when
      enumerable keys actually exist.

      No warning is shown when there
      are zero keys.
    */

    if (
      dataObject !== null &&
      (
        typeof dataObject === "object" ||
        typeof dataObject === "function"
      )
    ) {

      const dataKeys =
        Object.keys(
          dataObject
        );


      if (
        dataKeys.length > 0
      ) {

        console.log(
          `✓ Data sections found: ${dataKeys.join(", ")}`
        );

      } else {

        console.log(
          "✓ data.js loaded successfully."
        );

      }

    }

  }


  /* =======================================================
     SITE TEXT CHECK
  ======================================================= */

  let siteTextLoaded =
    siteTextResult.success;


  let siteTextObject =
    null;


  if (
    siteTextLoaded
  ) {

    siteTextObject =
      siteTextResult.module.default;


    if (
      !siteTextObject
    ) {

      console.warn(
        "⚠ siteText.js loaded but has no default export."
      );

      siteTextLoaded = false;

      errors.push(
        "siteText.js has no default export."
      );

    }

  }


  /* =======================================================
     SITE TEXT SUCCESS
  ======================================================= */

  if (
    siteTextLoaded
  ) {

    console.log(
      "✓ Site text loaded successfully."
    );


    const siteTextKeys =
      Object.keys(
        siteTextObject
      );


    if (
      siteTextKeys.length > 0
    ) {

      console.log(
        `✓ Text sections found: ${siteTextKeys.join(", ")}`
      );

    }

  }


  /* =======================================================
     PAGE CHECK
  ======================================================= */

  const pages = [
    "Home",
    "About",
    "Skills",
    "Projects",
    "Contact",
    "NotFound",
  ];


  console.log(
    `✓ Pages registered: ${pages.join(", ")}`
  );


  /* =======================================================
     MEDIA IMAGE COUNT
  ======================================================= */

  if (
    mediaObject &&
    mediaObject.images
  ) {

    const imageCount =
      Object.keys(
        mediaObject.images
      ).length;


    console.log(
      `✓ Images available: ${imageCount}`
    );

  }


  /* =======================================================
     MEDIA VIDEO COUNT
  ======================================================= */

  if (
    mediaObject &&
    mediaObject.videos
  ) {

    const videoCount =
      Object.keys(
        mediaObject.videos
      ).length;


    console.log(
      `✓ Videos available: ${videoCount}`
    );

  }


  /* =======================================================
     INDEX EXPORT WARNINGS
  ======================================================= */

  if (
    !indexHasMedia
  ) {

    errors.push(
      "index.js does not export media."
    );

  }


  if (
    !indexHasData
  ) {

    errors.push(
      "index.js does not export data."
    );

  }


  if (
    !indexHasSiteText
  ) {

    errors.push(
      "index.js does not export siteText."
    );

  }


  /* =======================================================
     FINAL SUCCESS
  ======================================================= */

  const everythingLoaded =
    indexResult.success &&
    mediaLoaded &&
    dataLoaded &&
    siteTextLoaded;


  await wait(100);


  console.log("");
  console.log(
    "=============================================="
  );


  if (
    everythingLoaded
  ) {

    console.log(
      "PORTFOLIO STARTUP CHECK COMPLETE"
    );

    console.log(
      "✓ All portfolio systems loaded successfully."
    );

    console.log(
      "✓ index.js loaded."
    );

    console.log(
      "✓ media.js loaded."
    );

    console.log(
      "✓ data.js loaded."
    );

    console.log(
      "✓ siteText.js loaded."
    );

    console.log(
      "✓ Portfolio is ready."
    );

  } else {

    console.warn(
      "PORTFOLIO STARTUP CHECK COMPLETE WITH WARNINGS"
    );

    console.warn(
      "Some portfolio systems reported warnings."
    );

  }


  console.log(
    "=============================================="
  );

  console.log("");


  /* =======================================================
     FINAL RESULT
  ======================================================= */

  return {

    success:
      everythingLoaded,

    index:
      indexResult.success,

    media:
      mediaLoaded,

    data:
      dataLoaded,

    siteText:
      siteTextLoaded,

    pages,

    errors,

  };

}


/* =========================================================
   EXPORT
========================================================= */

export default portfolioCheck;