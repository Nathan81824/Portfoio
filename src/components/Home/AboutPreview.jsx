import {
  ArrowRight,
  Code2,
  Layers3,
  Palette,
  Sparkles,
  Zap,
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

import Button, {
  MagneticButton,
} from "../Shared/Button/Button.jsx";

import {
  siteText,
} from "../../javascript/index.js";


gsap.registerPlugin(ScrollTrigger);

function AboutPreview({ text }) {
  const sectionRef = useRef(null);
  const glowOneRef = useRef(null);
  const glowTwoRef = useRef(null);

  const shouldReduceMotion =
    useReducedMotion();

  const aboutText =
    text ||
    siteText.home?.aboutPreview ||
    {};

  const focusItems = [
    {
      icon: Code2,
      title:
        aboutText.focus?.frontend?.title ||
        "Frontend Development",
      text:
        aboutText.focus?.frontend?.text ||
        "Building structured and interactive interfaces with modern frontend technologies.",
    },

    {
      icon: Palette,
      title:
        aboutText.focus?.design?.title ||
        "Thoughtful Design",
      text:
        aboutText.focus?.design?.text ||
        "Creating interfaces where visual details, layout and usability work together.",
    },

    {
      icon: Zap,
      title:
        aboutText.focus?.interaction?.title ||
        "Smooth Interaction",
      text:
        aboutText.focus?.interaction?.text ||
        "Adding meaningful interactions that make digital experiences feel responsive and engaging.",
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const glowOne = glowOneRef.current;
    const glowTwo = glowTwoRef.current;

    if (
      !section ||
      !glowOne ||
      !glowTwo
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const header =
        section.querySelector(
          ".home-about-header"
        );

      const textContent =
        section.querySelector(
          ".home-about-text"
        );

      const highlight =
        section.querySelector(
          ".home-about-highlight"
        );

      const focusCards =
        section.querySelectorAll(
          ".home-about-focus-card"
        );

      const stats =
        section.querySelector(
          ".home-about-stats"
        );

      const bottom =
        section.querySelector(
          ".home-about-bottom"
        );

      if (shouldReduceMotion) {
        gsap.set(
          [
            header,
            textContent,
            highlight,
            ...focusCards,
            stats,
            bottom,
          ].filter(Boolean),
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: "transform",
          }
        );

        return;
      }

      /* =========================
         HEADER
      ========================= */

      if (header) {
        gsap.fromTo(
          header,
          {
            opacity: 0,
            y: -70,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              end: "bottom 15%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );
      }

      /* =========================
         MAIN TEXT
      ========================= */

      if (textContent) {
        gsap.fromTo(
          textContent,
          {
            opacity: 0,
            x: -100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: textContent,
              start: "top 88%",
              end: "bottom 15%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );
      }

      /* =========================
         HIGHLIGHT
      ========================= */

      if (highlight) {
        gsap.fromTo(
          highlight,
          {
            opacity: 0,
            x: 100,
            scale: 0.96,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.1,
            delay: 0.1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: highlight,
              start: "top 88%",
              end: "bottom 15%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );

        gsap.to(highlight, {
          y: -6,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          overwrite: "auto",
        });
      }

      /* =========================
         FOCUS CARDS
      ========================= */

      focusCards.forEach(
        (card, index) => {
          let startX = 0;
          let startY = 0;

          if (index === 0) {
            startX = -90;
          } else if (index === 1) {
            startY = 90;
          } else {
            startX = 90;
          }

          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: startX,
              y: startY,
              scale: 0.95,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 1,
              delay: index * 0.12,
              ease: "power3.out",

              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "bottom 15%",
                toggleActions:
                  "play reverse play reverse",
              },
            }
          );

          const icon =
            card.querySelector(
              ".home-about-focus-icon"
            );

          if (!icon) {
            return;
          }

          const handleEnter = () => {
            gsap.to(card, {
              y: -7,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(icon, {
              rotate: 8,
              scale: 1.1,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          const handleLeave = () => {
            gsap.to(card, {
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });

            gsap.to(icon, {
              rotate: 0,
              scale: 1,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          };

          card.addEventListener(
            "mouseenter",
            handleEnter
          );

          card.addEventListener(
            "mouseleave",
            handleLeave
          );

          card._aboutEnter =
            handleEnter;

          card._aboutLeave =
            handleLeave;
        }
      );

      /* =========================
         STATS
      ========================= */

      if (stats) {
        gsap.fromTo(
          stats,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: stats,
              start: "top 88%",
              end: "bottom 15%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );
      }

      /* =========================
         EXPLORE MORE CARD
      ========================= */

      if (bottom) {
        gsap.fromTo(
          bottom,
          {
            opacity: 0,
            y: 70,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",

            scrollTrigger: {
              trigger: bottom,
              start: "top 90%",
              end: "bottom 15%",
              toggleActions:
                "play reverse play reverse",
            },
          }
        );
      }

      /* =========================
         BACKGROUND GLOW
      ========================= */

      const glowTimeline =
        gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: {
            ease: "sine.inOut",
          },
        });

      glowTimeline
        .to(
          glowOne,
          {
            x: -120,
            y: 55,
            scale: 1.12,
            duration: 4,
          },
          0
        )
        .to(
          glowTwo,
          {
            x: 120,
            y: -40,
            scale: 1.12,
            duration: 4,
          },
          0
        )
        .to(
          glowOne,
          {
            x: 90,
            y: -30,
            scale: 0.94,
            duration: 4,
          },
          4
        )
        .to(
          glowTwo,
          {
            x: -90,
            y: 45,
            scale: 0.94,
            duration: 4,
          },
          4
        );

      /* =========================
         MOUSE PARALLAX
      ========================= */

      const handleMouseMove = (
        event
      ) => {
        const rect =
          section.getBoundingClientRect();

        if (
          !rect.width ||
          !rect.height
        ) {
          return;
        }

        const mouseX =
          (event.clientX -
            rect.left) /
          rect.width;

        const mouseY =
          (event.clientY -
            rect.top) /
          rect.height;

        const moveX =
          (mouseX - 0.5) * 100;

        const moveY =
          (mouseY - 0.5) * 60;

        gsap.to(glowOne, {
          x: moveX * 0.45,
          y: moveY * 0.35,
          duration: 1.4,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(glowTwo, {
          x: moveX * -0.35,
          y: moveY * -0.3,
          duration: 1.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      section.addEventListener(
        "mousemove",
        handleMouseMove
      );
    }, section);

    return () => {
      const focusCards =
        section.querySelectorAll(
          ".home-about-focus-card"
        );

      focusCards.forEach(
        (card) => {
          if (card._aboutEnter) {
            card.removeEventListener(
              "mouseenter",
              card._aboutEnter
            );
          }

          if (card._aboutLeave) {
            card.removeEventListener(
              "mouseleave",
              card._aboutLeave
            );
          }
        }
      );

      ctx.revert();
    };
  }, [shouldReduceMotion]);

  return (
    <section
      className="home-about"
      id="about-preview"
      ref={sectionRef}
    >
      {/* =========================
          BACKGROUND
      ========================= */}

      <div
        className="
          home-about-background
          home-about-background-one
        "
        ref={glowOneRef}
        aria-hidden="true"
      />

      <div
        className="
          home-about-background
          home-about-background-two
        "
        ref={glowTwoRef}
        aria-hidden="true"
      />

      <div className="home-about-container">

        {/* =========================
            HEADER
        ========================= */}

        <header className="home-about-header">

          <span className="section-eyebrow">
            <Code2
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {aboutText.eyebrow ||
              "About Me"}
          </span>

          <h2 className="section-title">
            {aboutText.heading?.main ||
              "Building digital experiences"}

            {" "}

            <span>
              {aboutText.heading?.accent ||
                " that feel different."}
            </span>
          </h2>

        </header>


        {/* =========================
            MAIN
        ========================= */}

        <div className="home-about-main">

          <div className="home-about-text">

            <div className="home-about-intro">

              <span className="home-about-profession">
                {aboutText.intro
                  ?.profession ||
                  "Frontend Developer"}
              </span>

              {aboutText.intro
                ?.greeting && (
                <h3>
                  {
                    aboutText.intro
                      .greeting
                  }
                </h3>
              )}

            </div>


            <div className="home-about-description">

              {Array.isArray(
                aboutText.paragraphs
              ) &&
                aboutText.paragraphs.map(
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


            <MagneticButton
              href={
                aboutText.link?.href ||
                "/about"
              }
              variant="primary"
              size="md"
            >
              <span>
                {aboutText.link?.text ||
                  "More about me"}
              </span>

              <ArrowRight
                size={17}
                strokeWidth={2}
                aria-hidden="true"
              />
            </MagneticButton>

          </div>


          {/* =========================
              HIGHLIGHT
          ========================= */}

          <motion.div
            className="home-about-highlight"
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.015,
                  }
            }
            transition={{
              duration: 0.3,
            }}
          >

            <div className="home-about-highlight-icon">
              <Sparkles
                size={22}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div>

              <span className="home-about-highlight-label">
                {aboutText.highlight
                  ?.label ||
                  "What I focus on"}
              </span>

              <p>
                {aboutText.highlight
                  ?.text ||
                  "Clean UI · Responsive Design · Interactive Experiences"}
              </p>

            </div>

          </motion.div>

        </div>


        {/* =========================
            FOCUS CARDS
        ========================= */}

        <div className="home-about-focus">

          {focusItems.map(
            (item, index) => {
              const Icon =
                item.icon;

              return (
                <article
                  className="home-about-focus-card"
                  key={index}
                >

                  <div className="home-about-focus-icon">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="home-about-focus-content">

                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>

                  </div>

                </article>
              );
            }
          )}

        </div>


        {/* =========================
            STATS
        ========================= */}

        {Array.isArray(
          aboutText.stats
        ) &&
          aboutText.stats.length >
            0 && (
            <div className="home-about-stats">

              {aboutText.stats.map(
                (
                  stat,
                  index
                ) => (
                  <div
                    className="home-about-stat"
                    key={index}
                  >

                    <strong>
                      {stat.value}
                    </strong>

                    <span>
                      {stat.label}
                    </span>

                  </div>
                )
              )}

            </div>
          )}


        {/* =========================
            EXPLORE MORE
        ========================= */}

        <div className="home-about-bottom">

          <div className="home-about-bottom-icon">
            <Layers3
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>


          <div className="home-about-bottom-content">

            <h3>
              {aboutText.cta?.title ||
                "Explore More"}
            </h3>

            <p>
              {aboutText.cta?.text ||
                "Discover more about my skills, projects and the way I build digital experiences."}
            </p>

          </div>


          <Button
            href={
              aboutText.cta?.href ||
              "/projects"
            }
            variant="secondary"
            size="md"
          >
            <span>
              {aboutText.cta?.button ||
                "Explore More"}
            </span>

            <ArrowRight
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>

        </div>

      </div>
    </section>
  );
}

export default AboutPreview;