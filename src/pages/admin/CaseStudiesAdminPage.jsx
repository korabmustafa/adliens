import { MediaUpload } from "../../components/admin/MediaUpload";
import { useEffect, useState } from "react";
import {
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudies,
  getCompanies,
  updateCaseStudy,
} from "../../api/endpoints";

const blank = {
  companyId: "",
  name: "",
  result: "",
  summary: "",
  challenge: "",
  approach: "",
  imageUrl: "",
  videoUrl: "",
  services: "",
  status: "draft",
  isDemo: false,
};

export function CaseStudiesAdminPage() {
  const [companies, setCompanies] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [companyRows, caseRows] = await Promise.all([
      getCompanies(),
      getCaseStudies(),
    ]);
    setCompanies(companyRows);
    setItems(caseRows);
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        ...form,
        services: form.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await updateCaseStudy(editingId, payload);
        setEditingId(null);
      } else {
        await createCaseStudy(payload);
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
      isDemo: !!item.isDemo,
      companyId: item.companyId,
      name: item.name,
      result: item.result,
      summary: item.summary,
      challenge: item.challenge || "",
      approach: item.approach || "",
      imageUrl: item.imageUrl || "",
      videoUrl: item.videoUrl || "",
      services: (item.services || []).join(", "),
      status: item.status || "draft",
    });
  };

  const onDelete = async (id) => {
    setError("");
    try {
      await deleteCaseStudy(id);
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
            Case Studies
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Create company work entries shown on the public Work page.
          </p>
        </div>
        <p className="rounded-full border border-neon/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neon">
          {items.length} entries
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-3 rounded-2xl border border-slate-300 p-4 dark:border-neon/20 md:grid-cols-2 xl:grid-cols-4"
      >
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Company
          </span>
          <select
            required
            value={form.companyId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, companyId: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Status
          </span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>

        {[
          ["name", "Case study title"],
          ["result", "Result headline"],
          ["services", "Services (comma-separated)"],
          ["imageUrl", "Campaign image URL"],
          ["videoUrl", "Campaign video URL (MP4/WebM)"],
        ].map(([key, label]) => (
          <label
            key={key}
            className={key === "services" ? "xl:col-span-2" : ""}
          >
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </span>
            <input
              required={["name", "result"].includes(key)}
              type="text"

              value={form[key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
            />
          </label>
        ))}

        <MediaUpload
          label="Upload campaign image"
          accept="image/png,image/jpeg,image/webp"
          onUploaded={(imageUrl) => setForm((f) => ({ ...f, imageUrl }))}
        />
        <MediaUpload
          label="Upload campaign video"
          accept="video/mp4,video/webm"
          onUploaded={(videoUrl) => setForm((f) => ({ ...f, videoUrl }))}
        />
        <label>
          <input
            type="checkbox"
            checked={form.isDemo}
            onChange={(e) =>
              setForm((f) => ({ ...f, isDemo: e.target.checked }))
            }
          />{" "}
          Label as demo/concept work
        </label>
        <label className="md:col-span-2 xl:col-span-4">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Summary
          </span>
          <textarea
            required
            rows={4}
            value={form.summary}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, summary: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
          />
        </label>

        {["challenge", "approach"].map((key) => (
          <label key={key} className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {key}
            </span>
            <textarea
              rows={3}
              value={form[key]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-neon/30 dark:bg-slate-900"
            />
          </label>
        ))}
        <div className="md:col-span-2 xl:col-span-4 flex gap-2">
          <button
            className="rounded-xl bg-neon px-4 py-2 text-sm font-bold text-black"
            type="submit"
            disabled={busy}
          >
            {editingId ? "Update case study" : "Add case study"}
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
            className="rounded-2xl border border-slate-300 p-4 dark:border-neon/20"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {item.status}
                </p>
                <h3 className="font-heading text-xl font-semibold text-neon">
                  {item.name}
                </h3>
                <p className="text-sm text-slate-500">{item.companyName}</p>
              </div>
              <div className="flex gap-2">
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
            <p className="mt-2 text-sm font-semibold">{item.result}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
