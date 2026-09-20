/* =========================================================
   LOADER
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/Detection/Loader/Loader.jsx

   Purpose:
   - Display the portfolio loading screen
   - Run portfolio startup checks
   - Load index.js
   - Load media.js
   - Load data.js
   - Load siteText.js
   - Animate loading progress with GSAP
   - Finish loading only after startup checks complete
   - NEVER redirect to an error page
========================================================= */


/* =========================================================
   REACT
========================================================= */

import {
  useEffect,
  useRef,
} from "react";


/* =========================================================
   GSAP
========================================================= */

import gsap from "gsap";


/* =========================================================
   ANIMATION STORE
========================================================= */

import useAnimationStore from "../../../javascript/store/animationStore.js";


/* =========================================================
   PORTFOLIO SYSTEM
========================================================= */

import {
  portfolioCheck,
} from "../../../javascript/index.js";


/* =========================================================
   LOADER COMPONENT
========================================================= */

function Loader({
  children,
}) {

  /* =======================================================
     REFS
  ======================================================= */

  const screenRef =
    useRef(null);

  const progressRef =
    useRef(null);


  /* =======================================================
     GLOBAL LOADING STATE
  ======================================================= */

  const isLoading =
    useAnimationStore(
      (state) => state.isLoading
    );


  /* =======================================================
     GLOBAL PROGRESS
  ======================================================= */

  const progress =
    useAnimationStore(
      (state) => state.progress
    );


  /* =======================================================
     SET PROGRESS
  ======================================================= */

  const setProgress =
    useAnimationStore(
      (state) => state.setProgress
    );


  /* =======================================================
     FINISH LOADING
  ======================================================= */

  const finishLoading =
    useAnimationStore(
      (state) => state.finishLoading
    );


  /* =======================================================
     STARTUP EFFECT
  ======================================================= */

  useEffect(() => {

    let cancelled = false;


    /* =====================================================
       LOADER SCREEN
    ===================================================== */

    const screen =
      screenRef.current;


    if (!screen) {
      return;
    }


    /* =====================================================
       GSAP CONTEXT
    ===================================================== */

    const ctx =
      gsap.context(() => {


        /* ================================================
           LOGO ENTRANCE
        ================================================ */

        gsap.from(
          ".loading-logo",
          {
            opacity: 0,
            y: 25,
            scale: 0.85,
            duration: 0.8,
            ease: "power3.out",
          }
        );


        /* ================================================
           MESSAGE ENTRANCE
        ================================================ */

        gsap.from(
          ".loading-message",
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
            delay: 0.2,
            ease: "power3.out",
          }
        );


        /* ================================================
           PROGRESS ENTRANCE
        ================================================ */

        gsap.from(
          ".loading-progress-wrapper",
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
            delay: 0.3,
            ease: "power3.out",
          }
        );


        /* ================================================
           STATUS ENTRANCE
        ================================================ */

        gsap.from(
          ".loading-status",
          {
            opacity: 0,
            y: 10,
            duration: 0.6,
            delay: 0.4,
            ease: "power3.out",
          }
        );


        /* ================================================
           FIRST BACKGROUND GLOW
        ================================================ */

        gsap.to(
          ".loading-glow-one",
          {
            x: 50,
            y: -30,
            scale: 1.08,
            duration: 6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );


        /* ================================================
           SECOND BACKGROUND GLOW
        ================================================ */

        gsap.to(
          ".loading-glow-two",
          {
            x: -45,
            y: 35,
            scale: 1.08,
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );


        /* ================================================
           LOGO FLOATING ANIMATION
        ================================================ */

        gsap.to(
          ".loading-logo",
          {
            y: -4,
            scale: 1.02,
            duration: 2.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );

      },
      screen
    );


    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

    const updateProgress =
      (value) => {

        if (cancelled) {
          return;
        }


        const safeValue =
          Math.min(
            100,
            Math.max(
              0,
              Math.round(value)
            )
          );


        /* ===============================================
           STORE
        =============================================== */

        setProgress(
          safeValue
        );


        /* ===============================================
           PROGRESS BAR
        =============================================== */

        if (
          progressRef.current
        ) {

          gsap.to(
            progressRef.current,
            {
              width:
                `${safeValue}%`,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            }
          );

        }

      };


    /* =====================================================
       WAIT HELPER
    ===================================================== */

    const wait =
      (milliseconds) =>
        new Promise(
          (resolve) => {

            window.setTimeout(
              resolve,
              milliseconds
            );

          }
        );


    /* =====================================================
       RUN PORTFOLIO STARTUP CHECK
    ===================================================== */

    const runChecks =
      async () => {

        try {

          /* ===============================================
             INITIAL PROGRESS
          =============================================== */

          updateProgress(5);


          await wait(150);


          if (cancelled) {
            return;
          }


          /* ===============================================
             INDEX.JS
          =============================================== */

          updateProgress(10);


          /*
            portfolioCheck() loads:

            index.js
              ↓
            media.js
              ↓
            data.js
              ↓
            siteText.js
          */

          let checkResult =
            null;


          try {

            checkResult =
              await portfolioCheck();

          } catch (error) {

            console.warn(
              "Portfolio check encountered an issue. Continuing anyway:",
              error
            );

          }


          if (cancelled) {
            return;
          }


          /* ===============================================
             CHECK RESULT
          =============================================== */

          if (
            checkResult &&
            checkResult.index
          ) {

            updateProgress(30);

          } else {

            updateProgress(25);

          }


          await wait(200);


          if (cancelled) {
            return;
          }


          /* ===============================================
             MEDIA.JS
          =============================================== */

          if (
            checkResult &&
            checkResult.media
          ) {

            updateProgress(50);

          } else {

            /*
              Even if media has a warning,
              don't stop the portfolio.
            */

            updateProgress(45);

          }


          await wait(200);


          if (cancelled) {
            return;
          }


          /* ===============================================
             DATA.JS
          =============================================== */

          if (
            checkResult &&
            checkResult.data
          ) {

            updateProgress(70);

          } else {

            updateProgress(65);

          }


          await wait(200);


          if (cancelled) {
            return;
          }


          /* ===============================================
             SITE TEXT
          =============================================== */

          if (
            checkResult &&
            checkResult.siteText
          ) {

            updateProgress(85);

          } else {

            updateProgress(80);

          }


          await wait(250);


          if (cancelled) {
            return;
          }


          /* ===============================================
             CHECK WARNINGS
          =============================================== */

          if (
            checkResult &&
            checkResult.success === false
          ) {

            console.warn(
              "Portfolio startup completed with warnings. Continuing anyway."
            );

          }


          /* ===============================================
             FINAL PROGRESS
          =============================================== */

          updateProgress(
            100
          );


          /* ===============================================
             FORCE PROGRESS BAR TO 100%
          =============================================== */

          if (
            progressRef.current
          ) {

            gsap.to(
              progressRef.current,
              {
                width: "100%",
                duration: 0.5,
                ease: "power2.out",
                overwrite: true,
              }
            );

          }


          /* ===============================================
             FINISH LOADING
          =============================================== */

          window.setTimeout(
            () => {

              if (!cancelled) {

                finishLoading();

              }

            },
            600
          );


        } catch (error) {


          /* ===============================================
             ABSOLUTE FALLBACK
          =============================================== */

          console.warn(
            "Unexpected portfolio startup issue. Continuing anyway:",
            error
          );


          if (cancelled) {
            return;
          }


          /* ===============================================
             COMPLETE PROGRESS
          =============================================== */

          updateProgress(
            100
          );


          if (
            progressRef.current
          ) {

            gsap.to(
              progressRef.current,
              {
                width: "100%",
                duration: 0.5,
                ease: "power2.out",
                overwrite: true,
              }
            );

          }


          /* ===============================================
             STILL OPEN PORTFOLIO
          =============================================== */

          window.setTimeout(
            () => {

              if (!cancelled) {

                finishLoading();

              }

            },
            600
          );

        }

      };


    /* =====================================================
       START CHECKS
    ===================================================== */

    runChecks();


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      cancelled = true;

      ctx.revert();

    };

  }, [
    setProgress,
    finishLoading,
  ]);


  /* =======================================================
     SHOW PORTFOLIO
  ======================================================= */

  if (!isLoading) {

    return children;

  }


  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  return (

    <main
      ref={screenRef}
      className="loading-screen"
      aria-label="Loading portfolio"
      aria-live="polite"
    >

      {/* =================================================
          BACKGROUND GLOW ONE
      ================================================= */}

      <div
        className="
          loading-glow
          loading-glow-one
        "
        aria-hidden="true"
      />


      {/* =================================================
          BACKGROUND GLOW TWO
      ================================================= */}

      <div
        className="
          loading-glow
          loading-glow-two
        "
        aria-hidden="true"
      />


      {/* =================================================
          LOADING CONTENT
      ================================================= */}

      <div className="loading-content">


        {/* ===============================================
            LOGO
        =============================================== */}

        <div className="loading-logo">

          <div className="loading-logo-circle">

            <img
              src={
                `${import.meta.env.BASE_URL}logo.png`
              }
              alt="Nathan logo"
              className="loading-logo-image"
            />

          </div>

        </div>


        {/* ===============================================
            MESSAGE
        =============================================== */}

        <p className="loading-message">

          Preparing your experience...

        </p>


        {/* ===============================================
            PROGRESS
        =============================================== */}

        <div className="loading-progress-wrapper">


          <div
            className="loading-progress-track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
            aria-label="Portfolio loading progress"
          >

            <div
              ref={progressRef}
              className="loading-progress"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>


          {/* =============================================
              PERCENTAGE
          ============================================= */}

          <span className="loading-percentage">

            {progress}%

          </span>


        </div>


        {/* ===============================================
            STATUS
        =============================================== */}

        <span className="loading-status">

          Preparing portfolio

        </span>


      </div>

    </main>

  );

}


/* =========================================================
   EXPORT
========================================================= */

export default Loader;