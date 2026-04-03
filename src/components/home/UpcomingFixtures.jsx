import { Link } from "react-router-dom";
import MatchCard from "../sports/MatchCard";
import { useAppData } from "../../context/AppDataContext";

function UpcomingFixtures() {
  const { fixtures } = useAppData();

  return (
    <section className="section">
      <div className="container">
        <div className="section__top">
          <h2>Upcoming Fixtures</h2>
          <Link to="/fixtures" className="section__link">
            See all
          </Link>
        </div>

        <div className="match-list">
          {fixtures.slice(0, 4).map((fixture) => (
            <MatchCard key={fixture.id} match={fixture} type="fixture" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default UpcomingFixtures;