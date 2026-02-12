const serviceCards = [
  {
    title: 'Social Media Advertising',
    text: 'Performance ad systems across Meta, TikTok, and Google with testing frameworks and creative iteration.',
  },
  {
    title: 'Social Media Design',
    text: 'Thumb-stopping social assets crafted for consistency, growth, and conversion.',
  },
  {
    title: 'Brand Identity',
    text: 'Distinct, memorable visual identity systems with strategy-driven execution.',
  },
  {
    title: 'Motion Design',
    text: 'High-impact motion graphics and short-form video assets tuned for paid and organic channels.',
  },
  {
    title: 'Consulting',
    text: 'Adliens strategy sessions for offer clarity, funnel optimization, and practical growth roadmaps.',
  },
  {
    title: 'Creative Strategy',
    text: 'Campaign concepts, audience hypotheses, and messaging frameworks that unify brand and conversion.',
  },
];

export function ServicesPage() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-8 md:py-14 xl:px-12">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div>
          <h1 className="font-heading text-4xl font-bold md:text-6xl xl:text-7xl">Services</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
            We combine creative direction and measurable ad performance into one coherent growth engine.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-300 p-5 dark:border-neon/25">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Engagement model</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Flexible retainers, growth sprints, or focused advisory. Built for startup speed and enterprise rigor.
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {serviceCards.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-300 p-6 dark:border-neon/25">
            <h2 className="font-heading text-2xl font-semibold text-neon">{item.title}</h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
