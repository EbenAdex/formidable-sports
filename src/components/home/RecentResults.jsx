import { Link } from "react-router-dom";
import MatchCard from "../sports/MatchCard";
import { useAppData } from "../../context/AppDataContext";

function RecentResults() {
  const { results } = useAppData();

  if (!results.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section__top">
          <h2>Recent Results</h2>
          <Link to="/results" className="section__link">
            View all
          </Link>
        </div>

        <div className="match-list">
          {results.slice(0, 4).map((result) => (
            <MatchCard key={result.id} match={result} type="result" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentResults;