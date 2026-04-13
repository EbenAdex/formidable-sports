import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function asText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function Home() {
  const navigate = useNavigate();
  const appData = useAppData() || {};

  const fixtures = asArray(appData.fixtures);
  const results = asArray(appData.results);
  const news = asArray(appData.news);
  const sports = asArray(appData.sports);
  const teams = asArray(appData.teams);
  const favourites = asArray(appData.favourites);
  const table =asArray(appData.table);
  const getSortedTable =
    typeof appData.getSortedTable === "function" ? appData.getSortedTable : () => [];

  const [searchCategory, setSearchCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLiveMinute = (timing) => {
    if (!timing || !timing.currentPeriodStartedAt) return "";

    if (!timing.isRunning) {
      if (timing.phase === "Halftime") return "HT";
      if (timing.phase === "Ended") return "FT";
      if (timing.phase === "Break") return "Break";
      return "";
    }

    const start = new Date(timing.currentPeriodStartedAt).getTime();
    const now = Date.now();

    const elapsedSeconds = Math.max(Math.floor((now - start) / 1000), 0);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    const period = Number(timing.currentPeriod || 1);
    const periodDuration = Number(timing.periodDurationMinutes || 45);

    if (period === 1) {
      if (elapsedMinutes <= periodDuration) return `${elapsedMinutes}'`;
      return `${periodDuration}+${elapsedMinutes - periodDuration}'`;
    }

    if (period === 2) {
      const totalMinutes = periodDuration + elapsedMinutes;
      if (elapsedMinutes <= periodDuration) return `${totalMinutes}'`;
      return `${periodDuration * 2}+${elapsedMinutes - periodDuration}'`;
    }

    return `${elapsedMinutes}'`;
  };

  const liveMatches = useMemo(() => {
    return fixtures
      .filter((fixture) =>
        ["Live", "Halftime", "Break"].includes(asText(fixture?.status))
      )
      .slice(0, 2);
  }, [fixtures]);

  const upcomingFixtures = useMemo(() => {
    return fixtures
      .filter(
        (fixture) =>
          asText(fixture?.status) === "Upcoming" && !Boolean(fixture?.postponed)
      )
      .slice(0, 2);
  }, [fixtures]);

  const recentResults = useMemo(() => results.slice(0, 3), [results]);

  const availableFootballMaleGroups = [
  ...new Set(
    table
      .filter(
        (row) =>
          asText(row?.sport).toLowerCase() === "football" &&
          asText(row?.category).toLowerCase() === "male" &&
          asText(row?.competitionGroup).trim() !== ""
      )
      .map((row) => asText(row?.competitionGroup))
  ),
].sort();

const activeTopStandingGroup = availableFootballMaleGroups[0] || "";

const topStandings = activeTopStandingGroup
  ? asArray(getSortedTable("Football", "Male", activeTopStandingGroup)).slice(0, 4)
  : [];

  const qualifiedTeams = useMemo(() => {
    const qualifiedDepartments = new Set();

    teams.forEach((team) => {
      const isQualified = Boolean(team?.qualified);
      const departmentName = asText(team?.department || team?.name).trim();

      if (isQualified && departmentName) {
        qualifiedDepartments.add(departmentName.toLowerCase());
      }
    });

    return qualifiedDepartments.size;
  }, [teams]);

  const totalSquads = teams.length;

  const searchableTeams = useMemo(() => {
    return teams.filter((team) => {
      const category = asText(team?.category).toLowerCase();
      const validCategory = ["male", "female"].includes(category);
      if (!validCategory) return false;

      return searchCategory === "all" || category === searchCategory.toLowerCase();
    });
  }, [teams, searchCategory]);

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchableTeams.filter((team) => {
      const displayName = asText(team?.displayName).toLowerCase();
      const department = asText(team?.department || team?.name).toLowerCase();
      const sport = asText(team?.sport).toLowerCase();
      const category = asText(team?.category).toLowerCase();

      return (
        displayName.includes(query) ||
        department.includes(query) ||
        sport.includes(query) ||
        category.includes(query)
      );
    });
  }, [searchQuery, searchableTeams]);

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchableTeams.flatMap((team) =>
      asArray(team.players)
        .filter((player) => asText(player?.name).toLowerCase().includes(query))
        .map((player) => ({
          ...player,
          teamId: team.id,
          teamName:
            team.displayName ||
            `${team.department || team.name} ${team.sport || ""} ${team.category || ""} Team`,
          sport: team.sport,
          category: team.category,
        }))
    );
  }, [searchQuery, searchableTeams]);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const matchedTeam = filteredTeams[0];
    if (matchedTeam) {
      navigate(`/teams/${matchedTeam.id}`);
      return;
    }

    const matchedPlayer = filteredPlayers[0];
    if (matchedPlayer) {
      navigate(`/players/${matchedPlayer.teamId}/${matchedPlayer.id}`);
      return;
    }

    alert("No matching team or player found.");
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <Navbar />

      <main className="homepage">
        <section className="homepage-hero">
          <div className="container">
            <div className="homepage-hero__content">
              <p className="homepage-hero__tag">Faculty Sports Platform</p>
              <h1>ARTLYMPICS 6.0</h1>
              <p>
                Your source for fixtures, results, live updates, teams, records,
                and competition information.
              </p>

              <div className="homepage-hero__actions">
                <Link to="/fixtures" className="btn btn--primary">
                  View Fixtures
                </Link>
                <Link to="/results" className="btn btn--outline">
                  View Results
                </Link>
              </div>

              <div className="homepage-stats">
                <div className="homepage-stat-card">
                  <strong>{sports.length}</strong>
                  <span>Sports</span>
                </div>

                <div className="homepage-stat-card">
                  <strong>{qualifiedTeams}</strong>
                  <span>Qualified Teams</span>
                </div>

                <div className="homepage-stat-card">
                  <strong>{liveMatches.length}</strong>
                  <span>Live Matches</span>
                </div>

                <div className="homepage-stat-card">
                  <strong>{favourites.length}</strong>
                  <span>Watchlisted Matches</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  color: "#dbe6f7",
                  fontWeight: 600,
                }}
              >
                Total Squads Created: {totalSquads}
              </div>
            </div>
          </div>
        </section>

        <section className="homepage-search-block">
          <div className="container">
            <div className="homepage-panel">
              <h2>Search Teams and Players</h2>
              <p>
                Search male and female squads and players across all available sports.
              </p>

              <div className="homepage-search-row">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <input
                  type="text"
                  placeholder="Search by department, sport, team or player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />

                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              {!!searchQuery.trim() && (
                <div className="homepage-search-results">
                  {filteredTeams.length > 0 && (
                    <div className="homepage-search-results__block">
                      <h3>Teams</h3>
                      <div className="search-list">
                        {filteredTeams.slice(0, 5).map((team) => (
                          <Link
                            key={team.id}
                            to={`/teams/${team.id}`}
                            className="search-list__item"
                          >
                            <strong>
                              {team.displayName ||
                                `${team.department || team.name} ${team.sport || ""} ${team.category || ""} Team`}
                            </strong>
                            <p>
                              {team.department || team.name} • {team.sport || "No sport"} •{" "}
                              {team.category || "No category"}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredPlayers.length > 0 && (
                    <div className="homepage-search-results__block">
                      <h3>Players</h3>
                      <div className="search-list">
                        {filteredPlayers.slice(0, 5).map((player) => (
                          <Link
                            key={`${player.teamId}-${player.id}`}
                            to={`/players/${player.teamId}/${player.id}`}
                            className="search-list__item"
                          >
                            <strong>{player.name}</strong>
                            <p>
                              {player.teamName} • {player.position || "No position"} •{" "}
                              {player.sport || "No sport"} • {player.category || "No category"}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredTeams.length === 0 && filteredPlayers.length === 0 && (
                    <p className="homepage-empty">No matching team or player found.</p>
                  )}
                </div>
              )}

              <div className="homepage-sports-grid">
                {sports.length ? (
                  sports.map((sport) => (
                    <Link
                      to={asText(sport?.link, "#")}
                      className="homepage-sport-card"
                      key={asText(sport?.id, asText(sport?.name, "sport"))}
                    >
                      <div className="homepage-sport-card__image-wrap">
                        <img
                          src={
                            asText(sport?.name).toLowerCase() === "football"
                              ? "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80"
                              : asText(sport?.name).toLowerCase() === "basketball"
                              ? "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80"
                              : asText(sport?.name).toLowerCase() === "volleyball"
                              ? "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=80"
                              : "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80"
                          }
                          alt={asText(sport?.name, "Sport")}
                        />
                      </div>
                      <h3>{asText(sport?.name, "Sport")}</h3>
                    </Link>
                  ))
                ) : (
                  <p className="homepage-empty">No sports available yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="homepage-body">
          <div className="container homepage-body__grid">
            <div className="homepage-main">
              <div className="homepage-panel">
                <div className="homepage-section-head">
                  <h2>Live Matches</h2>
                  <Link to="/fixtures">More</Link>
                </div>

                {liveMatches.length ? (
                  <div className="homepage-match-grid">
                    {liveMatches.map((match) => (
                      <div className="homepage-match-card" key={match?.id}>
                        <div className="homepage-match-card__top">
                          <span>{match?.category || match?.gender || "Category"}</span>
                          <span className="homepage-badge">LIVE</span>
                        </div>

                        <p className="live-minute">⏱ {getLiveMinute(match.timing)}</p>

                        <h3>
                          {match?.homeTeam || "Home"} <strong>{match?.score?.home ?? 0}</strong> -{" "}
                          <strong>{match?.score?.away ?? 0}</strong> {match?.awayTeam || "Away"}
                        </h3>

                        <p>{match?.sport || "Sport"}</p>
                        <p>{match?.stage || "Stage"}</p>
                        <p>
                          {match?.date || "Date"} • {match?.kickoffTime || "--"} -{" "}
                          {match?.endTime || "--"}
                        </p>
                        <p>{match?.venue || "Venue"}</p>

                        <Link to={`/match/${match?.id}`} className="homepage-link-btn">
                          Match Details
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="homepage-empty">No live matches available.</p>
                )}
              </div>

              <div className="homepage-panel">
                <div className="homepage-section-head">
                  <h2>Upcoming Fixtures</h2>
                  <Link to="/fixtures">More</Link>
                </div>

                {upcomingFixtures.length ? (
                  <div className="homepage-fixture-grid">
                    {upcomingFixtures.map((fixture) => (
                      <div className="homepage-fixture-card" key={fixture?.id}>
                        <h3>
                          {fixture?.homeTeam || "Home"} vs {fixture?.awayTeam || "Away"}
                        </h3>
                        <p>{fixture?.sport || "Sport"}</p>
                        <p>{fixture?.category || fixture?.gender || "Category"}</p>
                        <p>{fixture?.date || "Date"}</p>
                        <p>
                          {fixture?.kickoffTime || "--"} • {fixture?.venue || "Venue"}
                        </p>
                        <p>{fixture?.stage || "Stage"}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="homepage-empty">No upcoming fixtures available.</p>
                )}
              </div>

              <div className="homepage-panel">
                <div className="homepage-section-head">
                  <h2>Latest News</h2>
                  <Link to="/news">More</Link>
                </div>

                {news.length ? (
                  <div className="homepage-news-grid">
                    {news.slice(0, 2).map((item) => (
                      <div className="homepage-news-card" key={item?.id}>
                        <div className="homepage-news-card__image">
                          <img src={item?.image} alt={item?.title || "News"} />
                        </div>
                        <div className="homepage-news-card__content">
                          <h3>{item?.title || "News Title"}</h3>
                          <p>{item?.summary || "No summary available."}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="homepage-empty">No news available.</p>
                )}
              </div>
            </div>

            <aside className="homepage-sidebar">
              <div className="homepage-panel">
                <div className="homepage-section-head">
                  <h2>Recent Results</h2>
                  <Link to="/results">More</Link>
                </div>

                {recentResults.length ? (
                  <div className="homepage-side-list">
                    {recentResults.map((result) => (
                      <div className="homepage-side-card" key={result?.id}>
                        <h4>
                          {result?.homeTeam || "Home"} {result?.homeScore ?? 0} -{" "}
                          {result?.awayScore ?? 0} {result?.awayTeam || "Away"}
                        </h4>
                        <p>{result?.sport || "Sport"}</p>
                        <p>
                          {result?.gender || result?.category || "Category"}
                          {result?.competitionGroup ? ` • ${result.competitionGroup}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="homepage-empty">No recent results.</p>
                )}
              </div>

              <div className="homepage-panel">
                <div className="homepage-section-head">
                  <h2>Top Standings
                    {activeTopStandingGroup ? ` - ${activeTopStandingGroup}` : ""}
                  </h2>
                  <Link to="/table">More</Link>
                </div>

                {topStandings.length ? (
                  <div className="homepage-table-wrap">
                    <table className="homepage-table">
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Team</th>
                          <th>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topStandings.map((team) => (
                          <tr key={team?.id || `${team?.team}-${team?.position}`}>
                            <td>{team?.position}</td>
                            <td>{team?.team}</td>
                            <td>{team?.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="homepage-empty">No standings available.</p>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;