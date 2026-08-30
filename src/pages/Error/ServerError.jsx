import { useEffect } from "react";

import {
  Home,
  RefreshCw,
  ServerCrash,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./error.css";


export default function ServerError({
  onRetry,
}) {

  /* =======================================================
     SERVER ERROR SOUND
  ======================================================= */

  useEffect(() => {

    const errorSound = new Audio(
      "/sounds/error.mp3"
    );

    errorSound.volume = 0.35;

    errorSound.play().catch(() => {
      /*
        Browsers may block automatic audio playback.
        The page continues working normally.
      */
    });

    return () => {

      errorSound.pause();

      errorSound.currentTime = 0;

    };

  }, []);


  /* =======================================================
     RETRY
  ======================================================= */

  const handleRetry = () => {

    if (typeof onRetry === "function") {

      onRetry();

      return;

    }

    window.location.reload();

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
          CONTENT
      ===================================================== */}

      <section
        className="error-container"
        aria-labelledby="server-error-title"
      >

        {/* ===================================================
            ICON
        =================================================== */}

        <div
          className="
            error-icon
            error-icon-danger
          "
          aria-hidden="true"
        >

          <ServerCrash
            size={30}
            strokeWidth={1.5}
          />

        </div>


        {/* ===================================================
            ERROR CODE
        =================================================== */}

        <p className="error-code">
          ERROR 500
        </p>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h1
          id="server-error-title"
          className="error-title"
        >
          Something went wrong
          <span>.</span>
        </h1>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p className="error-description">
          The server encountered an unexpected
          problem while processing your request.
          Please try again in a moment.
        </p>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="error-actions">

          {/* =================================================
              TRY AGAIN
          ================================================= */}

          <button
            type="button"
            className="
              error-button
              error-button-primary
            "
            onClick={handleRetry}
          >

            <RefreshCw
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              Try Again
            </span>

          </button>


          {/* =================================================
              BACK HOME
          ================================================= */}

          <Link
            to="/"
            className="
              error-button
              error-button-secondary
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
