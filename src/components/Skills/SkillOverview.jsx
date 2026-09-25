import {
  Code2,
  Layers3,
  Sparkles,
  ArrowUpRight,
  Check,
  Zap,
  MousePointer2,
  Monitor,
  Smartphone,
  Palette,
  GitBranch,
  Gauge,
} from "lucide-react";

import {
  useLayoutEffect,
  useRef,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  siteText,
} from "../../javascript/index.js";


gsap.registerPlugin(ScrollTrigger);

function SkillsOverview({ text }) {
  const sectionRef = useRef(null);

  const shouldReduceMotion =
    useReducedMotion();

  const overviewText =
    text ||
    siteText.skills?.overview ||
    {};

  const cards =
    overviewText.cards || [];

  const stats =
    overviewText.stats || [];

  /*
   * EXTRA TECHNOLOGIES
   */

  const technologies = [
    {
      name: "React",
      type: "Frontend",
    },
    {
      name: "JavaScript",
      type: "Language",
    },
    {
      name: "HTML & CSS",
      type: "Core",
    },
    {
      name: "Tailwind CSS",
      type: "Styling",
    },
    {
      name: "Three.js",
      type: "3D",
    },
    {
      name: "Zustand",
      type: "State",
    },
    {
      name: "Git",
      type: "Workflow",
    },
    {
      name: "Vite",
      type: "Tooling",
    },
  ];

  /*
   * HOW I WORK
   */

  const workflow = [
    {
      icon: MousePointer2,
      number: "01",
      title: "Understand",
      text:
        "I start by understanding what the interface needs to achieve and who will use it.",
    },
    {
      icon: Palette,
      number: "02",
      title: "Design",
      text:
        "I think about layout, visual hierarchy, responsiveness and the overall user experience.",
    },
    {
      icon: Code2,
      number: "03",
      title: "Build",
      text:
        "I turn the idea into structured, reusable and responsive frontend code.",
    },
    {
      icon: Gauge,
      number: "04",
      title: "Improve",
      text:
        "I refine interactions, performance, responsiveness and the small details that make an interface feel polished.",
    },
  ];

  /*
   * FOCUS AREAS
   */

  const focusAreas = [
    {
      icon: Monitor,
      title: "Responsive Interfaces",
      text:
        "Interfaces that adapt smoothly across desktops, tablets and mobile devices.",
    },
    {
      icon: Smartphone,
      title: "Mobile Experiences",
      text:
        "Layouts and interactions designed to remain clear and usable on smaller screens.",
    },
    {
      icon: Zap,
      title: "Interactive Experiences",
      text:
        "Animations and interactions that add personality without getting in the way.",
    },
    {
      icon: Layers3,
      title: "Reusable Structure",
      text:
        "Components and patterns that make projects easier to maintain and expand.",
    },
  ];

  /*
   * GSAP
   */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const ctx =
      gsap.context(() => {
        const animatedElements =
          section.querySelectorAll(
            [
              ".skills-overview-eyebrow",
              ".skills-overview-title",
              ".skills-overview-description",
              ".skills-overview-card",
              ".skills-overview-stat",
              ".skills-tech-title",
              ".skills-tech-item",
              ".skills-work-title",
              ".skills-work-item",
              ".skills-focus-title",
              ".skills-focus-card",
            ].join(",")
          );

        if (shouldReduceMotion) {
          gsap.set(
            animatedElements,
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              clearProps:
                "transform,opacity",
            }
          );

          return;
        }

        const headerElements =
          section.querySelectorAll(
            [
              ".skills-overview-eyebrow",
              ".skills-overview-title",
              ".skills-overview-description",
            ].join(",")
          );

        gsap.fromTo(
          headerElements,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-overview-header",
              start: "top 82%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        const overviewCards =
          section.querySelectorAll(
            ".skills-overview-card"
          );

        gsap.fromTo(
          overviewCards,
          {
            opacity: 0,
            y: 65,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            stagger: 0.13,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-overview-grid",
              start: "top 86%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        const statsElements =
          section.querySelectorAll(
            ".skills-overview-stat"
          );

        gsap.fromTo(
          statsElements,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-overview-stats",
              start: "top 88%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        const techItems =
          section.querySelectorAll(
            ".skills-tech-item"
          );

        gsap.fromTo(
          techItems,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-technologies",
              start: "top 88%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        const workItems =
          section.querySelectorAll(
            ".skills-work-item"
          );

        gsap.fromTo(
          workItems,
          {
            opacity: 0,
            x: -35,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-workflow",
              start: "top 85%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        const focusCards =
          section.querySelectorAll(
            ".skills-focus-card"
          );

        gsap.fromTo(
          focusCards,
          {
            opacity: 0,
            y: 45,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger:
                ".skills-focus-grid",
              start: "top 88%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );
      }, section);

    return () => {
      ctx.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <section
      className="skills-overview"
      ref={sectionRef}
    >
      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div
        className="skills-overview-glow skills-overview-glow-one"
        aria-hidden="true"
      />

      <div
        className="skills-overview-glow skills-overview-glow-two"
        aria-hidden="true"
      />

      <div
        className="skills-overview-grid-pattern"
        aria-hidden="true"
      />

      <div className="skills-overview-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="skills-overview-header">

          <motion.span
            className="skills-overview-eyebrow"
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 4,
                  }
            }
          >
            <Code2
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {overviewText.eyebrow ||
              "How I Build"}
          </motion.span>

          <h2 className="skills-overview-title">
            {overviewText.title?.main ||
              "More than just"}

            {" "}

            <span>
              {overviewText.title?.accent ||
                "writing code."}
            </span>
          </h2>

          <p className="skills-overview-description">
            {overviewText.description ||
              "I combine development, design and interaction to create experiences that are not only functional, but also feel polished and intuitive."}
          </p>

        </header>

        {/* =========================================
            MAIN CARDS
        ========================================= */}

        <div className="skills-overview-grid">

          {cards.map(
            (card, index) => {
              const Icon =
                index === 0
                  ? Code2
                  : index === 1
                  ? Sparkles
                  : Layers3;

              return (
                <motion.article
                  className="skills-overview-card"
                  key={index}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -8,
                        }
                  }
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <div className="skills-overview-card-top">

                    <span className="skills-overview-number">
                      {card.number ||
                        String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                    </span>

                    <div className="skills-overview-card-icon">
                      <Icon
                        size={20}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                  </div>

                  <div className="skills-overview-card-content">

                    <h3>
                      {card.title}
                    </h3>

                    <p>
                      {card.text}
                    </p>

                  </div>

                  <div className="skills-overview-card-line" />

                  <span className="skills-overview-card-arrow">
                    <ArrowUpRight
                      size={17}
                    />
                  </span>

                </motion.article>
              );
            }
          )}

        </div>

        {/* =========================================
            STATS
        ========================================= */}

        {stats.length > 0 && (
          <div className="skills-overview-stats">

            {stats.map(
              (stat, index) => (
                <motion.div
                  className="skills-overview-stat"
                  key={index}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -3,
                        }
                  }
                >
                  <strong>
                    {stat.value}
                  </strong>

                  <span>
                    {stat.label}
                  </span>
                </motion.div>
              )
            )}

          </div>
        )}

        {/* =========================================
            TECHNOLOGIES
        ========================================= */}

        <section className="skills-technologies">

          <div className="skills-section-heading">

            <div>
              <span className="skills-section-label">
                <Layers3
                  size={15}
                  strokeWidth={1.8}
                />

                TECHNOLOGIES
              </span>

              <h3 className="skills-tech-title">
                Tools I use to
                <span>
                  build.
                </span>
              </h3>
            </div>

            <p>
              A growing toolkit focused on
              modern frontend development,
              interaction and performance.
            </p>

          </div>

          <div className="skills-tech-list">

            {technologies.map(
              (
                technology,
                index
              ) => (
                <motion.div
                  className="skills-tech-item"
                  key={technology.name}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -4,
                        }
                  }
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <div className="skills-tech-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="skills-tech-info">
                    <strong>
                      {technology.name}
                    </strong>

                    <span>
                      {technology.type}
                    </span>
                  </div>

                  <Check
                    size={16}
                    className="skills-tech-check"
                  />
                </motion.div>
              )
            )}

          </div>

        </section>

        {/* =========================================
            WORKFLOW
        ========================================= */}

        <section className="skills-workflow">

          <div className="skills-section-heading">

            <div>
              <span className="skills-section-label">
                <GitBranch
                  size={15}
                  strokeWidth={1.8}
                />

                MY PROCESS
              </span>

              <h3 className="skills-work-title">
                From idea
                <span>
                  to interface.
                </span>
              </h3>
            </div>

            <p>
              I approach projects as a process,
              not just a collection of components.
            </p>

          </div>

          <div className="skills-work-grid">

            {workflow.map(
              (step) => {
                const Icon =
                  step.icon;

                return (
                  <motion.article
                    className="skills-work-item"
                    key={step.number}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -5,
                          }
                    }
                  >
                    <div className="skills-work-top">

                      <span>
                        {step.number}
                      </span>

                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />

                    </div>

                    <h4>
                      {step.title}
                    </h4>

                    <p>
                      {step.text}
                    </p>

                  </motion.article>
                );
              }
            )}

          </div>

        </section>

        {/* =========================================
            FOCUS AREAS
        ========================================= */}

        <section className="skills-focus">

          <div className="skills-section-heading">

            <div>
              <span className="skills-section-label">
                <Sparkles
                  size={15}
                  strokeWidth={1.8}
                />

                WHAT I FOCUS ON
              </span>

              <h3 className="skills-focus-title">
                Building experiences
                <span>
                  that feel right.
                </span>
              </h3>
            </div>

            <p>
              Good frontend development is
              about more than making something
              work.
            </p>

          </div>

          <div className="skills-focus-grid">

            {focusAreas.map(
              (area) => {
                const Icon =
                  area.icon;

                return (
                  <motion.article
                    className="skills-focus-card"
                    key={area.title}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -6,
                          }
                    }
                  >
                    <div className="skills-focus-icon">
                      <Icon
                        size={21}
                        strokeWidth={1.8}
                      />
                    </div>

                    <h4>
                      {area.title}
                    </h4>

                    <p>
                      {area.text}
                    </p>

                  </motion.article>
                );
              }
            )}

          </div>

        </section>

        {/* =========================================
            FINAL STATEMENT
        ========================================= */}

        <div className="skills-overview-footer">

          <div className="skills-footer-line" />

          <div className="skills-footer-content">

            <span>
              <span className="skills-footer-dot" />

              CONTINUOUSLY LEARNING
            </span>

            <p>
              The web keeps changing.
              So does the way I build.
            </p>

          </div>

          <div className="skills-footer-line" />

        </div>

      </div>
    </section>
  );
}

export default SkillsOverview;