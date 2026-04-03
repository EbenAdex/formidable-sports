import { useAuth } from "../../context/AuthContext";

function AdminHeader() {
  const { user } = useAuth();

  return (
    <div className="admin-header">
      <div>
        <h1 className="admin-header__title">Formidable Sports Admin</h1>
        <p className="admin-header__text">
          Manage fixtures, results, sports updates, and users.
        </p>
      </div>

      <div className="admin-header__user">
        <span>Welcome</span>
        <strong>{user?.fullName || "Admin"}</strong>
      </div>
    </div>
  );
}

export default AdminHeader;