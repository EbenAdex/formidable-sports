import { useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData, isValidCategory } from "../context/AppDataContext";
import {
  getAllPlayersFromTeams,
  getTopScorers,
  getTopCleanSheets,
  getTopPoints,
} from "../utils/playerStats";

function Leaderboards() {
  const { teams, sports } = useAppData();
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("male");

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      if (!isValidCategory(team.category)) return false;

      const categoryMatch =
        team.category.toLowerCase() === selectedCategory.toLowerCase();

      const sportMatch =
        selectedSport === "all" ||
        (team.sports || []).some(
          (sport) => sport.toLowerCase() === selectedSport.toLowerCase()
        );

      return categoryMatch && sportMatch;
    });
  }, [teams, selectedSport, selectedCategory]);

  const allPlayers = getAllPlayersFromTeams(filteredTeams);
  const topScorers = getTopScorers(allPlayers, 10);
  const topCleanSheets = getTopCleanSheets(allPlayers, 10);
  const topPoints = getTopPoints(allPlayers, 10);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Leaderboards</h1>
            <p className="page-intro">
              Track the best individual performers by sport and category.
            </p>
          </div>

          <div className="page-card">
            <div className="team-search-bar">
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <option value="all">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="leaderboard-grid">
              <div className="leaderboard-card">
                <h2>Top Scorers</h2>
                {topScorers.length ? (
                  topScorers.map((player, index) => (
                    <div className="leaderboard-item" key={`${player.teamId}-${player.id}`}>
                      <span>
                        {index + 1}. {player.name} ({player.teamName})
                      </span>
                      <strong>{player.goals || 0}</strong>
                    </div>
                  ))
                ) : (
                  <p>No scorer data yet.</p>
                )}
              </div>

              <div className="leaderboard-card">
                <h2>Top Clean Sheets</h2>
                {topCleanSheets.length ? (
                  topCleanSheets.map((player, index) => (
                    <div className="leaderboard-item" key={`${player.teamId}-${player.id}`}>
                      <span>
                        {index + 1}. {player.name} ({player.teamName})
                      </span>
                      <strong>{player.cleanSheets || 0}</strong>
                    </div>
                  ))
                ) : (
                  <p style={{color: 'white'}}>No clean sheet data yet.</p>
                )}
              </div>

              <div className="leaderboard-card">
                <h2>Top Points</h2>
                {topPoints.length ? (
                  topPoints.map((player, index) => (
                    <div className="leaderboard-item" key={`${player.teamId}-${player.id}`}>
                      <span>
                        {index + 1}. {player.name} ({player.teamName})
                      </span>
                      <strong>{player.points || 0}</strong>
                    </div>
                  ))
                ) : (
                  <p>No points data yet.</p>
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

export default Leaderboards;