/* =========================================================
   ABOUT HERO
   Nathan — Frontend Developer Portfolio

   Location:
   src/components/About/AboutHero/AboutHero.jsx

   Uses:
   - Central website data
   - Central site text
   - Central media
   - Framer Motion
   - Lucide React
   - Reusable Button
   - Cinematic hero video
   - Scroll parallax
========================================================= */

import {
  useEffect,
  useState,
  useRef,
} from "react";


/* =========================================================
   ICONS
========================================================= */

import {
  ArrowRight,
  Mail,
  MapPin,
  Play,
  Sparkles,
} from "lucide-react";


/* =========================================================
   FRAMER MOTION
========================================================= */

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";


/* =========================================================
   CENTRAL SYSTEMS
========================================================= */

import {
  getData,
  media,
  siteText,
} from "../../javascript/index.js";


/* =========================================================
   BUTTON
========================================================= */

import Button from "../Shared/Button/Button.jsx";





/* =========================================================
   ABOUT HERO
========================================================= */

export default function AboutHero() {


  /* =======================================================
     REDUCED MOTION
  ======================================================= */

  const shouldReduceMotion =
    useReducedMotion();


  /* =======================================================
     HERO REF
  ======================================================= */

  const heroRef =
    useRef(null);


  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  const {
    scrollYProgress,
  } = useScroll({

    target: heroRef,

    offset: [
      "start start",
      "end start",
    ],

  });


  /* =======================================================
     VIDEO PARALLAX
  ======================================================= */

  const videoY =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldReduceMotion
        ? ["0%", "0%"]
        : ["0%", "12%"]
    );


  const videoScale =
    useTransform(
      scrollYProgress,
      [0, 1],
      shouldReduceMotion
        ? [1, 1]
        : [1, 1.08]
    );


  /* =======================================================
     WEBSITE DATA
  ======================================================= */

  const data =
    getData();


  const personalInfo =
    data?.personalInfo || {};


  const roles =
    Array.isArray(data?.roles)
      ? data.roles
      : [];


  /* =======================================================
     SITE TEXT
  ======================================================= */

  const text =
    siteText.about.hero;


  /* =======================================================
     PERSONAL INFORMATION
  ======================================================= */

  const displayName =
    personalInfo.displayName ||
    personalInfo.name ||
    "Nathan";


  const location =
    personalInfo.location ||
    "";


  const email =
    personalInfo.email ||
    "";


  const bio =
    personalInfo.bio ||
    text.description;


  /* =======================================================
     ROLE LIST
  ======================================================= */

  const availableRoles =
    roles.length > 0

      ? roles

      : [
          personalInfo.role ||
          "Frontend Developer",
        ];


  /* =======================================================
     ROLE STATE
  ======================================================= */

  const [
    roleIndex,
    setRoleIndex,
  ] = useState(0);


  /* =======================================================
     VIDEO STATE
  ======================================================= */

  const [
    videoError,
    setVideoError,
  ] = useState(false);


  /* =======================================================
     VIDEO PLAY STATE
  ======================================================= */

  const [
    isVideoPlaying,
    setIsVideoPlaying,
  ] = useState(true);


  /* =======================================================
     ROLE ROTATION
  ======================================================= */

  useEffect(() => {

    if (
      shouldReduceMotion ||
      availableRoles.length <= 1
    ) {
      return;
    }


    const interval =
      window.setInterval(
        () => {

          setRoleIndex(
            (previousIndex) =>
              (
                previousIndex + 1
              ) %
              availableRoles.length
          );

        },
        3000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, [
    availableRoles.length,
    shouldReduceMotion,
  ]);


  /* =======================================================
     CURRENT ROLE
  ======================================================= */

  const currentRole =
    availableRoles[
      roleIndex %
      availableRoles.length
    ] ||
    "Frontend Developer";


  /* =======================================================
     VIDEO ERROR
  ======================================================= */

  const handleVideoError = () => {

    setVideoError(true);
    setIsVideoPlaying(false);

  };


  /* =======================================================
     VIDEO PLAY / PAUSE
  ======================================================= */

  const toggleVideo = () => {

    const video =
      heroRef.current?.querySelector(
        ".about-hero-video"
      );


    if (!video) {
      return;
    }


    if (video.paused) {

      video
        .play()
        .then(() => {

          setIsVideoPlaying(true);

        })
        .catch(() => {

          setIsVideoPlaying(false);

        });

    } else {

      video.pause();

      setIsVideoPlaying(false);

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      ref={heroRef}
      className="about-hero"
      id="about"
    >


      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="about-hero-background"
        aria-hidden="true"
      >

        <div
          className="
            about-hero-glow
            about-hero-glow-one
          "
        />

        <div
          className="
            about-hero-glow
            about-hero-glow-two
          "
        />

      </div>


      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <div className="about-hero-container">


        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <motion.div

          className="about-hero-content"

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -45,
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
            amount: 0.2,
          }}

          transition={{
            duration: 0.85,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >


          {/* ===============================================
              EYEBROW
          =============================================== */}

          <motion.div

            className="
              about-hero-eyebrow
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
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
              duration: 0.6,
            }}
          >

            <Sparkles
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {text.eyebrow.text}
            </span>

          </motion.div>


          {/* ===============================================
              HEADING
          =============================================== */}

          <motion.h1

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
              delay: 0.1,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >

            {text.heading.greeting}{" "}

            <span
              className="about-hero-name"
            >

              {displayName}

            </span>

          </motion.h1>


          {/* ===============================================
              SUBTITLE
          =============================================== */}

          <motion.h2

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
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
              delay: 0.2,
              ease: "easeOut",
            }}
          >

            {text.heading.subtitle}

          </motion.h2>


          {/* ===============================================
              DESCRIPTION
          =============================================== */}

          <motion.p

            className="
              about-hero-description
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
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
              duration: 0.7,
              delay: 0.3,
            }}
          >

            {bio}

          </motion.p>


          {/* ===============================================
              META INFORMATION
          =============================================== */}

          <motion.div

            className="
              about-hero-meta
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
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
              duration: 0.6,
              delay: 0.4,
            }}
          >

            {location && (

              <span>

                <MapPin
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {location}

              </span>

            )}


            {email && (

              <a
                href={`mailto:${email}`}
              >

                <Mail
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {email}

              </a>

            )}

          </motion.div>


          {/* ===============================================
              ACTIONS
          =============================================== */}

          <motion.div

            className="
              about-hero-actions
            "

            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
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
              duration: 0.7,
              delay: 0.5,
            }}
          >

            <Button
              href={text.actions.skills.link}
              variant="primary"
              size="lg"
              icon={ArrowRight}
            >

              {text.actions.skills.text}

            </Button>


            <Button
              href={text.actions.contact.link}
              variant="secondary"
              size="lg"
              icon={Mail}
            >

              {text.actions.contact.text}

            </Button>

          </motion.div>

        </motion.div>


        {/* =================================================
            RIGHT VISUAL
        ================================================= */}

        <motion.div

          className="
            about-hero-visual
          "

          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 45,
                  scale: 0.94,
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
            delay: 0.15,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
        >

          <div
            className="
              about-hero-card
            "
          >


            {/* =============================================
                VIDEO AREA
            ============================================= */}

            <div
              className="
                about-hero-image-wrapper
              "
            >

              {!videoError ? (

                <motion.video

                  src={
                    media.videos.myImageVideo
                  }

                  poster={
                    media.images.myImage
                  }

                  className="
                    about-hero-image
                    about-hero-video
                  "

                  style={{
                    y: videoY,
                    scale: videoScale,
                  }}

                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"

                  aria-label={
                    text.media.videoLabel
                  }

                  onError={
                    handleVideoError
                  }

                />

              ) : (

                <img
                  src={
                    media.images.myImage
                  }

                  alt={
                    text.media.imageAlt
                  }

                  className="
                    about-hero-image
                  "
                />

              )}


              {/* ===========================================
                  VIDEO OVERLAY
              =========================================== */}

              <div
                className="
                  about-hero-video-overlay
                "
                aria-hidden="true"
              />


              {/* ===========================================
                  VIDEO CONTROL
              =========================================== */}

              {!videoError && (

                <button

                  type="button"

                  className="
                    about-hero-video-control
                  "

                  onClick={
                    toggleVideo
                  }

                  aria-label={
                    isVideoPlaying
                      ? "Pause background video"
                      : "Play background video"
                  }
                >

                  {isVideoPlaying ? (

                    <span
                      className="
                        about-hero-video-pause
                      "
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                    </span>

                  ) : (

                    <Play
                      size={15}
                      fill="currentColor"
                      aria-hidden="true"
                    />

                  )}

                </button>

              )}


              {/* ===========================================
                  ROLE STATUS
              =========================================== */}

              <div
                className="
                  about-hero-role
                "
                aria-live="polite"
              >

                <span
                  className="
                    about-hero-role-glow
                    animate-status
                  "
                  aria-hidden="true"
                />


                <AnimatePresence
                  mode="wait"
                  initial={false}
                >

                  <motion.span

                    key={currentRole}

                    className="
                      about-hero-role-text
                    "

                    initial={
                      shouldReduceMotion
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {
                            opacity: 0,
                            y: 8,
                          }
                    }

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    exit={
                      shouldReduceMotion
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {
                            opacity: 0,
                            y: -8,
                          }
                    }

                    transition={{
                      duration: 0.35,
                    }}
                  >

                    {currentRole}

                  </motion.span>

                </AnimatePresence>

              </div>

            </div>


            {/* =============================================
                CARD CONTENT
            ============================================= */}

            <div
              className="
                about-hero-card-content
              "
            >

              <span>
                {text.meta.currently}
              </span>

              <strong>
                {currentRole}
              </strong>

              <p>
                {text.meta.building}
              </p>

            </div>

          </div>

        </motion.div>

      </div>


      {/* ===================================================
          BOTTOM SCROLL INDICATOR
      =================================================== */}

      <motion.div

        className="
          about-hero-scroll-indicator
        "

        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
              }
        }

        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: 1,
              }
        }

        transition={{
          delay: 1.2,
          duration: 0.8,
        }}

        aria-hidden="true"
      >

        <span />

        <span />

        <span />

      </motion.div>

    </section>

  );

}