import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Shared/Navbar/Navbar.jsx";
import Footer from "./components/Shared/Footer/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Skills from "./pages/Skills.jsx";
import Projects from "./pages/Projects.jsx";
import Contact from "./pages/Contact.jsx";

import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminChat from "./pages/Admin/Admin.jsx";

import ProtectedAdmin from "./components/Admin/ProtectedAdmin.jsx";
import ChatController from "./components/Contact/ChatController.jsx";

import NotFound from "./components/Detection/Error/NotFound.jsx";
import ServerError from "./components/Detection/Error/ServerError.jsx";

import { getData } from "./javascript/data/data.js";
import PageTransition from "./components/Detection/Effects/PageTransition/PageTransition.jsx";

/* =====================================================
PUBLIC PORTFOLIO
===================================================== */

function PublicPortfolio() {
const data = getData();

return (
<> <Navbar data={data} />

<PageTransition>

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

  </PageTransition>

  <Footer data={data} />

  <ChatController data={data} />
</>


);
}

/* =====================================================
APP
===================================================== */

function App() {
const location = useLocation();

const pathname = location.pathname;

/* =====================================================
500 ERROR PAGE
===================================================== */

if (pathname === "/500") {
return <ServerError />;
}

/* =====================================================
ADMIN ROUTES
===================================================== */

if (pathname === "/admin/login") {
return <AdminLogin />;
}

if (
pathname === "/admin" ||
pathname === "/admin/chat"
) {
return ( <ProtectedAdmin> <AdminChat /> </ProtectedAdmin>
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
