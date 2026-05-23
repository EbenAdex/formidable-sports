import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppData } from "../context/AppDataContext";
import "../styles/Medals.css";

function Medals() {
  const { rankings = [] } = useAppData();

  const sortedRankings = [...rankings].sort((a, b) => {
    if ((b.gold || 0) !== (a.gold || 0)) {
      return (b.gold || 0) - (a.gold || 0);
    }

    if ((b.silver || 0) !== (a.silver || 0)) {
      return (b.silver || 0) - (a.silver || 0);
    }

    return (b.bronze || 0) - (a.bronze || 0);
  });

  return (
    <>
      <Navbar />

      <main className="medals-page">
        <div className="container">
          <div className="medals-header">
            <h1>Medal Table</h1>
            <p>Current overall faculty rankings</p>
          </div>

          <div className="medals-table-wrapper">
            <table className="medals-table">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Faculty</th>
                  <th>Gold</th>
                  <th>Silver</th>
                  <th>Bronze</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {sortedRankings.length > 0 ? (
                  sortedRankings.map((team, index) => {
                    const gold = Number(team.gold || 0);
                    const silver = Number(team.silver || 0);
                    const bronze = Number(team.bronze || 0);

                    return (
                      <tr key={team.id || index}>
                        <td>{index + 1}</td>

                        <td>
                          {team.team ||
                            team.faculty ||
                            team.department ||
                            "Unknown"}
                        </td>

                        <td>{gold}</td>
                        <td>{silver}</td>
                        <td>{bronze}</td>
                        <td>{gold + silver + bronze}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-medals">
                      No medal rankings available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Medals;