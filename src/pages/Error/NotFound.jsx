import { useEffect } from "react";

import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function NotFound() {

  /* =======================================================
     ERROR SOUND
  ======================================================= */

  useEffect(() => {

    const errorSound = new Audio(
      "/sounds/error.mp3"
    );

    errorSound.volume = 0.35;

    errorSound.play().catch(() => {
      /*
        Browsers can block automatic audio playback.
        The page will continue working normally.
      */
    });

    return () => {
      errorSound.pause();
      errorSound.currentTime = 0;
    };

  }, []);


  /* =======================================================
     GO BACK
  ======================================================= */

  const handleGoBack = () => {

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }

  };


  return (
    <main className="error-page">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="error-background"
        aria-hidden="true"
      >

        <span
          className="error-orb error-orb-one"
        />

        <span
          className="error-orb error-orb-two"
        />

      </div>


      {/* =====================================================
          ERROR CONTENT
      ===================================================== */}

      <section
        className="error-container"
        aria-labelledby="not-found-title"
      >

        {/* ===================================================
            ERROR ICON
        =================================================== */}

        <div
          className="error-icon"
          aria-hidden="true"
        >

          <SearchX
            size={30}
            strokeWidth={1.5}
          />

        </div>


        {/* ===================================================
            ERROR CODE
        =================================================== */}

        <p className="error-code">
          ERROR 404
        </p>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h1
          id="not-found-title"
          className="error-title"
        >
          Page not found
          <span>.</span>
        </h1>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p className="error-description">
          The page you're looking for doesn't exist,
          may have been moved, or the URL may be
          incorrect.
        </p>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="error-actions">

          {/* =================================================
              BACK HOME
          ================================================= */}

          <Link
            to="/"
            className="
              error-button
              error-button-primary
            "
          >

            <Home
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              Back Home
            </span>

          </Link>


          {/* =================================================
              GO BACK
          ================================================= */}

          <button
            type="button"
            className="
              error-button
              error-button-secondary
            "
            onClick={handleGoBack}
          >

            <ArrowLeft
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              Go Back
            </span>

          </button>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="error-footer">

          <span>
            NATHAN
          </span>

          <span
            className="error-footer-dot"
            aria-hidden="true"
          />

          <span>
            FRONTEND DEVELOPER
          </span>

        </div>

      </section>

    </main>
  );
}

