import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Lead Management System 🚀</h1>
      <p className="mb-6">Manage your leads efficiently with filters, pagination, and more.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</Link>
      </div>
    </div>
  );
}
