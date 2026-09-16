import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import Detection from "./components/Detection/Detection.jsx";

import {
  ThemeProvider,
} from "./components/Detection/context/ThemeContext.jsx";

import ThemeTransition from "./components/Detection/Effects/Transition/ThemeTransition.jsx";

import SmoothScroll from "./components/Detection/Effects/ScrololEffect/SmoothScrolling.jsx";

import "./index.css";
import "./App.css";


/* =====================================================
   ROOT ELEMENT
===================================================== */

const rootElement =
  document.getElementById("root");


if (!rootElement) {
  throw new Error(
    "Root element #root was not found."
  );
}


/* =====================================================
   GITHUB PAGES DETECTION
===================================================== */

const isGitHubPages =
  window.location.hostname.endsWith(
    "github.io"
  );


/* =====================================================
   ROUTER BASENAME
===================================================== */

const basename =
  isGitHubPages
    ? "/Portfoio"
    : "/";


/* =====================================================
   CREATE ROOT
===================================================== */

const root =
  createRoot(rootElement);


/* =====================================================
   RENDER APPLICATION
===================================================== */

root.render(
  <React.StrictMode>

    <BrowserRouter
      basename={basename}
    >

      <ThemeProvider>

        <SmoothScroll />

        <Detection>

          <ThemeTransition />

          <App />

        </Detection>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);