import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AlienMark, Planet } from "./Planet";
import { WorldLink } from "./WorldLink";
import { getCaseStudies } from "../api/endpoints";

export function useProjects() {
  const [state, setState] = useState({ projects: [], status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getCaseStudies({ publishedOnly: true })
      .then((projects) => {
        if (active) setState({ projects, status: "success" });
      })
      .catch(() => {
        if (active) setState({ projects: [], status: "error" });
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return {
    ...state,
    retry: () => {
      setState((s) => ({ ...s, status: "loading" }));
      setAttempt((a) => a + 1);
    },
  };
}

export function ProjectArt({ project, variant = 0 }) {
  const [failedUrl, setFailedUrl] = useState(null);
  if (
    /^https:\/\//.test(project.imageUrl || "") &&
    failedUrl !== project.imageUrl
  )
    return (
      <div className="project-art uploaded-art">
        <img
          src={project.imageUrl}
          alt={`${project.name} — ${project.companyName}`}
          loading="lazy"
          onError={() => setFailedUrl(project.imageUrl)}
        />
      </div>
    );
  return (
    <div className={`project-art art-${variant % 3}`} aria-hidden="true">
      <div className="art-orbit" />
      <div className="art-object" />
      <span className="art-caption">ADLIENS — CREATIVE EXPLORATIONS</span>
      <strong>
        {variant % 2 === 0 ? (
          <>
            Beyond
            <br />
            <em>ordinary.</em>
          </>
        ) : (
          <>
            Make
            <br />
            <em>your move.</em>
          </>
        )}
      </strong>
      <span className="art-brand">{project.companyName}</span>
      <span className="art-star">✳</span>
    </div>
  );
}

const positions = [
  [23, 49],
  [78, 39],
  [68, 78],
  [38, 80],
];
const stars = Array.from({ length: 85 }, (_, i) => ({
  left: `${(i * 73.17) % 100}%`,
  top: `${(i * 37.71) % 100}%`,
  animationDelay: `${i % 9}s`,
  opacity: 0.15 + (i % 6) / 10,
}));

export function ProjectWorkspace({ compact = false }) {
  const { projects, status, retry } = useProjects();
  const [params, setParams] = useSearchParams();
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);
  const scene = useRef(null);
  const view = params.get("view") === "list" ? "list" : "explore";
  const filter = params.get("service") || "All work";
  const { pathname } = useLocation();
  const services = [
    "All work",
    ...new Set(projects.flatMap((p) => p.services || [])),
  ];
  const filtered = projects.filter(
    (p) => filter === "All work" || p.services?.includes(filter),
  );
  const worlds = [
    ...new Map(
      filtered.map((p) => [p.companyId || p.companyName || p.id, p]),
    ).values(),
  ];
  const sectors = Math.max(1, Math.ceil(worlds.length / positions.length));
  const sector = Math.min(
    Math.max(0, Number(params.get("sector")) || 0),
    sectors - 1,
  );
  const visible = worlds.slice(
    sector * positions.length,
    (sector + 1) * positions.length,
  );
  const sampleMode = import.meta.env.VITE_USE_MOCK_DATA !== "false";
  const active = worlds.find((p) => p.id === hovered);
  function change(key, value) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, String(value));
        if (key === "service") next.delete("sector");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }
  const destination = (p, campaign = false) =>
    `/work/${encodeURIComponent(p.companyId || p.id)}${campaign ? `?campaign=${encodeURIComponent(p.id)}` : ""}`;
  const returnState = () => ({
    returnTo: pathname + "?" + params.toString(),
    scrollY: window.scrollY,
  });
  const campaignCount = (p) =>
    projects.filter(
      (x) =>
        (x.companyId || x.companyName || x.id) ===
        (p.companyId || p.companyName || p.id),
    ).length;
  return (
    <section
      ref={scene}
      className={`star-system ${compact ? "home-system" : ""} ${paused ? "motion-paused" : ""}`}
      id="selected-work"
      aria-labelledby="work-heading"
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          paused ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        scene.current.style.setProperty(
          "--parallax-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 14}px`,
        );
        scene.current.style.setProperty(
          "--parallax-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * 10}px`,
        );
      }}
      onPointerLeave={() => {
        scene.current.style.setProperty("--parallax-x", "0px");
        scene.current.style.setProperty("--parallax-y", "0px");
      }}
    >
      <div className="starfield" aria-hidden="true">
        {stars.map((style, i) => (
          <i key={i} style={style} />
        ))}
      </div>
      <div className="nebula nebula-one" aria-hidden="true" />
      <div className="nebula nebula-two" aria-hidden="true" />
      <header className="system-intro">
        <p className="eyebrow">
          <span /> INDEPENDENT CREATIVE LIFE FORMS
        </p>
        <h1 id="work-heading">
          We come in peace.
          <br />
          <em>We leave an impact.</em>
        </h1>
        <p>
          A universe of brands. A different kind of agency.
          <br />
          Choose a world. Discover what we made.
        </p>
      </header>
      <div className="system-controls">
        <div className="view-switch" aria-label="Project view">
          <button
            aria-pressed={view === "explore"}
            onClick={() => change("view", "explore")}
          >
            ◎ <span>Explore</span>
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => change("view", "list")}
          >
            ☷ <span>All projects</span>
          </button>
        </div>
        <button
          className="orbit-control"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "▷ Resume motion" : "Ⅱ Pause motion"}
        </button>
      </div>
      {!compact && (
        <div className="filters system-filters" aria-label="Filter by service">
          {services.map((s) => (
            <button
              key={s}
              aria-pressed={filter === s}
              onClick={() => change("service", s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {status === "loading" && (
        <div className="system-loading" role="status">
          <span className="radar-loader" /> Establishing contact…
        </div>
      )}
      {status === "error" && (
        <div className="system-loading" role="alert">
          Signal interrupted.{" "}
          <button className="text-link" onClick={retry}>
            Reconnect ↗
          </button>
        </div>
      )}
      {status === "success" &&
        (view === "explore" ? (
          <div
            className={`orbital-map ${visible.length > 2 ? "dense-map" : ""}`}
            aria-label="Adliens client star system"
          >
            <svg
              className="orbital-paths"
              viewBox="0 0 1000 700"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g transform="rotate(-20 510 360)">
                <ellipse cx="510" cy="360" rx="235" ry="145" />
                <ellipse cx="510" cy="360" rx="405" ry="235" />
                <ellipse cx="510" cy="360" rx="490" ry="295" />
              </g>
              <path
                d="M510 360L230 343 M510 360L780 273"
                className="signal-lines"
              />
            </svg>
            <div
              className="mothership"
              aria-label="Adliens, the creative force at the center"
            >
              <div className="sun-corona" />
              <div className="sun-orbit" />
              <div className="mothership-core">
                <AlienMark />
              </div>
              <div className="mothership-caption">
                <strong>ADLIENS</strong>
                <span>THE CREATIVE MOTHERSHIP</span>
              </div>
            </div>
            {visible.map((p, i) => {
              const index = sector * positions.length + i;
              return (
                <WorldLink
                  key={p.id}
                  to={destination(p)}
                  state={returnState()}
                  className={`client-planet project-folder celestial-${i}`}
                  style={{
                    "--planet-x": `${positions[i][0]}%`,
                    "--planet-y": `${positions[i][1]}%`,
                    "--planet-delay": `${i * -2}s`,
                  }}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered(null)}
                  aria-label={`Enter ${p.companyName} world, ${campaignCount(p)} campaigns`}
                >
                  <span className="planet-target" />
                  <Planet variant={index} imageUrl={p.imageUrl} />
                  <span className="planet-label">
                    <small>
                      WORLD {String(index + 1).padStart(2, "0")} /{" "}
                      {p.services?.[0] || "CREATIVE"}
                    </small>
                    <strong>
                      {p.companyName}
                      <span>↗</span>
                    </strong>
                    <span className="planet-enter">
                      {campaignCount(p)} campaign
                      {campaignCount(p) === 1 ? "" : "s"} inside · Enter world
                    </span>
                  </span>
                </WorldLink>
              );
            })}
            <WorldLink to="/contact" className="undiscovered-world">
              <span className="unknown-orbit">+</span>
              <span>
                UNEXPLORED TERRITORY<strong>Your brand here ↗</strong>
              </span>
            </WorldLink>
            {!worlds.length && (
              <p className="empty-universe" role="status">
                No published worlds in this sector yet.
              </p>
            )}
            <div className="map-coordinate coordinate-one" aria-hidden="true">
              RA 23h 17m
              <br />
              DEC +42° 08′
            </div>
            <div className="map-coordinate coordinate-two" aria-hidden="true">
              + CREATIVE GRAVITY DETECTED
            </div>
          </div>
        ) : (
          <div className="mission-index">
            {filtered.map((p, i) => (
              <WorldLink
                key={p.id}
                className="mission-row project-folder"
                to={destination(p, true)}
                state={returnState()}
              >
                <span className="mission-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Planet variant={i} />
                <div>
                  <span className="eyebrow">{p.companyName}</span>
                  <h2>{p.name}</h2>
                  <p>{p.services?.join(" / ")}</p>
                </div>
                <span className="mission-arrow">↗</span>
              </WorldLink>
            ))}
            {!filtered.length && (
              <p className="workspace-message">
                No published projects in this collection yet.
              </p>
            )}
            <WorldLink className="mission-invite" to="/contact">
              The next mission could be yours. <span>Make contact ↗</span>
            </WorldLink>
          </div>
        ))}
      <div className="system-dossier" aria-live="polite">
        <span className="dossier-dot" />
        {active && (
          <div className="dossier-preview">
            <ProjectArt
              project={active}
              variant={worlds.findIndex((p) => p.id === active.id)}
            />
          </div>
        )}
        <div>
          <small>
            {active ? "SIGNAL IDENTIFIED" : "MISSION CONTROL / ADLIENS"}
          </small>
          <p>
            {active
              ? `${active.companyName} — ${active.name}`
              : "Our clients are the worlds. Our work is what connects them."}
          </p>
        </div>
      </div>
      <footer className="system-status">
        <span>
          <i /> {worlds.length.toString().padStart(2, "0")} CLIENT WORLDS IN
          ORBIT
        </span>
        {sectors > 1 && (
          <div className="sector-navigation">
            <button
              onClick={() => change("sector", sector - 1)}
              disabled={sector === 0}
              aria-label="Previous sector"
            >
              ←
            </button>
            <span>
              SECTOR {sector + 1} / {sectors}
            </span>
            <button
              onClick={() => change("sector", sector + 1)}
              disabled={sector === sectors - 1}
              aria-label="Next sector"
            >
              →
            </button>
          </div>
        )}
        <span>
          {sampleMode
            ? "DEMO UNIVERSE / SAMPLE CLIENTS & ARTWORK"
            : "INDEPENDENT MINDS. OTHERWORLDLY WORK."}
        </span>
      </footer>
    </section>
  );
}
