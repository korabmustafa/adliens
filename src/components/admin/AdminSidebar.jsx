import { NavLink } from 'react-router-dom';
import { useAuth } from '../../admin/AuthProvider';

export function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full border-b border-slate-300 p-4 dark:border-neon/20 md:min-h-[calc(100vh-4rem)] md:w-80 md:border-b-0 md:border-r md:p-6">
      <p className="font-heading text-xl font-bold">Adliens Admin</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Signed in as {user?.email}</p>

      <nav className="mt-6 grid gap-2">
        {[
          ['/admin/companies', 'Companies'],
          ['/admin/work', 'Case Studies'],
        ].map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-semibold ${
                isActive
                  ? 'bg-neon text-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-6 rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-neon/40"
      >
        Log out
      </button>
    </aside>
  );
}
