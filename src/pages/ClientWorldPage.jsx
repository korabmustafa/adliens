import { isMediaUrl } from "../api/media";
import { useEffect, useRef } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Planet } from "../components/Planet";
import { WorldLink } from "../components/WorldLink";
import { ProjectArt, useProjects } from "../components/ProjectWorkspace";
export function ClientWorldPage() {
  const { clientId } = useParams();
  const { projects, status, retry } = useProjects();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const dialog = useRef(null);
  const matches = projects.filter((p) => (p.companyId || p.id) === clientId);
  const selected =
    matches.find((p) => p.id === params.get("campaign")) || matches[0];
  const variant = Math.max(
    0,
    projects.findIndex((p) => p.id === selected?.id),
  );
  const hasVideo = isMediaUrl(selected?.videoUrl);
  const hasImage = isMediaUrl(selected?.imageUrl);
  const sample =
    !!selected?.isDemo || import.meta.env.VITE_USE_MOCK_DATA !== "false";
  useEffect(() => {
    if (selected) document.title = `${selected.companyName} — Adliens`;
    return () => {
      document.title = "Adliens — Creative agency";
    };
  }, [selected]);
  if (status === "loading")
    return (
      <div className="workspace-message" role="status">
        Entering client world…
      </div>
    );
  if (status === "error")
    return (
      <div className="workspace-message" role="alert">
        This world couldn’t load. <button onClick={retry}>Try again</button>
      </div>
    );
  if (!selected)
    return (
      <div className="page-intro">
        <h1>World not found.</h1>
        <Link className="text-link" to="/work">
          Return to selected work ↗
        </Link>
      </div>
    );
  return (
    <div className={`client-world world-${variant % 3}`}>
      <div className="client-breadcrumb">
        <WorldLink
          to={location.state?.returnTo || "/work"}
          state={{ restoreScroll: location.state?.scrollY || 0 }}
        >
          ← Return to the Adliens universe
        </WorldLink>
        <span>/ {selected.companyName}</span>
      </div>
      <header className="client-header">
        <div className="world-horizon" aria-hidden="true">
          <Planet variant={variant} imageUrl={selected.imageUrl} />
        </div>
        <p className="eyebrow">
          YOU HAVE ARRIVED / WORLD {String(variant + 1).padStart(2, "0")}
        </p>
        <h1>
          {selected.companyName}
          <span>↗</span>
        </h1>
        <p>
          {sample
            ? "Sample client · Demonstration case study"
            : "Strategy, creativity, and a shared ambition."}
        </p>
        <div className="project-tags">
          {[...new Set(matches.flatMap((p) => p.services || []))].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </header>
      <div className="campaign-tabs" aria-label="Campaigns">
        {matches.map((p) => (
          <button
            key={p.id}
            aria-pressed={selected.id === p.id}
            onClick={() =>
              setParams(
                { campaign: p.id },
                { replace: true, preventScrollReset: true },
              )
            }
          >
            {p.name} ↗
          </button>
        ))}
      </div>
      <section className="campaign-layout" key={selected.id}>
        <button
          className="art-preview"
          onClick={() => dialog.current.showModal()}
          aria-label={`Expand artwork for ${selected.name}`}
        >
          <ProjectArt project={selected} variant={variant} />
          <span className="preview-label">
            {hasVideo
              ? "WATCH CAMPAIGN"
              : hasImage
                ? "CAMPAIGN ARTWORK"
                : "CONCEPT ARTWORK"}{" "}
            <span>EXPAND ⤢</span>
          </span>
        </button>
        <aside className="campaign-summary">
          <p className="eyebrow">MISSION ARCHIVE / CAMPAIGN</p>
          <h2>{selected.name}</h2>
          <p>{selected.summary}</p>
          <div className="result-block">
            <small>{sample ? "SAMPLE OUTCOME" : "THE OUTCOME"}</small>
            <strong>
              {selected.result || "A new direction for the brand."}
            </strong>
          </div>
          <Link
            to={`/contact?project=${encodeURIComponent(selected.name)}`}
            className="primary-button"
          >
            Create my brand’s next chapter ↗
          </Link>
        </aside>
      </section>
      <section className="case-story">
        {[
          ["01", "The challenge", selected.challenge || ""],
          ["02", "Our approach", selected.approach || selected.summary],
          ["03", "The outcome", selected.result],
        ].map(([n, title, text]) => (
          <article key={n}>
            <small>
              {n} / {title.toUpperCase()}
            </small>
            <h3>{title}</h3>
            <p>{text || "The full project story is coming soon."}</p>
          </article>
        ))}
      </section>
      <dialog
        ref={dialog}
        className="art-dialog"
        onClose={() => dialog.current?.querySelector("video")?.pause()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current.close();
        }}
        aria-label={`${selected.name} concept artwork`}
      >
        <button
          className="dialog-close"
          onClick={() => dialog.current.close()}
          autoFocus
        >
          Close ×
        </button>
        <div className="dialog-media">
          {hasVideo ? (
            <video
              src={selected.videoUrl}
              controls
              playsInline
              preload="none"
              aria-label={`${selected.name} campaign video`}
            />
          ) : (
            <ProjectArt project={selected} variant={variant} />
          )}
        </div>
        <p>
          {hasVideo
            ? "Campaign video"
            : hasImage
              ? "Campaign artwork"
              : "Concept artwork"}{" "}
          · {selected.companyName}
        </p>
      </dialog>
      <WorldLink
        className="world-return"
        to={location.state?.returnTo || "/work"}
        state={{ restoreScroll: location.state?.scrollY || 0 }}
      >
        ← Leave orbit. Return to the universe.
      </WorldLink>
    </div>
  );
}
