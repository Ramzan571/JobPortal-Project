import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email aur password zaroori hain.');
      return;
    }
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      console.log('Backend response:', response.data);

      const { token, role, name, email } = response.data;

      if (!token || !role) {
        setError('Server se ghalat response aaya. Backend check karo.');
        return;
      }

      const user = { role, name, email };
      login(user, token);

      if (role === 'SuperAdmin') {
       navigate('/SuperAdmin');
 }   
       else if (role === 'Admin') {
  navigate('/admin');
}   
      else {
      navigate('/dashboard');
}
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="hero-badge">◈ TalentBridge</div>
          <h1 className="hero-headline">Your Dream<br />Job Awaits</h1>
          <p className="hero-sub">Connect with top employers and unlock opportunities that match your skills.</p>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">12K+</span><span className="stat-label">Jobs Posted</span></div>
            <div className="stat"><span className="stat-num">4.8K</span><span className="stat-label">Companies</span></div>
            <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Success Rate</span></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Login to your account</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password
                <Link to="/forgot-password" className="forgot-link">Forgot?</Link>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Login →'}
            </button>
          </form>

          <p className="auth-switch">
            Account nahi hai? <Link to="/register">Register karo</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;