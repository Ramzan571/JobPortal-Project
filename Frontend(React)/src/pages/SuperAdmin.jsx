import React, { useEffect, useState } from 'react';
import { adminManagementAPI, jobsAPI } from '../services/api';

const SuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('admins');
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [adminsRes, jobsRes] = await Promise.all([
        adminManagementAPI.getAll(),
        jobsAPI.getAll()
      ]);
      setAdmins(adminsRes.data || []);
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditAdmin(null);
    setFormData({ name: '', email: '', password: '' });
    setShowModal(true);
  };

  const openEdit = (admin) => {
    setEditAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, password: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) { showToast('Name aur email zaroori hain'); return; }
    if (!editAdmin && !formData.password) { showToast('Password zaroori hai'); return; }
    try {
      if (editAdmin) {
        await adminManagementAPI.update(editAdmin.id, formData);
        showToast('Admin update ho gaya ✓');
      } else {
        await adminManagementAPI.create(formData);
        showToast('Naya admin create ho gaya ✓');
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast('Error: ' + (err.response?.data || 'Failed'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Is admin ko delete karna chahte ho?')) return;
    try {
      await adminManagementAPI.delete(id);
      showToast('Admin delete ho gaya');
      fetchAll();
    } catch (err) {
      showToast('Delete failed');
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const S = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '32px 24px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: '#e2e8f0',
    },
    wrap: { maxWidth: '1100px', margin: '0 auto' },
    header: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '32px',
    },
    headerTitle: { margin: 0, fontSize: '26px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.5px' },
    headerSub: { margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' },
    btnPrimary: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', border: 'none', borderRadius: '10px',
      padding: '11px 22px', fontSize: '14px', fontWeight: '600',
      cursor: 'pointer', letterSpacing: '0.3px',
      boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
      transition: 'all 0.2s',
    },
    statsGrid: {
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: '16px', marginBottom: '28px',
    },
    statCard: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '22px',
      display: 'flex', gap: '18px', alignItems: 'center',
      backdropFilter: 'blur(10px)',
    },
    statIcon: { fontSize: '36px' },
    statValue: { fontSize: '30px', fontWeight: '700', color: '#f1f5f9', lineHeight: 1 },
    statLabel: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },
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
      transition: 'all 0.2s',
      background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
      color: active ? 'white' : '#94a3b8',
      boxShadow: active ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
    }),
    tableWrap: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', overflow: 'hidden',
      backdropFilter: 'blur(10px)',
    },
    th: {
      padding: '14px 20px', textAlign: 'left',
      color: '#64748b', fontWeight: '600', fontSize: '12px',
      textTransform: 'uppercase', letterSpacing: '0.8px',
      background: 'rgba(255,255,255,0.03)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    td: {
      padding: '16px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      color: '#e2e8f0', fontSize: '14px',
    },
    badge: (color) => ({
      background: color === 'purple' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
      color: color === 'purple' ? '#a5b4fc' : '#6ee7b7',
      padding: '4px 12px', borderRadius: '20px',
      fontSize: '12px', fontWeight: '600',
      border: `1px solid ${color === 'purple' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`,
    }),
    btnEdit: {
      background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: '8px', padding: '6px 14px',
      cursor: 'pointer', fontWeight: '500',
      fontSize: '13px', marginRight: '8px',
    },
    btnDelete: {
      background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '8px', padding: '6px 14px',
      cursor: 'pointer', fontWeight: '500', fontSize: '13px',
    },
    empty: {
      textAlign: 'center', padding: '70px 20px', color: '#64748b',
    },
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
    },
    modal: {
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', padding: '32px',
      width: '440px', maxWidth: '90vw',
      boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#f1f5f9' },
    label: {
      display: 'block', marginBottom: '7px',
      fontWeight: '500', color: '#94a3b8', fontSize: '13px',
    },
    input: {
      width: '100%', padding: '11px 14px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', fontSize: '14px',
      outline: 'none', color: '#f1f5f9',
      boxSizing: 'border-box',
    },
    btnCancel: {
      flex: 1, padding: '11px',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', background: 'transparent',
      cursor: 'pointer', fontSize: '14px', color: '#94a3b8',
    },
    btnSave: {
      flex: 1, padding: '11px', border: 'none',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', cursor: 'pointer',
      fontSize: '14px', fontWeight: '600',
      boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
    },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Toast */}
        {toast && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white', padding: '14px 22px',
            borderRadius: '12px', fontWeight: '600',
            fontSize: '14px', zIndex: 9999,
            boxShadow: '0 8px 25px rgba(16,185,129,0.4)',
          }}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.headerTitle}>⚙ SuperAdmin Dashboard</h1>
            <p style={S.headerSub}>Admins aur Jobs manage karo</p>
          </div>
          <button style={S.btnPrimary} onClick={openCreate}>+ New Admin</button>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          <div style={S.statCard}>
            <span style={S.statIcon}>👨‍💼</span>
            <div>
              <div style={S.statValue}>{loading ? '—' : admins.length}</div>
              <div style={S.statLabel}>Total Admins</div>
            </div>
          </div>
          <div style={S.statCard}>
            <span style={S.statIcon}>💼</span>
            <div>
              <div style={S.statValue}>{loading ? '—' : jobs.length}</div>
              <div style={S.statLabel}>Total Jobs</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={S.tabBar}>
          <button style={S.tabBtn(activeTab === 'admins')} onClick={() => setActiveTab('admins')}>
            👨‍💼 Admins ({admins.length})
          </button>
          <button style={S.tabBtn(activeTab === 'jobs')} onClick={() => setActiveTab('jobs')}>
            💼 Jobs ({jobs.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '15px' }}>
            Loading...
          </div>
        ) : activeTab === 'admins' ? (

          admins.length === 0 ? (
            <div style={S.empty}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>👨‍💼</div>
              <h3 style={{ color: '#94a3b8', margin: '0 0 8px' }}>Koi admin nahi hai abhi</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Upar wale "+ New Admin" button se admin banao</p>
            </div>
          ) : (
            <div style={S.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Name</th>
                    <th style={S.th}>Email</th>
                    <th style={S.th}>Role</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px', height: '38px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: '700', fontSize: '15px',
                          }}>
                            {admin.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{admin.name}</span>
                        </div>
                      </td>
                      <td style={{ ...S.td, color: '#94a3b8' }}>{admin.email}</td>
                      <td style={S.td}><span style={S.badge('purple')}>Admin</span></td>
                      <td style={S.td}>
                        <button style={S.btnEdit} onClick={() => openEdit(admin)}>✏ Edit</button>
                        <button style={S.btnDelete} onClick={() => handleDelete(admin.id)}>🗑 Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )

        ) : (

          jobs.length === 0 ? (
            <div style={S.empty}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>💼</div>
              <h3 style={{ color: '#94a3b8', margin: '0 0 8px' }}>Koi job post nahi hui abhi</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Admin se job post karwao</p>
            </div>
          ) : (
            <div style={S.tableWrap}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={S.th}>Title</th>
                    <th style={S.th}>Company</th>
                    <th style={S.th}>Location</th>
                    <th style={S.th}>Type</th>
                    <th style={S.th}>Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td style={{ ...S.td, fontWeight: '600', color: '#f1f5f9' }}>{job.title}</td>
                      <td style={{ ...S.td, color: '#94a3b8' }}>{job.company || '—'}</td>
                      <td style={{ ...S.td, color: '#94a3b8' }}>📍 {job.location}</td>
                      <td style={S.td}><span style={S.badge('green')}>{job.jobType || 'Full-time'}</span></td>
                      <td style={{ ...S.td, color: '#94a3b8' }}>💰 {job.salary || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Modal */}
        {showModal && (
          <div style={S.overlay} onClick={() => setShowModal(false)}>
            <div style={S.modal} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h3 style={S.modalTitle}>
                  {editAdmin ? '✏ Admin Edit Karo' : '+ Naya Admin Banao'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none',
                  borderRadius: '8px', width: '32px', height: '32px',
                  cursor: 'pointer', color: '#94a3b8', fontSize: '16px',
                }}>✕</button>
              </div>

              {[
                { key: 'name', label: 'Full Name', placeholder: 'e.g. Ahmed Ali', type: 'text' },
                { key: 'email', label: 'Email Address', placeholder: 'admin@example.com', type: 'email' },
                { key: 'password', label: editAdmin ? 'New Password (optional)' : 'Password', placeholder: 'Min 6 characters', type: 'password' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key} style={{ marginBottom: '18px' }}>
                  <label style={S.label}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    style={S.input}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button style={S.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={S.btnSave} onClick={handleSave}>
                  {editAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SuperAdmin;