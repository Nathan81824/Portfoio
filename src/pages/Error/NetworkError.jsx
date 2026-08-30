import { useEffect } from "react";

import {
  Home,
  RefreshCw,
  WifiOff,
} from "lucide-react";

import { Link } from "react-router-dom";




export default function NetworkError({
  onRetry,
}) {

  /* =======================================================
     NETWORK ERROR SOUND
  ======================================================= */

  useEffect(() => {

    const errorSound = new Audio(
      "/sounds/network-error.mp3"
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
        aria-labelledby="network-error-title"
      >

        {/* ===================================================
            ICON
        =================================================== */}

        <div
          className="
            error-icon
            error-icon-warning
          "
          aria-hidden="true"
        >

          <WifiOff
            size={30}
            strokeWidth={1.5}
          />

        </div>


        {/* ===================================================
            ERROR CODE
        =================================================== */}

        <p className="error-code">
          NETWORK ERROR
        </p>


        {/* ===================================================
            TITLE
        =================================================== */}

        <h1
          id="network-error-title"
          className="error-title"
        >
          Connection failed
          <span>.</span>
        </h1>


        {/* ===================================================
            DESCRIPTION
        =================================================== */}

        <p className="error-description">
          We couldn't connect to the server.
          Check your internet connection and try
          again.
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
              HOME
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