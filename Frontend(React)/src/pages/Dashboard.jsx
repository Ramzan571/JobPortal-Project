import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobsAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          applicationsAPI.getMyApplications(),
          jobsAPI.getAll({ limit: 5 }),
        ]);
        setApplications(appsRes.data || []);
        setRecentJobs(jobsRes.data?.jobs || jobsRes.data || []);
      } catch (err) {
        console.error('Dashboard data load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusColor = { Applied: '#3b82f6', Interview: '#f59e0b', Hired: '#10b981', Rejected: '#ef4444' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, <span className="highlight">{user?.name || 'User'}</span> 👋</h1>
          <p className="dash-sub">Here's your job search activity</p>
        </div>
        <Link to="/jobs" className="btn-primary">Browse Jobs →</Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          { label: 'Applications', value: applications.length, icon: '📄', color: '#6366f1' },
          { label: 'In Review', value: applications.filter(a => a.status === 'Applied').length, icon: '⏳', color: '#f59e0b' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, icon: '🤝', color: '#3b82f6' },
          { label: 'Offers', value: applications.filter(a => a.status === 'Hired').length, icon: '🎉', color: '#10b981' },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ '--accent': stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{loading ? '—' : stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* My Applications */}
        <div className="dash-section">
          <h3>My Applications</h3>
          {loading ? (
            <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-row" />)}</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <span>📭</span>
              <p>Koi application nahi hai abhi.<br /><Link to="/jobs">Jobs dhundho →</Link></p>
            </div>
          ) : (
            <div className="app-list">
              {applications.slice(0, 5).map((app, i) => (
                <div key={i} className="app-item">
                  <div className="app-info">
                    <div className="app-title">{app.jobTitle || app.job?.title}</div>
                    <div className="app-company">{app.company || app.job?.company}</div>
                  </div>
                  <span className="app-status" style={{ background: statusColor[app.status] + '22', color: statusColor[app.status] }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="dash-section">
          <h3>New Opportunities</h3>
          {loading ? (
            <div className="skeleton-list">{[1,2,3].map(i => <div key={i} className="skeleton-row" />)}</div>
          ) : recentJobs.length === 0 ? (
            <div className="empty-state"><span>🔍</span><p>No jobs found.</p></div>
          ) : (
            <div className="app-list">
              {recentJobs.map((job, i) => (
                <div key={i} className="app-item">
                  <div className="app-info">
                    <div className="app-title">{job.title}</div>
                    <div className="app-company">{job.company} · {job.location}</div>
                  </div>
                  <Link to={`/jobs/${job.id}`} className="btn-ghost-sm">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
