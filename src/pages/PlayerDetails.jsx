import { Link, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function PlayerDetails() {
  const { teamId, playerId } = useParams();
  const { teams = [], getPlayerMatchHistory } = useAppData();

  const team = teams.find((item) => String(item.id) === String(teamId));
  const player = team?.players?.find(
    (item) => String(item.id) === String(playerId)
  );

  if (!team || !player) {
    return (
      <>
        <Navbar />
        <div className="navbar-spacer" />
        <main className="page-shell">
          <div className="container">
            <div className="page-card">
              <p>Player not found.</p>
            </div>
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
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>{player.name || "Player Details"}</h1>
            <p className="page-intro">
              Player profile, statistics, and match history.
            </p>
          </div>

          <div className="page-card">
            <div className="player-details">
              <div className="player-details__hero">
                <img
                  src={team.logo}
                  alt={team.displayName || team.name}
                  className="team-details__logo"
                />

                <div>
                  <h2 style={{ color: "#fff", marginTop: 0 }}>{player.name}</h2>

                  <p>
                    <strong>Team:</strong>{" "}
                    {team.displayName ||
                      `${team.department || team.name} ${team.sport || ""} ${team.category || ""} Team`}
                  </p>

                  <p>
                    <strong>Department:</strong> {team.department || team.name}
                  </p>

                  <p>
                    <strong>Sport:</strong> {team.sport || "Not assigned"}
                  </p>

                  <p>
                    <strong>Category:</strong> {team.category || "Not assigned"}
                  </p>

                  <p>
                    <strong>Position:</strong> {player.position || "Not assigned"}
                  </p>

                  <p>
                    <strong>Jersey Number:</strong> {player.jerseyNumber || 0}
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
                            {fixture.homeTeam || "Home"} {fixture.score?.home ?? 0} -{" "}
                            {fixture.score?.away ?? 0} {fixture.awayTeam || "Away"}
                          </strong>
                          <p>
                            {fixture.date || "No date"} • {fixture.sport || "Sport"} •{" "}
                            {fixture.status || "Unknown"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No recorded match appearances yet.</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <Link to={`/teams/${team.id}`} className="homepage-link-btn">
                  Back to Team
                </Link>
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