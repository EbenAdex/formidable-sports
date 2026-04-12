import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: localStorage.getItem("formidableRememberedEmail") || "",
    password: "",
    rememberMe: !!localStorage.getItem("formidableRememberedEmail"),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      await login({
        email: formData.email,
        password: formData.password,
      });

      if (formData.rememberMe) {
        localStorage.setItem("formidableRememberedEmail", formData.email);
      } else {
        localStorage.removeItem("formidableRememberedEmail");
      }

      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Login failed.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container auth-page">
          <div className="auth-card">
            <h1>Login</h1>
            <p>Sign in to access your account and sports preferences.</p>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

           <div className="password-field">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />

<button
  type="button"
  className="password-toggle"
  onClick={() => setShowPassword((prev) => !prev)}
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>

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
                Login
              </button>
            </form>

            <p className="auth-switch">
              Need an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;