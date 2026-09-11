import {
  Code2,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";


import avatarVideo from "../../assets/videos/avater-viedio.mp4";


function AvatarBadge({
  icon: Icon,
  label,
  className = "",
  initial,
  delay = 0,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`avatar-badge ${className}`.trim()}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              ...initial,
            }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }
      }
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        scale: 1.04,
      }}
    >
      <span className="avatar-badge-icon">
        <Icon
          size={15}
          strokeWidth={1.8}
        />
      </span>

      <span>{label}</span>
    </motion.div>
  );
}


function AvatarSection() {
  const shouldReduceMotion = useReducedMotion();

  const subtitles = [
    "WE HAVE A SITUATION.",
    "IT'S TIME TO ACT.",
  ];

  const [subtitleIndex, setSubtitleIndex] = useState(0);


  /* =====================================================
     SUBTITLE LOOP
     Starts immediately with the first subtitle.
     Changes every 3 seconds.
  ===================================================== */

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setSubtitleIndex(
        (currentIndex) =>
          (currentIndex + 1) % subtitles.length
      );
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [shouldReduceMotion, subtitles.length]);


  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  useEffect(() => {
    if (shouldReduceMotion) {
      setSubtitleIndex(0);
    }
  }, [shouldReduceMotion]);


  return (
    <section
      className="avatar-section"
      id="avatar"
    >

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="avatar-background avatar-background-one"
        aria-hidden="true"
      />

      <div
        className="avatar-background avatar-background-two"
        aria-hidden="true"
      />

      <div
        className="avatar-grid"
        aria-hidden="true"
      />


      {/* =================================================
          CONTAINER
      ================================================= */}

      <div className="avatar-container">


        {/* =================================================
            VIDEO / AVATAR
        ================================================= */}

        <motion.div
          className="avatar-visual"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -120,
                  scale: 0.92,
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
            amount: 0.25,
          }}

          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <div
            className="avatar-glow"
            aria-hidden="true"
          />


          {/* =================================================
              ORBIT
          ================================================= */}

          <motion.div
            className="avatar-orbit"

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }

            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}

            aria-hidden="true"
          >
            <span className="avatar-orbit-dot" />
          </motion.div>


          {/* =================================================
              VIDEO
          ================================================= */}

          <motion.div
            className="avatar-video-wrapper"

            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }

            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >

            <video
              className="avatar-video"
              src={avatarVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />


            {/* =================================================
                SUBTITLE
            ================================================= */}

            <div
              className="avatar-subtitle-overlay"
              aria-live="polite"
            >

              <AnimatePresence
                mode="wait"
                initial={false}
              >

                <motion.div
                  key={subtitles[subtitleIndex]}
                  className="avatar-subtitle-text"

                  initial={
                    shouldReduceMotion
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                          y: 25,
                          scale: 0.94,
                          filter: "blur(8px)",
                        }
                  }

                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}

                  exit={
                    shouldReduceMotion
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                          y: -20,
                          scale: 1.03,
                          filter: "blur(6px)",
                        }
                  }

                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {subtitles[subtitleIndex]}
                </motion.div>

              </AnimatePresence>

            </div>


            {/* =================================================
                SUBTITLE PROGRESS
            ================================================= */}

            {!shouldReduceMotion && (
              <div
                className="avatar-subtitle-progress"
                aria-hidden="true"
              >

                <motion.span
                  key={subtitleIndex}

                  initial={{
                    width: "0%",
                  }}

                  animate={{
                    width: "100%",
                  }}

                  transition={{
                    duration: 3,
                    ease: "linear",
                  }}
                />

              </div>
            )}

          </motion.div>


          {/* =================================================
              BADGES
          ================================================= */}

          <AvatarBadge
            icon={Code2}
            label="React"
            className="avatar-badge-react"
            initial={{
              y: -45,
              scale: 0.85,
            }}
            delay={0.25}
          />

          <AvatarBadge
            icon={Sparkles}
            label="Creative"
            className="avatar-badge-creative"
            initial={{
              x: -60,
              scale: 0.85,
            }}
            delay={0.4}
          />

          <AvatarBadge
            icon={Zap}
            label="Interactive"
            className="avatar-badge-interactive"
            initial={{
              x: 60,
              scale: 0.85,
            }}
            delay={0.55}
          />

        </motion.div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <motion.div
          className="avatar-content"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 120,
                }
          }

          whileInView={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                }
          }

          viewport={{
            once: true,
            amount: 0.25,
          }}

          transition={{
            duration: 1.15,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >


          {/* =================================================
              EYEBROW
          ================================================= */}

          <motion.span
            className="section-eyebrow avatar-eyebrow"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: -35,
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
            }}

            transition={{
              duration: 0.75,
              delay: 0.25,
            }}
          >

            <Code2
              size={16}
              strokeWidth={1.8}
            />

            THE DEVELOPER BEHIND THE CODE

          </motion.span>


          {/* =================================================
              TITLE
          ================================================= */}

          <motion.h2
            className="avatar-title"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -70,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            Meet{" "}

            <span>
              Nathan.
            </span>

          </motion.h2>


          {/* =================================================
              PROFESSION
          ================================================= */}

          <motion.h3
            className="avatar-subtitle"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 70,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            Frontend Developer

          </motion.h3>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <motion.p
            className="avatar-description"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: -60,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.9,
              delay: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            I enjoy turning ideas into modern,
            responsive and interactive digital
            experiences that feel as good as they look.

          </motion.p>


          <motion.p
            className="avatar-description"

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    x: 60,
                  }
            }

            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.9,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            I focus on clean interfaces,
            meaningful interactions and frontend
            experiences that are built to perform.

          </motion.p>


          {/* =================================================
              STATUS
          ================================================= */}

          <motion.div
            className="avatar-status"

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
            }}

            transition={{
              duration: 0.75,
              delay: 0.95,
            }}
          >

            <span
              className="avatar-status-dot"
              aria-hidden="true"
            />

            <span>
              Available for opportunities
            </span>

          </motion.div>


          {/* =================================================
              SOCIALS
          ================================================= */}

          <motion.div
            className="avatar-socials"

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
            }}

            transition={{
              duration: 0.8,
              delay: 1.05,
            }}
          >

            <a
              href="https://github.com/Nathan81824?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nathan's GitHub"
              className="avatar-social"
            >

              <FaGithub size={18} />

              <span>
                GitHub
              </span>

            </a>


            <a
              href="https://www.linkedin.com/in/nathan-moses-b13b143bb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nathan's LinkedIn"
              className="avatar-social"
            >

              <FaLinkedin size={18} />

              <span>
                LinkedIn
              </span>

            </a>

          </motion.div>

        </motion.div>

      </div>


      {/* =================================================
          BOTTOM MESSAGE
      ================================================= */}

      <motion.div
        className="avatar-bottom"

        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 70,
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
          amount: 0.3,
        }}

        transition={{
          duration: 1,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      >

        <span>
          <Sparkles
            size={17}
            strokeWidth={1.8}
          />
        </span>

        <p>
          Building digital experiences with{" "}
          <strong>
            creativity, code and intention.
          </strong>
        </p>

      </motion.div>

    </section>
  );
}

export default AvatarSection;