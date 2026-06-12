import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getAll();
      setJobs(res.data?.jobs || res.data || []);
    } catch (err) {
      console.error('Jobs load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setApplyingId(jobId);
    try {
      await applicationsAPI.apply(jobId);
      setAppliedIds([...appliedIds, jobId]);
      showToast('Application submit ho gai! ✓');
    } catch (err) {
      showToast(err.response?.data?.message || 'Apply failed. Try again.');
    } finally {
      setApplyingId(null);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredJobs = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) &&
    j.location?.toLowerCase().includes(location.toLowerCase())
  );

  const typeColor = { Remote: '#6366f1', 'Full-time': '#10b981', 'Part-time': '#f59e0b', Contract: '#3b82f6' };

  return (
    <div className="jobs-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="jobs-header">
        <h1>Find Your Next Role</h1>
        <p>Browse {jobs.length}+ opportunities from top companies</p>
        <div className="search-bar">
          <div className="search-input-wrap">
            <span>🔍</span>
            <input placeholder="Job title, skills..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="search-input-wrap">
            <span>📍</span>
            <input placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={fetchJobs}>Search</button>
        </div>
      </div>

      <div className="jobs-content">
        <div className="jobs-results-info">{filteredJobs.length} jobs found</div>
        {loading ? (
          <div className="jobs-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="job-card skeleton-card" />)}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state large">
            <span>🔍</span>
            <h3>Koi job nahi mili</h3>
            <p>Search terms change karo ya baad mein try karo</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  <div className="job-company-logo">{job.company?.charAt(0) || 'C'}</div>
                  <div className="job-meta">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-company">{job.company}</div>
                  </div>
                </div>
                <div className="job-tags">
                  <span className="job-tag location">📍 {job.location}</span>
                  {job.jobType && (
                    <span className="job-tag type" style={{ color: typeColor[job.jobType] || '#6366f1' }}>
                      {job.jobType}
                    </span>
                  )}
                  {job.salary && <span className="job-tag salary">💰 {job.salary}</span>}
                </div>
                <p className="job-desc">{job.description?.substring(0, 100)}...</p>
                <div className="job-card-actions">
                  <Link to={`/jobs/${job.id}`} className="btn-ghost-sm">Details</Link>
                  <button
                    className={`btn-apply ${appliedIds.includes(job.id) ? 'applied' : ''}`}
                    onClick={() => handleApply(job.id)}
                    disabled={applyingId === job.id || appliedIds.includes(job.id)}
                  >
                    {appliedIds.includes(job.id) ? '✓ Applied' : applyingId === job.id ? '...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
