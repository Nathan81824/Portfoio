/* =========================================================
   FORMATERS
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/formaters.js

   PURPOSE
   ---------------------------------------------------------
   Central formatting utilities used throughout the portfolio.

   Used for:
   - Names
   - Roles
   - Navigation labels
   - Project names
   - Skill names
   - Text
   - Dates
   - Numbers
   - URLs
   - Slugs
========================================================= */


/* =========================================================
   CAPITALIZE FIRST LETTER
========================================================= */

export function capitalize(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return value;

  }


  const text =
    value.trim();


  if (!text) {

    return "";

  }


  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );

}


/* =========================================================
   CAPITALIZE WORDS
========================================================= */

export function capitalizeWords(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return value;

  }


  return value
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        capitalize(word)
    )
    .join(" ");

}


/* =========================================================
   FORMAT NAME
   ---------------------------------------------------------
   "nathan moses"
   → "Nathan Moses"
========================================================= */

export function formatName(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        capitalize(word)
    )
    .join(" ");

}


/* =========================================================
   FORMAT DISPLAY NAME
========================================================= */

export function formatDisplayName(
  value,
  maxLength = 18
) {

  const formatted =
    formatName(value);


  if (
    formatted.length <=
    maxLength
  ) {

    return formatted;

  }


  return (
    formatted
      .slice(
        0,
        maxLength - 3
      )
      .trim() +
    "..."
  );

}


/* =========================================================
   FORMAT ROLE
   ---------------------------------------------------------
   "frontend developer"
   → "Frontend Developer"
========================================================= */

export function formatRole(
  value
) {

  return formatName(
    value
  );

}


/* =========================================================
   FORMAT ROLES
========================================================= */

export function formatRoles(
  roles
) {

  if (
    !Array.isArray(roles)
  ) {

    return [];

  }


  return roles.map(
    (role) =>
      formatRole(role)
  );

}


/* =========================================================
   FORMAT TITLE
========================================================= */

export function formatTitle(
  value
) {

  return capitalizeWords(
    value
  );

}


/* =========================================================
   FORMAT LABEL
========================================================= */

export function formatLabel(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .replace(
      /[-_]+/g,
      " "
    )
    .split(/\s+/)
    .map(
      (word) =>
        capitalize(word)
    )
    .join(" ");

}


/* =========================================================
   FORMAT SKILL NAME
========================================================= */

export function formatSkillName(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  const specialNames = {

    html:
      "HTML",

    css:
      "CSS",

    javascript:
      "JavaScript",

    js:
      "JavaScript",

    react:
      "React",

    "react router":
      "React Router",

    tailwind:
      "Tailwind CSS",

    "tailwind css":
      "Tailwind CSS",

    github:
      "GitHub",

    git:
      "Git",

    vite:
      "Vite",

    gsap:
      "GSAP",

    lenis:
      "Lenis",

    emailjs:
      "EmailJS",

    "framer motion":
      "Framer Motion",

  };


  const normalized =
    value
      .trim()
      .toLowerCase();


  return (
    specialNames[
      normalized
    ] ||
    formatName(value)
  );

}


/* =========================================================
   FORMAT PROJECT NAME
========================================================= */

export function formatProjectName(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .replace(
      /[-_]+/g,
      " "
    )
    .split(/\s+/)
    .map(
      (word) =>
        capitalize(word)
    )
    .join(" ");

}


/* =========================================================
   FORMAT DESCRIPTION
========================================================= */

export function formatDescription(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .replace(
      /\s+/g,
      " "
    );

}


/* =========================================================
   TRUNCATE TEXT
========================================================= */

export function truncateText(
  value,
  maxLength = 120
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  const text =
    value.trim();


  if (
    text.length <=
    maxLength
  ) {

    return text;

  }


  return (
    text
      .slice(
        0,
        maxLength - 3
      )
      .trimEnd() +
    "..."
  );

}


/* =========================================================
   FORMAT NUMBER
========================================================= */

export function formatNumber(
  value
) {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {

    return "0";

  }


  return new Intl.NumberFormat(
    "en-US"
  ).format(number);

}


/* =========================================================
   FORMAT PERCENTAGE
========================================================= */

export function formatPercentage(
  value
) {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {

    return "0%";

  }


  return `${Math.round(number)}%`;

}


/* =========================================================
   FORMAT DATE
========================================================= */

export function formatDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);

}


/* =========================================================
   FORMAT DATE AND TIME
========================================================= */

export function formatDateTime(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(date);

}


/* =========================================================
   FORMAT RELATIVE DATE
   ---------------------------------------------------------
   "2 days ago"
========================================================= */

export function formatRelativeDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  const now =
    new Date();


  const difference =
    now.getTime() -
    date.getTime();


  const seconds =
    Math.floor(
      difference / 1000
    );


  if (
    seconds < 60
  ) {

    return "Just now";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  if (
    minutes < 60
  ) {

    return `${minutes}m ago`;

  }


  const hours =
    Math.floor(
      minutes / 60
    );


  if (
    hours < 24
  ) {

    return `${hours}h ago`;

  }


  const days =
    Math.floor(
      hours / 24
    );


  if (
    days < 30
  ) {

    return `${days}d ago`;

  }


  const months =
    Math.floor(
      days / 30
    );


  if (
    months < 12
  ) {

    return `${months}mo ago`;

  }


  const years =
    Math.floor(
      months / 12
    );


  return `${years}y ago`;

}


/* =========================================================
   CREATE SLUG
   ---------------------------------------------------------
   "My Cool Project"
   → "my-cool-project"
========================================================= */

export function createSlug(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    );

}


/* =========================================================
   FORMAT URL
========================================================= */

export function formatUrl(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  const url =
    value.trim();


  if (!url) {

    return "";

  }


  if (
    url.startsWith(
      "http://"
    ) ||
    url.startsWith(
      "https://"
    ) ||
    url.startsWith(
      "/"
    ) ||
    url.startsWith(
      "#"
    )
  ) {

    return url;

  }


  return `https://${url}`;

}


/* =========================================================
   FORMAT GITHUB REPOSITORY NAME
========================================================= */

export function formatRepositoryName(
  value
) {

  return formatProjectName(
    value
  );

}


/* =========================================================
   FORMAT LANGUAGE
========================================================= */

export function formatLanguage(
  value
) {

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  const languages = {

    js:
      "JavaScript",

    javascript:
      "JavaScript",

    jsx:
      "React",

    ts:
      "TypeScript",

    typescript:
      "TypeScript",

    html:
      "HTML",

    css:
      "CSS",

    scss:
      "SCSS",

    tailwind:
      "Tailwind CSS",

    python:
      "Python",

    java:
      "Java",

  };


  const normalized =
    value
      .trim()
      .toLowerCase();


  return (
    languages[
      normalized
    ] ||
    capitalize(value)
  );

}


/* =========================================================
   FORMAT PROJECT TECHNOLOGIES
========================================================= */

export function formatTechnologies(
  technologies
) {

  if (
    !Array.isArray(
      technologies
    )
  ) {

    return [];

  }


  return technologies.map(
    (technology) =>
      formatSkillName(
        technology
      )
  );

}


/* =========================================================
   FORMAT ARRAY
========================================================= */

export function formatArray(
  values
) {

  if (
    !Array.isArray(values)
  ) {

    return [];

  }


  return values
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    )
    .map(
      (value) =>
        typeof value === "string"
          ? value.trim()
          : value
    );

}


/* =========================================================
   FORMAT BOOLEAN
========================================================= */

export function formatBoolean(
  value
) {

  if (
    typeof value === "boolean"
  ) {

    return value;

  }


  if (
    typeof value === "string"
  ) {

    return (
      value.toLowerCase() ===
      "true"
    );

  }


  return Boolean(value);

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  capitalize,

  capitalizeWords,

  formatName,

  formatDisplayName,

  formatRole,

  formatRoles,

  formatTitle,

  formatLabel,

  formatSkillName,

  formatProjectName,

  formatDescription,

  truncateText,

  formatNumber,

  formatPercentage,

  formatDate,

  formatDateTime,

  formatRelativeDate,

  createSlug,

  formatUrl,

  formatRepositoryName,

  formatLanguage,

  formatTechnologies,

  formatArray,

  formatBoolean,

};
