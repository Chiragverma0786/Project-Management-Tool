// Signup.jsx
import { useState, useContext, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { data } = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate("/projects", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-mark">Acme</div>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Get started in a few seconds.</p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />

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
            placeholder="Create a password"
          />

          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
          />

          <Button text="Sign up" loading={loading} type="submit" />
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;