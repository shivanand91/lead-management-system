import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: "", status: "" });

    const { user } = useAuth();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(filters.search && { email: filters.search }),
        ...(filters.status && { status: filters.status }),
      };
      const res = await api.get("/leads", { params });
      setLeads(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, filters]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  const handleUpdate = (id) => {
    // redirect to create/edit lead form page with id
    window.location.href = `/leads/edit/${id}`;
  };

  const handleCreateLead = () => {
    window.location.href = "/leads/create";
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex items-center space-x-3 mb-3 md:mb-0">
          {/* User Profile */}
          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            {user?.name?.[0].toUpperCase()}
          </div>
          <span className="font-semibold text-gray-700">{user?.name}</span>
        </div>
        <button
          onClick={handleCreateLead}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Search by email"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border px-3 py-2 rounded w-full md:w-64"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border px-3 py-2 rounded w-full md:w-40"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>
      </div>

      {/* Leads Table */}
      {loading ? (
        <p className="text-center mt-10">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No leads found
                  </td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{lead.first_name} {lead.last_name}</td>
                  <td className="border px-4 py-2">{lead.email}</td>
                  <td className="border px-4 py-2">{lead.company}</td>
                  <td className="border px-4 py-2">{lead.status}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(lead._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2 flex-wrap">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
