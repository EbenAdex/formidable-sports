import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Welcome() {
  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />

      <main className="page-shell">
        <section className="welcome-hero">
          <div className="container">
            <div className="welcome-hero__content">
              <span className="welcome-hero__tag">Faculty Sports Platform</span>
              <h1>Welcome to ARTLYMPICS 6.0</h1>
              <p>
                Follow fixtures, results, standings, teams, rankings, player records,
                and live competition updates across faculty sports.
              </p>

              <div className="welcome-hero__actions">
                <Link to="/register" className="btn btn--primary">
                  Register
                </Link>
                <Link to="/login" className="btn btn--outline">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="welcome-preview">
          <div className="container">
            <div className="welcome-preview__grid">
              <div className="dark-card">
                <h2>Fixtures and Results</h2>
                <p>
                  View upcoming matches, completed games, and detailed result breakdowns.
                </p>
              </div>

              <div className="dark-card">
                <h2>Teams and Players</h2>
                <p>
                  Explore qualified teams, squad lists, player profiles, and match history.
                </p>
              </div>

              <div className="dark-card">
                <h2>Tables and Rankings</h2>
                <p>
                  Track standings, group tables, and leaderboard updates as matches end.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Welcome;