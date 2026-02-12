import { useEffect, useState } from 'react';
import { getCaseStudies } from '../api/endpoints';

export function WorkPage() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCaseStudies({ publishedOnly: true });
        setProjects(data);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    load();
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-10 md:px-8 md:py-14 xl:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold md:text-6xl xl:text-7xl">Selected Work</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Live from the Adliens admin dashboard.</p>
        </div>
        <div className="rounded-full border border-neon/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neon">
          Published Case Studies
        </div>
      </div>

      {status === 'loading' && <p className="mt-8">Loading case studies...</p>}
      {status === 'error' && <p className="mt-8 text-rose-500">Could not load case studies right now.</p>}

      {status === 'success' && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.length === 0 && <p>No published case studies yet.</p>}
          {projects.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-300 p-6 dark:border-neon/25">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Case Study · {item.companyName}</p>
              <h2 className="mt-1 font-heading text-2xl text-neon">{item.name}</h2>
              <p className="mt-2 text-lg font-semibold">{item.result}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{item.summary}</p>
              {!!item.services?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.services.map((service) => (
                    <span key={service} className="rounded-full border border-neon/60 px-3 py-1 text-xs font-semibold">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
