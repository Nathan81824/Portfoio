import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";


/* =========================================================
   BASE URL
========================================================= */

const basename =
  import.meta.env.BASE_URL.replace(
    /\/$/,
    ""
  );


/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      const serviceWorkerPath =
        `${import.meta.env.BASE_URL}sw.js`;


      navigator.serviceWorker
        .register(
          serviceWorkerPath
        )

        .then(
          (registration) => {

            console.log(
              "Service Worker registered:",
              registration.scope
            );

          }
        )

        .catch(
          (error) => {

            console.error(
              "Service Worker registration failed:",
              error
            );

          }
        );

    }
  );

}


/* =========================================================
   REACT APP
========================================================= */

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <BrowserRouter
      basename={basename}
    >

      <ThemeProvider>

        <App />

      </ThemeProvider>

    </BrowserRouter>

  </StrictMode>

);
