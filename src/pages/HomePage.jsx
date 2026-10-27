import { Link } from "react-router-dom";
import { ProjectWorkspace } from "../components/ProjectWorkspace";
export function HomePage() {
  return (
    <div className="universe-page">
      <section className="universe-hero">
        <div className="hero-coordinates">
          CREATIVE STUDIO / PLANET EARTH <span>EST. FOR WHAT’S NEXT</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> A DIFFERENT KIND OF AGENCY
          </p>
          <h1>
            Different worlds.
            <br />
            One creative <em>force.</em>
            <span className="hero-asterisk">✳</span>
          </h1>
          <div className="hero-bottom">
            <p>
              We turn brands into worlds worth exploring.
              <br />
              Strategy, design, and campaigns that make
              <br className="desktop-break" /> people stop. Feel. And act.
            </p>
            <a href="#selected-work" className="primary-button">
              Explore our work <span>↓</span>
            </a>
          </div>
        </div>
        <div className="hero-planet" aria-hidden="true">
          <div />
          <span>ad.</span>
        </div>
        <div className="hero-foot">
          <span>
            <i /> THE WORK IS THE WORLD.
          </span>
          <span>SCROLL TO DISCOVER ↓</span>
        </div>
      </section>
      <ProjectWorkspace compact />
      <section className="capabilities-strip">
        <p className="eyebrow">THE TOOLS BEHIND THE WORLDS</p>
        <div>
          {[
            "Strategy",
            "Brand identity",
            "Paid social",
            "Design",
            "Motion",
          ].map((s, i) => (
            <Link key={s} to="/services">
              <small>0{i + 1}</small>
              {s}
              <span>↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="contact-banner">
        <p className="eyebrow">NEXT FILE: SOMETHING GREAT</p>
        <h2>
          Let’s create your
          <br />
          <em>next dimension.</em>
        </h2>
        <Link to="/contact" className="primary-button">
          Start a project <span>↗</span>
        </Link>
      </section>
    </div>
  );
}
