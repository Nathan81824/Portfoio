import { useEffect, useRef } from "react";
import gsap from "gsap";

function LoadingScreen({
status = "Initializing portfolio",
message = "Preparing your experience...",
progress = 0,
}) {
const screenRef = useRef(null);
const progressRef = useRef(null);
const percentageRef = useRef(null);

/* =====================================================
MAIN ANIMATIONS
===================================================== */

useEffect(() => {
const screen = screenRef.current;

if (!screen) return;

const ctx = gsap.context(() => {

  /* ===============================================
     LOGO INTRO
  =============================================== */

  gsap.from(".loading-logo", {
    opacity: 0,
    y: 20,
    scale: 0.9,
    duration: 0.8,
    ease: "power3.out",
  });


  /* ===============================================
     MESSAGE INTRO
  =============================================== */

  gsap.from(".loading-message", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.2,
    ease: "power3.out",
  });


  /* ===============================================
     PROGRESS INTRO
  =============================================== */

  gsap.from(".loading-progress-wrapper", {
    opacity: 0,
    y: 15,
    duration: 0.7,
    delay: 0.3,
    ease: "power3.out",
  });


  /* ===============================================
     STATUS INTRO
  =============================================== */

  gsap.from(".loading-status", {
    opacity: 0,
    y: 10,
    duration: 0.6,
    delay: 0.4,
    ease: "power3.out",
  });


  /* ===============================================
     BACKGROUND GLOW ONE
  =============================================== */

  gsap.to(".loading-glow-one", {
    x: 50,
    y: -30,
    scale: 1.08,
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* ===============================================
     BACKGROUND GLOW TWO
  =============================================== */

  gsap.to(".loading-glow-two", {
    x: -45,
    y: 35,
    scale: 1.08,
    duration: 7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* ===============================================
     LOGO FLOAT
  =============================================== */

  gsap.to(".loading-logo", {
    y: -4,
    scale: 1.02,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

}, screen);

return () => {
  ctx.revert();
};


}, []);

/* =====================================================
PROGRESS ANIMATION
===================================================== */

useEffect(() => {
const progressBar = progressRef.current;
const percentage = percentageRef.current;

if (!progressBar || !percentage) return;

const safeProgress = Math.min(
  100,
  Math.max(0, progress)
);


/* ===============================================
   PROGRESS BAR
=============================================== */

gsap.to(progressBar, {
  width: `${safeProgress}%`,
  duration: 1.8,
  ease: "power1.out",
});


/* ===============================================
   PERCENTAGE
=============================================== */

gsap.to(percentage, {
  textContent: Math.round(safeProgress),
  duration: 1.5,
  snap: {
    textContent: 1,
  },
  ease: "power1.out",

  onUpdate: () => {
    percentage.textContent =
      `${Math.round(
        Number(percentage.textContent) ||
        safeProgress
      )}%`;
  },
});


}, [progress]);

/* =====================================================
RENDER
===================================================== */

return ( <main
   ref={screenRef}
   className="loading-screen"
   aria-label="Loading portfolio"
   aria-live="polite"
 >

```
  {/* =================================================
      AMBIENT BACKGROUND
  ================================================= */}

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

    {/* ===============================================
        LOGO
    =============================================== */}

    <div className="loading-logo">

      <div className="loading-logo-circle">

        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Nathan logo"
          className="loading-logo-image"
        />

      </div>

    </div>


    {/* ===============================================
        MESSAGE
    =============================================== */}

    <p className="loading-message">
      {message}
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
        aria-valuenow={Math.round(progress)}
        aria-label="Portfolio loading progress"
      >

        <div
          ref={progressRef}
          className="loading-progress"
        />

      </div>


      <span
        ref={percentageRef}
        className="loading-percentage"
      >
        {Math.round(progress)}%
      </span>

    </div>


    {/* ===============================================
        STATUS
    =============================================== */}

    <span className="loading-status">
      {status}
    </span>

  </div>

</main>

);
}

export default LoadingScreen;
