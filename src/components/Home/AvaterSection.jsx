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
useRef,
useState,
} from "react";

import avatarVideo from "../../assets/videos/avatar-viedio.mp4";

function AvatarSection() {
const sectionRef = useRef(null);
const videoRef = useRef(null);

const [soundEnabled, setSoundEnabled] = useState(false);

const shouldReduceMotion = useReducedMotion();

useEffect(() => {
const section = sectionRef.current;
const video = videoRef.current;


if (!section || !video) return;

let isInsideSection = false;

const stopVideo = () => {
  isInsideSection = false;

  video.pause();
  video.currentTime = 0;
  video.muted = true;

  setSoundEnabled(false);
};

const startVideo = async () => {
  isInsideSection = true;

  video.currentTime = 0;
  video.muted = false;

  try {
    await video.play();

    if (isInsideSection) {
      setSoundEnabled(true);
    }
  } catch (error) {
    video.muted = true;
    setSoundEnabled(false);

    try {
      await video.play();
    } catch (playError) {
      console.error(
        "Avatar video could not play:",
        playError
      );
    }
  }
};

const observer = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      startVideo();
    } else {
      stopVideo();
    }
  },
  {
    threshold: 0.6,
  }
);

observer.observe(section);

stopVideo();

return () => {
  observer.disconnect();
  stopVideo();
};


}, []);

return ( <section
   ref={sectionRef}
   className="avatar-section"
   id="avatar"
 >
<motion.div
className="avatar-container"
initial={
shouldReduceMotion
? false
: {
opacity: 0,
y: 40,
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
amount: 0.2,
}}
transition={{
duration: 0.8,
ease: "easeOut",
}}
>


    {/* =========================
        VIDEO
    ========================= */}

    <motion.div
      className="avatar-visual"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: -50,
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
        duration: 0.9,
        ease: "easeOut",
      }}
    >
      <div className="avatar-glow avatar-glow-one" />

      <div className="avatar-glow avatar-glow-two" />

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
          ref={videoRef}
          src={avatarVideo}
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          muted
        />
      </motion.div>

      <AnimatePresence>
        <motion.div
          className="avatar-floating-badge avatar-floating-badge-one"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -20,
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
            delay: 0.5,
            duration: 0.5,
          }}
        >
          <Code2 size={17} />
          <span>React</span>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          className="avatar-floating-badge avatar-floating-badge-two"
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 20,
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
            delay: 0.7,
            duration: 0.5,
          }}
        >
          <Zap size={17} />
          <span>JavaScript</span>
        </motion.div>
      </AnimatePresence>

    </motion.div>

    {/* =========================
        TEXT
    ========================= */}

    <motion.div
      className="avatar-content"
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 50,
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
        duration: 0.9,
        delay: 0.15,
        ease: "easeOut",
      }}
    >
      <div className="avatar-badge">
        <Sparkles size={16} />
        <span>Frontend Developer</span>
      </div>

      <h2 className="avatar-title">
        Building modern
        <span>digital experiences.</span>
      </h2>

      <p className="avatar-subtitle">
        Hi, I'm Nathan — a frontend developer focused on
        creating clean, responsive, and interactive web
        experiences with modern technologies.
      </p>

      <div className="avatar-skills">
        <div className="avatar-skill">
          <Code2 size={17} />
          <span>Clean Code</span>
        </div>

        <div className="avatar-skill">
          <Zap size={17} />
          <span>Fast Performance</span>
        </div>

        <div className="avatar-skill">
          <Sparkles size={17} />
          <span>Modern UI</span>
        </div>
      </div>

      <div className="avatar-socials">
        <a
          href="https://github.com/Nathan81824?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nathan's GitHub"
        >
          <FaGithub />
        </a>

        <a
          href="https://www.linkedin.com/in/nathan-moses-b13b143bb/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nathan's LinkedIn"
        >
          <FaLinkedin />
        </a>
      </div>

      <div
        className="avatar-sound-status"
        aria-live="polite"
      >
        <span
          className={
            soundEnabled
              ? "avatar-sound-dot active"
              : "avatar-sound-dot"
          }
        />

        <span>
          {soundEnabled
            ? "Sound playing"
            : "Video ready"}
        </span>
      </div>
    </motion.div>

  </motion.div>
</section>


);
}

export default AvatarSection;
