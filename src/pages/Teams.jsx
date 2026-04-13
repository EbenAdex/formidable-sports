import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function Teams() {
  const { teams = [], sports = [] } = useAppData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSport, setFilterSport] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const qualifiedTeams = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return teams.filter((team) => {
      const category = String(team.category || "").toLowerCase();
      const sport = String(team.sport || "").toLowerCase();
      const department = String(team.department || team.name || "").toLowerCase();
      const displayName = String(
        team.displayName ||
          `${team.department || team.name} ${team.sport || ""} ${team.category || ""} Team`
      ).toLowerCase();

      const validCategory = ["male", "female"].includes(category);
      if (!team.qualified || !validCategory) return false;

      const matchesSearch =
        !query ||
        department.includes(query) ||
        displayName.includes(query) ||
        sport.includes(query) ||
        (team.players || []).some((player) =>
          String(player.name || "").toLowerCase().includes(query)
        );

      const matchesSport =
        filterSport === "all" || sport === String(filterSport).toLowerCase();

      const matchesCategory =
        categoryFilter === "all" || category === String(categoryFilter).toLowerCase();

      return matchesSearch && matchesSport && matchesCategory;
    });
  }, [teams, searchTerm, filterSport, categoryFilter]);

  const groupedTeams = useMemo(() => {
    const groups = {};

    qualifiedTeams.forEach((team) => {
      const sport = team.sport || "Unknown Sport";
      const category = team.category || "Unknown Category";
      const key = `${sport}__${category}`;

      if (!groups[key]) {
        groups[key] = {
          sport,
          category,
          teams: [],
        };
      }

      groups[key].teams.push(team);
    });

    return Object.values(groups).sort((a, b) => {
      const sportCompare = String(a.sport).localeCompare(String(b.sport));
      if (sportCompare !== 0) return sportCompare;
      return String(a.category).localeCompare(String(b.category));
    });
  }, [qualifiedTeams]);

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Qualified Teams</h1>
            <p className="page-intro">
              Browse all qualified squads by sport and category.
            </p>
          </div>

          <div className="page-card">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search department, squad, sport or player"
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

            {groupedTeams.length ? (
              <div className="dark-grid">
                {groupedTeams.map((group) => (
                  <section
                    key={`${group.sport}-${group.category}`}
                    className="page-card"
                    style={{ marginTop: "1rem" }}
                  >
                    <h2 style={{ color: "#fff", marginTop: 0 }}>
                      {group.sport} - {group.category}
                    </h2>

                    <div className="team-grid-dark">
                      {group.teams.map((team) => (
                        <Link
                          to={`/teams/${team.id}`}
                          className="dark-link-card"
                          key={team.id}
                        >
                          <h3>
                            {team.displayName ||
                              `${team.department || team.name} ${team.sport || ""} ${team.category || ""} Team`}
                          </h3>

                          <p>
                            <strong>Department:</strong> {team.department || team.name}
                          </p>

                          <p>
                            <strong>Sport:</strong> {team.sport || "Not assigned"}
                          </p>

                          <p>
                            <strong>Category:</strong> {team.category || "Not assigned"}
                          </p>

                          <p>
                            <strong>Players:</strong> {team.players?.length || 0}
                          </p>

                          <p>
                            <strong>Coach:</strong> {team.coach?.name || "Not updated"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <p className="empty-state">No matching teams found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Teams;