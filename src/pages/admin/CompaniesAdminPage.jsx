import { MediaUpload } from "../../components/admin/MediaUpload";
import { useEffect, useState } from "react";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../../api/endpoints";

const blank = {
  name: "",
  logoUrl: "",
  industry: "",
  website: "",
  isActive: true,
};

export function CompaniesAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => setItems(await getCompanies());
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (editingId) {
        await updateCompany(editingId, form);
        setEditingId(null);
      } else {
        await createCompany(form);
      }
      setForm(blank);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      logoUrl: item.logoUrl,
      industry: item.industry,
      website: item.website,
      isActive: item.isActive,
    });
  };

  const onDelete = async (id) => {
    setError("");
    try {
      await deleteCompany(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      {error && (
        <p role="alert" className="text-rose-400">
          {error}
        </p>
      )}
      {busy && <p role="status">Saving…</p>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold md:text-5xl xl:text-6xl">
            Companies
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Add and manage represented companies.
          </p>
        </div>
        <p className="rounded-full border border-neon/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neon">
          {items.length} total records
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-3 rounded-2xl border border-slate-300 p-4 dark:border-neon/20 md:grid-cols-3 xl:grid-cols-5"
      >
        <MediaUpload
          label="Upload company logo"
          accept="image/png,image/jpeg,image/webp"
          onUploaded={(logoUrl) => setForm((f) => ({ ...f, logoUrl }))}
        />
        {[
          ["name", "Company name"],
          ["logoUrl", "Logo URL"],
          ["industry", "Industry"],
          ["website", "Website"],
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </span>
            <input
              required={key === "name"}
              value={form[key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
            />
          </label>
        ))}

        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isActive: event.target.checked }))
            }
          />
          Active company
        </label>

        <div className="md:col-span-3 xl:col-span-5 flex gap-2">
          <button
            className="rounded-xl bg-neon px-4 py-2 text-sm font-bold text-black"
            type="submit"
            disabled={busy}
          >
            {editingId ? "Update company" : "Add company"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(blank);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-neon/30"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex min-h-36 flex-col justify-between rounded-2xl border border-slate-300 p-4 dark:border-neon/20"
          >
            <div className="flex items-center gap-3">
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.industry || "Uncategorized"}
                </p>
              </div>
            </div>

            <div>
              <p className="mt-2 truncate text-xs text-slate-500">
                {item.website || "No website"}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-neon/30"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg border border-rose-400 px-3 py-1 text-sm text-rose-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
