/* =========================================================
   NAVBAR
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/Shared/Navbar/Navbar.jsx

   Uses:
   - useTheme
   - centralized navigation data
   - centralized personal data
   - react-router-dom
   - lucide-react
========================================================= */

import { useState } from "react";

import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";


/* =========================================================
   DATA
========================================================= */

import {
  personalInfo,
  navigation,
} from "../../../javascript/data/data.js";


/* =========================================================
   HOOKS
========================================================= */

import useTheme from
  "../../../javascript/hooks/Theme/useTheme.js";




/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);


  /* =======================================================
     CURRENT ROUTE
  ======================================================= */

  const location =
    useLocation();


  /* =======================================================
     THEME
  ======================================================= */

  const {
    isDark,
    toggleTheme,
  } = useTheme();


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navLinks =
    Array.isArray(navigation)
      ? navigation
      : [];


  /* =======================================================
     RESUME
  ======================================================= */

  const resumeUrl =
    `${import.meta.env.BASE_URL}resume.pdf`;


  /* =======================================================
     CLOSE MOBILE MENU
  ======================================================= */

  const closeMenu = () => {

    setMenuOpen(false);

  };


  /* =======================================================
     NAVIGATION HANDLER
  ======================================================= */

  const handleNavigation = () => {

    closeMenu();

  };


  /* =======================================================
     MOBILE MENU TOGGLE
  ======================================================= */

  const handleMenuToggle = () => {

    setMenuOpen(
      (previous) =>
        !previous
    );

  };


  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  const isActive = (
    href
  ) => {

    if (!href) {
      return false;
    }


    if (href === "/") {

      return (
        location.pathname === "/"
      );

    }


    return (
      location.pathname === href ||
      location.pathname.startsWith(
        `${href}/`
      )
    );

  };


  /* =======================================================
     LOGO NAME
  ======================================================= */

  const logoLetter =
    personalInfo?.displayName
      ?.charAt(0)
      ?.toUpperCase() || "N";


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <header className="navbar">


      {/* ===================================================
          NAVBAR CONTAINER
      =================================================== */}

      <div className="navbar-container">


        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={
            handleNavigation
          }
          aria-label="Go to home"
        >

          {logoLetter}

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >

          {navLinks.map(
            (link) => {

              if (
                !link ||
                !link.href
              ) {
                return null;
              }


              return (

                <Link
                  key={
                    link.id ||
                    link.name ||
                    link.href
                  }
                  to={link.href}
                  className={
                    `navbar-link ${
                      isActive(
                        link.href
                      )
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={
                    handleNavigation
                  }
                >

                  {link.name}

                </Link>

              );

            }
          )}

        </nav>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="navbar-right">


          {/* ===============================================
              THEME BUTTON
          =============================================== */}

          <button
            type="button"
            className="navbar-theme"
            onClick={
              toggleTheme
            }
            aria-label={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >

            {isDark ? (

              <Sun
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

            ) : (

              <Moon
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

            )}

          </button>


          {/* ===============================================
              DESKTOP RESUME
          =============================================== */}

          <a
            href={resumeUrl}
            className="
              navbar-resume
              navbar-resume-desktop
            "
            download
          >

            <span>
              Resume
            </span>

            <span
              className="navbar-resume-icon"
              aria-hidden="true"
            >

              <Download
                size={15}
                strokeWidth={1.8}
              />

            </span>

          </a>


          {/* ===============================================
              MOBILE MENU BUTTON
          =============================================== */}

          <button
            type="button"
            className="navbar-menu-button"
            onClick={
              handleMenuToggle
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              menuOpen
            }
            aria-controls="mobile-navigation"
          >

            {menuOpen ? (

              <X
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

            ) : (

              <Menu
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

            )}

          </button>

        </div>

      </div>


      {/* ===================================================
          MOBILE MENU
      =================================================== */}

      {menuOpen && (

        <div
          id="mobile-navigation"
          className="navbar-mobile-menu"
          role="dialog"
          aria-label="Mobile navigation"
        >


          {/* =============================================
              MOBILE HEADER
          ============================================= */}

          <div
            className="navbar-mobile-header"
          >

            <div>

              <span
                className="navbar-mobile-label"
              >
                Navigation
              </span>

              <h3>
                Explore
              </h3>

            </div>


            {/* =========================================
                CLOSE BUTTON
            ========================================= */}

            <button
              type="button"
              className="navbar-mobile-close"
              onClick={
                closeMenu
              }
              aria-label="Close navigation menu"
            >

              <X
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />

            </button>

          </div>


          {/* =============================================
              MOBILE LINKS
          ============================================= */}

          <nav
            className="navbar-mobile-links"
            aria-label="Mobile navigation"
          >

            {navLinks.map(
              (link, index) => {

                if (
                  !link ||
                  !link.href
                ) {
                  return null;
                }


                return (

                  <Link
                    key={
                      link.id ||
                      link.name ||
                      link.href
                    }
                    to={link.href}
                    className={
                      `navbar-mobile-link ${
                        isActive(
                          link.href
                        )
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={
                      handleNavigation
                    }
                  >

                    <span
                      className="
                        navbar-mobile-number
                      "
                    >

                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}

                    </span>


                    <span
                      className="
                        navbar-mobile-link-text
                      "
                    >

                      {link.name}

                    </span>

                  </Link>

                );

              }
            )}

          </nav>


          {/* =============================================
              MOBILE RESUME
          ============================================= */}

          <a
            href={resumeUrl}
            className="
              navbar-resume
              navbar-resume-mobile
            "
            download
          >

            <span>
              Download Resume
            </span>

            <span
              className="navbar-resume-icon"
              aria-hidden="true"
            >

              <Download
                size={16}
                strokeWidth={1.8}
              />

            </span>

          </a>


          {/* =============================================
              MOBILE FOOTER
          ============================================= */}

          <div
            className="navbar-mobile-footer"
          >

            <span>
              {personalInfo?.profession ||
                "FRONTEND DEVELOPER"}
            </span>

            <span
              className="navbar-mobile-dot"
              aria-hidden="true"
            />

            <span>
              {personalInfo?.displayName ||
                "NATHAN"}
            </span>

          </div>

        </div>

      )}

    </header>

  );

}