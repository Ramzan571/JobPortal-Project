import React, { useEffect, useState } from 'react';
import { jobsAPI, applicationsAPI } from '../services/api';

const Admin = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [formData, setFormData] = useState({ title: '', company: '', location: '', jobType: 'Full-time', salary: '', description: '' });
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([jobsAPI.getAll(), applicationsAPI.getAll()]);
      setJobs(jobsRes.data?.jobs || jobsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditJob(null);
    setFormData({ title: '', company: '', location: '', jobType: 'Full-time', salary: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditJob(job);
    setFormData({ title: job.title, company: job.company, location: job.location, jobType: job.jobType || 'Full-time', salary: job.salary || '', description: job.description });
    setShowModal(true);
  };

  const openDetail = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const openResume = (app) => {
    setSelectedApp(app);
    setShowResumeModal(true);
  };

  // ✅ FIXED: window.open use karo — blank page issue khatam
const getResumeUrl = (app) => {
  const url = app?.resumeUrl || app?.resume || '';
  // ✅ Agar url empty ya invalid hai toh empty return karo
  if (!url || url.length > 200) return '';
  return url.startsWith('http') ? url : `http://localhost:5182${url}`;
};

const downloadResume = (app) => {
  const url = getResumeUrl(app);
  if (!url) { showToast('Resume nahi mila ⚠'); return; }
  window.open(url, '_blank');
};

  const hasResume = (app) => !!(app?.resumeUrl || app?.resume);

  const handleSave = async () => {
    try {
      if (editJob) {
        await jobsAPI.update(editJob.id, formData);
        showToast('Job update ho gai ✓');
      } else {
        await jobsAPI.create(formData);
        showToast('Nayi job add ho gai ✓');
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast('Error: ' + (err.response?.data?.message || 'Failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Is job ko delete karna chahte ho?')) return;
    try {
      await jobsAPI.delete(id);
      showToast('Job delete ho gai');
      fetchAll();
    } catch (err) {
      showToast('Delete failed');
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const statusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'hired') return { bg: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: 'rgba(16,185,129,0.3)' };
    if (s === 'rejected') return { bg: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: 'rgba(239,68,68,0.25)' };
    return { bg: 'rgba(245,158,11,0.12)', color: '#fcd34d', border: 'rgba(245,158,11,0.25)' };
  };

  const jobApplications = selectedJob
    ? applications.filter(a => (a.jobTitle || a.job?.title) === selectedJob.title)
    : [];

  const S = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '32px 24px',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      color: '#e2e8f0',
    },
    wrap: { maxWidth: '1100px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    headerTitle: { margin: 0, fontSize: '26px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.5px' },
    headerSub: { margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' },
    btnPrimary: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', border: 'none', borderRadius: '10px',
      padding: '11px 22px', fontSize: '14px', fontWeight: '600',
      cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
    },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' },
    statCard: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '20px',
      display: 'flex', gap: '14px', alignItems: 'center',
      backdropFilter: 'blur(10px)',
    },
    statIcon: { fontSize: '32px' },
    statValue: { fontSize: '26px', fontWeight: '700', color: '#f1f5f9', lineHeight: 1 },
    statLabel: { fontSize: '12px', color: '#64748b', marginTop: '4px' },
    tabBar: {
      display: 'flex', gap: '4px', marginBottom: '24px',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '12px', padding: '4px',
      border: '1px solid rgba(255,255,255,0.08)',
      width: 'fit-content',
    },
    tabBtn: (active) => ({
      padding: '9px 22px', border: 'none', cursor: 'pointer',
      borderRadius: '9px', fontSize: '14px', fontWeight: '500',
      background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
      color: active ? 'white' : '#94a3b8',
      boxShadow: active ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
      transition: 'all 0.2s',
    }),
    tableWrap: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', overflow: 'hidden',
    },
    th: {
      padding: '13px 18px', textAlign: 'left',
      color: '#64748b', fontWeight: '600', fontSize: '12px',
      textTransform: 'uppercase', letterSpacing: '0.8px',
      background: 'rgba(255,255,255,0.03)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    td: { padding: '15px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e2e8f0', fontSize: '14px' },
    badge: (c) => ({
      background: c === 'green' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
      color: c === 'green' ? '#6ee7b7' : '#a5b4fc',
      border: `1px solid ${c === 'green' ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`,
      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
    }),
    btnView: {
      background: 'rgba(99,102,241,0.12)', color: '#a5b4fc',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: '7px', padding: '5px 12px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginRight: '6px',
    },
    btnEdit: {
      background: 'rgba(245,158,11,0.12)', color: '#fcd34d',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: '7px', padding: '5px 12px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginRight: '6px',
    },
    btnDel: {
      background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '7px', padding: '5px 12px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    },
    btnResume: {
      background: 'rgba(16,185,129,0.12)', color: '#6ee7b7',
      border: '1px solid rgba(16,185,129,0.25)',
      borderRadius: '7px', padding: '5px 12px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500', marginRight: '6px',
    },
    btnDownload: {
      background: 'rgba(6,182,212,0.12)', color: '#67e8f9',
      border: '1px solid rgba(6,182,212,0.25)',
      borderRadius: '7px', padding: '5px 12px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    },
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)', padding: '20px',
    },
    modal: {
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', padding: '32px',
      width: '100%', maxWidth: '520px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      maxHeight: '90vh', overflowY: 'auto',
    },
    detailModal: {
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', padding: '32px',
      width: '100%', maxWidth: '680px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      maxHeight: '90vh', overflowY: 'auto',
    },
    resumeModal: {
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', padding: '0',
      width: '100%', maxWidth: '800px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      height: '90vh', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    },
    label: { display: 'block', marginBottom: '7px', fontWeight: '500', color: '#94a3b8', fontSize: '13px' },
    input: {
      width: '100%', padding: '11px 14px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', fontSize: '14px',
      outline: 'none', color: '#f1f5f9', boxSizing: 'border-box',
    },
    select: {
      width: '100%', padding: '11px 14px',
      background: '#2a2a3e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', fontSize: '14px',
      outline: 'none', color: '#f1f5f9', boxSizing: 'border-box',
    },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px',
            background: 'linear-gradient(135deg,#10b981,#059669)',
            color: 'white', padding: '14px 22px',
            borderRadius: '12px', fontWeight: '600', fontSize: '14px',
            zIndex: 9999, boxShadow: '0 8px 25px rgba(16,185,129,0.4)',
          }}>{toast}</div>
        )}

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.headerTitle}>⚙ Admin Dashboard</h1>
            <p style={S.headerSub}>Jobs aur Applications manage karo</p>
          </div>
          <button style={S.btnPrimary} onClick={openCreate}>+ New Job</button>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {[
            { label: 'Total Jobs', value: jobs.length, icon: '💼' },
            { label: 'Applications', value: applications.length, icon: '📄' },
            { label: 'Active Jobs', value: jobs.filter(j => j.isActive !== false).length, icon: '✅' },
            { label: 'Hired', value: applications.filter(a => a.status === 'Hired').length, icon: '🎉' },
          ].map((s, i) => (
            <div key={i} style={S.statCard}>
              <span style={S.statIcon}>{s.icon}</span>
              <div>
                <div style={S.statValue}>{loading ? '—' : s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={S.tabBar}>
          <button style={S.tabBtn(activeTab === 'jobs')} onClick={() => setActiveTab('jobs')}>
            💼 Jobs ({jobs.length})
          </button>
          <button style={S.tabBtn(activeTab === 'apps')} onClick={() => setActiveTab('apps')}>
            📄 Applications ({applications.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading...</div>
        ) : activeTab === 'jobs' ? (

          jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
              <h3 style={{ color: '#94a3b8' }}>Koi job nahi hai</h3>
              <p>Upar wale "+ New Job" button se job add karo</p>
            </div>
          ) : (
            <div style={S.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Job Title</th>
                    <th style={S.th}>Company</th>
                    <th style={S.th}>Location</th>
                    <th style={S.th}>Type</th>
                    <th style={S.th}>Applications</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const appCount = applications.filter(a =>
                      (a.jobTitle || a.job?.title) === job.title
                    ).length;
                    return (
                      <tr key={job.id}>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: '700', fontSize: '14px',
                            }}>
                              {job.company?.charAt(0) || 'J'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{job.title}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{job.salary || 'Salary not specified'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...S.td, color: '#94a3b8' }}>{job.company}</td>
                        <td style={{ ...S.td, color: '#94a3b8' }}>📍 {job.location}</td>
                        <td style={S.td}><span style={S.badge('purple')}>{job.jobType || 'Full-time'}</span></td>
                        <td style={S.td}>
                          <span style={{
                            background: appCount > 0 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                            color: appCount > 0 ? '#6ee7b7' : '#64748b',
                            border: `1px solid ${appCount > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                          }}>
                            {appCount} applied
                          </span>
                        </td>
                        <td style={S.td}>
                          <button style={S.btnView} onClick={() => openDetail(job)}>👁 View</button>
                          <button style={S.btnEdit} onClick={() => openEdit(job)}>✏ Edit</button>
                          <button style={S.btnDel} onClick={() => handleDelete(job.id)}>🗑</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )

        ) : (

          applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📄</div>
              <h3 style={{ color: '#94a3b8' }}>Koi application nahi hai</h3>
            </div>
          ) : (
            <div style={S.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Applicant</th>
                    <th style={S.th}>Job</th>
                    <th style={S.th}>Company</th>
                    <th style={S.th}>Resume</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => {
                    const sc = statusColor(app.status);
                    return (
                      <tr key={i}>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: '700', fontSize: '13px',
                            }}>
                              {(app.userName || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{app.userName || '—'}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{app.userEmail || ''}</div>
                              {app.phoneNumber && (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>📞 {app.phoneNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...S.td, fontWeight: '500' }}>{app.jobTitle || app.job?.title}</td>
                        <td style={{ ...S.td, color: '#94a3b8' }}>{app.company || app.job?.company}</td>

                        {/* Resume Column */}
                        <td style={S.td}>
                          {hasResume(app) ? (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button style={S.btnResume} onClick={() => openResume(app)}>
                                👁 View
                              </button>
                              <button style={S.btnDownload} onClick={() => downloadResume(app)}>
                                ⬇ Save
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: '#475569', fontSize: '12px' }}>—</span>
                          )}
                        </td>

                        <td style={S.td}>
                          <span style={{
                            background: sc.bg, color: sc.color,
                            border: `1px solid ${sc.border}`,
                            padding: '4px 10px', borderRadius: '20px',
                            fontSize: '12px', fontWeight: '600',
                          }}>
                            {app.status}
                          </span>
                        </td>
                        <td style={{ ...S.td, color: '#64748b' }}>
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Job Detail Modal */}
        {showDetailModal && selectedJob && (
          <div style={S.overlay} onClick={() => setShowDetailModal(false)}>
            <div style={S.detailModal} onClick={e => e.stopPropagation()}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '800', fontSize: '20px', flexShrink: 0,
                  }}>
                    {selectedJob.company?.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>{selectedJob.title}</h3>
                    <p style={{ margin: '3px 0 0', color: '#94a3b8', fontSize: '14px' }}>{selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                  borderRadius: '8px', width: '34px', height: '34px',
                  cursor: 'pointer', color: '#94a3b8', fontSize: '16px',
                }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {selectedJob.location && (
                  <span style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>
                    📍 {selectedJob.location}
                  </span>
                )}
                {selectedJob.jobType && (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>
                    {selectedJob.jobType}
                  </span>
                )}
                {selectedJob.salary && (
                  <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>
                    💰 {selectedJob.salary}
                  </span>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Job Description</div>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: '1.7', fontSize: '14px' }}>{selectedJob.description}</p>
              </div>

              <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Applications ({jobApplications.length})
              </div>

              {jobApplications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  Is job pe abhi koi application nahi aayi
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {jobApplications.map((app, i) => {
                    const sc = statusColor(app.status);
                    return (
                      <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '12px', padding: '14px 16px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: hasResume(app) ? '10px' : '0' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{
                              width: '38px', height: '38px', borderRadius: '50%',
                              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                            }}>
                              {(app.userName || '?').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '14px' }}>{app.userName}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{app.userEmail}</div>
                              {app.phoneNumber && (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>📞 {app.phoneNumber}</div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#64748b', fontSize: '12px' }}>
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : '—'}
                            </span>
                            <span style={{
                              background: sc.bg, color: sc.color,
                              border: `1px solid ${sc.border}`,
                              padding: '4px 10px', borderRadius: '20px',
                              fontSize: '12px', fontWeight: '600',
                            }}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {hasResume(app) && (
                          <div style={{
                            display: 'flex', gap: '8px',
                            paddingTop: '10px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                          }}>
                            <button style={{ ...S.btnResume, fontSize: '12px', padding: '5px 14px' }} onClick={() => openResume(app)}>
                              📄 Resume Dekho
                            </button>
                            <button style={{ ...S.btnDownload, fontSize: '12px', padding: '5px 14px' }} onClick={() => downloadResume(app)}>
                              ⬇ Download
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => { setShowDetailModal(false); openEdit(selectedJob); }}
                style={{ ...S.btnPrimary, width: '100%', marginTop: '24px', padding: '12px' }}
              >
                ✏ Edit This Job
              </button>
            </div>
          </div>
        )}

        {/* Create / Edit Job Modal */}
        {showModal && (
          <div style={S.overlay} onClick={() => setShowModal(false)}>
            <div style={S.modal} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>
                  {editJob ? '✏ Job Edit Karo' : '+ Nayi Job Add Karo'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                  borderRadius: '8px', width: '32px', height: '32px',
                  cursor: 'pointer', color: '#94a3b8', fontSize: '16px',
                }}>✕</button>
              </div>

              {[
                { key: 'title', label: 'Job Title', placeholder: 'e.g. React Developer' },
                { key: 'company', label: 'Company', placeholder: 'e.g. Tech Corp' },
                { key: 'location', label: 'Location', placeholder: 'e.g. Lahore, Pakistan' },
                { key: 'salary', label: 'Salary (Optional)', placeholder: 'e.g. 80k-120k PKR' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <label style={S.label}>{label}</label>
                  <input
                    type="text" placeholder={placeholder} value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={S.input}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '16px' }}>
                <label style={S.label}>Job Type</label>
                <select style={S.select} value={formData.jobType} onChange={e => setFormData({ ...formData, jobType: e.target.value })}>
                  {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={S.label}>Description</label>
                <textarea
                  rows={4} placeholder="Job requirements, responsibilities..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...S.input, resize: 'vertical', lineHeight: '1.6' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '11px', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', background: 'transparent',
                  cursor: 'pointer', fontSize: '14px', color: '#94a3b8',
                }}>Cancel</button>
                <button onClick={handleSave} style={{
                  flex: 2, padding: '11px', border: 'none', borderRadius: '10px',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                }}>
                  {editJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Preview Modal */}
        {showResumeModal && selectedApp && (
          <div style={S.overlay} onClick={() => setShowResumeModal(false)}>
            <div style={S.resumeModal} onClick={e => e.stopPropagation()}>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                flexShrink: 0,
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '15px',
                  }}>
                    {(selectedApp.userName || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '15px' }}>
                      {selectedApp.userName} ka Resume
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {selectedApp.jobTitle || selectedApp.job?.title}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* ✅ FIXED: window.open use karo download ke liye */}
                  <button
                    onClick={() => downloadResume(selectedApp)}
                    style={{ ...S.btnDownload, padding: '8px 16px', fontSize: '13px' }}
                  >
                    ⬇ Download
                  </button>
                  <button
                    onClick={() => window.open(getResumeUrl(selectedApp), '_blank')}
                    style={{ ...S.btnResume, padding: '8px 16px', fontSize: '13px' }}
                  >
                    ↗ New Tab
                  </button>
                  <button onClick={() => setShowResumeModal(false)} style={{
                    background: 'rgba(255,255,255,0.08)', border: 'none',
                    borderRadius: '8px', width: '34px', height: '34px',
                    cursor: 'pointer', color: '#94a3b8', fontSize: '16px',
                  }}>✕</button>
                </div>
              </div>

              {/* PDF iframe */}
              <div style={{ flex: 1, overflow: 'hidden', background: '#111' }}>
                <iframe
                  src={getResumeUrl(selectedApp)}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Resume Preview"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
