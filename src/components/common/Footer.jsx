import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__wrapper">
        <div className="footer__brand">
          <h3>Formidable Sports</h3>
          <p>
            The official faculty sports platform for fixtures, results, live
            updates, teams, records, and competition information.
          </p>
        </div>

        <div className="footer__links">
          <div>
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/fixtures">Fixtures</Link>
            <Link to="/results">Results</Link>
            <Link to="/table">Table</Link>
          </div>

          <div>
            <h4>Community</h4>
            <Link to="/teams">Teams</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h4>Faculty Socials</h4>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="footer__social"
            >
              <span>📸</span>
              <span>Instagram</span>
            </a>

            <a
              href="https://tiktok.com/"
              target="_blank"
              rel="noreferrer"
              className="footer__social"
            >
              <span>🎵</span>
              <span>TikTok</span>
            </a>

            <a
              href="mailto:faculty@gmail.com"
              className="footer__social"
            >
              <span>✉️</span>
              <span>faculty@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Formidable Sports. All rights reserved.</p>
        <p className="footer__stamp">
          Designed and developed by <span>EbenAdex</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;