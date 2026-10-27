import { Link } from "react-router-dom";
const services = [
  [
    "Social Media Advertising",
    "The right message. The right moment.",
    "Paid campaigns across Meta, TikTok, and Google. Creative testing and continuous refinement built around your goals.",
    "Paid media / Testing / Optimization",
  ],
  [
    "Social Media Design",
    "Made to stop the scroll.",
    "Distinctive social content that makes your brand recognizable, from the first impression to the next interaction.",
    "Art direction / Content / Campaigns",
  ],
  [
    "Brand Identity",
    "A world only you could own.",
    "Visual identities with a clear point of view. A connected system of typography, color, and design that tells your story.",
    "Strategy / Identity / Guidelines",
  ],
  [
    "Motion Design",
    "Give your ideas a pulse.",
    "Motion graphics and short-form storytelling that bring character and energy to your brand.",
    "Animation / Short-form / Storytelling",
  ],
  [
    "Consulting",
    "A clearer direction forward.",
    "Focused conversations about your audience, positioning, and next opportunity. Practical thinking you can put to work.",
    "Discovery / Positioning / Roadmaps",
  ],
  [
    "Creative Strategy",
    "Good ideas need a direction.",
    "Campaign concepts, audience insights, and messaging that connect what your brand stands for with what people care about.",
    "Concepts / Messaging / Creative direction",
  ],
];
export function ServicesPage() {
  return (
    <div className="universe-page">
      <header className="page-intro">
        <p className="eyebrow">THE CREATIVE TOOLBOX</p>
        <h1>
          Built to make
          <br />
          <em>an impact.</em>
        </h1>
        <p>
          One agency. Connected disciplines. Everything your next chapter needs.
        </p>
      </header>
      <section className="service-list">
        {services.map(([title, subtitle, text, tags], i) => (
          <article key={title}>
            <span className="service-number">0{i + 1}</span>
            <div>
              <p className="eyebrow">{title}</p>
              <h2>{subtitle}</h2>
              <p>{text}</p>
              <small>{tags}</small>
            </div>
            <Link
              to={`/contact?service=${encodeURIComponent(title)}`}
              aria-label={`Discuss ${title}`}
            >
              ↗
            </Link>
          </article>
        ))}
      </section>
      <section className="contact-banner">
        <p className="eyebrow">LET’S CONNECT THE DOTS</p>
        <h2>
          Your ambition.
          <br />
          <em>Our next project.</em>
        </h2>
        <Link className="primary-button" to="/contact">
          Open a conversation ↗
        </Link>
      </section>
    </div>
  );
}
