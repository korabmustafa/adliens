export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14 xl:px-12">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h1 className="font-heading text-4xl font-bold md:text-6xl xl:text-7xl">About Adliens</h1>
          <p className="mt-5 text-lg text-slate-700 dark:text-slate-300">
            Adliens is a modern marketing agency focused on one mission: elevate brands into high-performing,
            category-defining businesses.
          </p>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            Our team blends creative strategy, visual identity, motion storytelling, and paid media execution. The result
            is a single creative-performance system that feels premium and delivers measurable outcomes.
          </p>
        </section>

        <aside className="rounded-2xl border border-slate-300 p-6 dark:border-neon/25">
          <h2 className="font-heading text-2xl text-neon">Why clients choose us</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li>• Strategy + execution in one integrated team</li>
            <li>• High-speed testing with transparent reporting</li>
            <li>• Brand quality without sacrificing performance</li>
            <li>• Senior-level partnership and clear communication</li>
          </ul>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-300 p-6 dark:border-neon/25">
        <h2 className="font-heading text-2xl text-neon">How We Work</h2>
        <ol className="mt-3 grid gap-2 pl-5 text-slate-700 dark:text-slate-300 md:grid-cols-2">
          <li>Discovery & brand immersion</li>
          <li>Creative strategy and concepting</li>
          <li>Campaign and design execution</li>
          <li>Weekly optimization and transparent reporting</li>
        </ol>
      </section>
    </div>
  );
}
