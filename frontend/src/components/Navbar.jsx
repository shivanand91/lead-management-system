import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";

export default function Navbar() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true }); // important
      setUser(null); // update frontend state
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="font-bold text-lg">Lead Management</h1>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" className="px-3">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3">Login</Link>
            <Link to="/register" className="px-3">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
