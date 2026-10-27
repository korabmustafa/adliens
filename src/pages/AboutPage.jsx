import { Link } from "react-router-dom";
export function AboutPage() {
  return (
    <div className="universe-page">
      <header className="page-intro">
        <p className="eyebrow">THE AGENCY BEHIND THE WORLDS</p>
        <h1>
          Different minds.
          <br />
          <em>Shared ambition.</em>
        </h1>
        <p>
          We’re Adliens. A creative marketing agency bringing strategy, design,
          motion, and paid media into the same orbit.
        </p>
      </header>
      <section className="agency-manifesto">
        <span className="manifesto-star" aria-hidden="true">
          ✳
        </span>
        <div>
          <p className="eyebrow">OUR POINT OF VIEW</p>
          <h2>
            Build a brand people
            <br />
            want to <em>step into.</em>
          </h2>
          <p>
            Every brand has its own world. We help make it visible—with a clear
            identity, considered creative work, and campaigns that move people.
          </p>
          <p>
            Our portfolio is a collection of those collaborations. Different
            clients, different challenges, one commitment to work with purpose.
          </p>
          <Link className="text-link" to="/work">
            Explore the work ↗
          </Link>
        </div>
      </section>
      <section className="process-section">
        <p className="eyebrow">HOW WE GET THERE</p>
        <div className="case-story">
          {[
            [
              "01",
              "Discover",
              "Understand the brand, its audience, and what comes next.",
            ],
            [
              "02",
              "Create",
              "Turn a clear direction into a distinctive creative world.",
            ],
            [
              "03",
              "Evolve",
              "Launch, learn, and keep making the work stronger.",
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <small>{n}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
