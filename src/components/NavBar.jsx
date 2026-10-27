import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
const items = [
  ["/work", "The universe"],
  ["/services", "Our expertise"],
  ["/about", "The agency"],
];
export function NavBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Link to="/" className="wordmark" aria-label="Adliens home">
        adliens<span>✳</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {items.map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="theme-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "◐" : "◑"}
        </button>
        <Link to="/contact" className="header-cta">
          Make contact <span>↗</span>
        </Link>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close −" : "Menu +"}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[["/", "Home"], ...items, ["/contact", "Start a project"]].map(
            ([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                aria-current={pathname === to ? "page" : undefined}
              >
                {label} <span>↗</span>
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
