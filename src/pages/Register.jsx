import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { createUserProfile } from "../services/profileService";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    department: "",
    level: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const allowedLevels = ["100", "200", "300", "400", "500"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "level") {
      const numericValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!allowedLevels.includes(formData.level)) {
      return "Level must be one of these only: 100, 200, 300, 400, or 500.";
    }

    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!passwordRegex.test(formData.password)) {
      return "Password must contain letters, numbers, and at least one special character.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");

    try {
      await register({
        email: formData.email,
        password: formData.password,
      });

      await createUserProfile({
        fullName: formData.fullName,
        email: formData.email,
        department: formData.department,
        level: formData.level,
        role: "user",
      });

      alert("Registration successful.");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container auth-page">
          <div className="auth-card">
            <h1>Register</h1>
            <p>Create an account to follow sports activities and updates.</p>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="level"
                placeholder="Level (100, 200, 300, 400, 500)"
                value={formData.level}
                onChange={handleChange}
                maxLength={3}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit" className="btn btn--primary">
                Register
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Register;