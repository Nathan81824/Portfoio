import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Shared/Navbar/Navbar.jsx";
import Footer from "./components/Shared/Footer/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import Admin from "./pages/Admin/Admin.jsx";

import ProtectedAdmin from "./components/Admin/ProtectedAdmin.jsx";
import ChatController from "./components/Contact/ChatController.jsx";

import NotFound from "./components/Detection/Error/NotFound.jsx";
import ServerError from "./components/Detection/Error/ServerError.jsx";

import PageTransition from "./components/Detection/Effects/Transition/PageTransition.jsx";
import { getData } from "./javascript/data/data.js";

/* =====================================================
PUBLIC PORTFOLIO
===================================================== */

function PublicPortfolio() { 
const data = getData();

return (  <div className="app">


    <PageTransition>

      <Navbar data={data} />

      <main className="app-content">

        <Routes>

          <Route
            path="/"
            element={<Home data={data} />}
          />

          <Route
            path="/about"
            element={<About data={data} />}
          />

          <Route
            path="/skills"
            element={<Skills data={data} />}
          />

          <Route
            path="/projects"
            element={<Projects data={data} />}
          />

          <Route
            path="/contact"
            element={<Contact data={data} />}
          />

        </Routes>

      </main>

      <Footer data={data} />

      <ChatController data={data} />

    </PageTransition>

  </div>



);
}

/* =====================================================
APP
===================================================== */

function App() {

const location = useLocation();

const pathname = location.pathname;

/* =====================================================
BOTTOM BLUR SCROLL CONTROL

```
 - Hidden at the top
 - Appears after scrolling 10vh
 - Disappears at the bottom
```

===================================================== */

useEffect(() => {


const handleScroll = () => {

  const scrollTop = window.scrollY;

  const viewportHeight = window.innerHeight;

  const documentHeight =
    document.documentElement.scrollHeight;


  const passedIntro =
    scrollTop > viewportHeight * 0.1;


  const reachedBottom =
    scrollTop + viewportHeight >=
    documentHeight - 10;


  document.documentElement.classList.toggle(
    "show-bottom-blur",
    passedIntro && !reachedBottom
  );

};


handleScroll();


window.addEventListener(
  "scroll",
  handleScroll,
  {
    passive: true,
  }
);


window.addEventListener(
  "resize",
  handleScroll
);


return () => {

  window.removeEventListener(
    "scroll",
    handleScroll
  );


  window.removeEventListener(
    "resize",
    handleScroll
  );

};


}, []);

/* =====================================================
SERVER ERROR
===================================================== */

if (
pathname === "/server-error" ||
pathname === "/500"
) {
return <ServerError />;
}

/* =====================================================
ADMIN LOGIN
===================================================== */

if (pathname === "/admin/login") {
return <AdminLogin />;
}

/* =====================================================
ADMIN ROUTES
===================================================== */

if (
pathname === "/admin" ||
pathname === "/admin/chat"
) {


return (
  <ProtectedAdmin>
    <Admin />
  </ProtectedAdmin>
);


}

/* =====================================================
VALID PUBLIC ROUTES
===================================================== */

const publicRoutes = [
"/",
"/about",
"/skills",
"/projects",
"/contact",
];

if (publicRoutes.includes(pathname)) {
return <PublicPortfolio />;
}

/* =====================================================
404 — STANDALONE
===================================================== */

return <NotFound />;
}

export default App;
