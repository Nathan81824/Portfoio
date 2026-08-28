import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
const [theme, setTheme] = useState("dark");

const toggleTheme = () => {
setTheme((currentTheme) =>
currentTheme === "dark" ? "light" : "dark"
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
{children}
</ThemeContext.Provider>
);
}

export function useTheme() {
const context = useContext(ThemeContext);

if (!context) {
throw new Error("useTheme must be used inside ThemeProvider");
}

return context;
}

export default ThemeContext;
