 /* =========================================================
    FOOTER
    Nathan — Frontend Developer Portfolio

    Location:
    src/components/Shared/Footer/Footer.jsx

    Uses:
    - Central website data
    - React Router
    - Lucide React
    - React Icons
========================================================= */

import {
  ArrowUp,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  SiVercel,
} from "react-icons/si";

import {
  Link,
} from "react-router-dom";


/* =========================================================
   DATA
========================================================= */

import {
  getData,
} from "../../../javascript/data/data.js";


/* =========================================================
   UTILITIES
========================================================= */

import {
  scrollToTop,
} from "../../../javascript/utils/scrollToSection.js";



/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {

  /* =======================================================
     WEBSITE DATA
  ======================================================= */

  const data =
    getData();


  const personalInfo =
    data?.personalInfo || {};


  const personalLinks =
    data?.personalLinks || {};


  const profile =
    data?.profile || {};


  const navigation =
    Array.isArray(
      data?.navigation
    )
      ? data.navigation
      : [];


  /* =======================================================
     FOOTER NAVIGATION
  ======================================================= */

  const footerNavigation =
    navigation.filter(
      (item) =>
        item &&
        item.href &&
        item.name
    );


  /* =======================================================
     SOCIAL LINKS
  ======================================================= */

  const socialLinks = [

    {
      name: "GitHub",

      href:
        personalLinks.github ||
        personalLinks.githubUrl ||
        "",

      icon: FaGithub,
    },


    {
      name: "LinkedIn",

      href:
        personalLinks.linkedin ||
        personalLinks.linkedinUrl ||
        "",

      icon: FaLinkedinIn,
    },


    {
      name: "Vercel",

      href:
        personalLinks.vercel ||
        personalLinks.vercelUrl ||
        "",

      icon: SiVercel,
    },

  ];


  /* =======================================================
     AVAILABILITY
  ======================================================= */

  const availability =
    personalInfo.availability ??
    profile.availability ??
    "Available for projects";


  const availabilityText =
    typeof availability === "object"

      ? (
          availability.available
            ? (
                availability.availableText ||
                "Available for projects"
              )
            : (
                availability.unavailableText ||
                "Currently unavailable"
              )
        )

      : String(
          availability
        );


  /* =======================================================
     PERSONAL DISPLAY NAME
  ======================================================= */

  const displayName =
    personalInfo.displayName ||
    personalInfo.name ||
    "Nathan";


  /* =======================================================
     PROFESSION
  ======================================================= */

  const profession =
    profile.profession ||
    personalInfo.profession ||
    "Frontend Developer";


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const currentYear =
    new Date().getFullYear();


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const handleScrollToTop = () => {

    scrollToTop();

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <footer className="footer">

      <div className="footer-container">


        {/* =================================================
            FOOTER TOP
        ================================================= */}

        <div className="footer-top">


          {/* ===============================================
              BRAND
          =============================================== */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
              aria-label="Go to home"
            >

              {
                displayName
                  .charAt(0)
                  .toUpperCase()
              }

            </Link>


            <div
              className="footer-brand-content"
            >

              <h2>
                {displayName}
              </h2>

              <p>
                {profession}
              </p>

            </div>

          </div>


          {/* ===============================================
              DESCRIPTION
          =============================================== */}

          <p className="footer-description">

            Building modern, responsive and
            interactive digital experiences.

          </p>

        </div>


        {/* =================================================
            FOOTER GRID
        ================================================= */}

        <div className="footer-grid">


          {/* ===============================================
              NAVIGATION
          =============================================== */}

          <div className="footer-column">

            <h3>
              Navigation
            </h3>


            <nav
              className="footer-links"
              aria-label="Footer navigation"
            >

              {footerNavigation.map(
                (link) => (

                  <Link
                    key={
                      link.id ||
                      link.name ||
                      link.href
                    }
                    to={link.href}
                  >

                    {link.name}

                  </Link>

                )
              )}

            </nav>

          </div>


          {/* ===============================================
              CONNECT
          =============================================== */}

          <div className="footer-column">

            <h3>
              Connect
            </h3>


            <div className="footer-socials">

              {socialLinks.map(
                (social) => {

                  if (
                    !social.href
                  ) {
                    return null;
                  }


                  const Icon =
                    social.icon;


                  return (

                    <a
                      key={
                        social.name
                      }

                      href={
                        social.href
                      }

                      className="footer-social"

                      target="_blank"

                      rel="noopener noreferrer"

                      aria-label={
                        social.name
                      }

                      title={
                        social.name
                      }
                    >

                      <Icon
                        size={18}
                        aria-hidden="true"
                      />

                      <span>
                        {social.name}
                      </span>

                    </a>

                  );

                }
              )}

            </div>

          </div>


          {/* ===============================================
              CONTACT
          =============================================== */}

          <div className="footer-column">

            <h3>
              Contact
            </h3>


            <div
              className="footer-contact"
            >


              {/* =========================================
                  EMAIL
              ========================================= */}

              {personalInfo.email && (

                <a
                  href={
                    `mailto:${personalInfo.email}`
                  }

                  className="footer-contact-link"
                >

                  <Mail
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <span>
                    {personalInfo.email}
                  </span>

                </a>

              )}


              {/* =========================================
                  LOCATION
              ========================================= */}

              {personalInfo.location && (

                <div
                  className="footer-contact-item"
                >

                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <span>
                    {personalInfo.location}
                  </span>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            FOOTER BOTTOM
        ================================================= */}

        <div className="footer-bottom">


          {/* ===============================================
              COPYRIGHT
          =============================================== */}

          <p>

            © {currentYear}{" "}

            {displayName}

            . All rights reserved.

          </p>


          {/* ===============================================
              AVAILABILITY
          =============================================== */}

          <div className="footer-status">

            <span
              className="footer-status-dot"
              aria-hidden="true"
            />

            <span>
              {availabilityText}
            </span>

          </div>


          {/* ===============================================
              BACK TO TOP
          =============================================== */}

          <button
            type="button"

            className="footer-top-button"

            onClick={
              handleScrollToTop
            }

            aria-label="Back to top"

            title="Back to top"
          >

            <ArrowUp
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />

          </button>

        </div>

      </div>

    </footer>

  );

}