import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, BarChart2 } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <nav className="navbar">
      <Link to={user ? "/dashboard" : "/"} className="navbar-brand">⚡ LinkSnap</Link>
      <div className="navbar-actions">
        {user ? (
          <>
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>{user.email}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={15}/> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
