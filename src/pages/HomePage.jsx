import { getSettings } from "../api/endpoints";
import { isMediaUrl } from "../api/media";
import { useEffect, useRef, useState } from "react";
import { WorldLink } from "../components/WorldLink";

const defaultFilm = "/adliens-intro%20(2).mp4";

// Play the entrance once; leave the film's own closing identity on screen.
export function HomePage() {
  const film = useRef(null);
  const entrance = useRef(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [blocked, setBlocked] = useState(false);
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
  const videoUrl =
    siteFilm || import.meta.env.VITE_AGENCY_FILM_URL || defaultFilm;
  const hasFilm = isMediaUrl(videoUrl) && !failed;
  const closingImage =
    videoUrl === defaultFilm ? "/adliens-intro-end.webp" : undefined;

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

  useEffect(() => {
    const video = film.current;
    if (!video || reduced) return;
    // Set both properties before play() for inline muted playback on iOS.
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(() => setBlocked(true));
  }, [videoUrl, hasFilm, reduced]);

  function togglePlayback() {
    const video = film.current;
    if (!video || ended) return;
    if (video.paused) video.play().catch(() => setBlocked(true));
    else video.pause();
  }

  return (
    <main
      ref={entrance}
      tabIndex={-1}
      className="cinema-entry"
      aria-label="Welcome to Adliens"
    >
      <div className="cinema-screen">
        {hasFilm ? (
          <video
            ref={film}
            className="cinema-film"
            src={videoUrl}
            poster={closingImage}
            autoPlay={!reduced}
            muted={muted}
            playsInline
            preload="auto"
            aria-label="Adliens introduction film"
            onError={() => setFailed(true)}
            onPlay={() => {
              setPlaying(true);
              setBlocked(false);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setEnded(true);
              setPlaying(false);
            }}
          />
        ) : (
          <div className="cinema-fallback">
            <h1>
              adliens<span>✳</span>
            </h1>
          </div>
        )}
        {ended && closingImage && (
          <img
            className="cinema-closing"
            src={closingImage}
            alt="Adliens — Alien thinking. Human connection."
          />
        )}
        {hasFilm && !ended && (blocked || reduced) && !playing && (
          <button className="cinema-start" onClick={togglePlayback}>
            Play intro <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      <footer className="cinema-footer">
        <WorldLink to="/universe" className="cinema-enter-link">
          {ended || !hasFilm || reduced ? "Enter our universe" : "Skip intro"}{" "}
          <span aria-hidden="true">↗</span>
        </WorldLink>
        {hasFilm && !ended && (
          <div className="cinema-controls">
            <button
              onClick={togglePlayback}
              aria-label={
                playing ? "Pause introduction film" : "Play introduction film"
              }
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "Enable film sound" : "Mute film sound"}
            >
              {muted ? "Sound on" : "Mute"}
            </button>
          </div>
        )}
      </footer>
    </main>
  );
}
