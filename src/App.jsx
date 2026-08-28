import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Shared/Navbar/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

import { getData } from "./javascript/data/data";


/* =========================================================
   404 PAGE
========================================================= */

function NotFound() {

  return (
    <main className="not-found">

      <div className="container">

        <span className="not-found-code">
          404
        </span>

        <h1>
          Page Not Found
        </h1>

        <p>
          The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <a
          href="/"
          className="btn btn-primary"
        >
          Back Home
        </a>

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
    personalInfo,
    roles,
  } = getData();


  useEffect(() => {

    /* =====================================================
       FORMAT NAME
    ===================================================== */

    const formattedName =
      personalInfo.name
        ? personalInfo.name.charAt(0).toUpperCase() +
          personalInfo.name.slice(1).toLowerCase()
        : "Portfolio";


    /* =====================================================
       NON-HOME PAGES
    ===================================================== */

    const pages = {
      "/": null,
      "/about": "About",
      "/skills": "Skills",
      "/projects": "Projects",
      "/contact": "Contact",
    };


    if (location.pathname !== "/") {

      const page =
        pages[location.pathname] ||
        "Page Not Found";

      document.title =
        `${formattedName} — ${page}`;

      return;
    }


    /* =====================================================
       HOME PAGE TITLE
       Uses roles from data.js
    ===================================================== */

    if (!roles || roles.length === 0) {

      document.title =
        `${formattedName} — Portfolio`;

      return;
    }


    let index = 0;


    const updateTitle = () => {

      document.title =
        `${formattedName} — ${roles[index]}`;

    };


    /* Initial title */

    updateTitle();


    /* Rotate roles */

    const interval = setInterval(() => {

      index =
        (index + 1) % roles.length;

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
          ROUTES
      =================================================== */}

      <main>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/skills"
            element={<Skills />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* =================================================
              404
          ================================================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>

    </>
  );
}