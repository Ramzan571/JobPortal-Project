import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-eyebrow">Pakistan's #1 Job Portal</div>
          <h1 className="hero-title">
            Find Jobs That<br />
            <span className="gradient-text">Match Your Skills</span>
          </h1>
          <p className="hero-description">
            Connect with thousands of employers across Pakistan. 
            Your next opportunity is just one click away.p
          </p>
          <div className="hero-cta">
            <Link to="/jobs" className="btn-primary large">Browse Jobs</Link>
            {!isAuthenticated && <Link to="/register" className="btn-outline large">Create Account</Link>}
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            {[
              { title: 'React Developer', company: 'TechHub Lahore', salary: '120k PKR' },
              { title: 'UI/UX Designer', company: 'Creative Co.', salary: '90k PKR' },
              { title: '.NET Engineer', company: 'SoftHouse PK', salary: '150k PKR' },
            ].map((card, i) => (
              <div key={i} className="float-card" style={{ animationDelay: `${i * 0.3}s` }}>
                <div className="float-card-icon">{['⚛', '🎨', '⚙'][i]}</div>
                <div>
                  <div className="float-card-title">{card.title}</div>
                  <div className="float-card-sub">{card.company}</div>
                </div>
                <div className="float-card-salary">{card.salary}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why TalentBridge?</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Fast Apply', desc: 'One-click apply karain — CV already save hoga' },
            { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered recommendations tumhare skills se match' },
            { icon: '🔒', title: 'Verified Companies', desc: 'Sirf trusted aur verified employers' },
            { icon: '📊', title: 'Track Applications', desc: 'Real-time status updates har application ka' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
