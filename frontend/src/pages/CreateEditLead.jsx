import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateEditLead() {
  const { id } = useParams(); // edit mode ke liye
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    last_activity_at: "",
    is_qualified: false,
  });

  const [error, setError] = useState("");

  // edit mode me data fetch
  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        try {
          const res = await api.get(`/leads/${id}`);
          const leadData = res.data;
          setForm({
            ...leadData,
            last_activity_at: leadData.last_activity_at
              ? leadData.last_activity_at.split("T")[0]
              : "",
          });
        } catch (err) {
          console.error(err.response?.data);
        }
      };
      fetchLead();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/leads/${id}`, form);
      } else {
        await api.post("/leads", form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold">{id ? "Edit Lead" : "Create Lead"}</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block mb-1 font-medium">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* City */}
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* State */}
          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block mb-1 font-medium">Source</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="website">Website</option>
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="referral">Referral</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
              <option value="won">Won</option>
            </select>
          </div>

          {/* Score */}
          <div>
            <label className="block mb-1 font-medium">Score</label>
            <input
              type="number"
              name="score"
              value={form.score}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              min="0"
              max="100"
            />
          </div>

          {/* Lead Value */}
          <div>
            <label className="block mb-1 font-medium">Lead Value</label>
            <input
              type="number"
              name="lead_value"
              value={form.lead_value}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Last Activity */}
          <div>
            <label className="block mb-1 font-medium">Last Activity Date</label>
            <input
              type="date"
              name="last_activity_at"
              value={form.last_activity_at}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          {/* Is Qualified */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <input
              type="checkbox"
              name="is_qualified"
              checked={form.is_qualified}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="font-medium">Is Qualified</label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full mt-4"
        >
          {id ? "Update Lead" : "Create Lead"}
        </button>
      </form>
    </div>
  );
}
