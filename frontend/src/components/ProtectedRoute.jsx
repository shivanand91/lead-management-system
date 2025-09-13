import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for user fetch

  if (!user) return <Navigate to="/login" />; // redirect if not logged in

  return children; // allow access
}
