import {
ArrowRight,
Code2,
Layers3,
Palette,
Sparkles,
Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AboutPreview({ text }) {
const sectionRef = useRef(null);
const glowOneRef = useRef(null);
const glowTwoRef = useRef(null);

const aboutText = text || {};

const focusItems = [
{
icon: Code2,
title:
aboutText.focus?.frontend?.title ||
"Frontend Development",
text:
aboutText.focus?.frontend?.text ||
"Building structured and interactive interfaces with modern frontend technologies.",
},
{
icon: Palette,
title:
aboutText.focus?.design?.title ||
"Thoughtful Design",
text:
aboutText.focus?.design?.text ||
"Creating interfaces where visual details, layout and usability work together.",
},
{
icon: Zap,
title:
aboutText.focus?.interaction?.title ||
"Smooth Interaction",
text:
aboutText.focus?.interaction?.text ||
"Adding meaningful interactions that make digital experiences feel responsive and engaging.",
},
];

useEffect(() => {
const section = sectionRef.current;
const glowOne = glowOneRef.current;
const glowTwo = glowTwoRef.current;

if (!section || !glowOne || !glowTwo) return;

const handleMouseMove = (event) => {
  const rect = section.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const mouseX =
    (event.clientX - rect.left) / rect.width;

  const mouseY =
    (event.clientY - rect.top) / rect.height;

  const moveX = (mouseX - 0.5) * 100;
  const moveY = (mouseY - 0.5) * 60;

  gsap.to(glowOne, {
    x: moveX * 0.45,
    y: moveY * 0.35,
    duration: 1.4,
    ease: "power3.out",
    overwrite: "auto",
  });

  gsap.to(glowTwo, {
    x: moveX * -0.35,
    y: moveY * -0.3,
    duration: 1.7,
    ease: "power3.out",
    overwrite: "auto",
  });
};

const ctx = gsap.context(() => {
  /* =====================================================
     HEADER
  ===================================================== */

  const header = section.querySelector(
    ".home-about-header"
  );

  if (header) {
    gsap.fromTo(
      header,
      {
        opacity: 0,
        y: -90,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 88%",
          end: "bottom 15%",
          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  }

  /* =====================================================
     MAIN CONTENT
  ===================================================== */

  const main = section.querySelector(
    ".home-about-main"
  );

  if (main) {
    const textContent = main.querySelector(
      ".home-about-text"
    );

    const highlight = main.querySelector(
      ".home-about-highlight"
    );

    /* LEFT → CENTER */

    if (textContent) {
      gsap.fromTo(
        textContent,
        {
          opacity: 0,
          x: -110,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textContent,
            start: "top 88%",
            end: "bottom 15%",
            toggleActions:
              "play reverse play reverse",
          },
        }
      );
    }

    /* RIGHT → CENTER */

    if (highlight) {
      gsap.fromTo(
        highlight,
        {
          opacity: 0,
          x: 110,
          scale: 0.97,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.15,
          delay: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: highlight,
            start: "top 88%",
            end: "bottom 15%",
            toggleActions:
              "play reverse play reverse",
          },
        }
      );
    }
  }

  /* =====================================================
     FOCUS CARDS
     LEFT → CENTER
     BOTTOM → CENTER
     RIGHT → CENTER
  ===================================================== */

  const focusCards = section.querySelectorAll(
    ".home-about-focus-card"
  );

  focusCards.forEach((card, index) => {
    let startX = 0;
    let startY = 0;

    if (index === 0) {
      startX = -100;
    } else if (index === 1) {
      startY = 100;
    } else {
      startX = 100;
    }

    gsap.fromTo(
      card,
      {
        opacity: 0,
        x: startX,
        y: startY,
        scale: 0.96,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.05,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "bottom 15%",
          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  });

  /* =====================================================
     STATS
     BOTTOM → CENTER
  ===================================================== */

  const stats = section.querySelector(
    ".home-about-stats"
  );

  if (stats) {
    gsap.fromTo(
      stats,
      {
        opacity: 0,
        y: 90,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stats,
          start: "top 88%",
          end: "bottom 15%",
          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  }

  /* =====================================================
     CTA
     TOP → CENTER
  ===================================================== */

  const bottom = section.querySelector(
    ".home-about-bottom"
  );

  if (bottom) {
    gsap.fromTo(
      bottom,
      {
        opacity: 0,
        y: -90,
        scale: 0.97,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bottom,
          start: "top 88%",
          end: "bottom 15%",
          toggleActions:
            "play reverse play reverse",
        },
      }
    );
  }

  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  section.addEventListener(
    "mousemove",
    handleMouseMove
  );

  /* =====================================================
     BACKGROUND GLOW ANIMATION
  ===================================================== */

  const glowTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      ease: "sine.inOut",
    },
  });

  glowTimeline
    .to(
      glowOne,
      {
        x: -130,
        y: 60,
        scale: 1.12,
        duration: 4,
      },
      0
    )
    .to(
      glowTwo,
      {
        x: 130,
        y: -40,
        scale: 1.12,
        duration: 4,
      },
      0
    )
    .to(
      glowOne,
      {
        x: 100,
        y: -35,
        scale: 0.92,
        duration: 4,
      },
      4
    )
    .to(
      glowTwo,
      {
        x: -100,
        y: 45,
        scale: 0.92,
        duration: 4,
      },
      4
    );

  /* =====================================================
     CARD HOVER
  ===================================================== */

  focusCards.forEach((card) => {
    const icon = card.querySelector(
      ".home-about-focus-icon"
    );

    const enter = () => {
      gsap.to(card, {
        y: -6,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (icon) {
        gsap.to(icon, {
          rotate: 8,
          scale: 1.08,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const leave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (icon) {
        gsap.to(icon, {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    card.addEventListener(
      "mouseenter",
      enter
    );

    card.addEventListener(
      "mouseleave",
      leave
    );

    card._aboutEnter = enter;
    card._aboutLeave = leave;
  });

  /* =====================================================
     HIGHLIGHT FLOAT
  ===================================================== */

  const highlight = section.querySelector(
    ".home-about-highlight"
  );

  if (highlight) {
    gsap.to(highlight, {
      y: -5,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  /* =====================================================
     LINK ARROWS
  ===================================================== */

  const links = section.querySelectorAll(
    ".home-about-link, .home-about-bottom-link"
  );

  links.forEach((link) => {
    const arrow = link.querySelector("svg");

    if (!arrow) return;

    const enter = () => {
      gsap.to(arrow, {
        x: 6,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const leave = () => {
      gsap.to(arrow, {
        x: 0,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    link.addEventListener(
      "mouseenter",
      enter
    );

    link.addEventListener(
      "mouseleave",
      leave
    );

    link._aboutArrowEnter = enter;
    link._aboutArrowLeave = leave;
  });
}, section);

/* =====================================================
   CLEANUP
===================================================== */

return () => {
  section.removeEventListener(
    "mousemove",
    handleMouseMove
  );

  const focusCards = section.querySelectorAll(
    ".home-about-focus-card"
  );

  focusCards.forEach((card) => {
    if (card._aboutEnter) {
      card.removeEventListener(
        "mouseenter",
        card._aboutEnter
      );
    }

    if (card._aboutLeave) {
      card.removeEventListener(
        "mouseleave",
        card._aboutLeave
      );
    }
  });

  const links = section.querySelectorAll(
    ".home-about-link, .home-about-bottom-link"
  );

  links.forEach((link) => {
    if (link._aboutArrowEnter) {
      link.removeEventListener(
        "mouseenter",
        link._aboutArrowEnter
      );
    }

    if (link._aboutArrowLeave) {
      link.removeEventListener(
        "mouseleave",
        link._aboutArrowLeave
      );
    }
  });

  ctx.revert();
};

}, []);

return (
<section className="home-about" id="about-preview" ref={sectionRef} >
<div className="home-about-background home-about-background-one" ref={glowOneRef} aria-hidden="true" />

  <div
    className="home-about-background home-about-background-two"
    ref={glowTwoRef}
    aria-hidden="true"
  />

  <div className="home-about-container">

    {/* =================================================
        HEADER
    ================================================= */}

    <header className="home-about-header">
      <span className="section-eyebrow">
        <Code2
          size={16}
          strokeWidth={1.8}
        />

        {aboutText.eyebrow || "About Me"}
      </span>

      <h2 className="section-title">
        {aboutText.heading?.main ||
          "Turning ideas into"}{" "}

        <span>
          {aboutText.heading?.accent ||
            " meaningful experiences."}
        </span>
      </h2>

      {aboutText.heading?.description && (
        <p className="home-about-header-description">
          {aboutText.heading.description}
        </p>
      )}
    </header>

    {/* =================================================
        MAIN
    ================================================= */}

    <div className="home-about-main">

      {/* LEFT */}
      <div className="home-about-text">

        <div className="home-about-intro">
          <span className="home-about-profession">
            {aboutText.intro?.profession ||
              "Frontend Developer"}
          </span>

          {aboutText.intro?.tagline && (
            <h3>
              {aboutText.intro.tagline}
            </h3>
          )}
        </div>

        <div className="home-about-description">
          {aboutText.paragraphs?.map(
            (paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            )
          )}
        </div>

        <Link
          to={
            aboutText.link?.href ||
            "/about"
          }
          className="home-about-link"
        >
          <span>
            {aboutText.link?.text ||
              "More about me"}
          </span>

          <ArrowRight
            size={17}
            strokeWidth={2}
          />
        </Link>

      </div>

      {/* RIGHT */}
      <div className="home-about-highlight">

        <div className="home-about-highlight-icon">
          <Sparkles
            size={22}
            strokeWidth={1.7}
          />
        </div>

        <div>
          <span className="home-about-highlight-label">
            {aboutText.highlight?.label ||
              "What I focus on"}
          </span>

          <p>
            {aboutText.highlight?.text ||
              "Thoughtful UI · Responsive Design · Smooth Interactions"}
          </p>
        </div>

      </div>

    </div>

    {/* =================================================
        FOCUS CARDS
    ================================================= */}

    <div className="home-about-focus">
      {focusItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <article
            className="home-about-focus-card"
            key={index}
          >
            <div className="home-about-focus-icon">
              <Icon
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <div className="home-about-focus-content">
              <h3>
                {item.title}
              </h3>

              <p>
                {item.text}
              </p>
            </div>
          </article>
        );
      })}
    </div>

    {/* =================================================
        STATS
    ================================================= */}

    {aboutText.stats && (
      <div className="home-about-stats">
        {aboutText.stats.map(
          (stat, index) => (
            <div
              className="home-about-stat"
              key={index}
            >
              <strong>
                {stat.value}
              </strong>

              <span>
                {stat.label}
              </span>
            </div>
          )
        )}
      </div>
    )}

    {/* =================================================
        CTA
    ================================================= */}

    <div className="home-about-bottom">

      <div className="home-about-bottom-icon">
        <Layers3
          size={20}
          strokeWidth={1.8}
        />
      </div>

      <div className="home-about-bottom-content">

        <h3>
          {aboutText.cta?.title ||
            "Interested in what I build?"}
        </h3>

        <p>
          {aboutText.cta?.text ||
            "Explore more of my work and see how I approach digital experiences."}
        </p>

      </div>

      <Link
        to={
          aboutText.cta?.href ||
          "/projects"
        }
        className="home-about-bottom-link"
      >
        <span>
          {aboutText.cta?.button ||
            "Explore Projects"}
        </span>

        <ArrowRight
          size={17}
          strokeWidth={2}
        />
      </Link>

    </div>

  </div>
</section>

);
}

export default AboutPreview;


