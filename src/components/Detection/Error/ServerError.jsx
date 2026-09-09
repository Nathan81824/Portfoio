import {
AlertTriangle,
ArrowLeft,
Home,
RefreshCw,
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

import Button, {
  MagneticButton,
} from "../../Shared/Button/Button.jsx";

function ServerError() {
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

  gsap.from(".server-error-logo", {
    opacity: 0,
    y: 25,
    scale: 0.9,
    duration: 0.8,
    ease: "power3.out",
  });


  /* =================================================
     ERROR CODE
  ================================================= */

  gsap.from(".server-error-code", {
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 1,
    delay: 0.15,
    ease: "power4.out",
  });


  /* =================================================
     WARNING ICON
  ================================================= */

  gsap.from(".server-error-icon", {
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

  gsap.from(".server-error-title", {
    opacity: 0,
    y: 25,
    duration: 0.7,
    delay: 0.4,
    ease: "power3.out",
  });


  /* =================================================
     DESCRIPTION
  ================================================= */

  gsap.from(".server-error-description", {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.5,
    ease: "power3.out",
  });


  /* =================================================
     STATUS
  ================================================= */

  gsap.from(".server-error-status", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    delay: 0.6,
    ease: "power3.out",
  });


  /* =================================================
     ACTIONS
  ================================================= */

  gsap.from(".server-error-actions", {
    opacity: 0,
    y: 20,
    duration: 0.7,
    delay: 0.65,
    ease: "power3.out",
  });


  /* =================================================
     BACK LINK
  ================================================= */

  gsap.from(".server-error-back", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    delay: 0.75,
    ease: "power3.out",
  });


  /* =================================================
     FLOATING LOGO
  ================================================= */

  gsap.to(".server-error-logo", {
    y: -5,
    scale: 1.02,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     FLOATING WARNING ICON
  ================================================= */

  gsap.to(".server-error-icon", {
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

  gsap.to(".server-error-glow-one", {
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

  gsap.to(".server-error-glow-two", {
    x: -45,
    y: 35,
    scale: 1.08,
    duration: 7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });


  /* =================================================
     500 SUBTLE FLOAT
  ================================================= */

  gsap.to(".server-error-code", {
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
RETRY
===================================================== */

const handleRetry = () => {
window.location.reload();
};

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
   className="server-error-page"
 >

  {/* =================================================
      BACKGROUND
  ================================================= */}

  <div
    className="server-error-glow server-error-glow-one"
    aria-hidden="true"
  />

  <div
    className="server-error-glow server-error-glow-two"
    aria-hidden="true"
  />

  <div
    className="server-error-grid"
    aria-hidden="true"
  />


  {/* =================================================
      CONTENT
  ================================================= */}

  <div className="server-error-container">


    {/* =================================================
        LOGO
    ================================================= */}

    <div className="server-error-logo">

      <div className="server-error-logo-circle">

        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="Nathan logo"
          className="server-error-logo-image"
        />

      </div>

    </div>


    {/* =================================================
        ERROR CODE
    ================================================= */}

    <div
      className="server-error-code"
      aria-hidden="true"
    >
      500
    </div>


    {/* =================================================
        WARNING ICON
    ================================================= */}

    <div
      className="server-error-icon"
      aria-hidden="true"
    >
      <AlertTriangle
        size={25}
        strokeWidth={1.8}
      />
    </div>


    {/* =================================================
        TITLE
    ================================================= */}

    <h1 className="server-error-title">
      Something went wrong.
    </h1>


    {/* =================================================
        DESCRIPTION
    ================================================= */}

    <p className="server-error-description">
      Something unexpected happened while
      loading this page. Please try again or
      return to the homepage.
    </p>


    {/* =================================================
        STATUS
    ================================================= */}

    <span className="server-error-status">
      Server error
    </span>


{/* =================================================
ACTIONS
================================================= */}

<div className="server-error-actions">

{/* =================================================
MAGNETIC RETRY BUTTON
================================================= */}

<MagneticButton
type="button"
className="server-error-button server-error-button-primary"
onClick={handleRetry}

>

<RefreshCw

  size={18}
  strokeWidth={2}
/>

<span>
  Try Again
</span>


  </MagneticButton>

{/* =================================================
BACK HOME
================================================= */}

  <Link
    to="/"
    className="server-error-button server-error-button-secondary"
  >
    <Home
      size={18}
      strokeWidth={2}
    />


<span>
  Back Home
</span>


  </Link>

</div>

{/* =================================================
BACK LINK
================================================= */}

<button
type="button"
className="server-error-back"
onClick={handleGoBack}

>

<ArrowLeft
 size={16}
 strokeWidth={1.8}
/>

  <span>
    Go back to the previous page
  </span>

</button>

  </div>

</main>

);
}

export default ServerError;
