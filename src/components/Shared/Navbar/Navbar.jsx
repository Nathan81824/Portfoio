import { useEffect, useState } from "react";

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

import {
  personalInfo,
  navigation,
} from "../../../javascript/data/data.js";

import useTheme from "../../../javascript/hooks/Theme/useTheme.js";

import Button, {
  MagneticButton,
} from "../Button/Button.jsx";

import {
  TextScramble,
} from "../../Detection/Effects/Effects.jsx";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const navLinks =
    navigation?.main ||
    navigation ||
    [];

  const resumeUrl =
    `${import.meta.env.BASE_URL}resume.pdf`;

  const logoName =
    personalInfo?.name ||
    "Portfolio";

  const logoLetter =
    logoName.charAt(0).toUpperCase();


  /* =========================================================
     HANDLE NAVBAR SCROLL STATE
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  /* =========================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  /* =========================================================
     LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow =
      menuOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);


  /* =========================================================
     MENU CONTROLS
  ========================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(
      (previous) => !previous
    );
  };


  /* =========================================================
     ACTIVE NAVIGATION LINK
  ========================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(
      path
    );
  };


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <header
      className={`navbar ${
        scrolled
          ? "navbar-scrolled"
          : "navbar-top"
      }`}
    >

      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="navbar-container">


        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="Go to homepage"
        >

          <span className="navbar-logo-mark">
            {logoLetter}
          </span>

          <span className="navbar-logo-name">
            <TextScramble
              text={logoName}
              duration={700}
              delay={100}
              className="text-scramble"
            />
          </span>

        </Link>


        {/* ===================================================
            DESKTOP NAVIGATION
        =================================================== */}

        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >

          {navLinks.map((item) => {
            const path =
              item.path ||
              item.href ||
              "/";

            const label =
              item.label ||
              item.name ||
              "";

            return (
              <Link
                key={path}
                to={path}
                className={`navbar-link ${
                  isActive(path)
                    ? "active"
                    : ""
                }`}
              >
                {label}
              </Link>
            );
          })}

        </nav>


        {/* ===================================================
            RIGHT SIDE CONTROLS
        =================================================== */}

        <div className="navbar-right">


          {/* =================================================
              THEME TOGGLE
          ================================================= */}

          <MagneticButton
            type="button"
            className="navbar-theme"
            strength={0.2}
            duration={0.3}
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={
              darkMode
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >

            {darkMode ? (
              <Sun
                size={18}
                strokeWidth={2}
              />
            ) : (
              <Moon
                size={18}
                strokeWidth={2}
              />
            )}

          </MagneticButton>


          {/* =================================================
              DESKTOP RESUME BUTTON
          ================================================= */}

          <div className="navbar-resume-desktop">

            <Button
              as="a"
              href={resumeUrl}
              download
              magnetic
              magneticStrength={0.15}
              className="navbar-resume"
            >

              <Download
                size={17}
                strokeWidth={2}
                className="navbar-resume-icon"
              />

              <span>
                Resume
              </span>

            </Button>

          </div>


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <MagneticButton
            type="button"
            className="navbar-menu-button"
            strength={0.2}
            duration={0.3}
            onClick={toggleMenu}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >

            {menuOpen ? (
              <X
                size={24}
                strokeWidth={2}
              />
            ) : (
              <Menu
                size={24}
                strokeWidth={2}
              />
            )}

          </MagneticButton>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`navbar-mobile-menu ${
          menuOpen
            ? "navbar-mobile-menu-open"
            : ""
        }`}
      >


        {/* ===================================================
            MOBILE MENU HEADER
        =================================================== */}

        <div className="navbar-mobile-header">

          <div>

            <span className="navbar-mobile-label">
              <TextScramble
                text="Navigation"
                duration={500}
                className="text-scramble"
              />
            </span>

            <h3>
              <TextScramble
                text="Menu"
                duration={600}
                delay={100}
                className="text-scramble"
              />
            </h3>

          </div>


          <MagneticButton
            type="button"
            className="navbar-mobile-close"
            strength={0.18}
            duration={0.3}
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >

            <X
              size={22}
              strokeWidth={2}
            />

          </MagneticButton>

        </div>


        {/* ===================================================
            MOBILE NAVIGATION LINKS
        =================================================== */}

        <nav
          className="navbar-mobile-links"
          aria-label="Mobile navigation"
        >

          {navLinks.map(
            (item, index) => {
              const path =
                item.path ||
                item.href ||
                "/";

              const label =
                item.label ||
                item.name ||
                "";

              return (
                <Link
                  key={path}
                  to={path}
                  className={`navbar-mobile-link ${
                    isActive(path)
                      ? "active"
                      : ""
                  }`}
                  onClick={closeMenu}
                >

                  <span className="navbar-mobile-number">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <span className="navbar-mobile-link-text">
                    {label}
                  </span>

                </Link>
              );
            }
          )}

        </nav>


        {/* ===================================================
            MOBILE RESUME BUTTON
        =================================================== */}

        <div className="navbar-resume-mobile">

          <Button
            as="a"
            href={resumeUrl}
            download
            magnetic
            magneticStrength={0.15}
            className="navbar-resume"
            onClick={closeMenu}
          >

            <Download
              size={17}
              strokeWidth={2}
              className="navbar-resume-icon"
            />

            <span>
              Download Resume
            </span>

          </Button>

        </div>


        {/* ===================================================
            MOBILE FOOTER
        =================================================== */}

        <div className="navbar-mobile-footer">

          <span className="navbar-mobile-dot" />

          <span>
            {personalInfo?.profession ||
              personalInfo?.role ||
              "Frontend Developer"}
          </span>

          <span>
            •
          </span>

          <span>
            {logoName}
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;