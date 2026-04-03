import AdminLayout from "../../components/admin/AdminLayout";
import { useAppData } from "../../context/AppDataContext";
import facultyDepartments from "../../data/facultyDepartments";

function AdminDashboard() {
  const { fixtures, results, news, sports } = useAppData();

  const totalFixtures = fixtures.length;
  const totalResults = results.length;
  const totalNews = news.length;
  const totalSports = sports.length;
  const liveMatches = fixtures.filter((fixture) => fixture.status === "Live").length;
  const qualifiedTeams = facultyDepartments.length;

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        

        <div className="admin-dashboard__stats">
          <div className="admin-stat-card">
            <span>Total Fixtures</span>
            <strong>{totalFixtures}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Total Results</span>
            <strong>{totalResults}</strong>
          </div>

          <div className="admin-stat-card">
            <span>News Posts</span>
            <strong>{totalNews}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Sports Categories</span>
            <strong>{totalSports}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Live Matches</span>
            <strong>{liveMatches}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Qualified Teams</span>
            <strong>{qualifiedTeams}</strong>
          </div>
        </div>

        <div className="admin-section-card">
          <h2>Admin Overview</h2>
          <p>
            This dashboard reflects live stored platform data, including fixtures,
            results, departments, sports categories, rankings, and active matches.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;