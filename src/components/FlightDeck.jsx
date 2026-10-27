import { useEffect, useRef, useState } from "react";
import { Planet } from "./Planet";
import { WorldLink } from "./WorldLink";
export function FlightDeck({ projects, returnState }) {
  const dialog = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  function launch() {
    setQuery("");
    dialog.current.showModal();
    setOpen(true);
  }
  useEffect(() => {
    function key(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current.open) dialog.current.close();
        else {
          setQuery("");
          dialog.current.showModal();
          setOpen(true);
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const results = projects
    .filter((p) =>
      `${p.companyName} ${p.name} ${p.services?.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 24);
  return (
    <>
      <button
        className="flight-launch"
        onClick={launch}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        ⌕ Jump anywhere <kbd>Ctrl K</kbd>
      </button>
      <dialog
        ref={dialog}
        className="flight-deck"
        aria-labelledby="flight-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
      >
        <header>
          <p className="eyebrow" id="flight-title">
            FLIGHT DECK / SET YOUR DESTINATION
          </p>
          <button
            onClick={() => dialog.current.close()}
            aria-label="Close flight deck"
          >
            Esc ×
          </button>
        </header>
        <label className="flight-search">
          <span className="sr-only">Find a world or campaign</span>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="A brand. A campaign. A new destination."
            autoFocus
          />
        </label>
        <p className="flight-results-count" role="status">
          {results.length} CAMPAIGN SIGNALS FOUND
        </p>
        <div className="flight-results">
          {results.map((p, i) => (
            <WorldLink
              key={p.id}
              to={`/work/${encodeURIComponent(p.companyId || p.id)}?campaign=${encodeURIComponent(p.id)}`}
              state={returnState()}
              className="flight-result"
              onClick={() => dialog.current.close()}
            >
              <Planet variant={p.artTheme ?? i} />
              <span>
                <small>{p.companyName}</small>
                <strong>{p.name}</strong>
              </span>
              <span>↗</span>
            </WorldLink>
          ))}
          {!results.length && (
            <p className="flight-empty">
              No signal found. Try a brand name or a service.
            </p>
          )}
        </div>
        <footer>
          <WorldLink to="/services" onClick={() => dialog.current.close()}>
            Our expertise ↗
          </WorldLink>
          <WorldLink to="/contact" onClick={() => dialog.current.close()}>
            Make contact ↗
          </WorldLink>
          <span>Tab to explore · Enter to jump</span>
        </footer>
      </dialog>
    </>
  );
}
