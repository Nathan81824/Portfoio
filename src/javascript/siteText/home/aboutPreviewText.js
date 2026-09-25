import { personalInfo } from "../../data/data.js";

const aboutPreviewText = {
  eyebrow: "About Me",

  heading: {
    main: "Building digital experiences",
    accent: " that feel different.",
  },

  intro: {
    profession: personalInfo.role,
    greeting: `Hi, I'm ${personalInfo.displayName}.`,
  },

  paragraphs: [
    "I create responsive, interactive and modern digital experiences with a strong focus on clean design, usability and performance.",

    "I enjoy turning ideas into polished interfaces, exploring modern web technologies, and creating experiences that are both visually engaging and easy to use.",
  ],

  link: {
    text: "More about me",
    href: "/about",
  },

  highlight: {
    label: "What I focus on",
    text: "Clean UI · Responsive Design · Interactive Experiences",
  },
};

export default aboutPreviewText;