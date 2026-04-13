import { useMemo, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";
import CompetitionTable from "../components/sports/CompetitionTable";

function Table() {
  const { sports, table = [], getSortedTable } = useAppData();
  const [sport, setSport] = useState("Football");
  const [category, setCategory] = useState("Male");

  const groupedTables = useMemo(() => {
    const groups = [
      ...new Set(
        table
          .filter(
            (row) =>
              String(row?.sport || "").toLowerCase() === sport.toLowerCase() &&
              String(row?.category || "").toLowerCase() === category.toLowerCase() &&
              String(row?.competitionGroup || "").trim() !== ""
          )
          .map((row) => String(row.competitionGroup))
      ),
    ].sort();

    return groups.map((groupName) => ({
      groupName,
      rows: getSortedTable(sport, category, groupName),
    }));
  }, [table, sport, category, getSortedTable]);

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />

      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>League Table</h1>
            <p className="page-intro">
              Follow standings by sport, category, and competition group.
            </p>
          </div>

          <div className="page-card">
            <div className="team-search-bar">
              <select value={sport} onChange={(e) => setSport(e.target.value)}>
                {sports.length ? (
                  sports.map((sportItem) => (
                    <option key={sportItem.id} value={sportItem.name}>
                      {sportItem.name}
                    </option>
                  ))
                ) : (
                  <option value="Football">Football</option>
                )}
              </select>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {groupedTables.length ? (
            groupedTables.map((group) => (
              <div className="page-card" key={group.groupName}>
                <h2 style={{ marginTop: 0 }}>{group.groupName}</h2>
                <CompetitionTable
                  rows={group.rows}
                  emptyMessage={`No table data available for ${sport} ${category} ${group.groupName}.`}
                />
              </div>
            ))
          ) : (
            <div className="page-card">
              <p className="empty-state">
                No grouped table data available for {sport} {category}.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Table;