import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, Sparkles, User, Store, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const redirectAfterLogin = (role) => {
    if (location.state?.from) {
      navigate(location.state.from.pathname);
      return;
    }
    if (role === 'pharmacist') {
      navigate('/pharmacy/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(email, password);
      redirectAfterLogin(user.role);
    } catch (err) {
      // toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (role) => {
    try {
      setDemoLoading(true);
      const user = await quickDemoLogin(role);
      redirectAfterLogin(user.role);
    } catch (err) {
      // toast shown in context
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="modal-card" style={{ maxWidth: '480px', width: '100%', boxShadow: 'var(--shadow-xl)' }}>
        {/* Header */}
        <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)', padding: '1.75rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div className="brand-icon-wrap" style={{ width: '32px', height: '32px' }}>
              <Activity size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>
              Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            Log in to manage requests, reservations, or pharmacy inventory.
          </p>
        </div>

        {/* Demo Fast-Switch Buttons */}
        <div style={{ padding: '1.25rem 2rem 0.5rem', backgroundColor: '#faf5ff', borderBottom: '1px solid #f3e8ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            <Sparkles size={13} /> 1-Click Fast Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleDemoClick('customer')}
              disabled={demoLoading}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.85rem', padding: '0.5rem', flexDirection: 'column', gap: '3px' }}
            >
              <User size={16} color="var(--primary-600)" />
              <span style={{ fontWeight: 600 }}>Login as Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('pharmacist')}
              disabled={demoLoading}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.85rem', padding: '0.5rem', flexDirection: 'column', gap: '3px' }}
            >
              <Store size={16} color="var(--accent-teal)" />
              <span style={{ fontWeight: 600 }}>Login as Pharmacist</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting || demoLoading} style={{ marginTop: '1.5rem' }}>
            {submitting ? 'Logging In...' : 'Log In'} <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
