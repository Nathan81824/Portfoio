import { useEffect } from "react";

import {
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

import Navbar from "./components/Shared/Navbar/Navbar.jsx";
import Footer from "./components/Shared/Footer/Footer.jsx";


import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";

import { getData } from "./javascript/data/data.js";
import FloatingContact from "./components/Contact/FloatingContact.jsx";


/* =========================================================
   404 PAGE
========================================================= */

function NotFound() {
  return (
    <main className="not-found">

      <div className="container">

        <span
          className="not-found-code"
          aria-hidden="true"
        >
          404
        </span>

        <p className="not-found-label">
          ERROR
        </p>

        <h1>
          Page Not Found
        </h1>

        <p className="not-found-description">
          The page you're looking for doesn't exist,
          may have been moved, or the URL may be incorrect.
        </p>

        <div className="not-found-actions">

          <Link
            to="/"
            className="btn btn-primary"
          >
            Back Home
          </Link>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>

        </div>

      </div>

    </main>
  );
}


/* =========================================================
   PAGE TITLE
========================================================= */

function PageTitle() {

  const location = useLocation();

  const {
    personalInfo = {},
    roles = [],
  } = getData();


  useEffect(() => {

    /* =======================================================
       FORMAT NAME
    ======================================================= */

    const formattedName =
      personalInfo.name
        ? personalInfo.name
            .charAt(0)
            .toUpperCase() +
          personalInfo.name
            .slice(1)
            .toLowerCase()
        : "Portfolio";


    /* =======================================================
       PAGE TITLES
    ======================================================= */

    const pages = {
      "/": null,
      "/about": "About",
      "/skills": "Skills",
      "/projects": "Projects",
      "/contact": "Contact",
    };


    /* =======================================================
       NON-HOME PAGES
    ======================================================= */

    if (location.pathname !== "/") {

      const page =
        pages[location.pathname] ||
        "Page Not Found";

      document.title =
        `${formattedName} — ${page}`;

      return;
    }


    /* =======================================================
       HOME PAGE
    ======================================================= */

    if (
      !Array.isArray(roles) ||
      roles.length === 0
    ) {

      document.title =
        `${formattedName} — Portfolio`;

      return;
    }


    /* =======================================================
       ROTATING HOME TITLE
    ======================================================= */

    let index = 0;


    const updateTitle = () => {

      document.title =
        `${formattedName} — ${roles[index]}`;

    };


    /* Initial title */

    updateTitle();


    /* Rotate title */

    const interval = setInterval(() => {

      index =
        (index + 1) %
        roles.length;

      updateTitle();

    }, 3000);


    /* Cleanup */

    return () => {
      clearInterval(interval);
    };

  }, [
    location.pathname,
    personalInfo.name,
    roles,
  ]);


  return null;
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (
    <>

      {/* ===================================================
          DYNAMIC PAGE TITLE
      =================================================== */}

      <PageTitle />


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar />


      {/* ===================================================
          MAIN ROUTES
      =================================================== */}

      <main>

        <Routes>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={
              <Home />
            }
          />


          {/* =================================================
              ABOUT
          ================================================= */}

          <Route
            path="/about"
            element={
              <About />
            }
          />


          {/* =================================================
              SKILLS
          ================================================= */}

          <Route
            path="/skills"
            element={
              <Skills />
            }
          />


          {/* =================================================
              PROJECTS
          ================================================= */}

          <Route
            path="/projects"
            element={
              <Projects />
            }
          />


          {/* =================================================
              CONTACT
          ================================================= */}

          <Route
            path="/contact"
            element={
              <Contact />
            }
          />


          {/* =================================================
              404
          ================================================= */}

          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>

      </main>


      {/* ===================================================
          FLOATING CONTACT
      =================================================== */}

      <FloatingContact/>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <Footer />

    </>
  );
}
