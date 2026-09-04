import { useEffect, useState } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("portfolio-theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return true;
  });


  useEffect(() => {
    const theme = darkMode
      ? "dark"
      : "light";

    document.documentElement.classList.toggle(
      "light-theme",
      !darkMode
    );

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "portfolio-theme",
      theme
    );
  }, [darkMode]);


  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };


  return {
    darkMode,
    toggleTheme,
    theme: darkMode
      ? "dark"
      : "light",
  };
}