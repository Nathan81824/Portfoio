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

function AboutPreview({ text }) {
const sectionRef = useRef(null);
const glowOneRef = useRef(null);
const glowTwoRef = useRef(null);

useEffect(() => {
const section = sectionRef.current;
const glowOne = glowOneRef.current;
const glowTwo = glowTwoRef.current;


if (!section || !glowOne || !glowTwo) return;

const handleMouseMove = (event) => {
  const rect = section.getBoundingClientRect();

  const mouseX = (event.clientX - rect.left) / rect.width;
  const mouseY = (event.clientY - rect.top) / rect.height;

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

section.addEventListener("mousemove", handleMouseMove);

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

return () => {
  section.removeEventListener("mousemove", handleMouseMove);
  glowTimeline.kill();
  gsap.killTweensOf([glowOne, glowTwo]);
};

}, []);

const aboutText = text || {};

const focusItems = [
{
icon: Code2,
title: aboutText.focus?.frontend?.title || "Frontend Development",
text:
aboutText.focus?.frontend?.text ||
"Building structured and interactive interfaces with modern frontend technologies.",
},
{
icon: Palette,
title: aboutText.focus?.design?.title || "Thoughtful Design",
text:
aboutText.focus?.design?.text ||
"Creating interfaces where visual details, layout and usability work together.",
},
{
icon: Zap,
title: aboutText.focus?.interaction?.title || "Smooth Interaction",
text:
aboutText.focus?.interaction?.text ||
"Adding meaningful interactions that make digital experiences feel responsive and engaging.",
},
];

return ( <section
   className="home-about"
   id="about-preview"
   ref={sectionRef}
 > <div
     className="home-about-background home-about-background-one"
     ref={glowOneRef}
     aria-hidden="true"
   />


  <div
    className="home-about-background home-about-background-two"
    ref={glowTwoRef}
    aria-hidden="true"
  />

  <div className="home-about-container">
    {/* SECTION HEADER */}
    <header className="home-about-header">
      <span className="section-eyebrow">
        <Code2 size={16} strokeWidth={1.8} />
        {aboutText.eyebrow || "About Me"}
      </span>

      <h2 className="section-title">
        {aboutText.heading?.main || "Turning ideas into"}{" "}
        <span>
          {aboutText.heading?.accent || " meaningful experiences."}
        </span>
      </h2>

      {aboutText.heading?.description && (
        <p className="home-about-header-description">
          {aboutText.heading.description}
        </p>
      )}
    </header>

    {/* MAIN CONTENT */}
    <div className="home-about-main">
      <div className="home-about-text">
        <div className="home-about-intro">
          <span className="home-about-profession">
            {aboutText.intro?.profession || "Frontend Developer"}
          </span>

          {aboutText.intro?.tagline && (
            <h3>{aboutText.intro.tagline}</h3>
          )}
        </div>

        <div className="home-about-description">
          {aboutText.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <Link
          to={aboutText.link?.href || "/about"}
          className="home-about-link"
        >
          <span>
            {aboutText.link?.text || "More about me"}
          </span>

          <ArrowRight size={17} strokeWidth={2} />
        </Link>
      </div>

      {/* HIGHLIGHT CARD */}
      <div className="home-about-highlight">
        <div className="home-about-highlight-icon">
          <Sparkles size={22} strokeWidth={1.7} />
        </div>

        <div>
          <span className="home-about-highlight-label">
            {aboutText.highlight?.label || "What I focus on"}
          </span>

          <p>
            {aboutText.highlight?.text ||
              "Thoughtful UI · Responsive Design · Smooth Interactions"}
          </p>
        </div>
      </div>
    </div>

    {/* FOCUS CARDS */}
    <div className="home-about-focus">
      {focusItems.map((item, index) => {
        const Icon = item.icon;

        return (
          <article
            className="home-about-focus-card"
            key={index}
          >
            <div className="home-about-focus-icon">
              <Icon size={20} strokeWidth={1.8} />
            </div>

            <div className="home-about-focus-content">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        );
      })}
    </div>

    {/* STATS */}
    {aboutText.stats && (
      <div className="home-about-stats">
        {aboutText.stats.map((stat, index) => (
          <div className="home-about-stat" key={index}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    )}

    {/* BOTTOM CTA */}
    <div className="home-about-bottom">
      <div className="home-about-bottom-icon">
        <Layers3 size={20} strokeWidth={1.8} />
      </div>

      <div className="home-about-bottom-content">
        <h3>
          {aboutText.cta?.title || "Interested in what I build?"}
        </h3>

        <p>
          {aboutText.cta?.text ||
            "Explore more of my work and see how I approach digital experiences."}
        </p>
      </div>

      <Link
        to={aboutText.cta?.href || "/projects"}
        className="home-about-bottom-link"
      >
        <span>
          {aboutText.cta?.button || "Explore Projects"}
        </span>

        <ArrowRight size={17} strokeWidth={2} />
      </Link>
    </div>
  </div>
</section>


);
}

export default AboutPreview;
