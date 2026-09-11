import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Detection from "./components/Detection/Detection.jsx";
import { ThemeProvider } from "./components/Detection/context/ThemeContext.jsx";
import ThemeTransition from "./components/Detection/Effects/Transition/ThemeTransition.jsx";

import "./index.css";
import "./App.css";

const rootElement = document.getElementById("root");

const isGitHubPages =
window.location.hostname.endsWith("github.io");

const basename = isGitHubPages
? "/Portfoio"
: "/";

const root = createRoot(rootElement);

root.render(
<React.StrictMode>
<BrowserRouter basename={basename}>
<ThemeProvider>
<Detection>
<ThemeTransition />
<App />
</Detection>
</ThemeProvider>
</BrowserRouter>
</React.StrictMode>
);