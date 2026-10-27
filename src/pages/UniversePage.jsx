import { Link } from "react-router-dom";
import { ProjectWorkspace } from "../components/ProjectWorkspace";
export function UniversePage() {
  return (
    <div className="cosmic-home">
      <ProjectWorkspace compact />
      <section className="transmission-section">
        <p className="eyebrow">TRANSMISSION 001 / WHO WE ARE</p>
        <div>
          <h2>
            Alien thinking.
            <br />
            <em>Human connection.</em>
          </h2>
          <p>
            Adliens brings strategy, brand identity, design, motion, and paid
            media into the same orbit. Different disciplines. One purpose: work
            that makes your brand impossible to ignore.
            <Link to="/about" className="text-link">
              Meet the life forms behind the work ↗
            </Link>
          </p>
        </div>
        <nav aria-label="Agency disciplines">
          {[
            "Strategy",
            "Brand identity",
            "Paid social",
            "Design",
            "Motion",
          ].map((s, i) => (
            <Link to="/services" key={s}>
              <small>0{i + 1}</small>
              {s}
              <span>↗</span>
            </Link>
          ))}
        </nav>
      </section>
      <section className="contact-transmission">
        <div className="beacon" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">OPEN CHANNEL / NEW COLLABORATIONS</p>
        <h2>
          Ready for your
          <br />
          <em>next orbit?</em>
        </h2>
        <Link to="/contact" className="primary-button">
          Make first contact <span>↗</span>
        </Link>
      </section>
    </div>
  );
}
