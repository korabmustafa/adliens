import { useRef } from "react";
import { WorldLink } from "../components/WorldLink";
import { AlienMark } from "../components/Planet";
export function HomePage() {
  const film = useRef(null);
  const videoUrl = import.meta.env.VITE_AGENCY_FILM_URL;
  const hasFilm = /^https:\/\//.test(videoUrl || "");
  return (
    <div className="arrival-page">
      <section className="arrival-stage">
        <div className="arrival-grid" aria-hidden="true" />
        <div className="arrival-eclipse" aria-hidden="true">
          <span />
          <AlienMark />
        </div>
        <div className="arrival-coordinates">
          TRANSMISSION FROM PLANET EARTH{" "}
          <span>ADLIENS / INDEPENDENT CREATIVE AGENCY</span>
        </div>
        <div className="arrival-copy">
          <p className="eyebrow">
            FOR BRANDS THAT WERE NEVER MEANT TO BLEND IN
          </p>
          <h1>
            Some brands exist.
            <br />
            <em>Others create worlds.</em>
          </h1>
          <p>
            We’re Adliens. Strategy, design, and campaigns
            <br />
            with a gravitational pull of their own.
          </p>
          <div className="arrival-actions">
            <WorldLink to="/universe" className="primary-button">
              Enter our universe <span>↗</span>
            </WorldLink>
            <a href="#agency-film" className="film-link">
              ◎ {hasFilm ? "Watch our story" : "Our story / Film coming soon"}{" "}
              <span>↓</span>
            </a>
          </div>
        </div>
        <footer className="arrival-footer">
          <span>ALIEN THINKING. HUMAN CONNECTION.</span>
          <span>YOUR NEXT CHAPTER STARTS HERE ↓</span>
        </footer>
      </section>
      <section id="agency-film" className="agency-film-section">
        <p className="eyebrow">TRANSMISSION 001 / THE ADLIENS STORY</p>
        <h2>
          A little introduction.
          <br />
          <em>A different perspective.</em>
        </h2>
        <div className={`agency-film-frame ${hasFilm ? "has-film" : ""}`}>
          {hasFilm ? (
            <video
              ref={film}
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              aria-label="Introducing Adliens agency"
            />
          ) : (
            <>
              <div className="film-placeholder-mark">
                <AlienMark />
              </div>
              <span className="film-timecode">ADLIENS / THE AGENCY FILM</span>
              <div className="film-placeholder-copy">
                <p>EVERY UNIVERSE HAS AN ORIGIN STORY.</p>
                <h3>Ours is coming into focus.</h3>
                <span>Agency introduction film · Coming soon</span>
              </div>
              <span className="film-corner">[ SIGNAL IN PRODUCTION ]</span>
            </>
          )}
        </div>
        <WorldLink to="/universe" className="text-link">
          Until then, let the work introduce us. Enter the universe ↗
        </WorldLink>
      </section>
    </div>
  );
}
