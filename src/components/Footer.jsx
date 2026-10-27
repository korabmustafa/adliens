import { Link } from "react-router-dom";
export function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="wordmark">
        adliens<span>✳</span>
      </Link>
      <p>
        Independent thinking.
        <br />
        Otherworldly work.
      </p>
      <div>
        <Link to="/work">Selected work ↗</Link>
        <Link to="/contact">Start a conversation ↗</Link>
      </div>
      <small>© {new Date().getFullYear()} ADLIENS AGENCY</small>
    </footer>
  );
}
