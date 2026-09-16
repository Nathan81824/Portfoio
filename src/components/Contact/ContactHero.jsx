import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import contactVideo from "../../assets/videos/contact-avatar.mp4";


function Contact() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [isInView, setIsInView] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });


  /* =========================================================
     SECTION VISIBILITY
  ========================================================= */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);


  /* =========================================================
     VIDEO PLAY / PAUSE
  ========================================================= */

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isInView) {
      video.currentTime = 0;
      video.volume = 1;
      video.muted = false;

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log(
            "Browser blocked autoplay with sound:",
            error
          );

          /*
            Some browsers require user interaction before
            allowing sound. The video will still attempt
            to play normally.
          */

          try {
            video.muted = true;
            await video.play();
          } catch (fallbackError) {
            console.log(
              "Video playback was blocked:",
              fallbackError
            );
          }
        }
      };

      playVideo();
    } else {
      video.pause();
    }
  }, [isInView]);


  /* =========================================================
     FORM HANDLING
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setStatus({
        type: "error",
        message: "Please fill in all fields.",
      });

      return;
    }

    setStatus({
      type: "success",
      message: "Message ready to send.",
    });

    setFormData({
      name: "",
      email: "",
      message: "",
    });

    setTimeout(() => {
      setStatus({
        type: "",
        message: "",
      });
    }, 4000);
  };


  /* =========================================================
     VIDEO ANIMATION
  ========================================================= */

  const videoAnimation = {
    initial: {
      left: "50%",
      width: "min(520px, 44vw)",
    },

    animate: {
      left: isInView ? "75%" : "50%",
      width: isInView
        ? "min(430px, 36vw)"
        : "min(520px, 44vw)",
    },

    transition: {
      left: {
        duration: 1.8,
        delay: isInView ? 2 : 0,
        ease: [0.76, 0, 0.24, 1],
      },

      width: {
        duration: 1.8,
        delay: isInView ? 2 : 0,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };


  /* =========================================================
     CONTENT ANIMATION
  ========================================================= */

  const contentAnimation = {
    initial: {
      opacity: 0,
      x: -100,
    },

    animate: {
      opacity: isInView ? 1 : 0,
      x: isInView ? 0 : -100,
    },

    transition: {
      duration: 1.1,
      delay: isInView ? 3 : 0,
      ease: [0.76, 0, 0.24, 1],
    },
  };


  return (
    <section
      ref={sectionRef}
      className="contact-page"
      id="contact"
    >

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <motion.div
        className="contact-content"
        initial={contentAnimation.initial}
        animate={contentAnimation.animate}
        transition={contentAnimation.transition}
      >

        <div className="contact-heading">

          <div className="contact-eyebrow">
            <span>GET IN TOUCH</span>
          </div>

          <h1>
            Have a project
            <span>in mind?</span>
          </h1>

          <p className="contact-description">
            Whether you're building a website, a web app,
            or something completely new, let's turn your
            idea into something real.
          </p>

        </div>


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <div className="contact-field">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />

          </div>


          <div className="contact-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>


          <div className="contact-field">

            <label htmlFor="message">
              Message
            </label>

            <textarea
              id="message"
              name="message"
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={handleChange}
              rows="5"
            />

          </div>


          <button
            type="submit"
            className="contact-submit"
          >
            <span>Let's talk</span>

            <Send size={17} />

          </button>

        </form>


        {/* ===================================================
            SOCIAL LINKS
        =================================================== */}

        <div className="contact-socials">

          <a
            href="https://github.com/Nathan81824?tab=repositories"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>


          <a
            href="https://www.linkedin.com/in/nathan-moses-b13b143bb/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>

        </div>

      </motion.div>


      {/* =====================================================
          VIDEO
      ===================================================== */}

      <motion.div
        className="contact-visual"
        initial={videoAnimation.initial}
        animate={videoAnimation.animate}
        transition={videoAnimation.transition}
      >

        <div className="contact-video-frame">

          <video
            ref={videoRef}
            className="contact-video"
            src={contactVideo}
            autoPlay
            loop
            playsInline
            preload="auto"
            muted={false}
          />


          {/* VIDEO OVERLAY */}

          <div className="contact-video-overlay" />


          {/* SCANLINE */}

          <div className="contact-scanline" />


          {/* CORNERS */}

          <span className="contact-corner top-left" />
          <span className="contact-corner top-right" />
          <span className="contact-corner bottom-left" />
          <span className="contact-corner bottom-right" />


          {/* STATUS */}

          <div className="contact-video-status">

            <span className="contact-video-status-dot" />

            <span>
              AVAILABLE
            </span>

          </div>


          {/* CAPTION */}

          <div className="contact-video-caption">
            Let's build something meaningful.
          </div>


          {/* FLOATING NODES */}

          <span className="contact-floating-node node-one" />
          <span className="contact-floating-node node-two" />

        </div>

      </motion.div>


      {/* =====================================================
          STATUS POPUP
      ===================================================== */}

      <AnimatePresence>

        {status.message && (

          <motion.div
            className={`contact-status-popup ${status.type}`}
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >

            {status.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}

            <span>
              {status.message}
            </span>

          </motion.div>

        )}

      </AnimatePresence>

    </section>
  );
}

export default Contact;
