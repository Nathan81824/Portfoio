import { useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  visibleSkills,
  skillCategories,
} from "../../javascript/data/skills/skills";




/* =========================================================
   SKILLS PAGE
========================================================= */

export default function Skills() {

  /* =======================================================
     STATE
  ======================================================= */

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [soundEnabled, setSoundEnabled] =
    useState(true);


  /* =======================================================
     FILTER SKILLS
     Automatically updates from skills.js
  ======================================================= */

  const filteredSkills = useMemo(() => {

    if (
      !activeCategory ||
      activeCategory === "All"
    ) {
      return visibleSkills;
    }

    return visibleSkills.filter(
      (skill) =>
        skill.category === activeCategory
    );

  }, [activeCategory]);


  /* =======================================================
     SKILL SOUND
  ======================================================= */

  const playSkillSound = () => {

    if (!soundEnabled) {
      return;
    }

    try {

      const audio =
        new Audio("/sounds/click.mp3");

      audio.volume = 0.25;

      audio.currentTime = 0;

      audio.play().catch(() => {});

    } catch {
      // Sound is optional.
    }

  };


  /* =======================================================
     HANDLE SKILL CLICK
  ======================================================= */

  const handleSkillClick = () => {

    playSkillSound();

  };


  /* =======================================================
     RETURN
  ======================================================= */

  return (

    <main
      className="skills-page"
      id="skills"
    >

      {/* ===================================================
          HERO / INTRO
      =================================================== */}

      <section className="skills-section">

        <div className="skills-container">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="skills-intro">

            {/* Eyebrow */}

            <span className="skills-eyebrow">
              MY SKILLS
            </span>


            {/* Heading */}

            <h1 className="skills-title">

              Technologies I use
              <span className="skills-title-accent">
                .
              </span>

            </h1>


            {/* Description */}

            <p className="skills-description">

              I build modern, responsive and
              interactive web experiences using
              a combination of frontend
              technologies, development tools
              and animation libraries.

            </p>


            {/* Skill count */}

            <div className="skills-count">

              <strong>
                {visibleSkills.length}
              </strong>

              <span>
                technologies & tools
              </span>

            </div>


            {/* =================================================
                SOUND BUTTON
            ================================================= */}

            <button
              type="button"
              className="skills-sound-button"
              onClick={() =>
                setSoundEnabled(
                  (previous) => !previous
                )
              }
              aria-label={
                soundEnabled
                  ? "Disable skill sounds"
                  : "Enable skill sounds"
              }
            >

              {soundEnabled ? (
                <Volume2
                  size={17}
                  strokeWidth={1.8}
                />
              ) : (
                <VolumeX
                  size={17}
                  strokeWidth={1.8}
                />
              )}

              <span>
                {soundEnabled
                  ? "Sound On"
                  : "Sound Off"}
              </span>

            </button>


            {/* =================================================
                CONTACT / CTA
            ================================================= */}

            <a
              href="#contact"
              className="skills-cta"
            >

              <span>
                Let's work together
              </span>

              <ArrowRight
                size={17}
                strokeWidth={1.8}
              />

            </a>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="skills-content">


            {/* =================================================
                CATEGORY FILTERS
            ================================================= */}

            <div
              className="skills-filters"
              aria-label="Skill categories"
            >

              {skillCategories.map(
                (category) => (

                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory === category
                        ? "skills-filter active"
                        : "skills-filter"
                    }
                    onClick={() => {

                      setActiveCategory(
                        category
                      );

                      playSkillSound();

                    }}
                  >

                    {category}

                  </button>

                )
              )}

            </div>


            {/* =================================================
                SKILL GRID
            ================================================= */}

            <div className="skills-grid">

              {filteredSkills.map(
                (skill, index) => (

                  <article
                    key={skill.id}
                    className="skill-card"
                    style={{
                      "--skill-index": index,
                      "--skill-color":
                        skill.color,
                    }}
                    onMouseEnter={
                      handleSkillClick
                    }
                  >

                    {/* =========================================
                        CARD TOP
                    ========================================= */}

                    <div className="skill-card-top">


                      {/* Skill icon */}

                      <div
                        className="skill-icon"
                        style={{
                          color:
                            skill.color,
                        }}
                      >

                        {skill.icon ? (
                          <span>
                            {skill.label
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </span>
                        ) : (
                          <span>
                            {skill.label
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </span>
                        )}

                      </div>


                      {/* Skill level */}

                      <span className="skill-level">
                        {skill.level}
                      </span>

                    </div>


                    {/* =========================================
                        CARD CONTENT
                    ========================================= */}

                    <div className="skill-card-content">

                      <h2>
                        {skill.name}
                      </h2>

                      <p>
                        {skill.description}
                      </p>

                    </div>


                    {/* =========================================
                        PROGRESS
                    ========================================= */}

                    <div className="skill-progress">

                      <div className="skill-progress-header">

                        <span>
                          Proficiency
                        </span>

                        <span>
                          {skill.percentage}%
                        </span>

                      </div>


                      <div
                        className="skill-progress-track"
                        aria-label={`${skill.name} proficiency ${skill.percentage}%`}
                      >

                        <span
                          className="skill-progress-bar"
                          style={{
                            width:
                              `${skill.percentage}%`,
                            background:
                              skill.color,
                          }}
                        />

                      </div>

                    </div>


                    {/* =========================================
                        CARD FOOTER
                    ========================================= */}

                    <div className="skill-card-footer">

                      <span>
                        {skill.category}
                      </span>


                      {skill.officialUrl && (

                        <a
                          href={
                            skill.officialUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="skill-official-link"
                          aria-label={`Learn more about ${skill.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >

                          <ExternalLink
                            size={15}
                            strokeWidth={1.8}
                          />

                        </a>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {filteredSkills.length === 0 && (

              <div className="skills-empty">

                <p>
                  No skills found in this category.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  );
}
