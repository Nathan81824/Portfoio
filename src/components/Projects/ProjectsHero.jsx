
import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Play,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  projects as fallbackProjects,
  fetchProjects,
} from "../../javascript/projects/projects.js";

import { media } from "../../javascript/index.js";

import LazyImage from "../Shared/UI/Media/LazyImage.jsx";

function ProjectsHero() {
  const [projects, setProjects] = useState(
    Array.isArray(fallbackProjects)
      ? fallbackProjects
      : []
  );

  const [error, setError] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  const projectVideo =
    media?.videos?.projectsHeroVideo;

  const visibleProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      return [];
    }

    return projects
      .filter(
        (project) =>
          project &&
          project.visible !== false
      )
      .slice(0, 8);
  }, [projects]);

  /*
   * Background project loading.
   *
   * The hero renders immediately using the projects
   * already exported from projects.js.
   *
   * GitHub data is fetched in the background and
   * replaces the current list when it arrives.
   */
  useEffect(() => {
    let mounted = true;

    const loadProjectsInBackground = async () => {
      try {
        const result =
          await fetchProjects();

        if (!mounted) {
          return;
        }

        if (!Array.isArray(result)) {
          return;
        }

        const validProjects =
          result.filter(
            (project) =>
              project &&
              project.visible !== false
          );

        if (validProjects.length > 0) {
          setProjects(validProjects);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error(
          "Background project loading failed:",
          err
        );

        if (!mounted) {
          return;
        }

        /*
         * Do not remove already available projects
         * when the background request fails.
         */
        setError(
          "Projects could not be refreshed."
        );
      }
    };

    loadProjectsInBackground();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Automatic slider.
   */
  useEffect(() => {
    if (
      visibleProjects.length <= 1 ||
      isPaused
    ) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setActiveIndex((current) => {
          if (
            current >=
            visibleProjects.length - 1
          ) {
            return 0;
          }

          return current + 1;
        });
      }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    visibleProjects.length,
    isPaused,
  ]);

  /*
   * Protect the slider when the project list
   * changes after background loading.
   */
  useEffect(() => {
    if (
      visibleProjects.length === 0
    ) {
      setActiveIndex(0);
      return;
    }

    if (
      activeIndex >=
      visibleProjects.length
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    visibleProjects.length,
  ]);

  const goNext = () => {
    if (
      visibleProjects.length === 0
    ) {
      return;
    }

    setActiveIndex((current) => {
      if (
        current >=
        visibleProjects.length - 1
      ) {
        return 0;
      }

      return current + 1;
    });
  };

  const goPrevious = () => {
    if (
      visibleProjects.length === 0
    ) {
      return;
    }

    setActiveIndex((current) => {
      if (current <= 0) {
        return (
          visibleProjects.length - 1
        );
      }

      return current - 1;
    });
  };

  const retryProjects = async () => {
    try {
      setError("");

      const result =
        await fetchProjects();

      if (!Array.isArray(result)) {
        return;
      }

      const validProjects =
        result.filter(
          (project) =>
            project &&
            project.visible !== false
        );

      if (validProjects.length > 0) {
        setProjects(validProjects);
        setActiveIndex(0);
      }
    } catch (err) {
      console.error(
        "Failed to refresh projects:",
        err
      );

      setError(
        "Projects could not be refreshed."
      );
    }
  };

  const ProjectCard = ({
    project,
    index,
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
      project?.repository?.html_url ||
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
      project?.thumbnail ||
      "";

    return (
      <article className="projects-hero-card">
        <div className="projects-hero-card-image">
          {screenshotUrl ? (
            <LazyImage
              src={screenshotUrl}
              alt={`${title} preview`}
              className="projects-hero-card-image-element"
            />
          ) : (
            <div
              className="projects-hero-card-placeholder"
              aria-hidden="true"
            >
              <GitBranch
                size={42}
                strokeWidth={1.2}
              />

              <span>
                Project Preview
              </span>
            </div>
          )}

          <div className="projects-hero-card-image-overlay">
            <span>
              {String(
                index + 1
              ).padStart(2, "0")}
            </span>
          </div>
        </div>

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

          {technologies.length > 0 && (
            <div className="projects-hero-card-tech">
              {technologies
                .slice(0, 5)
                .map(
                  (
                    technology,
                    technologyIndex
                  ) => (
                    <span
                      key={`${technology}-${technologyIndex}`}
                    >
                      {technology}
                    </span>
                  )
                )}
            </div>
          )}

          <div className="projects-hero-card-footer">
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
                    size={15}
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
                    size={15}
                    strokeWidth={1.8}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      className="projects-hero"
      id="projects"
    >
      <div
        className="projects-hero-background"
        aria-hidden="true"
      >
        <div className="projects-hero-grid-background" />

        <div className="projects-hero-glow projects-hero-glow-one" />

        <div className="projects-hero-glow projects-hero-glow-two" />
      </div>

      <div className="projects-hero-container">
        <div
          className="projects-hero-right"
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
        >
          <div className="projects-hero-header">
            <div className="projects-hero-heading">
              <span className="projects-hero-eyebrow">
                <GitBranch
                  size={15}
                  strokeWidth={1.8}
                />

                <span>
                  MY WORK
                </span>
              </span>

              <h1>
                Projects
                <span>
                  .
                </span>
              </h1>

              <p>
                A selection of deployed
                projects built with modern
                frontend technologies.
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

          <div className="projects-hero-slider">
            <div className="projects-hero-slider-top">
              <div className="projects-hero-slider-counter">
                <span className="projects-hero-slider-current">
                  {String(
                    visibleProjects.length > 0
                      ? activeIndex + 1
                      : 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <span className="projects-hero-slider-divider">
                  /
                </span>

                <span>
                  {String(
                    visibleProjects.length ||
                      1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              {visibleProjects.length >
                1 && (
                <div className="projects-hero-slider-controls">
                  <button
                    type="button"
                    onClick={
                      goPrevious
                    }
                    aria-label="Previous project"
                    className="projects-hero-slider-button"
                  >
                    <ArrowLeft
                      size={17}
                      strokeWidth={1.8}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={
                      goNext
                    }
                    aria-label="Next project"
                    className="projects-hero-slider-button"
                  >
                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="projects-hero-slider-window">
              <div
                className="projects-hero-slider-track"
                style={{
                  transform:
                    `translateX(-${
                      activeIndex *
                      100
                    }%)`,
                }}
              >
                {visibleProjects.length >
                0 ? (
                  visibleProjects.map(
                    (
                      project,
                      index
                    ) => (
                      <div
                        className="projects-hero-slide"
                        key={
                          project?.id ||
                          project?.name ||
                          project?.title ||
                          index
                        }
                      >
                        <ProjectCard
                          project={
                            project
                          }
                          index={
                            index
                          }
                        />
                      </div>
                    )
                  )
                ) : (
                  <div className="projects-hero-slide">
                    <div className="projects-hero-empty">
                      <GitBranch
                        size={36}
                        strokeWidth={1.3}
                      />

                      <h2>
                        No projects available
                      </h2>

                      <p>
                        GitHub Pages projects
                        will appear here once
                        they are available.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {visibleProjects.length >
              1 && (
              <div className="projects-hero-slider-bottom">
                <div className="projects-hero-slider-dots">
                  {visibleProjects.map(
                    (
                      project,
                      index
                    ) => (
                      <button
                        type="button"
                        key={
                          project?.id ||
                          project?.name ||
                          project?.title ||
                          index
                        }
                        aria-label={`Go to project ${
                          index + 1
                        }`}
                        aria-current={
                          activeIndex ===
                          index
                            ? "true"
                            : undefined
                        }
                        className={
                          `projects-hero-slider-dot ${
                            activeIndex ===
                            index
                              ? "active"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setActiveIndex(
                            index
                          )
                        }
                      />
                    )
                  )}
                </div>

                <div className="projects-hero-slider-status">
                  <span
                    className={
                      isPaused
                        ? "paused"
                        : ""
                    }
                  />

                  <span>
                    {isPaused
                      ? "PAUSED"
                      : "AUTO PLAY"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="projects-hero-fetch-status">
              <div>
                <RefreshCw
                  size={14}
                  strokeWidth={1.8}
                />

                <span>
                  {error}
                </span>
              </div>

              <button
                type="button"
                onClick={
                  retryProjects
                }
              >
                <span>
                  Retry
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="projects-hero-video-area">
          <div
            className="projects-hero-video-glow"
            aria-hidden="true"
          />

          <div className="projects-hero-video-frame">
            {projectVideo ? (
              <video
                className="projects-hero-video"
                src={projectVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls
              />
            ) : (
              <div className="projects-hero-video-empty">
                <Play
                  size={30}
                  strokeWidth={1.4}
                />

                <span>
                  Project video unavailable
                </span>
              </div>
            )}

            <div
              className="projects-hero-video-overlay"
              aria-hidden="true"
            />

            <div
              className="projects-hero-video-border"
              aria-hidden="true"
            />
          </div>

          <div className="projects-hero-video-label">
            <span className="projects-hero-video-dot" />

            <span>
              PROJECTS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsHero;

