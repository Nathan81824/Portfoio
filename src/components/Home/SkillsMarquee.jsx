import { useEffect, useRef } from "react";

import {
  FaReact,
  FaJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaGithub,
  FaCode,
  FaServer,
} from "react-icons/fa";

import { FiWind } from "react-icons/fi";

const skills = [
  { name: "React", icon: FaReact },
  { name: "JavaScript", icon: FaJs },
  { name: "HTML5", icon: FaHtml5 },
  { name: "CSS3", icon: FaCss3Alt },
  { name: "Tailwind CSS", icon: FiWind },
  { name: "Git", icon: FaGitAlt },
  { name: "GitHub", icon: FaGithub },
  { name: "Vite", icon: FaCode },
  { name: "Responsive Design", icon: FaCode },
  { name: "REST APIs", icon: FaServer },
];

function SkillItem({ skill }) {
  const Icon = skill.icon;

  return (
    <div className="skills-marquee-item">
      <Icon
        className="skills-marquee-icon"
        aria-hidden="true"
      />

      <span>{skill.name}</span>
    </div>
  );
}

function SkillsMarquee() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    let animationFrame;
    let position = 0;

    const normalSpeed = 0.8;
    const hoverSpeed = 0.22;

    let currentSpeed = normalSpeed;
    let targetSpeed = normalSpeed;

    const handleMouseEnter = () => {
      targetSpeed = hoverSpeed;
    };

    const handleMouseLeave = () => {
      targetSpeed = normalSpeed;
    };

    const animate = () => {
      currentSpeed += (targetSpeed - currentSpeed) * 0.035;

      position -= currentSpeed;

      const firstGroup = track.children[0];

      if (firstGroup) {
        const groupWidth = firstGroup.offsetWidth;

        if (Math.abs(position) >= groupWidth) {
          position += groupWidth;
        }
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);

      section.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      section.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="skills-marquee"
      aria-label="Technologies and tools I use"
    >
      <div
        className="skills-marquee-top-line"
        aria-hidden="true"
      />

      <div
        className="skills-marquee-fade skills-marquee-fade-left"
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        className="skills-marquee-track"
      >
        <div className="skills-marquee-group">
          {skills.map((skill, index) => (
            <SkillItem
              key={`first-${skill.name}-${index}`}
              skill={skill}
            />
          ))}
        </div>

        <div
          className="skills-marquee-group"
          aria-hidden="true"
        >
          {skills.map((skill, index) => (
            <SkillItem
              key={`second-${skill.name}-${index}`}
              skill={skill}
            />
          ))}
        </div>
      </div>

      <div
        className="skills-marquee-fade skills-marquee-fade-right"
        aria-hidden="true"
      />

      <div
        className="skills-marquee-wave"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            className="skills-wave-path skills-wave-one"
            d="M0,40 C120,10 240,70 360,40 C480,10 600,70 720,40 C840,10 960,70 1080,40 C1200,10 1320,70 1440,40"
          />

          <path
            className="skills-wave-path skills-wave-two"
            d="M0,45 C120,75 240,15 360,45 C480,75 600,15 720,45 C840,75 960,15 1080,45 C1200,75 1320,15 1440,45"
          />
        </svg>
      </div>
    </section>
  );
}

export default SkillsMarquee;