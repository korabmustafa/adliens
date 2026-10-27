import { getSettings } from "../api/endpoints";
import { isMediaUrl } from "../api/media";
import { useEffect, useRef, useState } from "react";
import { WorldLink } from "../components/WorldLink";

// An isolated entrance: the site's layout is mounted only after entering.
export function HomePage() {
  const film = useRef(null);
  const entrance = useRef(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [siteFilm, setSiteFilm] = useState(null);
  useEffect(() => {
    if (import.meta.env.VITE_USE_MOCK_DATA === "false") {
      let active = true;
      getSettings()
        .then((s) => {
          if (active) setSiteFilm(s.filmUrl);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }
  }, []);
  const videoUrl = siteFilm || import.meta.env.VITE_AGENCY_FILM_URL || "/adliens-intro.mp4";
  const hasFilm = isMediaUrl(videoUrl) && !failed;
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    entrance.current?.focus({ preventScroll: true });
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduced(preference.matches);
      if (preference.matches) film.current?.pause();
    };
    preference.addEventListener("change", change);
    return () => {
      document.body.style.overflow = previous;
      preference.removeEventListener("change", change);
    };
  }, []);
  return (
    <main
      ref={entrance}
      tabIndex={-1}
      className="cinema-entry"
      aria-label="Welcome to Adliens"
    >
      {hasFilm ? (
        <video
          ref={film}
          className="cinema-film"
          src={videoUrl}
          autoPlay={!reduced}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          aria-label="Adliens introduction film"
          onError={() => setFailed(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : (
        <div className="cinema-still" aria-hidden="true">
          <span className="cinema-halo" />
        </div>
      )}
      <div className="cinema-shade" aria-hidden="true" />
      <div className="cinema-signature" aria-hidden="true">
        INDEPENDENT CREATIVE LIFE FORMS
      </div>
      <div className="cinema-identity">
        <p>YOU ARE ENTERING A DIFFERENT WORLD</p>
        <h1>
          adliens<span>✳</span>
        </h1>
        <span className="cinema-tagline">
          ALIEN THINKING. HUMAN CONNECTION.
        </span>
      </div>
      <div className="cinema-enter">
        <WorldLink to="/universe" className="cinema-enter-link">
          Enter our universe <span>↗</span>
        </WorldLink>
      </div>
      {hasFilm && (
        <div className="cinema-controls">
          <button
            onClick={() => {
              if (film.current.paused)
                film.current.play().catch(() => setPlaying(false));
              else film.current.pause();
            }}
            aria-label={
              playing ? "Pause introduction film" : "Play introduction film"
            }
          >
            {playing ? "Ⅱ Pause film" : "▷ Play film"}
          </button>
          <button
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Enable film sound" : "Mute film sound"}
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>
      )}
    </main>
  );
}
