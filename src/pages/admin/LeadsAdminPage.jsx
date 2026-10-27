import { useEffect, useState } from "react";
import { getLeads, updateLead } from "../../api/endpoints";
export function LeadsAdminPage() {
  const [items, setItems] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    getLeads()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="admin-panel">
      <h1>Inquiry inbox</h1>
      <p>Contact requests submitted through the website.</p>
      <button onClick={load}>Refresh</button>
      {loading && <p role="status">Loading inquiries…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !items.length && <p>No inquiries yet.</p>}
      <div className="inquiry-list">
        {items.map((i) => (
          <article key={i.id}>
            <small>
              {new Date(i.createdAt).toLocaleString()} · {i.status}
            </small>
            <h2>
              {i.name} / {i.company}
            </h2>
            <a href={`mailto:${i.email}`}>{i.email}</a>
            <p>{i.message}</p>
            <label>
              Status{" "}
              <select
                value={i.status}
                onChange={async (e) => {
                  try {
                    await updateLead(i.id, e.target.value);
                    load();
                  } catch (e) {
                    setError(e.message);
                  }
                }}
              >
                {["new", "read", "archived"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}
