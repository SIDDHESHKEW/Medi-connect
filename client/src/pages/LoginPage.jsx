import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Store, User, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

const PHARMACY_DEMO_ACCOUNTS = [
  { name: 'ABC Medical Store', email: 'abc@mediconnect.com' },
  { name: 'HealthPlus Pharmacy', email: 'healthplus@mediconnect.com' },
  { name: 'City Care Pharmacy', email: 'citycare@mediconnect.com' },
  { name: 'MediCare Pharmacy', email: 'medicare@mediconnect.com' },
  { name: 'Apollo Local Care', email: 'apollo@mediconnect.com' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedPharmIndex, setSelectedPharmIndex] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'pharmacist') {
        navigate('/pharmacy/dashboard');
      } else {
        navigate(redirectPath === '/login' ? '/search' : redirectPath);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomerFastLogin = async () => {
    setSubmitting(true);
    try {
      await login('customer@mediconnect.com', 'password123');
      navigate('/search');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePharmacistFastLogin = async () => {
    setSubmitting(true);
    try {
      const pharm = PHARMACY_DEMO_ACCOUNTS[selectedPharmIndex];
      await login(pharm.email, 'password123');
      navigate('/pharmacy/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.75rem 1rem', textAlign: 'center', borderBottom: '1px solid var(--slate-100)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div className="brand-icon-wrap" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
              <Activity size={18} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>
              Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--slate-900)' }}>Log In</h2>
        </div>

        {/* 1-Click Fast Switchers - Both Buttons Styled Identically */}
        <div style={{ padding: '1.25rem 1.75rem', backgroundColor: '#f0f9ff', borderBottom: '1px solid #e0f2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> 1-Click Demo Logins
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* 1. Customer Demo Button */}
            <button
              type="button"
              onClick={handleCustomerFastLogin}
              disabled={submitting}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--primary-200)',
                padding: '0.65rem 0.95rem',
                width: '100%',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="var(--primary-600)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)' }}>Login as Customer</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>Rahul Verma</span>
            </button>

            {/* 2. Pharmacist Demo Button (Identical Style) */}
            <button
              type="button"
              onClick={handlePharmacistFastLogin}
              disabled={submitting}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--primary-200)',
                padding: '0.65rem 0.95rem',
                width: '100%',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={16} color="var(--primary-600)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--slate-800)' }}>Login as Pharmacist</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                {PHARMACY_DEMO_ACCOUNTS[selectedPharmIndex].name}
              </span>
            </button>

            {/* Subtle Pharmacy Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>Switch Store:</span>
              <select
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  border: '1px solid var(--primary-200)',
                  backgroundColor: 'transparent',
                  color: 'var(--primary-800)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                value={selectedPharmIndex}
                onChange={(e) => setSelectedPharmIndex(Number(e.target.value))}
              >
                {PHARMACY_DEMO_ACCOUNTS.map((p, idx) => (
                  <option key={p.email} value={idx}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.75rem 1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem' }}>Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.825rem' }}>Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging In...' : 'Log In with Credentials'} <ArrowRight size={15} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
            Need an account? <Link to="/register" style={{ fontWeight: 600 }}>Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
