import { motion } from "framer-motion";
import {
  ArrowDown,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { getData } from "../../javascript/data/data";



/* =========================================================
   CONTACT HERO
========================================================= */

export default function ContactHero() {

  const {
    personalInfo = {},
    profile = {},
  } = getData();


  const displayName =
    personalInfo.displayName ||
    personalInfo.name ||
    "Nathan";


  const email =
    personalInfo.email ||
    "";


  return (

    <section
      className="contact-hero"
      id="contact"
    >

      {/* ===================================================
          AMBIENT BACKGROUND
      =================================================== */}

      <div
        className="contact-hero__glow contact-hero__glow--one"
        aria-hidden="true"
      />

      <div
        className="contact-hero__glow contact-hero__glow--two"
        aria-hidden="true"
      />


      {/* ===================================================
          GRID
      =================================================== */}

      <div
        className="contact-hero__grid"
        aria-hidden="true"
      />


      {/* ===================================================
          CONTAINER
      =================================================== */}

      <div className="contact-hero__container">


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <motion.div
          className="contact-hero__content"

          initial={{
            opacity: 0,
            x: -30,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >

          {/* =================================================
              EYEBROW
          ================================================= */}

          <motion.div
            className="contact-hero__eyebrow"

            initial={{
              opacity: 0,
              y: 12,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
          >

            <span className="contact-hero__eyebrow-line" />

            <span>
              CONTACT
            </span>

          </motion.div>


          {/* =================================================
              TITLE
          ================================================= */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
          >

            Let's build
            <br />

            <span>
              something great.
            </span>

          </motion.h1>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            className="contact-hero__description"

            initial={{
              opacity: 0,
              y: 18,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
          >

            Have an idea, project, or question?
            Send me a message and let's talk about
            what we can create together.

          </motion.p>


          {/* =================================================
              STATUS
          ================================================= */}

          <motion.div
            className="contact-hero__status"

            initial={{
              opacity: 0,
              y: 15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.6,
              delay: 0.45,
            }}
          >

            <span className="contact-hero__status-dot" />

            <span>
              {profile.availability ||
                "Available for projects"}
            </span>

          </motion.div>


          {/* =================================================
              QUICK CONTACT
          ================================================= */}

          {email && (

            <motion.a
              href={`mailto:${email}`}
              className="contact-hero__email"

              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              transition={{
                duration: 0.6,
                delay: 0.55,
              }}
            >

              <span className="contact-hero__email-icon">

                <Mail
                  size={17}
                  strokeWidth={1.8}
                />

              </span>


              <span>
                {email}
              </span>


              <ArrowDown
                className="contact-hero__email-arrow"
                size={16}
                strokeWidth={1.8}
              />

            </motion.a>

          )}


          {/* =================================================
              DECORATIVE MESSAGE CARD
          ================================================= */}

          <motion.div
            className="contact-hero__message-card"

            initial={{
              opacity: 0,
              scale: 0.95,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            transition={{
              duration: 0.7,
              delay: 0.65,
            }}
          >

            <div className="contact-hero__message-icon">

              <MessageCircle
                size={18}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <span>
                Your message
              </span>

              <strong>
                goes directly to my inbox.
              </strong>

            </div>


            <Sparkles
              size={17}
              strokeWidth={1.7}
            />

          </motion.div>

        </motion.div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <motion.div
          className="contact-hero__visual"

          initial={{
            opacity: 0,
            x: 30,
          }}

          animate={{
            opacity: 1,
            x: 0,
          }}

          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
        >

          <div className="contact-hero__visual-orbit">

            <div className="contact-hero__orbit contact-hero__orbit--one" />

            <div className="contact-hero__orbit contact-hero__orbit--two" />

            <div className="contact-hero__orbit contact-hero__orbit--three" />


            <div className="contact-hero__visual-core">

              <MessageCircle
                size={42}
                strokeWidth={1.3}
              />

              <span>
                Let's Talk
              </span>

            </div>

          </div>

        </motion.div>


        {/* =================================================
            SCROLL INDICATOR
        ================================================= */}

        <motion.a
          href="#contact-form"
          className="contact-hero__scroll"

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 1,
            duration: 0.6,
          }}
        >

          <span>
            Start a conversation
          </span>

          <ArrowDown
            size={16}
            strokeWidth={1.7}
          />

        </motion.a>

      </div>

    </section>

  );

}
