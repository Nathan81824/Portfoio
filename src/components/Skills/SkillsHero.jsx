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
} from "../../javascript/skills/skills.js";

import {
  playClick,
  isSoundEnabled,
  enableSound,
  disableSound,
} from "../../javascript/sounds/sound.js";


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
    useState(
      isSoundEnabled()
    );


  /* =======================================================
     FILTER SKILLS
  ======================================================= */

  const filteredSkills =
    useMemo(() => {

      if (
        !activeCategory ||
        activeCategory === "All"
      ) {

        return visibleSkills;

      }


      return visibleSkills.filter(
        (skill) =>
          skill.category ===
          activeCategory
      );

    }, [
      activeCategory,
    ]);


  /* =======================================================
     PLAY SKILL SOUND
  ======================================================= */

  const playSkillSound = () => {

    if (
      !soundEnabled
    ) {

      return;

    }


    playClick();

  };


  /* =======================================================
     TOGGLE SOUND
  ======================================================= */

  const toggleSound = () => {

    setSoundEnabled(
      (previous) => {

        const next =
          !previous;


        if (next) {

          enableSound();

        } else {

          disableSound();

        }


        return next;

      }
    );

  };


  /* =======================================================
     HANDLE CATEGORY
  ======================================================= */

  const handleCategoryChange =
    (category) => {

      setActiveCategory(
        category
      );

      playSkillSound();

    };


  /* =======================================================
     HANDLE SKILL INTERACTION
  ======================================================= */

  const handleSkillInteraction =
    () => {

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

      <section
        className="skills-section"
      >

        <div
          className="skills-container"
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div
            className="skills-intro"
          >

            {/* =================================================
                EYEBROW
            ================================================= */}

            <span
              className="skills-eyebrow"
            >
              MY SKILLS
            </span>


            {/* =================================================
                HEADING
            ================================================= */}

            <h1
              className="skills-title"
            >

              Technologies I use

              <span
                className="
                  skills-title-accent
                "
              >
                .
              </span>

            </h1>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
              className="
                skills-description
              "
            >
              I build modern, responsive
              and interactive web
              experiences using a
              combination of frontend
              technologies, development
              tools and animation
              libraries.
            </p>


            {/* =================================================
                SKILL COUNT
            ================================================= */}

            <div
              className="skills-count"
            >

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
              className="
                skills-sound-button
              "
              onClick={
                toggleSound
              }
              aria-label={
                soundEnabled
                  ? "Disable skill sounds"
                  : "Enable skill sounds"
              }
              aria-pressed={
                soundEnabled
              }
            >

              {soundEnabled ? (

                <Volume2
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

              ) : (

                <VolumeX
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

              )}

              <span>
                {soundEnabled
                  ? "Sound On"
                  : "Sound Off"}
              </span>

            </button>


            {/* =================================================
                CONTACT CTA
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
                aria-hidden="true"
              />

            </a>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="skills-content"
          >

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
                      activeCategory ===
                      category

                        ? "skills-filter active"

                        : "skills-filter"
                    }
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                    aria-pressed={
                      activeCategory ===
                      category
                    }
                  >

                    {category}

                  </button>

                )
              )}

            </div>


            {/* =================================================
                SKILL GRID
            ================================================= */}

            <div
              className="skills-grid"
            >

              {filteredSkills.map(
                (
                  skill,
                  index
                ) => (

                  <article
                    key={
                      skill.id ||
                      `${skill.name}-${index}`
                    }

                    className="skill-card"

                    style={{
                      "--skill-index":
                        index,

                      "--skill-color":
                        skill.color ||
                        "var(--accent-primary)",
                    }}

                    onMouseEnter={
                      handleSkillInteraction
                    }
                  >

                    {/* =========================================
                        CARD TOP
                    ========================================= */}

                    <div
                      className="
                        skill-card-top
                      "
                    >

                      {/* Skill icon */}

                      <div
                        className="skill-icon"

                        style={{
                          color:
                            skill.color ||
                            "var(--accent-primary)",
                        }}

                        aria-hidden="true"
                      >

                        <span>
                          {(
                            skill.label ||
                            skill.name ||
                            "S"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                      </div>


                      {/* Skill level */}

                      <span
                        className="skill-level"
                      >
                        {skill.level}
                      </span>

                    </div>


                    {/* =========================================
                        CARD CONTENT
                    ========================================= */}

                    <div
                      className="
                        skill-card-content
                      "
                    >

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

                    <div
                      className="skill-progress"
                    >

                      <div
                        className="
                          skill-progress-header
                        "
                      >

                        <span>
                          Proficiency
                        </span>

                        <span>
                          {skill.percentage}%
                        </span>

                      </div>


                      <div
                        className="
                          skill-progress-track
                        "
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={
                          skill.percentage
                        }
                        aria-label={
                          `${skill.name} proficiency ${skill.percentage}%`
                        }
                      >

                        <span
                          className="
                            skill-progress-bar
                          "

                          style={{
                            width:
                              `${skill.percentage}%`,

                            background:
                              skill.color ||
                              "var(--accent-primary)",
                          }}
                        />

                      </div>

                    </div>


                    {/* =========================================
                        CARD FOOTER
                    ========================================= */}

                    <div
                      className="
                        skill-card-footer
                      "
                    >

                      <span>
                        {skill.category}
                      </span>


                      {skill.officialUrl && (

                        <a
                          href={
                            skill.officialUrl
                          }

                          target="_blank"

                          rel="
                            noopener noreferrer
                          "

                          className="
                            skill-official-link
                          "

                          aria-label={
                            `Learn more about ${skill.name}`
                          }

                          onClick={(event) => {

                            event.stopPropagation();

                          }}
                        >

                          <ExternalLink
                            size={15}
                            strokeWidth={1.8}
                            aria-hidden="true"
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

              <div
                className="skills-empty"
              >

                <p>
                  No skills found in this
                  category.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>

  );

}
