import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon, Download } from "lucide-react";

import { useTheme } from "../../../context/ThemeContext";
import { getData } from "../../../javascript/data/data";
import Button from "../Button/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { personalInfo, roles, navLinks } = getData();

  // Toggle a subtle "scrolled" style once the user scrolls past the hero area
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 120);

    handleScroll(); // set initial state on mount
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a
          href="#home"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="Go to home"
        >
          {personalInfo?.name?.charAt(0).toUpperCase()}
        </a>

        {/* Desktop navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks?.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="navbar-link"
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right side: theme toggle, resume, mobile menu trigger */}
        <div className="navbar-right">
          <button
            type="button"
            className="navbar-theme"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <Sun size={17} strokeWidth={1.8} />
            ) : (
              <Moon size={17} strokeWidth={1.8} />
            )}
          </button>

          <Button
            href={personalInfo?.resume}
            variant="primary"
            size="sm"
            icon={Download}
            download
            className="navbar-resume"
          >
            Resume
          </Button>

          <button
            type="button"
            className="navbar-menu-button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={19} strokeWidth={1.8} />
            ) : (
              <Menu size={19} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu" role="dialog" aria-label="Mobile navigation">
          <div className="navbar-mobile-header">
            <div>
              <span className="navbar-mobile-label">NAVIGATION</span>
              <h3>Explore</h3>
            </div>

            <button
              type="button"
              className="navbar-mobile-close"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          <nav className="navbar-mobile-links" aria-label="Mobile navigation">
            {navLinks?.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                className="navbar-mobile-link"
                onClick={closeMenu}
              >
                <span className="navbar-mobile-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="navbar-mobile-link-text">{link.name}</span>
              </a>
            ))}
          </nav>

          <Button
            href={personalInfo?.resume}
            variant="primary"
            size="md"
            icon={Download}
            download
            className="navbar-resume-mobile"
          >
            Resume
          </Button>

          <div className="navbar-mobile-footer">
            <span>{personalInfo?.name?.toUpperCase()}</span>
            <span className="navbar-mobile-dot" />
            <span>{roles?.[0] || "Developer"}</span>
          </div>
        </div>
      )}
    </header>
  );
}