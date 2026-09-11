import { createContext, useContext, useEffect, useState } from "react";

import ThemeTransition from "../Effects/Transition/ThemeTransition";


const ThemeContext = createContext(null);


export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");

    return savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : "dark";
  });


  useEffect(() => {

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.documentElement.classList.toggle(
      "light-theme",
      theme === "light"
    );

    document.documentElement.classList.toggle(
      "dark-theme",
      theme === "dark"
    );

    localStorage.setItem(
      "portfolio-theme",
      theme
    );

  }, [theme]);


  const toggleTheme = () => {

    setTheme((currentTheme) =>
      currentTheme === "dark"
        ? "light"
        : "dark"
    );

  };


  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
      }}
    >

      <ThemeTransition />

      {children}

    </ThemeContext.Provider>
  );
}


export function useTheme() {

  const context = useContext(ThemeContext);


  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }


  return context;
}


export default ThemeContext;