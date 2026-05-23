import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";

const MAX_STARTERS = {
  Football: 11,
  Basketball: 5,
  Volleyball: 6,
  Tennis: 1,
};

function ManageLineups() {
  const { fixtures, teams, updateFixture } =
    useAppData();

  const [selectedFixtureId, setSelectedFixtureId] =
    useState(fixtures[0]?.id || "");

  const [selectedSport, setSelectedSport] =
    useState("Football");

  const [selectedCategory, setSelectedCategory] =
    useState("Male");

  const [homeCoach, setHomeCoach] =
    useState("");

  const [awayCoach, setAwayCoach] =
    useState("");

  const [homeStarters, setHomeStarters] =
    useState([]);

  const [awayStarters, setAwayStarters] =
    useState([]);

  const normalize = (value = "") =>
    String(value).trim().toLowerCase();

  const filteredFixtures = useMemo(() => {
    return fixtures.filter(
      (fixture) =>
        normalize(fixture.sport) ===
          normalize(selectedSport) &&
        normalize(fixture.category) ===
          normalize(selectedCategory)
    );
  }, [
    fixtures,
    selectedSport,
    selectedCategory,
  ]);

  const selectedFixture = useMemo(() => {
    return filteredFixtures.find(
      (fixture) =>
        String(fixture.id) ===
        String(selectedFixtureId)
    );
  }, [filteredFixtures, selectedFixtureId]);

  const homeTeam = useMemo(() => {
    if (!selectedFixture) return null;

    return teams.find((team) => {
      const sameDepartment =
        normalize(team.name) ===
        normalize(selectedFixture.homeTeam);

      const sameCategory =
        normalize(team.category) ===
        normalize(selectedFixture.category);

      const sameSport =
        normalize(team.sport) ===
          normalize(selectedFixture.sport) ||
        (team.sports || []).some(
          (sport) =>
            normalize(sport) ===
            normalize(selectedFixture.sport)
        );

      return (
        sameDepartment &&
        sameCategory &&
        sameSport
      );
    });
  }, [selectedFixture, teams]);

  const awayTeam = useMemo(() => {
    if (!selectedFixture) return null;

    return teams.find((team) => {
      const sameDepartment =
        normalize(team.name) ===
        normalize(selectedFixture.awayTeam);

      const sameCategory =
        normalize(team.category) ===
        normalize(selectedFixture.category);

      const sameSport =
        normalize(team.sport) ===
          normalize(selectedFixture.sport) ||
        (team.sports || []).some(
          (sport) =>
            normalize(sport) ===
            normalize(selectedFixture.sport)
        );

      return (
        sameDepartment &&
        sameCategory &&
        sameSport
      );
    });
  }, [selectedFixture, teams]);

  const toggleStarter = (
    side,
    playerId
  ) => {
    const limit =
      MAX_STARTERS[selectedSport] || 11;

    if (side === "home") {
      setHomeStarters((prev) => {
        if (prev.includes(playerId)) {
          return prev.filter(
            (id) => id !== playerId
          );
        }

        if (prev.length >= limit) {
          alert(
            `Maximum ${limit} starters allowed`
          );
          return prev;
        }

        return [...prev, playerId];
      });
    }

    if (side === "away") {
      setAwayStarters((prev) => {
        if (prev.includes(playerId)) {
          return prev.filter(
            (id) => id !== playerId
          );
        }

        if (prev.length >= limit) {
          alert(
            `Maximum ${limit} starters allowed`
          );
          return prev;
        }

        return [...prev, playerId];
      });
    }
  };

  const handleSave = async () => {
    if (!selectedFixture) return;

    try {
      await updateFixture(selectedFixture.id, {
        lineups: {
          homeCoach,
          awayCoach,
          homeStarters,
          awayStarters,
        },
      });

      alert("Lineup saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save lineup");
    }
  };

  return (
    <AdminLayout>
      <div className="manage-lineups-page">
        <div className="manage-lineups-header">
          <h1>Manage Lineups</h1>
          <p>
            Create official starting
            lineups for fixtures.
          </p>
        </div>

        <div className="lineup-top-controls">
          <select
            value={selectedSport}
            onChange={(e) =>
              setSelectedSport(
                e.target.value
              )
            }
          >
            <option>Football</option>
            <option>Basketball</option>
            <option>Volleyball</option>
            <option>Tennis</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value
              )
            }
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <select
            value={selectedFixtureId}
            onChange={(e) =>
              setSelectedFixtureId(
                e.target.value
              )
            }
          >
            {filteredFixtures.map(
              (fixture) => (
                <option
                  key={fixture.id}
                  value={fixture.id}
                >
                  {fixture.homeTeam} vs{" "}
                  {fixture.awayTeam}
                </option>
              )
            )}
          </select>
        </div>

        {selectedFixture && (
          <div className="lineup-main-card">
            <div className="lineup-fixture-title">
              <h2>
                {selectedFixture.homeTeam} vs{" "}
                {selectedFixture.awayTeam}
              </h2>

              <div className="lineup-tags">
                <span>
                  {selectedSport}
                </span>

                <span>
                  {selectedCategory}
                </span>
              </div>
            </div>

            <div className="lineup-coach-grid">
              <input
                type="text"
                placeholder="Home Coach"
                value={homeCoach}
                onChange={(e) =>
                  setHomeCoach(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                placeholder="Away Coach"
                value={awayCoach}
                onChange={(e) =>
                  setAwayCoach(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="lineup-teams-grid">
              {/* HOME */}
              <div className="lineup-team-card">
                <h3>
                  {homeTeam?.name} Starters
                </h3>

                <div className="players-grid">
                  {homeTeam?.players?.map(
                    (player) => (
                      <div
                        key={player.id}
                        className={`player-card ${
                          homeStarters.includes(
                            player.id
                          )
                            ? "active-player"
                            : ""
                        }`}
                        onClick={() =>
                          toggleStarter(
                            "home",
                            player.id
                          )
                        }
                      >
                        <div className="player-number">
                          #
                          {player.jerseyNumber}
                        </div>

                        <div className="player-info">
                          <h4>
                            {player.name}
                          </h4>

                          <p>
                            {
                              player.position
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* AWAY */}
              <div className="lineup-team-card">
                <h3>
                  {awayTeam?.name} Starters
                </h3>

                <div className="players-grid">
                  {awayTeam?.players?.map(
                    (player) => (
                      <div
                        key={player.id}
                        className={`player-card ${
                          awayStarters.includes(
                            player.id
                          )
                            ? "active-player"
                            : ""
                        }`}
                        onClick={() =>
                          toggleStarter(
                            "away",
                            player.id
                          )
                        }
                      >
                        <div className="player-number">
                          #
                          {player.jerseyNumber}
                        </div>

                        <div className="player-info">
                          <h4>
                            {player.name}
                          </h4>

                          <p>
                            {
                              player.position
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              className="save-lineup-btn"
              onClick={handleSave}
            >
              Save Official Lineup
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ManageLineups;