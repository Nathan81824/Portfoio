import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  Code2,
  Layers3,
  Sparkles,
} from "lucide-react";

import LazyImage from "../Shared/UI/Media/LazyImage.jsx";

import {
  media,
  siteText,
} from "../../javascript/index.js";




function WhoIAm() {

  const shouldReduceMotion =
    useReducedMotion();


  /* =====================================================
     TEXT
  ===================================================== */

  const text =
    siteText.about.whoIAm;


  /* =====================================================
     IMAGE
  ===================================================== */

  const image =
    media.images.aboutImage;


  /* =====================================================
     MAIN ANIMATION
  ===================================================== */

  const contentAnimation = {

    hidden: {
      opacity: 0,
      y: 50,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      },
    },

  };


  return (

    <section
      className="who-i-am"
      id="who-i-am"
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="who-i-am-background"
        aria-hidden="true"
      >

        <div
          className="
            who-i-am-glow
            who-i-am-glow-one
          "
        />

        <div
          className="
            who-i-am-glow
            who-i-am-glow-two
          "
        />

      </div>


      {/* =================================================
          CONTAINER
      ================================================= */}

      <div className="who-i-am-container">


        {/* =================================================
            CONTENT
        ================================================= */}

        <motion.div
          className="who-i-am-content"

          initial={
            shouldReduceMotion
              ? false
              : "hidden"
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : "visible"
          }

          viewport={{
            once: true,
            amount: 0.2,
          }}

          variants={
            contentAnimation
          }
        >


          {/* ===============================================
              SECTION LABEL
          =============================================== */}

          <div className="who-i-am-label">

            <span className="who-i-am-number">
              {text.number}
            </span>

            <span
              className="who-i-am-line"
              aria-hidden="true"
            />

            <span className="who-i-am-label-text">
              {text.label}
            </span>

          </div>


          {/* ===============================================
              HEADING
          =============================================== */}

          <h2>

            {text.heading.main}

            <span>
              {text.heading.accent}
            </span>

          </h2>


          {/* ===============================================
              PARAGRAPHS
          =============================================== */}

          <div className="who-i-am-text">

            {text.paragraphs.map(
              (
                paragraph,
                index
              ) => (

                <p key={index}>
                  {paragraph}
                </p>

              )
            )}

          </div>


          {/* ===============================================
              HIGHLIGHTS
          =============================================== */}

          <div className="who-i-am-highlights">


            {/* FRONTEND */}

            <div className="who-i-am-highlight">

              <div
                className="who-i-am-highlight-icon"
                aria-hidden="true"
              >
                <Code2 size={20} />
              </div>

              <div>

                <strong>
                  {
                    text.highlights
                      .frontend
                      .title
                  }
                </strong>

                <span>
                  {
                    text.highlights
                      .frontend
                      .description
                  }
                </span>

              </div>

            </div>


            {/* REACT */}

            <div className="who-i-am-highlight">

              <div
                className="who-i-am-highlight-icon"
                aria-hidden="true"
              >
                <Layers3 size={20} />
              </div>

              <div>

                <strong>
                  {
                    text.highlights
                      .react
                      .title
                  }
                </strong>

                <span>
                  {
                    text.highlights
                      .react
                      .description
                  }
                </span>

              </div>

            </div>


            {/* CREATIVE */}

            <div className="who-i-am-highlight">

              <div
                className="who-i-am-highlight-icon"
                aria-hidden="true"
              >
                <Sparkles size={20} />
              </div>

              <div>

                <strong>
                  {
                    text.highlights
                      .creative
                      .title
                  }
                </strong>

                <span>
                  {
                    text.highlights
                      .creative
                      .description
                  }
                </span>

              </div>

            </div>


          </div>


        </motion.div>


        {/* =================================================
            IMAGE / VISUAL
        ================================================= */}

        <motion.div
          className="who-i-am-visual"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 70,
                  scale: 0.96,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }
          }

          viewport={{
            once: true,
            amount: 0.2,
          }}

          transition={{
            duration: 0.9,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >


          {/* ===============================================
              IMAGE FRAME
          =============================================== */}

          <div className="who-i-am-image-frame">


            {/* IMAGE GLOW */}

            <div
              className="who-i-am-image-glow"
              aria-hidden="true"
            />


            {/* IMAGE */}

            <LazyImage
              src={image}
              alt={text.imageAlt}
              wrapperClassName="who-i-am-image"
              threshold={200}
            />


            {/* BORDER */}

            <div
              className="who-i-am-image-border"
              aria-hidden="true"
            />

          </div>


          {/* ===============================================
              FLOATING CARD
          =============================================== */}

          <div className="who-i-am-floating-card">

            <span
              className="who-i-am-floating-dot"
              aria-hidden="true"
            />

            <div>

              <strong>
                {text.card.title}
              </strong>

              <span>
                {text.card.description}
              </span>

            </div>

          </div>


          {/* ===============================================
              CODE DECORATION
          =============================================== */}

          <div
            className="who-i-am-code-decoration"
            aria-hidden="true"
          >
            &lt;/&gt;
          </div>


        </motion.div>


      </div>

    </section>

  );

}


export default WhoIAm;