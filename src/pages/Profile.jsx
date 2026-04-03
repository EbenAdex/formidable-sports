import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Profile</h1>
            <p className="page-intro">
              Manage your account and view your profile information.
            </p>
          </div>

          <div className="page-card">
            <div className="team-panel">
              <p>
                <strong>Name:</strong> {user?.fullName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p>
                <strong>Department:</strong> {user?.department || "N/A"}
              </p>
              <p>
                <strong>Level:</strong> {user?.level || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {user?.role || "user"}
              </p>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;