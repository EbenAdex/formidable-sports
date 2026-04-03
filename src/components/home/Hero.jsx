import { Link } from "react-router-dom";
import HeroStats from "./HeroStats";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__content">
        <p className="hero__tag">Faculty Sports Platform</p>
        <h1 className="hero__title">Welcome to Formidable Sports</h1>
        <p className="hero__text">
          Follow faculty competitions, check live fixtures, view results, track
          team progress, and stay updated with the latest sports news.
        </p>

        <div className="hero__actions">
          <Link to="/fixtures" className="btn btn--primary">
            View Fixtures
          </Link>
          <Link to="/results" className="btn btn--secondary">
            View Results
          </Link>
        </div>

        <HeroStats />
      </div>
    </section>
  );
}

export default Hero;