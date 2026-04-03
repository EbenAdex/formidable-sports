import { useMemo } from "react";
import { useAppData } from "../../context/AppDataContext";

type Player = {
  id: number;
  name: string;
  position?: string;
  jerseyNumber?: number;
  goals?: number;
  cleanSheets?: number;
  points?: number;
};

type Team = {
  id: number;
  name: string;
  logo?: string;
  about?: string;
  category?: string;
  sports?: string[];
  coach?: { name?: string };
  players?: Player[];
};

type SearchResult =
  | {
      id: string;
      type: "team";
      label: string;
      team: Team;
      player?: undefined;
    }
  | {
      id: string;
      type: "player";
      label: string;
      team: Team;
      player: Player;
    };

type Fixture = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  status: string;
  postponed?: boolean;
  date?: string;
  kickoffTime?: string;
  gender?: string;
};

type Result = {
  id: number;
  sport: string;
  gender: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue: string;
};

type SearchResultModalProps = {
  result: SearchResult;
  onClose: () => void;
};

function SearchResultModal({ result, onClose }: SearchResultModalProps) {
  const { fixtures, results } = useAppData();
  const fixturesData = fixtures as Fixture[];
  const resultsData = results as Result[];

  const teamData = useMemo(() => {
    if (result.type === "team") return result.team;
    if (result.type === "player") return result.team;
    return null;
  }, [result]);

  const teamFixtures = useMemo<Fixture[]>(() => {
    if (!teamData) return [];

    return fixturesData.filter(
      (fixture) =>
        (fixture.homeTeam === teamData.name || fixture.awayTeam === teamData.name) &&
        fixture.gender === teamData.category
    );
  }, [fixturesData, teamData]);

  const teamResults = useMemo<Result[]>(() => {
    if (!teamData) return [];

    return resultsData.filter(
      (item) =>
        (item.homeTeam === teamData.name || item.awayTeam === teamData.name) &&
        item.gender === teamData.category
    );
  }, [resultsData, teamData]);

  const playedMatches = teamFixtures.filter((fixture) => fixture.status === "Ended");
  const upcomingMatches = teamFixtures.filter(
    (fixture) => fixture.status === "Upcoming" && !fixture.postponed
  );
  const liveMatches = teamFixtures.filter((fixture) => fixture.status === "Live");

  const estimatedPlayerMatches = teamFixtures.length;

  return (
    <div className="search-modal">
      <div className="search-modal__overlay" onClick={onClose} />

      <div className="search-modal__content">
        <button className="search-modal__close" onClick={onClose} type="button">
          ✕
        </button>

        {result.type === "team" && (
          <div className="search-modal__body">
            <div className="search-modal__hero">
              <img
                src={result.team.logo}
                alt={result.team.name}
                className="search-modal__logo"
              />

              <div>
                <h2>{result.team.name}</h2>
                <p>{result.team.about}</p>
                <p>
                  <strong>Category:</strong> {result.team.category}
                </p>
                <p>
                  <strong>Sports:</strong>{" "}
                  {result.team.sports?.length
                    ? result.team.sports.join(", ")
                    : "None assigned"}
                </p>
                <p>
                  <strong>Coach:</strong> {result.team.coach?.name || "Not updated"}
                </p>
                <p>
                  <strong>Squad Size:</strong> {result.team.players?.length || 0}
                </p>
              </div>
            </div>

            <div className="search-modal__grid">
              <div className="search-panel">
                <h3>Competition Summary</h3>
                <p>
                  <strong>Total Fixtures:</strong> {teamFixtures.length}
                </p>
                <p>
                  <strong>Played Matches:</strong> {playedMatches.length}
                </p>
                <p>
                  <strong>Upcoming Matches:</strong> {upcomingMatches.length}
                </p>
                <p>
                  <strong>Live Matches:</strong> {liveMatches.length}
                </p>
                <p>
                  <strong>Recorded Results:</strong> {teamResults.length}
                </p>
              </div>

              <div className="search-panel">
                <h3>Recent Fixtures</h3>
                {teamFixtures.length ? (
                  <div className="search-list">
                    {teamFixtures.slice(0, 6).map((fixture) => (
                      <div className="search-list__item" key={fixture.id}>
                        <strong>
                          {fixture.homeTeam} vs {fixture.awayTeam}
                        </strong>
                        <p>
                          {fixture.date} • {fixture.kickoffTime} • {fixture.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No fixtures found for this team.</p>
                )}
              </div>
            </div>

            <div className="search-panel">
              <h3>Players</h3>
              {result.team.players?.length ? (
                <div className="player-list">
                  {result.team.players.map((player) => (
                    <div className="player-card" key={player.id}>
                      <h4>{player.name}</h4>
                      <p>
                        <strong>Position:</strong> {player.position}
                      </p>
                      <p>
                        <strong>Jersey:</strong> {player.jerseyNumber}
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
                  ))}
                </div>
              ) : (
                <p>No player data available yet.</p>
              )}
            </div>
          </div>
        )}

        {result.type === "player" && (
          <div className="search-modal__body">
            <div className="search-modal__hero">
              <img
                src={result.team.logo}
                alt={result.team.name}
                className="search-modal__logo"
              />

              <div>
                <h2>{result.player.name}</h2>
                <p>
                  <strong>Team:</strong> {result.team.name}
                </p>
                <p>
                  <strong>Category:</strong> {result.team.category}
                </p>
                <p>
                  <strong>Sports:</strong>{" "}
                  {result.team.sports?.length
                    ? result.team.sports.join(", ")
                    : "None assigned"}
                </p>
                <p>
                  <strong>Position:</strong> {result.player.position}
                </p>
                <p>
                  <strong>Jersey Number:</strong> {result.player.jerseyNumber}
                </p>
              </div>
            </div>

            <div className="search-modal__grid">
              <div className="search-panel">
                <h3>Player Statistics</h3>
                <p>
                  <strong>Goals:</strong> {result.player.goals || 0}
                </p>
                <p>
                  <strong>Clean Sheets:</strong> {result.player.cleanSheets || 0}
                </p>
                <p>
                  <strong>Points:</strong> {result.player.points || 0}
                </p>
                <p>
                  <strong>Total Matches Played:</strong> {estimatedPlayerMatches}
                </p>
              </div>

              <div className="search-panel">
                <h3>Team Competition Summary</h3>
                <p>
                  <strong>Played Matches:</strong> {playedMatches.length}
                </p>
                <p>
                  <strong>Upcoming Matches:</strong> {upcomingMatches.length}
                </p>
                <p>
                  <strong>Live Matches:</strong> {liveMatches.length}
                </p>
              </div>
            </div>

            <div className="search-panel">
              <h3>Related Team Fixtures</h3>
              {teamFixtures.length ? (
                <div className="search-list">
                  {teamFixtures.slice(0, 6).map((fixture) => (
                    <div className="search-list__item" key={fixture.id}>
                      <strong>
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </strong>
                      <p>
                        {fixture.date} • {fixture.kickoffTime} • {fixture.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No fixture data available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResultModal;