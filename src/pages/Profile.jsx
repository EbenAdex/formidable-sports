import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Profile</h1>
            <p className="page-intro">Manage your account and view your profile information.</p>
          </div>

          <div className="page-card">
            {user ? (
              <>
                <p>
                  <strong>Name:</strong> {user.fullName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.department && (
                  <p>
                    <strong>Department:</strong> {user.department}
                  </p>
                )}
                {user.level && user.level !== "000" && (
                  <p>
                    <strong>Level:</strong> {user.level}
                  </p>
                )}

                <button className="btn btn--primary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <p>No user data available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;