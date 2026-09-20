import {
  motion,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowDown,
  Code2,
  Layers3,
  Rocket,
} from "lucide-react";

import {
  siteText,
} from "../../javascript/index.js";



function MyJourney() {

  const shouldReduceMotion =
    useReducedMotion();

  const text =
    siteText.about.myJourney;


  /* =====================================================
     ANIMATION
  ===================================================== */

  const containerVariants = {

    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },

  };


  const itemVariants = {

    hidden: {
      opacity: 0,
      y: 35,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      },
    },

  };


  /* =====================================================
     ICONS
  ===================================================== */

  const icons = [
    Code2,
    Layers3,
    Rocket,
  ];


  return (

    <section
      className="my-journey"
      id="my-journey"
    >


      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="my-journey-background"
        aria-hidden="true"
      >

        <div
          className="
            my-journey-glow
            my-journey-glow-one
          "
        />

        <div
          className="
            my-journey-glow
            my-journey-glow-two
          "
        />

        <div
          className="my-journey-grid"
        />

      </div>


      {/* =================================================
          CONTAINER
      ================================================= */}

      <div className="my-journey-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          className="my-journey-header"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 35,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }

          viewport={{
            once: true,
            amount: 0.25,
          }}

          transition={{
            duration: 0.8,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          <div className="my-journey-label">

            <span className="my-journey-number">
              {text.number}
            </span>

            <span
              className="my-journey-line"
              aria-hidden="true"
            />

            <span className="my-journey-label-text">
              {text.label}
            </span>

          </div>


          <h2>

            {text.heading.main}

            <span>
              {text.heading.accent}
            </span>

          </h2>


          <p className="my-journey-intro">
            {text.intro}
          </p>

        </motion.div>


        {/* =================================================
            TIMELINE
        ================================================= */}

        <motion.div
          className="my-journey-timeline"

          variants={
            containerVariants
          }

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
            amount: 0.15,
          }}
        >


          {/* =================================================
              TIMELINE LINE
          ================================================= */}

          <div
            className="my-journey-timeline-line"
            aria-hidden="true"
          />


          {/* =================================================
              JOURNEY ITEMS
          ================================================= */}

          {text.steps.map(
            (
              step,
              index
            ) => {

              const Icon =
                icons[
                  index % icons.length
                ];

              return (

                <motion.article
                  className={`
                    my-journey-item
                    ${
                      index % 2 === 0
                        ? "my-journey-item-left"
                        : "my-journey-item-right"
                    }
                  `}

                  key={
                    step.id ||
                    step.title ||
                    index
                  }

                  variants={
                    itemVariants
                  }
                >


                  {/* =======================================
                      CARD
                  ======================================= */}

                  <div className="my-journey-card">


                    <div className="my-journey-card-top">

                      <span className="my-journey-step">
                        {step.number}
                      </span>

                      <span className="my-journey-year">
                        {step.period}
                      </span>

                    </div>


                    <div className="my-journey-card-icon">

                      <Icon
                        size={22}
                        strokeWidth={1.8}
                      />

                    </div>


                    <h3>
                      {step.title}
                    </h3>


                    <p>
                      {step.description}
                    </p>


                    {step.skills && (
                      <div className="my-journey-skills">

                        {step.skills.map(
                          (skill) => (

                            <span
                              key={skill}
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>
                    )}


                  </div>


                  {/* =======================================
                      TIMELINE DOT
                  ======================================= */}

                  <div
                    className="my-journey-dot"
                    aria-hidden="true"
                  >

                    <span />

                  </div>


                  {/* =======================================
                      CONNECTOR
                  ======================================= */}

                  <div
                    className="my-journey-connector"
                    aria-hidden="true"
                  />

                </motion.article>

              );

            }
          )}

        </motion.div>


        {/* =================================================
            BOTTOM MESSAGE
        ================================================= */}

        <motion.div
          className="my-journey-bottom"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 30,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }

          viewport={{
            once: true,
            amount: 0.4,
          }}

          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >

          <div className="my-journey-bottom-icon">

            <ArrowDown
              size={18}
            />

          </div>

          <span>
            {text.bottomText}
          </span>

        </motion.div>


      </div>

    </section>

  );

}


export default MyJourney;