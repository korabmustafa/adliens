import { getSettings } from "../api/endpoints";
import { isMediaUrl } from "../api/media";
import { useEffect, useRef, useState } from "react";
import { WorldLink } from "../components/WorldLink";

// Matching landscape and portrait films share the same planet palette and timing.
const defaultFilm = "/adliens-intro-landscape.mp4";

// Play the entrance once; leave the film's own closing identity on screen.
export function HomePage() {
  const film = useRef(null);
  const entrance = useRef(null);
  const resume = useRef(null);
  const [portrait, setPortrait] = useState(
    () => window.matchMedia("(max-aspect-ratio: 1/1)").matches,
  );
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
  const configuredFilm =
    siteFilm || import.meta.env.VITE_AGENCY_FILM_URL || defaultFilm;
  const bundledFilm = [
    defaultFilm,
    "/adliens-intro%20(2).mp4",
    "/adliens-intro (2).mp4",
    "/adliens-intro-mobile.mp4",
    "/adliens-intro-portrait.mp4",
  ].includes(configuredFilm);
  const videoUrl =
    bundledFilm && portrait
      ? "/adliens-intro-portrait.mp4"
      : bundledFilm
        ? defaultFilm
        : configuredFilm;
  const hasFilm = isMediaUrl(videoUrl) && !failed;
  const closingImage = bundledFilm
    ? portrait
      ? "/adliens-intro-portrait-end.webp"
      : "/adliens-intro-landscape-end.webp"
    : undefined;

  useEffect(() => {
    const query = window.matchMedia("(max-aspect-ratio: 1/1)");
    const change = () => {
      const video = film.current;
      if (video)
        resume.current = { time: video.currentTime, paused: video.paused };
      setPortrait(query.matches);
    };
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);

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
    if (!video || reduced || resume.current?.paused) return;
    // Muted inline autoplay is enabled initially; preserve user sound settings.
    video.defaultMuted = true;
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
      data-ended={ended}
      data-film-format={portrait ? "portrait" : "landscape"}
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
            onLoadedMetadata={() => {
              const previous = resume.current;
              if (!previous) return;
              film.current.currentTime = Math.min(
                previous.time,
                film.current.duration,
              );
              if (previous.paused) film.current.pause();
              resume.current = null;
            }}
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
