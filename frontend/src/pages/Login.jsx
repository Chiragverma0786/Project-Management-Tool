// Login.jsx
import { useState, useContext, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Auth.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/projects", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await loginUser(form);
      login(data.user, data.token);
      navigate("/projects", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">Acme</div>

        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Welcome back. Enter your details.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <Button text="Log in" loading={loading} type="submit" />
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;