import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function Loader({ children }) {
const screenRef = useRef(null);
const progressRef = useRef(null);

const [loading, setLoading] = useState(true);
const [progress, setProgress] = useState(0);

/* =====================================================
LOADER ANIMATION + PROGRESS
===================================================== */

useEffect(() => {
const screen = screenRef.current;


if (!screen) {
  return;
}

const ctx = gsap.context(() => {
  /* =================================================
     INTRO
  ================================================= */

  gsap.from(".loading-logo", {
    opacity: 0,
    y: 25,
    scale: 0.85,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from(".loading-message", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.2,
    ease: "power3.out",
  });

  gsap.from(".loading-progress-wrapper", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.3,
    ease: "power3.out",
  });

  gsap.from(".loading-status", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    delay: 0.4,
    ease: "power3.out",
  });

  /* =================================================
     FLOATING GLOWS
  ================================================= */

  gsap.to(".loading-glow-one", {
    x: 50,
    y: -30,
    scale: 1.08,
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".loading-glow-two", {
    x: -45,
    y: 35,
    scale: 1.08,
    duration: 7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  /* =================================================
     LOGO FLOAT
  ================================================= */

  gsap.to(".loading-logo", {
    y: -4,
    scale: 1.02,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}, screen);

/* =================================================
   PROGRESS
================================================= */

let currentProgress = 0;

const progressTimer = window.setInterval(() => {
  currentProgress += Math.floor(Math.random() * 9) + 4;

  if (currentProgress >= 100) {
    currentProgress = 100;
  }

  setProgress(currentProgress);

  if (progressRef.current) {
    gsap.to(progressRef.current, {
      width: `${currentProgress}%`,
      duration: 0.35,
      ease: "power2.out",
    });
  }

  if (currentProgress >= 100) {
    window.clearInterval(progressTimer);

    window.setTimeout(() => {
      setLoading(false);
    }, 450);
  }
}, 150);

/* =================================================
   CLEANUP
================================================= */

return () => {
  window.clearInterval(progressTimer);
  ctx.revert();
};


}, []);

/* =====================================================
SHOW PORTFOLIO AFTER LOADING
===================================================== */

if (!loading) {
return children;
}

/* =====================================================
LOADING SCREEN
===================================================== */

return ( <main
   ref={screenRef}
   className="loading-screen"
   aria-label="Loading portfolio"
   aria-live="polite"
 >
{/* =================================================
BACKGROUND GLOWS
================================================= */}

```
  <div
    className="loading-glow loading-glow-one"
    aria-hidden="true"
  />

  <div
    className="loading-glow loading-glow-two"
    aria-hidden="true"
  />

  {/* =================================================
      CONTENT
  ================================================= */}

  <div className="loading-content">

    {/* =================================================
        LOGO
    ================================================= */}

    <div className="loading-logo">
      <div className="loading-logo-circle">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Nathan logo"
          className="loading-logo-image"
        />
      </div>
    </div>

    {/* =================================================
        MESSAGE
    ================================================= */}

    <p className="loading-message">
      Preparing your experience...
    </p>

    {/* =================================================
        PROGRESS
    ================================================= */}

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
            width: `${progress}%`,
          }}
        />
      </div>

      <span className="loading-percentage">
        {progress}%
      </span>

    </div>

    {/* =================================================
        STATUS
    ================================================= */}

    <span className="loading-status">
      Initializing portfolio
    </span>

  </div>
</main>


);
}

export default Loader;
