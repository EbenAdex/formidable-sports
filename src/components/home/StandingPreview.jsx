import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";

function StandingsPreview() {
  const { getSortedTable } = useAppData();
  const table = getSortedTable().slice(0, 5);

  return (
    <section className="section section--light">
      <div className="container">
        <div className="section__top">
          <h2>Top Standings</h2>
          <Link to="/table" className="section__link">
            Full table
          </Link>
        </div>

        <div className="table-wrapper">
          <table className="public-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>P</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((team, index) => (
                <tr key={team.id}>
                  <td>{index + 1}</td>
                  <td>{team.team}</td>
                  <td>{team.played}</td>
                  <td>{team.goalDifference}</td>
                  <td>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default StandingsPreview;