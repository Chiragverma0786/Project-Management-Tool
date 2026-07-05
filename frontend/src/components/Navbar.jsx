import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">Project Management</h1>
        <div className="navbar-menu">
          {user && <span className="navbar-user">{user.name || user.email}</span>}
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
