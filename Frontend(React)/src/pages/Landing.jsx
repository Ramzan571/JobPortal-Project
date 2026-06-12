import { useEffect, useState } from "react";
import axios from "axios";

export default function Landing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:7088/api/jobs/public")
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>
        <div className="flex gap-3">
          <a href="/login"
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Login
          </a>
          <a href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Register
          </a>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <div className="bg-blue-600 text-white py-16 px-8 text-center">
        <h2 className="text-4xl font-bold mb-3">Find Your Dream Job</h2>
        <p className="text-blue-100 mb-8">Hundreds of jobs available — apply before deadline!</p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl text-gray-800 text-lg focus:outline-none shadow-lg"
          />
        </div>
      </div>

      {/* ===== JOBS SECTION ===== */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          All Posted Jobs
          <span className="ml-2 text-sm text-gray-400">({filteredJobs.length} jobs)</span>
        </h3>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">No jobs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-6 text-gray-400 text-sm border-t">
        © 2025 JobPortal. All rights reserved.
      </footer>
    </div>
  );
}