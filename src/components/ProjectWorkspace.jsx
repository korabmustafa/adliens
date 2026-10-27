import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
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

export function ProjectWorkspace({ compact = false }) {
  const { projects, status, retry } = useProjects();
  const [params, setParams] = useSearchParams();
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
    ...new Map(filtered.map((p) => [p.companyId || p.companyName, p])).values(),
  ];
  const sampleMode = import.meta.env.VITE_USE_MOCK_DATA !== "false";
  function change(key, value) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }
  return (
    <section
      className="workspace"
      id="selected-work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span /> THE ADLIENS UNIVERSE
          </p>
          <h2 id="work-heading">
            Good work. <span>Different worlds.</span>
          </h2>
        </div>
        <p className="section-note">
          A collection of brands, ideas, and the
          <br />
          work that brings them to life.
        </p>
      </div>
      <div className="workspace-toolbar">
        <div className="workspace-path">
          <span className="tiny-folder" /> adliens <span>/</span> selected work{" "}
          <span className="count">
            {worlds.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="view-switch" aria-label="Project view">
          <button
            aria-pressed={view === "explore"}
            onClick={() => change("view", "explore")}
          >
            ▦ <span>Explore</span>
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => change("view", "list")}
          >
            ☷ <span>All projects</span>
          </button>
        </div>
      </div>
      {!compact && (
        <div className="filters" aria-label="Filter by service">
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
      {sampleMode && (
        <p className="sample-note">
          DEMO COLLECTION{" "}
          <span>
            Sample clients and concept artwork. Real client work will live here.
          </span>
        </p>
      )}
      {status === "loading" && (
        <div className="workspace-message" role="status">
          Opening the archive<span className="loading-dots">…</span>
        </div>
      )}
      {status === "error" && (
        <div className="workspace-message" role="alert">
          The archive couldn’t load.{" "}
          <button className="text-link" onClick={retry}>
            Try again ↗
          </button>
        </div>
      )}
      {status === "success" && (
        <div className={`project-grid ${view === "list" ? "list-view" : ""}`}>
          {(view === "list" ? filtered : worlds).map((p, i) => (
            <Link
              className={`project-folder folder-${i % 3}`}
              to={`/work/${encodeURIComponent(p.companyId || p.id)}${view === "list" ? `?campaign=${encodeURIComponent(p.id)}` : ""}`}
              state={{
                returnTo: pathname + "?" + params.toString(),
                scrollY: window.scrollY,
              }}
              key={p.id}
            >
              <div className="folder-stage">
                <div className="folder-back">
                  <span>{String(i + 1).padStart(2, "0")} / CLIENT WORLD</span>
                </div>
                <div className="folder-sheet sheet-two" />
                <div className="folder-sheet sheet-one">
                  <ProjectArt project={p} variant={i} />
                </div>
                <div className="folder-front">
                  <span className="folder-monogram">
                    {p.companyName
                      ?.split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    {p.companyName}
                    <small>{p.services?.[0] || "Creative studio"}</small>
                  </span>
                  <span className="folder-arrow">↗</span>
                </div>
              </div>
              <div className="folder-meta">
                <div>
                  <h3>{view === "list" ? p.name : p.companyName}</h3>
                  <p>
                    {view === "list"
                      ? p.companyName
                      : `${projects.filter((x) => x.companyId === p.companyId).length} campaign${projects.filter((x) => x.companyId === p.companyId).length === 1 ? "" : "s"} · Open client world`}
                  </p>
                </div>
                <span>↗</span>
              </div>
            </Link>
          ))}
          {!filtered.length && (
            <p className="workspace-message">
              No published projects in this collection yet.
            </p>
          )}
          <Link to="/contact" className="new-world">
            <span className="new-world-icon">+</span>
            <div>
              <h3>Your brand, next.</h3>
              <p>There’s a world of possibilities.</p>
            </div>
            <span className="text-link">Let’s make something ↗</span>
          </Link>
        </div>
      )}
      <div className="workspace-bottom">
        <span>
          <i /> INDEPENDENT MINDS. SHARED AMBITION.
        </span>
        <span>BUILT TO BE EXPLORED ↗</span>
      </div>
    </section>
  );
}
