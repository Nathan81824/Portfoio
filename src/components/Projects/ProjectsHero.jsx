import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  projects as fallbackProjects,
} from "../../javascript/projects/projects";


/* =========================================================
   GITHUB API
========================================================= */

const GITHUB_API =
  "https://api.github.com/users/Nathan81824/repos";


/* =========================================================
   SCREENSHOT SERVICE
========================================================= */

const getScreenshotUrl = (url) => {

  if (!url) {
    return "";
  }

  return (
    "https://image.thum.io/get/" +
    "width/1600/" +
    "crop/900/" +
    url
  );

};


/* =========================================================
   PROJECTS HERO
========================================================= */

export default function ProjectsHero() {

  /* =======================================================
     STATE
  ======================================================= */

  const [projects, setProjects] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);


  /* =======================================================
     FETCH PROJECTS
  ======================================================= */

  useEffect(() => {

    let cancelled = false;


    async function fetchProjects() {

      try {

        setLoading(true);


        const response =
          await fetch(
            `${GITHUB_API}?per_page=100&sort=updated`
          );


        /* =================================================
           GITHUB 403 / ERROR
        ================================================= */

        if (!response.ok) {

          throw new Error(
            `GitHub returned ${response.status}`
          );

        }


        const repositories =
          await response.json();


        /* =================================================
           ONLY REPOSITORIES WITH GITHUB PAGES
        ================================================= */

        const githubProjects =
          repositories

            .filter(
              (repo) =>
                !repo.fork &&
                repo.has_pages
            )

            .map(
              (repo) => {

                const liveUrl =
                  repo.homepage ||
                  `https://${repo.owner.login}.github.io/${repo.name}/`;


                return {

                  id:
                    `github-${repo.id}`,

                  name:
                    repo.name,

                  title:
                    repo.name,

                  description:
                    repo.description ||
                    "A modern web project.",

                  language:
                    repo.language ||
                    "Web",

                  technologies:
                    repo.language
                      ? [repo.language]
                      : [],

                  github:
                    repo.html_url,

                  githubUrl:
                    repo.html_url,

                  liveUrl:
                    liveUrl,

                  homepage:
                    liveUrl,

                  demo:
                    liveUrl,

                  source:
                    "github",

                  platform:
                    "GitHub Pages",

                  previewType:
                    "screenshot",

                };

              }
            );


        /* =================================================
           USE GITHUB DATA
        ================================================= */

        if (
          githubProjects.length > 0
        ) {

          if (!cancelled) {

            setProjects(
              githubProjects
            );

            setCurrentIndex(0);

          }

          return;

        }


        /* =================================================
           FALLBACK
        ================================================= */

        if (!cancelled) {

          setProjects(
            Array.isArray(
              fallbackProjects
            )
              ? fallbackProjects
              : []
          );

          setCurrentIndex(0);

        }

      } catch (error) {

        /*
          GitHub API can return 403 because of
          rate limiting.

          Do not break the portfolio.
        */

        console.warn(
          "GitHub API unavailable. Using projects.js.",
          error
        );


        if (!cancelled) {

          setProjects(
            Array.isArray(
              fallbackProjects
            )
              ? fallbackProjects
              : []
          );

          setCurrentIndex(0);

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }


    fetchProjects();


    return () => {

      cancelled = true;

    };

  }, []);


  /* =======================================================
     CURRENT PROJECT
  ======================================================= */

  const currentProject =
    projects.length > 0
      ? projects[
          currentIndex %
          projects.length
        ]
      : null;


  /* =======================================================
     NEXT
  ======================================================= */

  const nextProject = () => {

    if (!projects.length) {
      return;
    }


    setCurrentIndex(
      (previousIndex) =>
        (
          previousIndex + 1
        ) %
        projects.length
    );

  };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const previousProject = () => {

    if (!projects.length) {
      return;
    }


    setCurrentIndex(
      (previousIndex) =>
        (
          previousIndex -
          1 +
          projects.length
        ) %
        projects.length
    );

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <section
        className="projects-hero"
        id="projects"
      >

        <div
          className="projects-hero-loading"
        >

          <LoaderCircle
            size={34}
            className="projects-hero-loader"
          />

          <span>
            Loading projects...
          </span>

        </div>

      </section>

    );

  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (!currentProject) {

    return (

      <section
        className="projects-hero"
        id="projects"
      >

        <div
          className="projects-hero-empty"
        >

          <h2>
            No projects available
          </h2>

          <p>
            Add projects to projects.js
            to display them here.
          </p>

        </div>

      </section>

    );

  }


  /* =======================================================
     PROJECT DATA
  ======================================================= */

  const projectName =
    currentProject.name ||
    currentProject.title ||
    "Project";


  const projectDescription =
    currentProject.description ||
    "A modern web project.";


  const githubUrl =
    currentProject.githubUrl ||
    currentProject.github ||
    currentProject.html_url ||
    "";


  const liveUrl =
    currentProject.liveUrl ||
    currentProject.homepage ||
    currentProject.demo ||
    currentProject.url ||
    "";


  const technologies =
    Array.isArray(
      currentProject.technologies
    )
      ? currentProject.technologies
      : currentProject.language
        ? [currentProject.language]
        : [];


  const platform =
    currentProject.platform ||
    (
      currentProject.source === "github"
        ? "GitHub Pages"
        : ""
    );


  const screenshotUrl =
    getScreenshotUrl(
      liveUrl
    );


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="projects-hero"
      id="projects"
    >


      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="projects-hero-background"
        aria-hidden="true"
      >

        <div
          className="
            projects-hero-glow
            projects-hero-glow-one
          "
        />

        <div
          className="
            projects-hero-glow
            projects-hero-glow-two
          "
        />

        <div
          className="
            projects-hero-grid
          "
        />

      </div>


      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          projects-hero-header
        "
      >

        <motion.span
          className="
            projects-hero-eyebrow
          "

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.6,
          }}
        >
          Selected Projects
        </motion.span>


        <motion.h1

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >

          Projects
          <span>.</span>

        </motion.h1>


        <motion.p

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
        >
          A collection of projects
          I've built and published
          on the web.
        </motion.p>

      </div>


      {/* ===================================================
          SLIDER
      =================================================== */}

      <div
        className="
          projects-hero-slider
        "
      >


        {/* =================================================
            PREVIOUS
        ================================================= */}

        <button
          type="button"

          className="
            projects-slider-arrow
            projects-slider-prev
          "

          onClick={
            previousProject
          }

          aria-label="
            Previous project
          "
        >

          <ArrowLeft
            size={22}
            strokeWidth={1.8}
          />

        </button>


        {/* =================================================
            CARD
        ================================================= */}

        <AnimatePresence
          mode="wait"
        >

          <motion.article

            key={
              currentProject.id ||
              projectName
            }

            className="
              projects-hero-card
            "

            initial={{
              opacity: 0,
              x: 45,
              scale: 0.98,
            }}

            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              x: -45,
              scale: 0.98,
            }}

            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
          >


            {/* =============================================
                WEBSITE SCREENSHOT
            ============================================= */}

            <div
              className="
                projects-preview
              "
            >

              {liveUrl ? (

                <a
                  href={liveUrl}

                  target="_blank"

                  rel="
                    noopener noreferrer
                  "

                  className="
                    projects-preview-link
                  "

                  aria-label={
                    `Open ${projectName} live website`
                  }
                >

                  <img
                    src={screenshotUrl}

                    alt={
                      `${projectName} website preview`
                    }

                    className="
                      projects-preview-image
                    "

                    loading="eager"

                  />

                  <div
                    className="
                      projects-preview-overlay
                    "
                  />

                  <div
                    className="
                      projects-preview-open
                    "
                  >

                    <ExternalLink
                      size={20}
                      strokeWidth={1.8}
                    />

                    <span>
                      Open live site
                    </span>

                  </div>

                </a>

              ) : (

                <div
                  className="
                    projects-preview-placeholder
                  "
                >

                  <ExternalLink
                    size={42}
                    strokeWidth={1.4}
                  />

                  <span>
                    Live preview unavailable
                  </span>

                </div>

              )}

            </div>


            {/* =============================================
                PROJECT INFORMATION
            ============================================= */}

            <div
              className="
                projects-hero-info
              "
            >


              {/* PROJECT NUMBER */}

              <div
                className="
                  projects-hero-project-number
                "
              >

                <span>
                  {String(
                    currentIndex + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span>/</span>

                <span>
                  {String(
                    projects.length
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

              </div>


              {/* PROJECT NAME */}

              <h2
                className="
                  projects-hero-project-name
                "
              >

                <span
                  className="
                    projects-name-glow
                  "
                />

                {projectName}

              </h2>


              {/* DESCRIPTION */}

              <p
                className="
                  projects-hero-description
                "
              >

                {projectDescription}

              </p>


              {/* TECHNOLOGIES */}

              {technologies.length > 0 && (

                <div
                  className="
                    projects-hero-technologies
                  "
                >

                  {technologies.map(
                    (
                      technology,
                      index
                    ) => (

                      <span
                        key={
                          `${technology}-${index}`
                        }

                        className="
                          projects-hero-technology
                        "
                      >

                        {technology}

                      </span>

                    )
                  )}

                </div>

              )}


              {/* PLATFORM */}

              {platform && (

                <div
                  className="
                    projects-hero-meta
                  "
                >

                  <span
                    className="
                      projects-hero-source
                    "
                  >
                    {platform}
                  </span>

                </div>

              )}


              {/* ACTIONS */}

              <div
                className="
                  projects-hero-actions
                "
              >

                {githubUrl && (

                  <a
                    href={githubUrl}

                    target="_blank"

                    rel="
                      noopener noreferrer
                    "

                    className="
                      projects-hero-button
                      projects-hero-button-github
                    "
                  >

                    <FaGithub
                      size={18}
                    />

                    <span>
                      GitHub
                    </span>

                  </a>

                )}


                {liveUrl && (

                  <a
                    href={liveUrl}

                    target="_blank"

                    rel="
                      noopener noreferrer
                    "

                    className="
                      projects-hero-button
                      projects-hero-button-live
                    "
                  >

                    <ExternalLink
                      size={18}
                      strokeWidth={1.8}
                    />

                    <span>
                      Live Demo
                    </span>

                  </a>

                )}

              </div>

            </div>

          </motion.article>

        </AnimatePresence>


        {/* =================================================
            NEXT
        ================================================= */}

        <button
          type="button"

          className="
            projects-slider-arrow
            projects-slider-next
          "

          onClick={
            nextProject
          }

          aria-label="
            Next project
          "
        >

          <ArrowRight
            size={22}
            strokeWidth={1.8}
          />

        </button>

      </div>


      {/* ===================================================
          DOTS
      =================================================== */}

      <div
        className="
          projects-hero-dots
        "
      >

        {projects.map(
          (
            project,
            index
          ) => (

            <button

              key={
                project.id ||
                project.name ||
                index
              }

              type="button"

              className={
                `projects-hero-dot ${
                  index === currentIndex
                    ? "active"
                    : ""
                }`
              }

              onClick={() =>
                setCurrentIndex(
                  index
                )
              }

              aria-label={
                `View ${
                  project.name ||
                  project.title ||
                  "project"
                }`
              }

            />

          )
        )}

      </div>


    </section>

  );

}
