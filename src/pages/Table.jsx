import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";
import CompetitionTable from "../components/sports/CompetitionTable";

function Table() {
  const { sports, getSortedTable } = useAppData();
  const [sport, setSport] = useState("Football");
  const [category, setCategory] = useState("Male");

  const sortedTable = getSortedTable(sport, category);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>League Table</h1>
            <p className="page-intro">
              Follow standings by sport and category.
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

            <CompetitionTable
              rows={sortedTable}
              emptyMessage={`No table data available for ${sport} ${category}.`}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Table;