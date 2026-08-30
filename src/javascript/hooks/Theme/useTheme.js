/* =========================================================
   USE THEME HOOK
   Nathan — Frontend Developer Portfolio

   Location:
   src/hooks/Theme/useTheme.js

   PURPOSE
   ---------------------------------------------------------
   Reusable light / dark theme management.

   Features:
   - Dark mode
   - Light mode
   - localStorage persistence
   - System preference fallback
   - data-theme attribute
   - light-theme / dark-theme classes
   - No Context required
========================================================= */

import {
  useEffect,
  useState,
} from "react";


/* =========================================================
   STORAGE KEY
========================================================= */

const THEME_STORAGE_KEY =
  "portfolio-theme";


/* =========================================================
   THEME VALUES
========================================================= */

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};


/* =========================================================
   GET SYSTEM THEME
========================================================= */

function getSystemTheme() {

  if (
    typeof window === "undefined"
  ) {

    return THEMES.DARK;

  }


  const prefersLight =
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;


  return prefersLight
    ? THEMES.LIGHT
    : THEMES.DARK;

}


/* =========================================================
   GET SAVED THEME
========================================================= */

function getSavedTheme() {

  if (
    typeof window === "undefined"
  ) {

    return null;

  }


  try {

    const savedTheme =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );


    if (
      savedTheme === THEMES.LIGHT ||
      savedTheme === THEMES.DARK
    ) {

      return savedTheme;

    }

  } catch (error) {

    console.warn(
      "Unable to read saved theme:",
      error
    );

  }


  return null;

}


/* =========================================================
   GET INITIAL THEME
========================================================= */

function getInitialTheme() {

  const savedTheme =
    getSavedTheme();


  if (
    savedTheme
  ) {

    return savedTheme;

  }


  return getSystemTheme();

}


/* =========================================================
   APPLY THEME
========================================================= */

function applyTheme(
  theme
) {

  if (
    typeof document === "undefined"
  ) {

    return;

  }


  const root =
    document.documentElement;


  /* =======================================================
     DATA ATTRIBUTE
  ======================================================= */

  root.setAttribute(
    "data-theme",
    theme
  );


  /* =======================================================
     LIGHT CLASS
  ======================================================= */

  root.classList.toggle(
    "light-theme",
    theme === THEMES.LIGHT
  );


  /* =======================================================
     DARK CLASS
  ======================================================= */

  root.classList.toggle(
    "dark-theme",
    theme === THEMES.DARK
  );


  /* =======================================================
     COLOR SCHEME
  ======================================================= */

  root.style.colorScheme =
    theme;

}


/* =========================================================
   SAVE THEME
========================================================= */

function saveTheme(
  theme
) {

  if (
    typeof window === "undefined"
  ) {

    return;

  }


  try {

    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme
    );

  } catch (error) {

    console.warn(
      "Unable to save theme:",
      error
    );

  }

}


/* =========================================================
   HOOK
========================================================= */

export default function useTheme() {

  const [
    theme,
    setThemeState
  ] = useState(
    getInitialTheme
  );


  /* =======================================================
     APPLY THEME WHEN IT CHANGES
  ======================================================= */

  useEffect(() => {

    applyTheme(
      theme
    );

    saveTheme(
      theme
    );

  }, [theme]);


  /* =======================================================
     TOGGLE THEME
  ======================================================= */

  const toggleTheme = () => {

    setThemeState(
      (currentTheme) => {

        if (
          currentTheme ===
          THEMES.DARK
        ) {

          return THEMES.LIGHT;

        }


        return THEMES.DARK;

      }
    );

  };


  /* =======================================================
     SET THEME
  ======================================================= */

  const setTheme = (
    newTheme
  ) => {

    if (
      newTheme !== THEMES.LIGHT &&
      newTheme !== THEMES.DARK
    ) {

      console.warn(
        `Invalid theme: ${newTheme}`
      );

      return;

    }


    setThemeState(
      newTheme
    );

  };


  /* =======================================================
     RESET TO SYSTEM THEME
  ======================================================= */

  const resetTheme = () => {

    const systemTheme =
      getSystemTheme();


    setThemeState(
      systemTheme
    );

  };


  /* =======================================================
     RETURN
  ======================================================= */

  return {

    /* =======================================================
       CURRENT THEME
    ======================================================= */

    theme,


    /* =======================================================
       BOOLEAN STATES
    ======================================================= */

    isDark:
      theme === THEMES.DARK,

    isLight:
      theme === THEMES.LIGHT,


    /* =======================================================
       ACTIONS
    ======================================================= */

    toggleTheme,

    setTheme,

    resetTheme,


    /* =======================================================
       CONSTANTS
    ======================================================= */

    themes:
      THEMES,

  };

}


/* =========================================================
   NAMED EXPORT
========================================================= */

export {
  THEMES,
  THEME_STORAGE_KEY,
  applyTheme,
};
