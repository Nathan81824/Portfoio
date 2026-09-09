import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import App from "./App.jsx";

import {
ThemeProvider,
} from "./components/Detection/context/ThemeContext.jsx";

import Detection from "./components/Detection/Detection.jsx";

import "./index.css";

/* =====================================================
GITHUB PAGES BASE PATH
===================================================== */

const basename = "/Portfoio";

/* =====================================================
SERVICE WORKER
===================================================== */

registerSW({
immediate: true,

onOfflineReady() {
console.log("✅ App is ready to work offline.");
},

onNeedRefresh() {
console.log("🔄 New version of the app is available.");
},

onRegisteredSW(swUrl, registration) {
console.log("✅ Service Worker registered:", swUrl);


if (registration) {
  console.log("✅ Offline caching is active.");
}


},

onRegisterError(error) {
console.error(
"❌ Service worker registration failed:",
error
);
},
});

/* =====================================================
REACT ROOT
===================================================== */

createRoot(
document.getElementById("root")
).render( <StrictMode> <BrowserRouter basename={basename}> <ThemeProvider> <Detection> <App /> </Detection> </ThemeProvider> </BrowserRouter> </StrictMode>
);
