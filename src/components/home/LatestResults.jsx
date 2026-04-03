import MatchCard from "../sports/MatchCard";
import { useAppData } from "../../context/AppDataContext";

function LatestResults() {
  const { results } = useAppData();

  return (
    <section className="section section--light">
      <div className="container">
        <div className="section__top">
          <h2>Latest Results</h2>
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

export default LatestResults;