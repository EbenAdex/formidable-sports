import { useMemo, useState, useEffect } from "react";
import { useAppData, isValidCategory } from "../../context/AppDataContext";
import SearchResultModal from "./SearchResultModal";

function HomeSearch() {
  const { teams } = useAppData();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedResult, setSelectedResult] = useState(null);

  const searchableItems = useMemo(() => {
    const validTeams = teams.filter((team) => isValidCategory(team.category));

    const filteredTeams =
      categoryFilter === "all"
        ? validTeams
        : validTeams.filter(
            (team) => team.category.toLowerCase() === categoryFilter.toLowerCase()
          );

    const teamItems = filteredTeams.map((team) => ({
      id: `team-${team.id}`,
      type: "team",
      label: `${team.name} (${team.category})`,
      team,
    }));

    const playerItems = filteredTeams.flatMap((team) =>
      (team.players || []).map((player) => ({
        id: `player-${team.id}-${player.id}`,
        type: "player",
        label: `${player.name} (${team.category})`,
        player,
        team,
      }))
    );

    return [...teamItems, ...playerItems];
  }, [teams, categoryFilter]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    return searchableItems
      .filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase())
      )
      .slice(0, 10);
  }, [query, searchableItems]);

  return (
    <>
      <section className="home-search section">
        <div className="container">
          <div className="home-search__box">
            <h2>Search Teams and Players</h2>
            <p>
              Search male and female teams and players separately across all
              available sports.
            </p>

            <div className="team-search-bar">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="home-search__input-wrap">
              <input
                type="text"
                placeholder="Search for a team or player"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {filteredResults.length > 0 && (
                <div className="home-search__results">
                  {filteredResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="home-search__result-item"
                      onClick={() => {
                        setSelectedResult(item);
                        setQuery("");
                      }}
                    >
                      <span>{item.label}</span>
                      <small>{item.type === "team" ? "Team" : "Player"}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedResult && (
        <SearchResultModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </>
  );
}

export default HomeSearch;