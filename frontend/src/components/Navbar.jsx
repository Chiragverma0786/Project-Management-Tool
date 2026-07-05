// Navbar.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const GRADIENTS = [
  ["#7c5cff", "#22d3ee"],
  ["#f472b6", "#fb923c"],
  ["#34d399", "#3b82f6"],
];

const gradientFor = (str = "") => {
  const sum = str.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
};

const initialsFor = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const displayName = user?.name || user?.email || "";
  const [c1, c2] = gradientFor(displayName);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {/* <span className="navbar-brand__mark" aria-hidden="true" /> */}
          <h1 className="navbar-brand__text">Project Management</h1>
        </div>

        <div className="navbar-menu">
          {user && (
            <div className="navbar-user">
              <span
                className="navbar-user__avatar"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
              >
                {initialsFor(displayName)}
              </span>
              <span className="navbar-user__name">{displayName}</span>
            </div>
          )}
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;