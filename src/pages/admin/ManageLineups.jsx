import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

function ManageLineups() {
  const { fixtures, getTeamById, updateFixtureWithCallback } = useAppData();
  const [selectedMatchId, setSelectedMatchId] = useState(fixtures[0]?.id || "");

  const [homeCoach, setHomeCoach] = useState("");
  const [awayCoach, setAwayCoach] = useState("");
  const [homePlayerIds, setHomePlayerIds] = useState([]);
  const [awayPlayerIds, setAwayPlayerIds] = useState([]);

  const selectedMatch = fixtures.find(
    (match) => String(match.id) === String(selectedMatchId)
  );

  const homeTeam = selectedMatch ? getTeamById(selectedMatch.homeTeamId) : null;
  const awayTeam = selectedMatch ? getTeamById(selectedMatch.awayTeamId) : null;

  useEffect(() => {
    if (!selectedMatch) return;

    setHomeCoach(selectedMatch.lineups?.homeCoach || "");
    setAwayCoach(selectedMatch.lineups?.awayCoach || "");
    setHomePlayerIds(selectedMatch.lineups?.homePlayerIds || []);
    setAwayPlayerIds(selectedMatch.lineups?.awayPlayerIds || []);
  }, [selectedMatch]);

  const togglePlayer = (side, playerId) => {
    if (side === "home") {
      setHomePlayerIds((prev) =>
        prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
      );
      return;
    }

    setAwayPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const handleSaveLineup = () => {
    updateFixtureWithCallback(selectedMatchId, (match) => ({
      ...match,
      lineups: {
        homeCoach,
        awayCoach,
        homePlayerIds,
        awayPlayerIds,
      },
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Lineups</h2>
        <p>Lineups are now saved by player ID and support exact appearance tracking.</p>

        <select
          className="admin-select"
          value={selectedMatchId || ""}
          onChange={(e) => setSelectedMatchId(e.target.value)}
        >
          {fixtures.map((match) => (
            <option key={match.id} value={match.id}>
              {match.homeTeam} vs {match.awayTeam}
            </option>
          ))}
        </select>
      </div>

      {selectedMatch && (
        <div className="admin-section-card">
          <h2>
            {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
          </h2>

          <div className="admin-form__grid">
            <input
              type="text"
              placeholder="Home Coach"
              value={homeCoach}
              onChange={(e) => setHomeCoach(e.target.value)}
            />

            <input
              type="text"
              placeholder="Away Coach"
              value={awayCoach}
              onChange={(e) => setAwayCoach(e.target.value)}
            />
          </div>

          <div className="search-modal__grid">
            <div className="search-panel">
              <h3>{selectedMatch.homeTeam} Starters</h3>
              {homeTeam?.players?.length ? (
                homeTeam.players.map((player) => (
                  <label className="remember-me" key={player.id}>
                    <input
                      type="checkbox"
                      checked={homePlayerIds.includes(player.id)}
                      onChange={() => togglePlayer("home", player.id)}
                    />
                    <span>
                      {player.name} — {player.position}
                    </span>
                  </label>
                ))
              ) : (
                <p>No players available.</p>
              )}
            </div>

            <div className="search-panel">
              <h3>{selectedMatch.awayTeam} Starters</h3>
              {awayTeam?.players?.length ? (
                awayTeam.players.map((player) => (
                  <label className="remember-me" key={player.id}>
                    <input
                      type="checkbox"
                      checked={awayPlayerIds.includes(player.id)}
                      onChange={() => togglePlayer("away", player.id)}
                    />
                    <span>
                      {player.name} — {player.position}
                    </span>
                  </label>
                ))
              ) : (
                <p>No players available.</p>
              )}
            </div>
          </div>

          <div className="admin-actions">
            <button type="button" onClick={handleSaveLineup}>
              Save Lineup
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default ManageLineups;