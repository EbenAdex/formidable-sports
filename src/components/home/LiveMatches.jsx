import MatchCard from "../sports/MatchCard";
import { useAppData } from "../../context/AppDataContext";

function LiveMatches() {
  const { fixtures } = useAppData();

  const liveMatches = fixtures.filter((fixture) => fixture.status === "Live");

  if (!liveMatches.length) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section__top">
          <h2>Live Matches</h2>
          <p>Matches currently in progress.</p>
        </div>

        <div className="match-list">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} type="fixture" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LiveMatches;