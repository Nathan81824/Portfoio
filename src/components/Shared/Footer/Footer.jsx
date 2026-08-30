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

import {
  getData,
} from "../../../javascript";


/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {

  /* =======================================================
     WEBSITE DATA
  ======================================================= */

  const data = getData();

  const personalInfo =
    data?.personalInfo || {};

  const personalLinks =
    data?.personalLinks || {};

  const profile =
    data?.profile || {};

  const navigation =
    Array.isArray(data?.navigation)
      ? data.navigation
      : [];


  /* =======================================================
     NAVIGATION FALLBACK
  ======================================================= */

  const footerNavigation =
    navigation.length > 0

      ? navigation

      : [
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
     SOCIAL LINKS
  ======================================================= */

  const socialLinks = [

    {
      name: "GitHub",
      href:
        personalLinks.github || "",
      icon: FaGithub,
    },

    {
      name: "LinkedIn",
      href:
        personalLinks.linkedin || "",
      icon: FaLinkedinIn,
    },

    {
      name: "Vercel",
      href:
        personalLinks.vercel || "",
      icon: SiVercel,
    },

  ];


  /* =======================================================
     AVAILABILITY
  ======================================================= */

  const availability =
    personalInfo.availability;


  const availabilityText =

    availability &&
    typeof availability === "object"

      ? availability.available

        ? availability.availableText

        : availability.unavailableText

      : availability ||

        profile.availability ||

        "Available for projects";


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const currentYear =
    new Date().getFullYear();


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

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
              N
            </Link>


            <div className="footer-brand-content">

              <h2>

                {
                  personalInfo.displayName ||

                  personalInfo.name ||

                  "Nathan"
                }

              </h2>


              <p>

                {
                  profile.profession ||

                  personalInfo.profession ||

                  "Frontend Developer"
                }

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
                    key={link.name}
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

                  /*
                    Don't render social links
                    that don't have a URL.
                  */

                  if (!social.href) {

                    return null;

                  }


                  const Icon =
                    social.icon;


                  return (

                    <a
                      key={social.name}

                      href={social.href}

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


            <div className="footer-contact">


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

            {
              personalInfo.displayName ||

              personalInfo.name ||

              "Nathan"
            }

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

            onClick={scrollToTop}

            aria-label="Back to top"

            title="Back to top"
          >

            <ArrowUp
              size={17}
              strokeWidth={1.8}
            />

          </button>

        </div>

      </div>

    </footer>

  );

}