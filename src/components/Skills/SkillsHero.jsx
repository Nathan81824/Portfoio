import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Layers3,
  ArrowUpRight,
} from "lucide-react";

import createSkillsScene from "../../javascript/skills/skills";



function Skills() {
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const cleanup =
      createSkillsScene(sceneRef.current);

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

  return (
    <main className="skills-page">
      {/* ========================================
          BACKGROUND
      ======================================== */}

      <section className="skills-hero">

        <div className="skills-background">
          <div className="skills-glow skills-glow-one" />
          <div className="skills-glow skills-glow-two" />
          <div className="skills-grid" />
        </div>

        {/* ======================================
            CONTENT
        ====================================== */}

        <div className="skills-container">

          {/* ====================================
              LEFT SIDE
          ==================================== */}

          <motion.div
            className="skills-content"

            initial={{
              opacity: 0,
              x: -50,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >

            {/* LABEL */}

            <div className="skills-label">
              <span className="skills-label-icon">
                <Code2 size={16} />
              </span>

              <span>
                MY SKILLS
              </span>
            </div>

            {/* TITLE */}

            <h1 className="skills-title">
              Building with
              <span>
                {" "}modern technology.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="skills-description">
              I build responsive, interactive
              and user-focused web experiences
              using modern frontend technologies
              and development tools.
            </p>

            {/* ==================================
                HIGHLIGHTS
            ================================== */}

            <div className="skills-highlights">

              {/* FRONTEND */}

              <div className="skill-highlight">

                <div className="skill-highlight-icon">
                  <Code2 size={20} />
                </div>

                <div>
                  <h3>
                    Frontend Development
                  </h3>

                  <p>
                    React, JavaScript, HTML
                    and CSS
                  </p>
                </div>

              </div>

              {/* TOOLS */}

              <div className="skill-highlight">

                <div className="skill-highlight-icon">
                  <Layers3 size={20} />
                </div>

                <div>
                  <h3>
                    Modern Tools
                  </h3>

                  <p>
                    Tailwind, Zustand, Git
                    and Vite
                  </p>
                </div>

              </div>

              {/* CREATIVE */}

              <div className="skill-highlight">

                <div className="skill-highlight-icon">
                  <Sparkles size={20} />
                </div>

                <div>
                  <h3>
                    Creative Interfaces
                  </h3>

                  <p>
                    Animations, 3D experiences
                    and interactions
                  </p>
                </div>

              </div>

            </div>

            {/* PROJECT LINK */}

            <motion.a
              href="#projects"
              className="skills-project-link"

              whileHover={{
                x: 5,
              }}

              transition={{
                duration: 0.2,
              }}
            >
              <span>
                Explore my projects
              </span>

              <ArrowUpRight size={18} />
            </motion.a>

          </motion.div>

          {/* ====================================
              RIGHT SIDE — THREE.JS
          ==================================== */}

          <motion.div
            className="skills-scene-wrapper"

            initial={{
              opacity: 0,
              scale: 0.85,
              x: 50,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}

            transition={{
              duration: 1,
              delay: 0.2,
              ease: "easeOut",
            }}
          >

            {/* THREE.JS CANVAS */}

            <div
              ref={sceneRef}
              className="skills-three-scene"
            />

            {/* TOP LABEL */}

            <div className="scene-label scene-label-top">
              <span />
              3D SKILLS
            </div>

          </motion.div>

        </div>
      </section>
    </main>
  );
}

export default Skills;