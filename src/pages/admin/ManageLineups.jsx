import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

const MAX_STARTERS = {
  Football: 11,
  Basketball: 5,
  Volleyball: 6,
  "Table Tennis": 1,
};

function ManageLineups() {
  const { fixtures, players, getTeamById, updateFixtureWithCallback } = useAppData();
  const [selectedMatchId, setSelectedMatchId] = useState(fixtures[0]?.id || "");

  const [homeCoach, setHomeCoach] = useState("");
  const [awayCoach, setAwayCoach] = useState("");
  const [homePlayerIds, setHomePlayerIds] = useState([]);
  const [awayPlayerIds, setAwayPlayerIds] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
const [filterSport, setFilterSport] = useState("");



  const selectedMatch = fixtures.find(
    (match) => String(match.id) === String(selectedMatchId)
  );

   const matchCategory = selectedMatch?.category || selectedMatch?.gender;

  const homeTeam = selectedMatch ? getTeamById(selectedMatch.homeTeamId) : null;
  const awayTeam = selectedMatch ? getTeamById(selectedMatch.awayTeamId) : null;


  console.log("Match Category:", matchCategory);
console.log("Home Players:", homeTeam?.players);
console.log("Away Players:", awayTeam?.players);
  useEffect(() => {
    if (!selectedMatch) return;

    setHomeCoach(selectedMatch.lineups?.homeCoach || "");
    setAwayCoach(selectedMatch.lineups?.awayCoach || "");
    setHomePlayerIds(selectedMatch.lineups?.homePlayerIds || []);
    setAwayPlayerIds(selectedMatch.lineups?.awayPlayerIds || []);
    setFilterCategory(selectedMatch.category || selectedMatch.gender || "");
  setFilterSport(selectedMatch.sport || "");
  }, [selectedMatch]);

  const togglePlayer = (side, playerId) => {
    const max = MAX_STARTERS[selectedMatch?.sport] || 11;

    if (side === "home") {
      setHomePlayerIds((prev) => {
        if (prev.includes(playerId)) {
          return prev.filter((id) => id !== playerId);
        }

        if (prev.length >= max) {
          alert(`Only ${max} starters allowed`);
          return prev;
        }

        return [...prev, playerId];
      });
      return;
    }

    setAwayPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }

      if (prev.length >= max) {
        alert(`Only ${max} starters allowed`);
        return prev;
      }

      return [...prev, playerId];
    });
  };

  

const handleSaveLineup = () => {
    if (!selectedMatch) return;

    if (homePlayerIds.length === 0 || awayPlayerIds.length === 0) {
      alert("Both teams must have players selected");
      return;
    }

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

  const normalize = (v) => (v || "").toLowerCase().trim();
const getFilteredPlayers = (players) => {
  return (players || []).filter((player) => {
    const matchesCategory =
      !filterCategory || normalize(player.category) === normalize(filterCategory);

    const matchesSport =
      !filterSport || (player.sports || []).some(
        (s) => normalize(s) === normalize(filterSport)
      );

    return matchesCategory && matchesSport;
  });
};
 

const homePlayers = homeTeam?.players || [];
const awayPlayers = awayTeam?.players || [];

const filteredHomePlayers = getFilteredPlayers(homePlayers);
const filteredAwayPlayers = getFilteredPlayers(awayPlayers);

 return (
    <AdminLayout>
      <div className="admin-section-card">
        <h2>Manage Lineups</h2>
        <p>Lineups are filtered by match category and enforce player limits.</p>

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

          <div className="admin-form__grid">
  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  >
    <option value="">All Categories</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>

  <select
    value={filterSport}
    onChange={(e) => setFilterSport(e.target.value)}
  >
    <option value="">All Sports</option>
    <option value="Football">Football</option>
    <option value="Basketball">Basketball</option>
    <option value="Volleyball">Volleyball</option>
    <option value="Table Tennis">Table Tennis</option>
  </select>
</div>

          <div className="search-modal__grid">
            {/* HOME TEAM */}
            <div className="search-panel">
              <h3>{selectedMatch.homeTeam} Starters</h3>

 

   {filteredHomePlayers.length ? (
  filteredHomePlayers.map((player) => (
    <label className="remember-me" key={player.id}>
      <input
        type="checkbox"
        checked={homePlayerIds.includes(player.id)}
        onChange={() => togglePlayer("home", player.id)}
      />
      <span>
        #{player.jerseyNumber || "-"} {player.name} — {player.position}
      </span>
    </label>
  ))
) : (
  <p>No players available.</p>
)}
            </div>

            {/* AWAY TEAM */}
            <div className="search-panel">
              <h3>{selectedMatch.awayTeam} Starters</h3>
{filteredAwayPlayers.length ? (
  filteredAwayPlayers.map((player) => (
    <label className="remember-me" key={player.id}>
      <input
        type="checkbox"
        checked={awayPlayerIds.includes(player.id)}
        onChange={() => togglePlayer("away", player.id)}
      />
      <span>
        #{player.jerseyNumber || "-"} {player.name} — {player.position}
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