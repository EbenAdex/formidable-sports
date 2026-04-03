import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function Teams() {
  const { teams, sports } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const qualifiedTeams = useMemo(() => {
    return teams.filter((team) => {
      const validCategory = ["male", "female"].includes(
        (team.category || "").toLowerCase()
      );
      if (!team.qualified || !validCategory) return false;

      const matchesSearch =
        (team.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.players || []).some((player) =>
          (player.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSport =
        filterSport === "all" ||
        (team.sports || []).some(
          (sport) => sport.toLowerCase() === filterSport.toLowerCase()
        );

      const matchesCategory =
        categoryFilter === "all" ||
        (team.category || "").toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesSport && matchesCategory;
    });
  }, [teams, searchTerm, filterSport, categoryFilter]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Qualified Teams</h1>
            <p className="page-intro">
              Browse all qualified teams by sport and category.
            </p>
          </div>

          <div className="page-card">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search team or player"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
              >
                <option value="all">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.name}>
                    {sport.name}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="team-grid-dark">
              {qualifiedTeams.length ? (
                qualifiedTeams.map((team) => (
                  <Link
                    to={`/teams/${team.id}`}
                    className="dark-link-card"
                    key={team.id}
                  >
                    <h3>{team.name}</h3>
                    <p>
                      <strong>Category:</strong> {team.category}
                    </p>
                    <p>
                      <strong>Sports:</strong>{" "}
                      {team.sports?.length ? team.sports.join(", ") : "Not assigned"}
                    </p>
                    <p>
                      <strong>Players:</strong> {team.players?.length || 0}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="empty-state">No matching teams found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Teams;