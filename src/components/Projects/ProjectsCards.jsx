
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  projects as fallbackProjects,
  fetchProjects,
} from "../../javascript/projects/projects.js";



/* =========================================================
   PROJECTS HERO
========================================================= */

export default function ProjectsHero() {

  const [projects, setProjects] = useState(
    fallbackProjects || []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =======================================================
     LOAD PROJECTS
  ======================================================= */

  useEffect(() => {

    let mounted = true;


    const loadProjects = async () => {

      try {

        setLoading(true);

        setError("");


        const result =
          await fetchProjects();


        if (!mounted) {
          return;
        }


        const githubProjects =
          Array.isArray(result)
            ? result.filter((project) => {

                const name =
                  String(
                    project?.name ||
                    project?.title ||
                    ""
                  ).toLowerCase();


                const liveUrl =
                  String(
                    project?.liveUrl ||
                    project?.pagesUrl ||
                    project?.homepage ||
                    ""
                  );


                /* =========================================
                   NEVER SHOW THE PORTFOLIO ITSELF
                ========================================= */

                if (
                  name === "portfoio" ||
                  name === "portfolio"
                ) {
                  return false;
                }


                /* =========================================
                   ONLY GITHUB PAGES PROJECTS
                ========================================= */

                return liveUrl.includes(
                  "github.io"
                );

              })
            : [];


        setProjects(
          githubProjects
        );

      } catch (err) {

        console.error(
          "Failed to load GitHub Pages projects:",
          err
        );


        if (!mounted) {
          return;
        }


        setError(
          "Unable to load projects right now."
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    loadProjects();


    return () => {

      mounted = false;

    };

  }, []);


  /* =======================================================
     PROJECT CARD
  ======================================================= */

  const ProjectCard = ({
    project,
  }) => {

    const title =
      project?.title ||
      project?.name ||
      "Untitled Project";


    const description =
      project?.description ||
      "A frontend project built with modern web technologies.";


    const liveUrl =
      project?.liveUrl ||
      project?.pagesUrl ||
      project?.homepage ||
      "";


    const githubUrl =
      project?.githubUrl ||
      project?.htmlUrl ||
      project?.repositoryUrl ||
      "";


    const technologies =
      Array.isArray(
        project?.technologies
      )
        ? project.technologies
        : [];


    const screenshotUrl =
      project?.screenshotUrl ||
      project?.image ||
      project?.imageUrl ||
      "";


    return (

      <article className="projects-hero-card">


        {/* =================================================
            PROJECT IMAGE
        ================================================= */}

        <div className="projects-hero-card-image">

          {screenshotUrl ? (

            <img
              src={screenshotUrl}
              alt={`${title} preview`}
              loading="lazy"
            />

          ) : (

            <div
              className="projects-hero-card-placeholder"
              aria-hidden="true"
            >
              <GitBranch
                size={34}
                strokeWidth={1.4}
              />
            </div>

          )}

        </div>


        {/* =================================================
            PROJECT CONTENT
        ================================================= */}

        <div className="projects-hero-card-content">


          <div className="projects-hero-card-source">

            <GitBranch
              size={14}
              strokeWidth={1.8}
            />

            <span>
              GitHub Pages
            </span>

          </div>


          <h2>
            {title}
          </h2>


          <p>
            {description}
          </p>


          {/* =================================================
              TECHNOLOGIES
          ================================================= */}

          {technologies.length > 0 && (

            <div className="projects-hero-card-tech">

              {technologies
                .slice(0, 5)
                .map((technology) => (

                  <span
                    key={technology}
                  >
                    {technology}
                  </span>

                ))}

            </div>

          )}


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="projects-hero-card-actions">


            {liveUrl && (

              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="projects-hero-card-button projects-hero-card-button-primary"
              >

                <span>
                  Live Demo
                </span>

                <ExternalLink
                  size={16}
                  strokeWidth={1.8}
                />

              </a>

            )}


            {githubUrl && (

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="projects-hero-card-button projects-hero-card-button-secondary"
              >

                <span>
                  Source
                </span>

                <GitBranch
                  size={16}
                  strokeWidth={1.8}
                />

              </a>

            )}

          </div>

        </div>

      </article>

    );

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <section className="projects-hero">

        <div className="projects-hero-loading">

          <RefreshCw
            size={24}
            className="projects-hero-spin"
          />

          <span>
            Loading projects...
          </span>

        </div>

      </section>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {

    return (

      <section className="projects-hero">

        <div className="projects-hero-error">

          <h2>
            Projects unavailable
          </h2>

          <p>
            {error}
          </p>


          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="projects-hero-retry"
          >

            <RefreshCw
              size={16}
            />

            <span>
              Try Again
            </span>

          </button>

        </div>

      </section>

    );

  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (projects.length === 0) {

    return (

      <section className="projects-hero">

        <div className="projects-hero-empty">

          <GitBranch
            size={30}
            strokeWidth={1.4}
          />

          <h2>
            No projects available
          </h2>

          <p>
            GitHub Pages projects will
            appear here once they are
            available.
          </p>

        </div>

      </section>

    );

  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <section
      className="projects-hero"
      id="projects"
    >


      {/* =================================================
          HERO HEADER
      ================================================= */}

      <div className="projects-hero-header">

        <div>

          <span className="projects-hero-eyebrow">
            MY WORK
          </span>

          <h1>
            Projects
            <span>
              .
            </span>
          </h1>

          <p>
            A selection of deployed projects
            built with modern frontend
            technologies.
          </p>

        </div>


        <Link
          to="/projects"
          className="projects-hero-view-all"
        >

          <span>
            View All
          </span>

          <ArrowRight
            size={17}
            strokeWidth={1.8}
          />

        </Link>

      </div>


      {/* =================================================
          PROJECT GRID
      ================================================= */}

      <div className="projects-hero-grid">

        {projects
          .slice(0, 6)
          .map((project) => (

            <ProjectCard
              key={
                project.id ||
                project.name
              }
              project={project}
            />

          ))}

      </div>

    </section>

  );

}

