import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useAuth } from "../../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: localStorage.getItem("formidableAdminRememberedEmail") || "",
    password: "",
    rememberMe: !!localStorage.getItem("formidableAdminRememberedEmail"),
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!result?.isAdminOverride && formData.email !== "admin@formidablesports.com") {
        setErrorMessage("These details are not authorized for admin access.");
        return;
      }

      if (formData.rememberMe) {
        localStorage.setItem("formidableAdminRememberedEmail", formData.email);
      } else {
        localStorage.removeItem("formidableAdminRememberedEmail");
      }

      navigate("/admin");
    } catch (error) {
      setErrorMessage(error.message || "Admin login failed.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container auth-page">
          <div className="auth-card">
            <h1>Admin Login</h1>
            <p>Enter admin credentials to access the dashboard.</p>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Admin Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <button type="submit" className="btn btn--primary">
                Login as Admin
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminLogin;