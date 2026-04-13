import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    level: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || "",
      department: user?.department || "",
      level: user?.level || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: user?.fullName || "",
      department: user?.department || "",
      level: user?.level || "",
    });
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      await updateProfile({
        fullName: formData.fullName.trim(),
        department: formData.department.trim(),
        level: formData.level.trim(),
      });

      setSuccessMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(error?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />
      <div className="navbar-spacer" />
      <main className="page-shell">
        <div className="container">
          <div className="page-header-block">
            <h1>Profile</h1>
            <p className="page-intro">
              Manage your account and update your personal information.
            </p>
          </div>

          <div className="page-card profile-card">
            <div className="profile-card__top">
              <div>
                <h2 className="profile-card__title">
                  {user?.fullName || "User Profile"}
                </h2>
                <p className="profile-card__subtitle">
                  {user?.email || "No email available"}
                </p>
              </div>

              <div className="profile-role-badge">
                {user?.role || "user"}
              </div>
            </div>

            {successMessage ? (
              <div className="profile-message profile-message--success">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="profile-message profile-message--error">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSave}>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{user?.fullName || "N/A"}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Email</label>
                  <p>{user?.email || "N/A"}</p>
                </div>

                <div className="profile-field">
                  <label>Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{user?.department || "N/A"}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Level</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{user?.level || "N/A"}</p>
                  )}
                </div>

                <div className="profile-field">
                  <label>Role</label>
                  <p>{user?.role || "user"}</p>
                </div>
              </div>

              <div className="profile-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="btn btn--primary"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;