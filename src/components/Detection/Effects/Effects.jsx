/* =========================================================
   EFFECTS
   Nathan — Frontend Developer Portfolio

   Central effects export.

   Global effects:
   - CursorGlow
   - BackgroundParticles
   - PageTransition
   - SmoothScroll

   Reusable effects:
   - ScrollReveal
   - TextScramble
   ========================================================= */


/* =========================================================
   GLOBAL EFFECTS
========================================================= */

import CursorGlow from "./CursorGlow/CursorGlow.jsx";
import BackgroundParticles from "./BackgroundParticles/BackgroundParticles.jsx";
import PageTransition from "./Transition/PageTransition.jsx";


/* =========================================================
   REUSABLE EFFECTS
========================================================= */

import ScrollReveal from "./ScrollReveal/ScrollReveal.jsx";
import TextScramble from "./TextScramble/TextScramble.jsx";


/* =========================================================
   GLOBAL EFFECT COMPONENT
========================================================= */

function Effects() {
  return (
    <>
      <CursorGlow />
      <BackgroundParticles />
    </>
  );
}


/* =========================================================
   EFFECT EXPORTS
========================================================= */

export {
  CursorGlow,
  BackgroundParticles,
  PageTransition,
  ScrollReveal,
  TextScramble,
};


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default Effects;