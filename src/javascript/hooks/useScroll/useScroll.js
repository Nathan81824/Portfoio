/* =========================================================
   USE SCROLL HOOK
   Nathan — Frontend Developer Portfolio

   Location:
   src/hooks/useScroll/useScroll.js

   PURPOSE
   ---------------------------------------------------------
   Reusable scroll state for:
   - Navbar
   - Hero
   - Scroll indicators
   - Back-to-top buttons
   - Scroll progress
   - Scroll direction
========================================================= */

import { useEffect, useState } from "react";


/* =========================================================
   DEFAULT THRESHOLD
========================================================= */

const DEFAULT_THRESHOLD = 20;


/* =========================================================
   HOOK
========================================================= */

export default function useScroll(
  threshold = DEFAULT_THRESHOLD
) {

  /* =======================================================
     CURRENT SCROLL POSITION
  ======================================================= */

  const [
    scrollY,
    setScrollY
  ] = useState(() => {

    if (
      typeof window === "undefined"
    ) {

      return 0;

    }

    return window.scrollY;

  });


  /* =======================================================
     SCROLLED STATE
  ======================================================= */

  const [
    isScrolled,
    setIsScrolled
  ] = useState(() => {

    if (
      typeof window === "undefined"
    ) {

      return false;

    }

    return (
      window.scrollY >
      threshold
    );

  });


  /* =======================================================
     SCROLL DIRECTION
  ======================================================= */

  const [
    scrollDirection,
    setScrollDirection
  ] = useState("up");


  /* =======================================================
     SCROLL PROGRESS
     0 → 1
  ======================================================= */

  const [
    scrollProgress,
    setScrollProgress
  ] = useState(0);


  /* =======================================================
     SCROLL HANDLER
  ======================================================= */

  useEffect(() => {

    if (
      typeof window === "undefined"
    ) {

      return;

    }


    let previousScrollY =
      window.scrollY;


    /* =====================================================
       HANDLE SCROLL
    ===================================================== */

    const handleScroll = () => {

      const currentScrollY =
        window.scrollY;


      /* ===================================================
         SCROLL POSITION
      =================================================== */

      setScrollY(
        currentScrollY
      );


      /* ===================================================
         SCROLLED STATE
      =================================================== */

      setIsScrolled(
        currentScrollY >
        threshold
      );


      /* ===================================================
         SCROLL DIRECTION
      =================================================== */

      if (
        currentScrollY >
        previousScrollY
      ) {

        setScrollDirection(
          "down"
        );

      } else if (
        currentScrollY <
        previousScrollY
      ) {

        setScrollDirection(
          "up"
        );

      }


      previousScrollY =
        currentScrollY;


      /* ===================================================
         SCROLL PROGRESS
      =================================================== */

      const documentHeight =
        document.documentElement
          .scrollHeight;

      const viewportHeight =
        window.innerHeight;

      const scrollableHeight =
        documentHeight -
        viewportHeight;


      if (
        scrollableHeight <= 0
      ) {

        setScrollProgress(0);

      } else {

        const progress =
          currentScrollY /
          scrollableHeight;


        setScrollProgress(
          Math.min(
            Math.max(
              progress,
              0
            ),
            1
          )
        );

      }

    };


    /* =====================================================
       INITIAL UPDATE
    ===================================================== */

    handleScroll();


    /* =====================================================
       EVENT LISTENER
    ===================================================== */

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, [threshold]);


  /* =========================================================
     RETURN VALUES
  ========================================================= */

  return {

    /* =======================================================
       POSITION
    ======================================================= */

    scrollY,


    /* =======================================================
       BASIC STATES
    ======================================================= */

    isScrolled,

    atTop:
      scrollY <= 0,


    atBottom:
      typeof document !== "undefined"
        ? window.innerHeight +
            window.scrollY >=
          document.documentElement
            .scrollHeight - 2
        : false,


    /* =======================================================
       DIRECTION
    ======================================================= */

    scrollDirection,

    isScrollingDown:
      scrollDirection === "down",

    isScrollingUp:
      scrollDirection === "up",


    /* =======================================================
       PROGRESS
    ======================================================= */

    scrollProgress,

    scrollPercentage:
      Math.round(
        scrollProgress * 100
      ),

  };

}
