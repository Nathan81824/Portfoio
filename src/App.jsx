import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Shared/Navbar/Navbar.jsx";
import Footer from "./components/Shared/Footer/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import Admin from "./pages/Admin/Admin.jsx";

import ProtectedAdmin from "./components/Admin/ProtectedAdmin.jsx";
import ChatController from "./components/Contact/ChatController.jsx";

import PageTransition from "./components/Detection/Effects/Transition/PageTransition.jsx";

import { getData } from "./javascript/index.js";

import {
  isAdminLoginRoute,
  isAdminRoute,
  isPublicRoute,
} from "./App.js";

function PublicPortfolio() {
  const data = getData();

  return (
    <div className="app">
      <PageTransition>
        <Navbar data={data} />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home data={data} />} />
            <Route path="/about" element={<About data={data} />} />
            <Route path="/skills" element={<Skills data={data} />} />
            <Route path="/projects" element={<Projects data={data} />} />
            <Route path="/contact" element={<Contact data={data} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer data={data} />

        <ChatController data={data} />
      </PageTransition>
    </div>
  );
}

function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const passedIntro =
        scrollTop > viewportHeight * 0.1;

      const reachedBottom =
        scrollTop + viewportHeight >= documentHeight - 10;

      document.documentElement.classList.toggle(
        "show-bottom-blur",
        passedIntro && !reachedBottom
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
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
  }, [pathname]);

  if (isAdminLoginRoute(pathname)) {
    return <AdminLogin />;
  }

  if (isAdminRoute(pathname)) {
    return (
      <ProtectedAdmin>
        <Admin />
      </ProtectedAdmin>
    );
  }

  if (isPublicRoute(pathname)) {
    return <PublicPortfolio />;
  }

  return <NotFound />;
}

export default App;