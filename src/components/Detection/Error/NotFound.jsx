import {
ArrowLeft,
Home,
SearchX,
} from "lucide-react";

import {
Link,
useNavigate,
} from "react-router-dom";

import {
useEffect,
useRef,
} from "react";

import gsap from "gsap";


function NotFound() {
const pageRef = useRef(null);

const navigate = useNavigate();

/* =====================================================
PAGE ANIMATIONS
===================================================== */

useEffect(() => {
const page = pageRef.current;


if (!page) return;


const ctx = gsap.context(() => {

  /* =================================================
     LOGO
  ================================================= */

  gsap.from(".not-found-logo", {
    opacity: 0,
    y: 25,
    scale: 0.9,
    duration: 0.8,
    ease: "power3.out",
  });


  /* =================================================
     404
  ================================================= */

  gsap.from(".not-found-code", {
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 1,
    delay: 0.15,
    ease: "power4.out",
  });


  /* =================================================
     ICON
  ================================================= */

  gsap.from(".not-found-icon", {
    opacity: 0,
    scale: 0.6,
    rotate: -15,
    duration: 0.8,
    delay: 0.3,
    ease: "back.out(1.7)",
  });


  /* =================================================
     TITLE
  ================================================= */

  gsap.from(".not-found-title", {
    opacity: 0,
    y: 25,
    duration: 0.7,
    delay: 0.4,
    ease: "power3.out",
  });


  /* =================================================
     DESCRIPTION
  ================================================= */

  gsap.from(".not-found-description", {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.5,
    ease: "power3.out",
  });


  /* =================================================
     STATUS
  ================================================= */

  gsap.from(".not-found-status", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    delay: 0.6,
    ease: "power3.out",
  });


  /* =================================================
     BUTTONS
  ================================================= */

  gsap.from(".not-found-actions", {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.65,
    ease: "power3.out",
  });


  /* =================================================
     BACK LINK
  ================================================= */

  gsap.from(".not-found-back", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    delay: 0.75,
    ease: "power3.out",
  });


  /* =================================================
     FLOATING LOGO
  ================================================= */

  gsap.to(".not-found-logo", {
    y: -5,
    scale: 1.02,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     FLOATING ICON
  ================================================= */

  gsap.to(".not-found-icon", {
    y: -5,
    rotate: 3,
    duration: 2.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     BACKGROUND GLOW ONE
  ================================================= */

  gsap.to(".not-found-glow-one", {
    x: 50,
    y: -35,
    scale: 1.08,
    duration: 6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     BACKGROUND GLOW TWO
  ================================================= */

  gsap.to(".not-found-glow-two", {
    x: -45,
    y: 35,
    scale: 1.08,
    duration: 7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     404 SUBTLE FLOAT
  ================================================= */

  gsap.to(".not-found-code", {
    y: -3,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

}, page);


return () => {
  ctx.revert();
};


}, []);

/* =====================================================
GO BACK
===================================================== */

const handleGoBack = () => {
if (window.history.length > 1) {
navigate(-1);
} else {
navigate("/");
}
};

/* =====================================================
RENDER
===================================================== */

return ( <main
   ref={pageRef}
   className="not-found-page"
 >


  {/* =================================================
      BACKGROUND
  ================================================= */}

  <div
    className="not-found-glow not-found-glow-one"
    aria-hidden="true"
  />

  <div
    className="not-found-glow not-found-glow-two"
    aria-hidden="true"
  />

  <div
    className="not-found-grid"
    aria-hidden="true"
  />


  {/* =================================================
      CONTENT
  ================================================= */}

  <div className="not-found-container">


    {/* =================================================
        LOGO
    ================================================= */}

    <div className="not-found-logo">

      <div className="not-found-logo-circle">

        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Nathan logo"
          className="not-found-logo-image"
        />

      </div>

    </div>


    {/* =================================================
        ERROR CODE
    ================================================= */}

    <div
      className="not-found-code"
      aria-hidden="true"
    >
      404
    </div>


    {/* =================================================
        ICON
    ================================================= */}

    <div
      className="not-found-icon"
      aria-hidden="true"
    >
      <SearchX
        size={25}
        strokeWidth={1.8}
      />
    </div>


    {/* =================================================
        TITLE
    ================================================= */}

    <h1 className="not-found-title">
      Page not found.
    </h1>


    {/* =================================================
        DESCRIPTION
    ================================================= */}

    <p className="not-found-description">
      The page you're looking for doesn't
      exist or may have been moved somewhere
      else.
    </p>


    {/* =================================================
        STATUS
    ================================================= */}

    <span className="not-found-status">
      Page unavailable
    </span>


    {/* =================================================
        ACTIONS
    ================================================= */}

    <div className="not-found-actions">

      <Link
        to="/"
        className="not-found-button not-found-button-primary"
      >
        <Home
          size={18}
          strokeWidth={2}
        />

        <span>
          Back Home
        </span>
      </Link>


      <button
        type="button"
        className="not-found-button not-found-button-secondary"
        onClick={handleGoBack}
      >
        <ArrowLeft
          size={18}
          strokeWidth={2}
        />

        <span>
          Go Back
        </span>
      </button>

    </div>


    {/* =================================================
        BACK LINK
    ================================================= */}

    <Link
      to="/"
      className="not-found-back"
    >
      Return to the homepage
    </Link>

  </div>

</main>

);
}

export default NotFound;
