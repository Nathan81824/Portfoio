/* =========================================================
   NAVBAR
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/Shared/Navbar/Navbar.jsx

   Uses:
   - useTheme
   - react-router-dom
   - lucide-react
========================================================= */

import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";


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
     NAVIGATION LINKS
  ======================================================= */

  const navLinks = [

    {
      name: "Home",
      href: "/",
    },

    {
      name: "About",
      href: "/about",
    },

    {
      name: "Skills",
      href: "/skills",
    },

    {
      name: "Projects",
      href: "/projects",
    },

    {
      name: "Contact",
      href: "/contact",
    },

  ];


  /* =======================================================
     CLOSE MOBILE MENU
  ======================================================= */

  const closeMenu = () => {

    setMenuOpen(false);

  };


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNavigation = () => {

    closeMenu();

  };


  /* =======================================================
     THEME
  ======================================================= */

  const handleThemeToggle = () => {

    toggleTheme();

  };


  /* =======================================================
     MOBILE MENU
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

    if (href === "/") {

      return (
        location.pathname === "/"
      );

    }

    return (
      location.pathname === href
    );

  };


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

          N

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav

          className="navbar-links"

          aria-label="Main navigation"
        >

          {navLinks.map(
            (link) => (

              <Link

                key={link.name}

                to={link.href}

                className={
                  `navbar-link ${
                    isActive(link.href)
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

            )
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
              handleThemeToggle
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
              />

            ) : (

              <Moon
                size={17}
                strokeWidth={1.8}
              />

            )}

          </button>


          {/* ===============================================
              DESKTOP RESUME
          =============================================== */}

          <a

            href="/resume.pdf"

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
          >

            {menuOpen ? (

              <X
                size={19}
                strokeWidth={1.8}
              />

            ) : (

              <Menu
                size={19}
                strokeWidth={1.8}
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
              (link, index) => (

                <Link

                  key={link.name}

                  to={link.href}

                  className={
                    `navbar-mobile-link ${
                      isActive(link.href)
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

              )
            )}

          </nav>


          {/* =============================================
              MOBILE RESUME
          ============================================= */}

          <a

            href="/resume.pdf"

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
              FRONTEND DEVELOPER
            </span>

            <span
              className="navbar-mobile-dot"
            />

            <span>
              NATHAN
            </span>

          </div>

        </div>

      )}

    </header>

  );

}