import { useTheme } from './ThemeProvider';

export function LampThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark neon mode"
      className="group relative flex h-12 w-10 items-center justify-center"
    >
      <span className="absolute top-0 h-6 w-1 rounded-full bg-slate-500/70 dark:bg-neon/60" />
      <span
        className={`lamp-switch absolute top-4 h-7 w-7 border transition-all duration-300 ${
          theme === 'dark'
            ? 'border-neon bg-neon/80 shadow-glow'
            : 'border-slate-400 bg-white shadow-sm'
        }`}
      />
      <span className="sr-only">Current mode: {theme}</span>
    </button>
  );
}
