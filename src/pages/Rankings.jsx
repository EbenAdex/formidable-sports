import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";

function Rankings() {
  const { getRankingsBySportAndCategory } = useAppData();
  const [sport, setSport] = useState("Athletics");
  const [category, setCategory] = useState("Male");

  const rankingRows = getRankingsBySportAndCategory(sport, category);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Rankings</h1>
            <p className="page-intro">
              Follow official rankings and placements for athletics, swimming, track,
              and other ranking-based events.
            </p>
          </div>

          <div className="page-card">
            <div className="filter-bar">
              <select value={sport} onChange={(e) => setSport(e.target.value)}>
                <option value="Athletics">Athletics</option>
                <option value="Swimming">Swimming</option>
                <option value="Track Events">Track Events</option>
              </select>

              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="page-table-wrap">
              <table className="page-table-dark">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Department</th>
                    <th>Event</th>
                    <th>Score / Time</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingRows.length ? (
                    rankingRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.rank}</td>
                        <td>{item.department}</td>
                        <td>{item.eventName}</td>
                        <td>{item.resultValue}</td>
                        <td>{item.points}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No ranking data available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Rankings;