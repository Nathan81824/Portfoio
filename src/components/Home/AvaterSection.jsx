import { useEffect, useRef } from "react";

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

import avatarVideo from "../../assets/videos/avater-viedio.mp4";

function AvatarSection() {
const videoRef = useRef(null);
const soundEnabled = useRef(false);
const shouldReduceMotion = useReducedMotion();

useEffect(() => {
const enableSoundAfterScroll = () => {
const video = videoRef.current;


  if (!video || soundEnabled.current) {
    return;
  }

  soundEnabled.current = true;

  video.muted = false;
  video.volume = 1;

  video.play().catch(() => {
    soundEnabled.current = false;
  });

  window.removeEventListener("scroll", enableSoundAfterScroll);
  window.removeEventListener("wheel", enableSoundAfterScroll);
  window.removeEventListener("touchmove", enableSoundAfterScroll);
};

window.addEventListener("scroll", enableSoundAfterScroll, {
  passive: true,
});

window.addEventListener("wheel", enableSoundAfterScroll, {
  passive: true,
});

window.addEventListener("touchmove", enableSoundAfterScroll, {
  passive: true,
});

return () => {
  window.removeEventListener("scroll", enableSoundAfterScroll);
  window.removeEventListener("wheel", enableSoundAfterScroll);
  window.removeEventListener("touchmove", enableSoundAfterScroll);
};


}, []);

const containerVariants = {
hidden: {
opacity: 0,
y: 40,
},


visible: {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.8,
    ease: "easeOut",
    staggerChildren: 0.12,
  },
},


};

const itemVariants = {
hidden: {
opacity: 0,
y: 25,
},


visible: {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
},


};

const floatingAnimation = shouldReduceMotion
? {}
: {
y: [0, -10, 0],
transition: {
duration: 4,
repeat: Infinity,
ease: "easeInOut",
},
};

return ( <section className="avatar-section" id="avatar">
<motion.div
className="avatar-container"
variants={containerVariants}
initial="hidden"
whileInView="visible"
viewport={{
once: true,
amount: 0.2,
}}
>


    <motion.div
      className="avatar-content"
      variants={itemVariants}
    >

      <motion.div
        className="avatar-badge"
        variants={itemVariants}
      >
        <Sparkles size={16} />
        <span>Frontend Developer</span>
      </motion.div>


      <motion.h2
        className="avatar-title"
        variants={itemVariants}
      >
        Building modern
        <span> digital experiences.</span>
      </motion.h2>


      <motion.p
        className="avatar-subtitle"
        variants={itemVariants}
      >
        Hi, I'm Nathan — a frontend developer focused on
        creating clean, responsive, and interactive web
        experiences with modern technologies.
      </motion.p>


      <motion.div
        className="avatar-skills"
        variants={itemVariants}
      >

        <div className="avatar-skill">
          <Code2 size={18} />
          <span>Clean Code</span>
        </div>

        <div className="avatar-skill">
          <Zap size={18} />
          <span>Fast Performance</span>
        </div>

        <div className="avatar-skill">
          <Sparkles size={18} />
          <span>Modern UI</span>
        </div>

      </motion.div>


      <motion.div
        className="avatar-socials"
        variants={itemVariants}
      >

        <motion.a
          href="https://github.com/Nathan81824?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          whileHover={{
            scale: 1.1,
            y: -3,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <FaGithub />
        </motion.a>


        <motion.a
          href="https://www.linkedin.com/in/nathan-moses-b13b143bb/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          whileHover={{
            scale: 1.1,
            y: -3,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <FaLinkedin />
        </motion.a>

      </motion.div>

    </motion.div>


    <motion.div
      className="avatar-visual"
      variants={itemVariants}
      animate={floatingAnimation}
    >

      <div className="avatar-glow avatar-glow-one" />

      <div className="avatar-glow avatar-glow-two" />


      <motion.div
        className="avatar-video-wrapper"
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                scale: 1.02,
              }
        }
        transition={{
          duration: 0.3,
        }}
      >

        <video
          ref={videoRef}
          src={avatarVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />

      </motion.div>


      <AnimatePresence>

        <motion.div
          className="avatar-floating-badge avatar-floating-badge-one"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -8, 0],
                  transition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        >
          <Code2 size={18} />
          <span>React</span>
        </motion.div>


        <motion.div
          className="avatar-floating-badge avatar-floating-badge-two"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, 8, 0],
                  transition: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        >
          <Zap size={18} />
          <span>JavaScript</span>
        </motion.div>

      </AnimatePresence>

    </motion.div>

  </motion.div>
</section>


);
}

export default AvatarSection;
