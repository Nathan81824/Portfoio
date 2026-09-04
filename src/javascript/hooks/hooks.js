/* =========================================================
   HOOKS
   Nathan — Frontend Developer Portfolio

   Central entry point for custom React hooks.

   HOOKS
   ---------------------------------------------------------
   useTheme
   → Theme state and theme controls

   useScroll
   → Scroll position and scroll-related behavior

   This file combines the hooks so they can be accessed
   from one central location.
========================================================= */


/* =========================================================
   THEME HOOK
========================================================= */

import useTheme
  from "./useTheme/useTheme.js";


/* =========================================================
   SCROLL HOOK
========================================================= */

import useScroll
  from "./useScroll/useScroll.js";


/* =========================================================
   HOOKS OBJECT
========================================================= */

const hooks = {

  useTheme,

  useScroll,

};


/* =========================================================
   NAMED EXPORTS
========================================================= */

export {

  useTheme,

  useScroll,

};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default hooks;