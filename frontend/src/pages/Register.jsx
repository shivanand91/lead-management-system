import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange}
          className="border w-full p-2 mb-3 rounded" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="border w-full p-2 mb-3 rounded" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="border w-full p-2 mb-3 rounded" required />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
}
