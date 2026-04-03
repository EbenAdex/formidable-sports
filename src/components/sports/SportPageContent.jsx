import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import { useAppData } from "../../context/AppDataContext";

function SportPageContent({ sportName, description }) {
  const { fixtures, teams } = useAppData();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredFixtures = useMemo(() => {
    const sportFixtures = fixtures.filter(
      (fixture) => fixture.sport.toLowerCase() === sportName.toLowerCase()
    );

    if (activeFilter === "all") return sportFixtures;
    if (activeFilter === "live") {
      return sportFixtures.filter((fixture) => fixture.status === "Live");
    }
    if (activeFilter === "upcoming") {
      return sportFixtures.filter(
        (fixture) => fixture.status === "Upcoming" && !fixture.postponed
      );
    }
    if (activeFilter === "ended") {
      return sportFixtures.filter((fixture) => fixture.status === "Ended");
    }
    if (activeFilter === "male") {
      return sportFixtures.filter(
        (fixture) => fixture.gender.toLowerCase() === "male"
      );
    }
    if (activeFilter === "female") {
      return sportFixtures.filter(
        (fixture) => fixture.gender.toLowerCase() === "female"
      );
    }

    return sportFixtures;
  }, [fixtures, sportName, activeFilter]);

  const assignedTeams = teams.filter((team) =>
    team.sports?.some((sport) => sport.toLowerCase() === sportName.toLowerCase())
  );

  return (
    <div className="sport-page">
      <div className="sport-filters">
        <button
          className={activeFilter === "all" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("all")}
          type="button"
        >
          All
        </button>
        <button
          className={activeFilter === "live" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("live")}
          type="button"
        >
          Live
        </button>
        <button
          className={activeFilter === "upcoming" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("upcoming")}
          type="button"
        >
          Upcoming
        </button>
        <button
          className={activeFilter === "ended" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("ended")}
          type="button"
        >
          Ended
        </button>
        <button
          className={activeFilter === "male" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("male")}
          type="button"
        >
          Male
        </button>
        <button
          className={activeFilter === "female" ? "sport-filter active" : "sport-filter"}
          onClick={() => setActiveFilter("female")}
          type="button"
        >
          Female
        </button>
      </div>

      <div className="sport-page__section">
        <h2>{sportName} Teams</h2>

        {assignedTeams.length ? (
  <div className="team-grid">
    {assignedTeams.map((team) => (
      <div className="team-card" key={team.id}>
        <img src={team.logo} alt={team.name} className="team-card__logo" />
        <h3>{team.name}</h3>
        <p><strong>Category:</strong> {team.category || 'N/A'}</p>
        <p><strong>Status:</strong> {team.qualified ? "Qualified" : "Not Qualified"}</p>
        {team.players && team.players.length > 0 && (
          <p><strong>Players:</strong> {team.players.length}</p>
        )}
        {team.coach && (
          <p><strong>Coach:</strong> {team.coach.name}</p>
        )}
      </div>
    ))}
  </div>
) : (
  <p>No teams assigned to {sportName} yet.</p>
)}
</div>
      <div className="sport-page__section">
        <h2>{sportName} Fixtures</h2>

        {filteredFixtures.length ? (
          <div className="match-list">
            {filteredFixtures.map((fixture) => (
              <MatchCard key={fixture.id} match={fixture} type="fixture" />
            ))}
          </div>
        ) : (
          <p>No fixtures available for this filter.</p>
        )}
      </div>
    </div>
  );
}

export default SportPageContent;