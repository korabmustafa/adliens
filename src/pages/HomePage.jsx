import { Link } from 'react-router-dom';
import { useLocale } from '../i18n/LocaleProvider';

const services = [
  'Social Media Advertising',
  'Social Media Design',
  'Brand Identity',
  'Motion Design',
  'Consulting',
];

const metrics = [
  ['4x', 'Avg. ROAS uplift in 90 days'],
  ['120+', 'Campaign launches delivered'],
  ['24h', 'Fast response SLA for active clients'],
  ['18', 'Active growth retainers'],
];

export function HomePage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-8 md:py-14 xl:px-12">
      <section className="hero-grid rounded-3xl border border-neon/40 bg-grid bg-[length:20px_20px] bg-center p-6 shadow-glow dark:bg-ink md:p-10 xl:grid xl:grid-cols-[1.25fr_0.75fr] xl:gap-8 xl:p-12">
        <div>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-neon/80">adliens agency</p>
          <h1 className="font-heading text-5xl font-bold uppercase leading-[0.95] md:text-7xl xl:text-8xl">
            {t.heroTitle.split(' ').map((part) => (
              <span key={part} className="mr-4 inline-block text-neon">
                {part}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{t.heroSubtitle}</p>
          <p className="mt-6 max-w-3xl text-base md:text-lg">{t.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-neon/60 px-5 py-2 text-sm font-semibold md:text-base"
              >
                {service}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-neon px-7 py-3 text-sm font-bold uppercase tracking-wide text-black"
            >
              {t.cta}
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-slate-400 px-7 py-3 text-sm font-semibold dark:border-neon/60"
            >
              Explore Services
            </Link>
          </div>
        </div>

        <aside className="mt-8 grid gap-4 xl:mt-0">
          {metrics.map(([metric, desc]) => (
            <article key={metric} className="rounded-2xl border border-slate-300 p-5 dark:border-neon/30">
              <p className="font-heading text-4xl font-bold text-neon">{metric}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
            </article>
          ))}
        </aside>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Growth Systems', 'High-velocity experimentation built for rapid scaling.'],
          ['Creative Intelligence', 'Brand + ad creative informed by real performance data.'],
          ['Partner Mindset', 'Weekly visibility, transparent reporting, no black-box tactics.'],
          ['Execution Speed', 'Fast turnaround from strategy to campaign deployment.'],
        ].map(([title, desc]) => (
          <article key={title} className="rounded-2xl border border-slate-300 p-5 dark:border-neon/25">
            <h3 className="font-heading text-xl text-neon">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
