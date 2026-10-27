import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createLead } from "../api/endpoints";

const initialForm = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export function ContactPage() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    message: params.get("project")
      ? `I’d like to discuss a project inspired by ${params.get("project")}.`
      : params.get("service")
        ? `I’m interested in ${params.get("service")}.`
        : "",
  }));
  const [status, setStatus] = useState("idle");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await createLead(form);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-page universe-page">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <section>
          <h1 className="font-heading text-4xl font-bold md:text-6xl xl:text-7xl">
            Your world. Next.
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Every great collaboration starts with a conversation. Tell us what
            you have in mind.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-300 p-5 dark:border-neon/25">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              What happens next
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
              <li>We review your growth goals and current bottlenecks.</li>
              <li>We suggest a strategy path and initial timeline.</li>
              <li>We align on scope and launch the first sprint.</li>
            </ol>
          </div>
        </section>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-slate-300 p-6 dark:border-neon/25"
        >
          <label className="contact-trap" aria-hidden="true">
            Website
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={onChange}
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["name", "Name"],
              ["email", "Email"],
              ["company", "Company"],
            ].map(([key, label]) => (
              <label
                key={key}
                className={`block ${key === "company" ? "md:col-span-2" : ""}`}
              >
                <span className="mb-1 block text-sm font-semibold">
                  {label}
                </span>
                <input
                  required
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={form[key]}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none ring-neon/70 focus:ring dark:border-neon/30 dark:bg-slate-900"
                />
              </label>
            ))}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Message</span>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={onChange}
              rows={6}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none ring-neon/70 focus:ring dark:border-neon/30 dark:bg-slate-900"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-neon px-6 py-3 font-bold uppercase tracking-wide text-black disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Let's Talk"}
          </button>

          {status === "success" && (
            <p role="status" className="text-emerald-500">
              Thanks! We’ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-rose-500">
              Could not send your request right now. Please try again shortly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
