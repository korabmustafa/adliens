import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../admin/AuthProvider";

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from || "/admin/companies", { replace: true });
    } catch (error) {
      setError(error.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-16 md:px-8 xl:px-12">
      <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
        <section>
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            Admin Login
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300">
            {import.meta.env.VITE_USE_MOCK_DATA !== "false"
              ? "Local demo: use any email and password."
              : "Sign in with your Adliens administrator account."}
          </p>
        </section>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-slate-300 p-6 dark:border-neon/20"
        >
          <input
            type="email"
            required
            placeholder="work@adliens.agency"
            aria-label="Admin email"
            autoComplete="username"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-neon/30 dark:bg-slate-900"
          />
          <input
            type="password"
            required
            placeholder="••••••••"
            aria-label="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 dark:border-neon/30 dark:bg-slate-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neon px-4 py-2 font-bold text-black"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error && <p className="text-sm text-rose-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
