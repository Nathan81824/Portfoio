/* =========================================================
   HOW I BUILD
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/About/HowIBuild/HowIBuild.jsx

   Uses:
   - Central site text
   - Framer Motion
   - Lucide React
   - GSAP
   - Responsive interaction
   - Reduced motion
========================================================= */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import {
  Search,
  ClipboardList,
  Code2,
  Sparkles,
  Rocket,
  ArrowUpRight,
  Check,
  Terminal,
  Layers3,
} from "lucide-react";

import gsap from "gsap";

import {
  siteText,
} from "../../javascript/index.js";




/* =========================================================
   ICONS
========================================================= */

const icons = [
  Search,
  ClipboardList,
  Code2,
  Sparkles,
  Rocket,
];


/* =========================================================
   COMPONENT
========================================================= */

function HowIBuild() {

  const shouldReduceMotion =
    useReducedMotion();

  const text =
    siteText.about.howIBuild;

  const [activeStep, setActiveStep] =
    useState(0);

  const progressRef =
    useRef(null);

  const glowRef =
    useRef(null);


  /* =======================================================
     ACTIVE STEP
  ======================================================= */

  const currentStep =
    text.steps[activeStep];

  const CurrentIcon =
    icons[
      activeStep % icons.length
    ];


  /* =======================================================
     GSAP PROGRESS
  ======================================================= */

  useEffect(() => {

    if (
      shouldReduceMotion ||
      !progressRef.current
    ) {
      return;
    }

    const progress =
      (activeStep /
        Math.max(
          text.steps.length - 1,
          1
        )) *
      100;

    gsap.to(
      progressRef.current,
      {
        width: `${progress}%`,
        duration: 0.65,
        ease: "power3.out",
      }
    );

  }, [
    activeStep,
    shouldReduceMotion,
    text.steps.length,
  ]);


  /* =======================================================
     MOUSE GLOW
  ======================================================= */

  const handleMouseMove = (
    event
  ) => {

    if (
      shouldReduceMotion ||
      !glowRef.current
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;

    gsap.to(
      glowRef.current,
      {
        x: x - 180,
        y: y - 180,
        duration: 0.5,
        ease: "power2.out",
      }
    );

  };


  /* =======================================================
     HEADER ANIMATION
  ======================================================= */

  const headerVariants = {

    hidden: {
      opacity: 0,
      y: 40,
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


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="how-i-build"
      id="how-i-build"
    >

      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="how-i-build-background"
        aria-hidden="true"
      >

        <div
          className="
            how-i-build-background-grid
          "
        />

        <div
          className="
            how-i-build-background-glow
            how-i-build-background-glow-one
          "
        />

        <div
          className="
            how-i-build-background-glow
            how-i-build-background-glow-two
          "
        />

      </div>


      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <div
        className="how-i-build-container"
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <motion.header
          className="how-i-build-header"

          variants={
            headerVariants
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
            amount: 0.25,
          }}
        >

          <div
            className="
              how-i-build-label
            "
          >

            <span
              className="
                how-i-build-label-number
              "
            >
              {text.number}
            </span>

            <span
              className="
                how-i-build-label-line
              "
            />

            <span
              className="
                how-i-build-label-text
              "
            >
              {text.label}
            </span>

          </div>


          <h2>

            {text.heading.main}

            <span>
              {text.heading.accent}
            </span>

          </h2>


          <p
            className="
              how-i-build-intro
            "
          >
            {text.intro}
          </p>

        </motion.header>


        {/* =================================================
            WORKFLOW
        ================================================= */}

        <motion.div
          className="
            how-i-build-workspace
          "

          onMouseMove={
            handleMouseMove
          }

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 45,
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
            amount: 0.15,
          }}

          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          {/* =================================================
              MOUSE GLOW
          ================================================= */}

          <div
            ref={glowRef}
            className="
              how-i-build-mouse-glow
            "
            aria-hidden="true"
          />


          {/* =================================================
              LEFT NAVIGATION
          ================================================= */}

          <aside
            className="
              how-i-build-navigation
            "
          >

            <div
              className="
                how-i-build-navigation-header
              "
            >

              <span>
                PROCESS
              </span>

              <span>
                0{activeStep + 1}
              </span>

            </div>


            <div
              className="
                how-i-build-navigation-list
              "
            >

              {text.steps.map(
                (
                  step,
                  index
                ) => {

                  const Icon =
                    icons[
                      index %
                      icons.length
                    ];

                  const isActive =
                    activeStep === index;

                  return (

                    <button
                      key={
                        step.id ||
                        step.title ||
                        index
                      }

                      type="button"

                      className={`
                        how-i-build-navigation-item
                        ${
                          isActive
                            ? "is-active"
                            : ""
                        }
                      `}

                      onClick={() =>
                        setActiveStep(
                          index
                        )
                      }

                      onMouseEnter={() =>
                        setActiveStep(
                          index
                        )
                      }
                    >

                      <span
                        className="
                          how-i-build-navigation-number
                        "
                      >
                        {step.number}
                      </span>


                      <span
                        className="
                          how-i-build-navigation-icon
                        "
                      >
                        <Icon
                          size={17}
                          strokeWidth={1.7}
                        />
                      </span>


                      <span
                        className="
                          how-i-build-navigation-title
                        "
                      >
                        {step.title}
                      </span>


                      <ArrowUpRight
                        className="
                          how-i-build-navigation-arrow
                        "
                        size={15}
                      />

                    </button>

                  );

                }
              )}

            </div>


            {/* =============================================
                STATUS
            ============================================= */}

            <div
              className="
                how-i-build-status
              "
            >

              <span
                className="
                  how-i-build-status-dot
                "
              />

              <span>
                SYSTEM READY
              </span>

            </div>

          </aside>


          {/* =================================================
              CONTENT PANEL
          ================================================= */}

          <div
            className="
              how-i-build-content
            "
          >

            {/* =============================================
                TOP BAR
            ============================================= */}

            <div
              className="
                how-i-build-content-top
              "
            >

              <div
                className="
                  how-i-build-terminal
                "
              >

                <Terminal
                  size={15}
                />

                <span>
                  nathan@frontend
                </span>

                <span>
                  :
                </span>

                <span
                  className="
                    how-i-build-terminal-path
                  "
                >
                  ~/build
                </span>

              </div>


              <div
                className="
                  how-i-build-content-meta
                "
              >

                <span>
                  STEP {currentStep.number}
                </span>

                <span>
                  /
                </span>

                <span>
                  05
                </span>

              </div>

            </div>


            {/* =============================================
                PROGRESS
            ============================================= */}

            <div
              className="
                how-i-build-progress
              "
            >

              <div
                className="
                  how-i-build-progress-track
                "
              >

                <div
                  ref={progressRef}
                  className="
                    how-i-build-progress-fill
                  "
                />

              </div>

            </div>


            {/* =============================================
                CONTENT
            ============================================= */}

            <AnimatePresence
              mode="wait"
            >

              <motion.div
                key={
                  currentStep.id
                }

                className="
                  how-i-build-content-main
                "

                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: 20,
                      }
                }

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                exit={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 0,
                        x: -20,
                      }
                }

                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >

                {/* =========================================
                    ICON
                ========================================= */}

                <div
                  className="
                    how-i-build-main-icon
                  "
                >

                  <CurrentIcon
                    size={38}
                    strokeWidth={1.4}
                  />

                  <span
                    className="
                      how-i-build-main-icon-ring
                    "
                  />

                </div>


                {/* =========================================
                    STEP NUMBER
                ========================================= */}

                <span
                  className="
                    how-i-build-main-number
                  "
                >
                  {currentStep.number}
                </span>


                {/* =========================================
                    TITLE
                ========================================= */}

                <h3>
                  {currentStep.title}
                </h3>


                {/* =========================================
                    DESCRIPTION
                ========================================= */}

                <p
                  className="
                    how-i-build-main-description
                  "
                >
                  {
                    currentStep.description
                  }
                </p>


                {/* =========================================
                    KEYWORD
                ========================================= */}

                <div
                  className="
                    how-i-build-main-keyword
                  "
                >

                  <span>
                    FOCUS
                  </span>

                  <strong>
                    {
                      currentStep.keyword
                    }
                  </strong>

                </div>


                {/* =========================================
                    TECHNICAL DETAILS
                ========================================= */}

                <div
                  className="
                    how-i-build-details
                  "
                >

                  <div
                    className="
                      how-i-build-detail
                    "
                  >

                    <Layers3
                      size={16}
                    />

                    <span>
                      COMPONENT BASED
                    </span>

                  </div>


                  <div
                    className="
                      how-i-build-detail
                    "
                  >

                    <Check
                      size={16}
                    />

                    <span>
                      RESPONSIVE
                    </span>

                  </div>


                  <div
                    className="
                      how-i-build-detail
                    "
                  >

                    <Code2
                      size={16}
                    />

                    <span>
                      CLEAN CODE
                    </span>

                  </div>

                </div>

              </motion.div>

            </AnimatePresence>


            {/* =============================================
                NEXT STEP
            ============================================= */}

            <div
              className="
                how-i-build-next
              "
            >

              <span>
                {activeStep <
                text.steps.length - 1
                  ? "NEXT STEP"
                  : "PROCESS COMPLETE"}
              </span>

              {activeStep <
                text.steps.length - 1 && (

                <button
                  type="button"

                  onClick={() =>
                    setActiveStep(
                      activeStep + 1
                    )
                  }

                  aria-label="Go to next step"
                >

                  <ArrowUpRight
                    size={18}
                  />

                </button>

              )}

            </div>

          </div>

        </motion.div>


        {/* =================================================
            BOTTOM STATEMENT
        ================================================= */}

        <motion.div
          className="
            how-i-build-bottom
          "

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                }
          }

          viewport={{
            once: true,
            amount: 0.5,
          }}

          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >

          <span
            className="
              how-i-build-bottom-line
            "
          />

          <p>
            {text.bottomText}
          </p>

          <span
            className="
              how-i-build-bottom-line
            "
          />

        </motion.div>

      </div>

    </section>

  );

}


export default HowIBuild;