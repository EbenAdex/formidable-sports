import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function PlayerDetails() {
  const { teamId, playerId } = useParams();
  const { teams, getPlayerMatchHistory } = useAppData();

  const team = teams.find((item) => String(item.id) === String(teamId));
  const player = team?.players?.find(
    (item) => String(item.id) === String(playerId)
  );

  if (!team || !player) {
    return (
      <>
        <Navbar />
        <main className="page section">
          <div className="container">
            <p>Player not found.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const matchHistory = getPlayerMatchHistory(team.id, player.id);

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="player-details">
            <div className="player-details__hero">
              <img src={team.logo} alt={team.name} className="team-details__logo" />
              <div>
                <h1>{player.name}</h1>
                <p>
                  <strong>Team:</strong> {team.name}
                </p>
                <p>
                  <strong>Category:</strong> {team.category}
                </p>
                <p>
                  <strong>Position:</strong> {player.position}
                </p>
                <p>
                  <strong>Jersey Number:</strong> {player.jerseyNumber}
                </p>
              </div>
            </div>

            <div className="team-details__grid">
              <div className="team-panel">
                <h2>Player Statistics</h2>
                <p>
                  <strong>Appearances:</strong> {player.appearances || 0}
                </p>
                <p>
                  <strong>Goals:</strong> {player.goals || 0}
                </p>
                <p>
                  <strong>Clean Sheets:</strong> {player.cleanSheets || 0}
                </p>
                <p>
                  <strong>Points:</strong> {player.points || 0}
                </p>
              </div>

              <div className="team-panel">
                <h2>Player Match History</h2>
                {matchHistory.length ? (
                  <div className="search-list">
                    {matchHistory.map((fixture) => (
                      <div className="search-list__item" key={fixture.id}>
                        <strong>
                          {fixture.homeTeam} {fixture.score?.home ?? 0} -{" "}
                          {fixture.score?.away ?? 0} {fixture.awayTeam}
                        </strong>
                        <p>
                          {fixture.date} • {fixture.sport} • {fixture.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recorded match appearances yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PlayerDetails;