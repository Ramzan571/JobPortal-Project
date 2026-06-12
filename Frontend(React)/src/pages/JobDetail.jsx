import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ phoneNumber: '', resume: null });
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await jobsAPI.getById(id);
      setJob(res.data);
    } catch {
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone number zaroori hai';
    if (!formData.resume) errs.resume = 'Resume (PDF) zaroori hai';
    else if (formData.resume.type !== 'application/pdf') errs.resume = 'Sirf PDF file allowed hai';
    else if (formData.resume.size > 5 * 1024 * 1024) errs.resume = 'File size 5MB se kam honi chahiye';
    return errs;
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setFormData(prev => ({ ...prev, resume: file }));
    setErrors(prev => ({ ...prev, resume: '' }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('phoneNumber', formData.phoneNumber);
      payload.append('resume', formData.resume);
      await applicationsAPI.apply(id, payload);
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || err.response?.data || 'Apply failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const S = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '32px 24px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: '#e2e8f0',
    },
    wrap: { maxWidth: '780px', margin: '0 auto' },
    backBtn: {
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#94a3b8', borderRadius: '10px',
      padding: '9px 18px', cursor: 'pointer',
      fontSize: '14px', marginBottom: '24px',
      display: 'inline-flex', alignItems: 'center', gap: '6px',
    },
    card: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '36px',
      backdropFilter: 'blur(10px)',
    },
    logoCircle: {
      width: '64px', height: '64px', borderRadius: '16px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: '800', fontSize: '26px',
      marginBottom: '20px',
    },
    title: { margin: '0 0 6px', fontSize: '26px', fontWeight: '700', color: '#f1f5f9' },
    company: { margin: '0 0 20px', fontSize: '16px', color: '#94a3b8' },
    tagsRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' },
    tag: (color) => ({
      background: color === 'blue' ? 'rgba(99,102,241,0.15)' : color === 'green' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
      color: color === 'blue' ? '#a5b4fc' : color === 'green' ? '#6ee7b7' : '#fcd34d',
      border: `1px solid ${color === 'blue' ? 'rgba(99,102,241,0.3)' : color === 'green' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
    }),
    divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '24px 0' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '12px' },
    desc: { color: '#94a3b8', lineHeight: '1.8', fontSize: '15px' },
    applyBtn: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white', border: 'none', borderRadius: '12px',
      padding: '14px 32px', fontSize: '16px', fontWeight: '600',
      cursor: 'pointer', width: '100%', marginTop: '28px',
      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
    },
    appliedBox: {
      background: 'rgba(16,185,129,0.1)',
      border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: '12px', padding: '20px',
      textAlign: 'center', marginTop: '28px',
    },
    overlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
      padding: '20px',
    },
    modal: {
      background: '#1e1e2e',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '20px', padding: '32px',
      width: '100%', maxWidth: '520px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
      maxHeight: '90vh', overflowY: 'auto',
    },
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
    errorText: { color: '#fca5a5', fontSize: '12px', marginTop: '5px' },
    dropZone: (active, hasFile, hasError) => ({
      border: `2px dashed ${hasError ? 'rgba(239,68,68,0.5)' : hasFile ? 'rgba(16,185,129,0.5)' : active ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.15)'}`,
      borderRadius: '12px',
      padding: '28px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      background: hasFile ? 'rgba(16,185,129,0.05)' : active ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
      transition: 'all 0.2s ease',
    }),
  };

  if (loading) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#64748b', fontSize: '16px' }}>Loading...</div>
    </div>
  );

  if (!job) return null;

  const isAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        <button style={S.backBtn} onClick={() => navigate('/jobs')}>← Wapas Jobs</button>

        <div style={S.card}>
          <div style={S.logoCircle}>{job.company?.charAt(0) || 'C'}</div>
          <h1 style={S.title}>{job.title}</h1>
          <p style={S.company}>{job.company}</p>

          <div style={S.tagsRow}>
            {job.location && <span style={S.tag('blue')}>📍 {job.location}</span>}
            {job.jobType && <span style={S.tag('green')}>{job.jobType}</span>}
            {job.salary && <span style={S.tag('yellow')}>💰 {job.salary}</span>}
          </div>

          <hr style={S.divider} />

          <div style={S.sectionTitle}>Job Description</div>
          <p style={S.desc}>{job.description}</p>

          <hr style={S.divider} />

          {isAdmin ? (
            <div style={{ ...S.appliedBox, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', marginTop: '0' }}>
              <p style={{ margin: 0, color: '#a5b4fc', fontSize: '14px' }}>
                Admin account se apply nahi kar sakte
              </p>
            </div>
          ) : applied ? (
            <div style={S.appliedBox}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
              <div style={{ color: '#6ee7b7', fontWeight: '700', fontSize: '18px', marginBottom: '6px' }}>
                Application Successfully Submitted!
              </div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                Your application has been submitted successfully. Admin will review it soon.
              </div>
            </div>
          ) : (
            <button style={S.applyBtn} onClick={() => {
              if (!isAuthenticated) { navigate('/login'); return; }
              setShowForm(true);
            }}>
              Apply Now →
            </button>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showForm && (
        <div style={S.overlay} onClick={() => setShowForm(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>
                  Application Form
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                  {job.title} — {job.company}
                </p>
              </div>
              <button onClick={() => setShowForm(false)} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderRadius: '8px', width: '34px', height: '34px',
                cursor: 'pointer', color: '#94a3b8', fontSize: '16px',
              }}>✕</button>
            </div>

            {/* Job Info Banner */}
            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '12px', padding: '14px 16px',
              marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0,
              }}>
                {job.company?.charAt(0)}
              </div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px' }}>{job.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>{job.company} • {job.location}</div>
              </div>
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '18px' }}>
              <label style={S.label}>Phone Number *</label>
              <input
                type="tel"
                placeholder="e.g. 0300-1234567"
                value={formData.phoneNumber}
                onChange={e => { setFormData({ ...formData, phoneNumber: e.target.value }); setErrors({ ...errors, phoneNumber: '' }); }}
                style={{ ...S.input, borderColor: errors.phoneNumber ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)' }}
              />
              {errors.phoneNumber && <div style={S.errorText}>⚠ {errors.phoneNumber}</div>}
            </div>

            {/* Resume PDF Upload */}
            <div style={{ marginBottom: '18px' }}>
              <label style={S.label}>Resume (PDF) * <span style={{ color: '#475569', fontWeight: '400' }}>(max 5MB)</span></label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e.target.files?.[0])}
              />

              {/* Drag & Drop Zone */}
              <div
                style={S.dropZone(dragOver, !!formData.resume, !!errors.resume)}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileChange(e.dataTransfer.files?.[0]);
                }}
              >
                {formData.resume ? (
                  // File selected state
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                    <div style={{ color: '#6ee7b7', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                      {formData.resume.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>
                      {(formData.resume.size / 1024).toFixed(1)} KB
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, resume: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#fca5a5', borderRadius: '8px',
                        padding: '5px 14px', fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  // Empty state
                  <div>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>📁</div>
                    <div style={{ color: '#94a3b8', fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                      PDF yahan drop karein ya click karein
                    </div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>
                      Sirf PDF • Max 5MB
                    </div>
                  </div>
                )}
              </div>

              {errors.resume && <div style={S.errorText}>⚠ {errors.resume}</div>}
            </div>

            {/* API Error */}
            {errors.api && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '12px 14px',
                color: '#fca5a5', fontSize: '14px', marginBottom: '16px',
              }}>
                ⚠ {errors.api}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setShowForm(false)} style={{
                flex: 1, padding: '12px', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', background: 'transparent',
                cursor: 'pointer', fontSize: '14px', color: '#94a3b8',
              }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting} style={{
                flex: 2, padding: '12px', border: 'none',
                borderRadius: '10px',
                background: submitting ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: '600',
                boxShadow: submitting ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
              }}>
                {submitting ? 'Submitting...' : 'Submit Application →'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;