import { NavLink } from 'react-router-dom';
import { LampThemeToggle } from './LampThemeToggle';
import { useLocale } from '../i18n/LocaleProvider';

const navItems = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/work', 'Work'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export function NavBar() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-300/50 bg-mist/90 backdrop-blur dark:border-neon/20 dark:bg-ink/80">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-3 md:px-8 xl:px-12">
        <NavLink to="/" className="font-heading text-xl font-bold tracking-tight md:text-2xl">
          {t.brand} <span className="text-neon">agency</span>
        </NavLink>

        <nav className="hidden gap-8 text-sm font-semibold lg:flex">
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition ${isActive ? 'text-neon' : 'text-slate-700 hover:text-neon dark:text-slate-200'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LampThemeToggle />
          <NavLink
            to="/contact"
            className="rounded-full border border-neon bg-neon px-4 py-2 text-sm font-bold uppercase tracking-wide text-black transition hover:translate-y-px"
          >
            {t.cta}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
