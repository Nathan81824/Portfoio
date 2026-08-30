/* =========================================================
   SCROLL TO SECTION
   Nathan — Frontend Developer Portfolio

   Location:
   src/javascript/utils/scrollToSection.js

   PURPOSE
   ---------------------------------------------------------
   Reusable smooth-scrolling utility.

   Used for:
   - Navbar navigation
   - Hero buttons
   - Scroll indicators
   - "View Projects"
   - "About Me"
   - Contact buttons
   - Back-to-section navigation

   IMPORTANT
   ---------------------------------------------------------
   Works with normal HTML IDs:

   <section id="projects">
      ...
   </section>

   Then:

   scrollToSection("projects");
========================================================= */


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

export const SCROLL_CONFIG = {

  /* Distance from top of viewport */

  offset:
    0,


  /* Scroll behavior */

  behavior:
    "smooth",

};


/* =========================================================
   GET ELEMENT
========================================================= */

function getSectionElement(
  section
) {

  if (
    typeof document === "undefined"
  ) {

    return null;

  }


  /* =======================================================
     ELEMENT WAS PASSED DIRECTLY
  ======================================================= */

  if (
    section instanceof Element
  ) {

    return section;

  }


  /* =======================================================
     INVALID VALUE
  ======================================================= */

  if (
    typeof section !== "string"
  ) {

    return null;

  }


  let id =
    section.trim();


  if (!id) {

    return null;

  }


  /* =======================================================
     REMOVE # IF PROVIDED
  ======================================================= */

  if (
    id.startsWith("#")
  ) {

    id =
      id.slice(1);

  }


  /* =======================================================
     FIND ELEMENT
  ======================================================= */

  return document.getElementById(
    id
  );

}


/* =========================================================
   SCROLL TO SECTION
========================================================= */

export function scrollToSection(
  section,
  options = {}
) {

  const element =
    getSectionElement(
      section
    );


  if (!element) {

    console.warn(
      `Scroll target "${section}" was not found.`
    );

    return false;

  }


  const {

    offset =
      SCROLL_CONFIG.offset,

    behavior =
      SCROLL_CONFIG.behavior,

  } = options;


  /* =======================================================
     ELEMENT POSITION
  ======================================================= */

  const elementTop =
    element.getBoundingClientRect()
      .top;


  const currentScroll =
    window.scrollY;


  const targetPosition =
    elementTop +
    currentScroll -
    offset;


  /* =======================================================
     SCROLL
  ======================================================= */

  window.scrollTo({

    top:
      Math.max(
        targetPosition,
        0
      ),

    behavior,

  });


  return true;

}


/* =========================================================
   SCROLL TO TOP
========================================================= */

export function scrollToTop(
  options = {}
) {

  const {

    behavior =
      SCROLL_CONFIG.behavior,

  } = options;


  if (
    typeof window === "undefined"
  ) {

    return;

  }


  window.scrollTo({

    top: 0,

    behavior,

  });

}


/* =========================================================
   SCROLL TO BOTTOM
========================================================= */

export function scrollToBottom(
  options = {}
) {

  const {

    behavior =
      SCROLL_CONFIG.behavior,

  } = options;


  if (
    typeof window === "undefined"
  ) {

    return;

  }


  window.scrollTo({

    top:
      document.documentElement
        .scrollHeight,

    behavior,

  });

}


/* =========================================================
   CHECK SECTION
========================================================= */

export function sectionExists(
  section
) {

  return Boolean(
    getSectionElement(
      section
    )
  );

}


/* =========================================================
   GET SECTION POSITION
========================================================= */

export function getSectionPosition(
  section,
  offset = 0
) {

  const element =
    getSectionElement(
      section
    );


  if (!element) {

    return null;

  }


  return (
    element.getBoundingClientRect()
      .top +
    window.scrollY -
    offset
  );

}


/* =========================================================
   SCROLL WITH CUSTOM OFFSET
========================================================= */

export function scrollToSectionWithOffset(
  section,
  offset = 0,
  behavior = "smooth"
) {

  return scrollToSection(
    section,
    {
      offset,
      behavior,
    }
  );

}


/* =========================================================
   SCROLL TO ELEMENT
========================================================= */

export function scrollToElement(
  element,
  options = {}
) {

  return scrollToSection(
    element,
    options
  );

}


/* =========================================================
   HANDLE NAVIGATION CLICK
   ---------------------------------------------------------
   Useful for Navbar links.

   Example:

   onClick={(event) =>
     handleScrollClick(
       event,
       "projects"
     )
   }
========================================================= */

export function handleScrollClick(
  event,
  section,
  options = {}
) {

  if (event) {

    event.preventDefault();

  }


  return scrollToSection(
    section,
    options
  );

}


/* =========================================================
   CREATE SCROLL HANDLER
   ---------------------------------------------------------
   Useful when creating reusable navigation links.

   Example:

   onClick={createScrollHandler("about")}
========================================================= */

export function createScrollHandler(
  section,
  options = {}
) {

  return (
    event
  ) => {

    handleScrollClick(
      event,
      section,
      options
    );

  };

}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {

  scrollToSection,

  scrollToTop,

  scrollToBottom,

  sectionExists,

  getSectionPosition,

  scrollToSectionWithOffset,

  scrollToElement,

  handleScrollClick,

  createScrollHandler,

};

