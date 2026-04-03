import { useAppData } from "../../context/AppDataContext";
import facultyDepartments from "../../data/facultyDepartments";

function HeroStats() {
  const { fixtures, teams, sports, favourites, facultyDepartments } = useAppData();

  const liveMatches = fixtures.filter((fixture) => fixture.status === "Live").length;
  const qualifiedTeams = facultyDepartments.length;

  return (
    <div className="hero-stats">
      <div className="hero-stat">
        <strong>{sports.length}</strong>
        <span>Sports</span>
      </div>
      <div className="hero-stat">
        <strong>{qualifiedTeams}</strong>
        <span>Departments</span>
      </div>
      <div className="hero-stat">
        <strong>{liveMatches}</strong>
        <span>Live Matches</span>
      </div>
      <div className="hero-stat">
        <strong>{favourites.length}</strong>
        <span>Watchlisted Matches</span>
      </div>
    </div>
  );
}

export default HeroStats;