import {
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";


/* =========================================================
   SHARED
========================================================= */

import Navbar from "./components/Shared/Navbar/Navbar.jsx";

import Footer from "./components/Shared/Footer/Footer.jsx";


/* =========================================================
   PUBLIC PAGES
========================================================= */

import Home from "./pages/Home.jsx";

import About from "./pages/About.jsx";

import Skills from "./pages/Skills.jsx";

import Projects from "./pages/Projects.jsx";

import Contact from "./pages/Contact.jsx";


/* =========================================================
   ADMIN
========================================================= */

import AdminLogin from "./pages/Admin/AdminLogin.jsx";

import AdminChat from "./pages/Admin/Admin.jsx";

import ProtectedAdmin from "./components/Admin/ProtectedAdmin.jsx";


/* =========================================================
   CHAT
========================================================= */

import ChatController from "./components/Contact/ChatController.jsx";


/* =========================================================
   DATA
========================================================= */

import { getData } from "./javascript/data/data.js";


/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {

  const location =
    useLocation();


  /* =======================================================
     WEBSITE DATA
  ======================================================= */

  const data =
    getData();


  /* =======================================================
     ADMIN ROUTE CHECK
  ======================================================= */

  const isAdminRoute =
    location.pathname.startsWith(
      "/admin"
    );


  return (
    <>

      {/* ===================================================
          PUBLIC NAVBAR
      =================================================== */}

      {!isAdminRoute && (
        <Navbar />
      )}


      {/* ===================================================
          ROUTES
      =================================================== */}

      <Routes>


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={
            <Home
              data={data}
            />
          }
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={
            <About
              data={data}
            />
          }
        />


        {/* =================================================
            SKILLS
        ================================================= */}

        <Route
          path="/skills"
          element={
            <Skills
              data={data}
            />
          }
        />


        {/* =================================================
            PROJECTS
        ================================================= */}

        <Route
          path="/projects"
          element={
            <Projects
              data={data}
            />
          }
        />


        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact"
          element={
            <Contact
              data={data}
            />
          }
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />


        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminChat />
            </ProtectedAdmin>
          }
        />


        {/* =================================================
            ADMIN CHAT
        ================================================= */}

        <Route
          path="/admin/chat"
          element={
            <ProtectedAdmin>
              <AdminChat />
            </ProtectedAdmin>
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


      {/* ===================================================
          PUBLIC FOOTER
      =================================================== */}

      {!isAdminRoute && (
        <Footer />
      )}


      {/* ===================================================
          PUBLIC CHAT
      =================================================== */}

      {!isAdminRoute && (
        <ChatController />
      )}

    </>
  );
}


/* =========================================================
   NOT FOUND
========================================================= */

function NotFound() {

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >

      <div>

        <p
          style={{
            marginBottom: "0.5rem",
            color: "var(--accent-primary)",
            fontWeight: 700,
          }}
        >
          404
        </p>


        <h1>
          Page not found
        </h1>


        <p
          style={{
            marginTop: "0.75rem",
            color: "var(--text-secondary)",
          }}
        >
          The page you're looking for doesn't exist.
        </p>


        <Link
          to="/"
          style={{
            display: "inline-flex",
            marginTop: "1.5rem",
            padding: "0.7rem 1rem",
            borderRadius: "999px",
            background: "var(--accent-gradient)",
            color: "var(--text-dark)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Back Home
        </Link>

      </div>

    </main>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (
    <AppContent />
  );

}
