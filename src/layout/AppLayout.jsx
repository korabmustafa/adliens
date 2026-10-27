import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";
export function AppLayout() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, location.state?.restoreScroll || 0);
    const frame = requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.state]);
  return (
    <div className="public-site">
      <NavBar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
