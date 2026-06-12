import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'JobSeeker'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name zaroori hai';
    if (!formData.email.trim()) errs.email = 'Email zaroori hai';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email dalo';
    if (!formData.password) errs.password = 'Password zaroori hai';
    else if (formData.password.length < 6) errs.password = 'Min 6 characters chahiye';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords match nahi kar rahe';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/login', { state: { message: 'Registration successful! Ab login karo.' } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = () => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = strengthLevel();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][strength];

  return (
    <div className="auth-page register-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-badge">◈ TalentBridge</div>
          <h1 className="hero-headline">Start Your<br />Journey Today</h1>
          <p className="hero-sub">Join thousands of professionals finding their perfect role through our platform.</p>
          <div className="register-benefits">
            {['Free account, always', 'Apply to unlimited jobs', 'Smart job recommendations', 'Direct employer contact'].map((b, i) => (
              <div key={i} className="benefit-item">
                <span className="benefit-check">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card wide">
          <div className="auth-card-header">
            <h2>Create Account</h2>
            <p>Apna free account banao</p>
          </div>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div className="role-selector">
              {['JobSeeker', 'Employer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-btn ${formData.role === role ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role })}
                >
                  <span>{role === 'JobSeeker' ? '👤' : '🏢'}</span>
                  {role === 'JobSeeker' ? 'Job Seeker' : 'Employer'}
                </button>
              ))}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Muhammad Ali"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                {formData.password && (
                  <div className="strength-bar">
                    <div className="strength-track">
                      <div className="strength-fill" style={{ width: `${(strength / 5) * 100}%`, background: strengthColor }} />
                    </div>
                    <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Password repeat karo"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already account hai? <Link to="/login">Login karo</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
