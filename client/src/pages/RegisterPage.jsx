import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, Store, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'pharmacist' ? 'pharmacist' : 'customer';

  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [pharmacyName, setPharmacyName] = useState('');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 10:00 PM');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await register({
        name,
        email,
        phone,
        password,
        role,
        address,
        city,
        pharmacyName,
        openingHours,
      });

      if (user.role === 'pharmacist') {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Toast handles error display
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="modal-card" style={{ maxWidth: '540px', width: '100%', boxShadow: 'var(--shadow-xl)' }}>
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
          <h2 style={{ fontSize: '1.4rem' }}>Create Your Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
            Join MediConnect to access or manage neighbourhood medicine availability.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem 2rem' }}>
          {/* Account Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`btn ${role === 'customer' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.75rem', flexDirection: 'column', gap: '4px' }}
            >
              <User size={18} />
              <span>Customer / Patient</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('pharmacist')}
              className={`btn ${role === 'pharmacist' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.75rem', flexDirection: 'column', gap: '4px' }}
            >
              <Store size={18} />
              <span>Pharmacy Owner</span>
            </button>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label className="form-label">{role === 'pharmacist' ? 'Pharmacist / Contact Person Name' : 'Full Name'}</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password (Min. 6 characters)</label>
            <input
              type="password"
              className="form-input"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Pharmacy specific fields */}
          {role === 'pharmacist' && (
            <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <Store size={16} color="var(--primary-600)" /> Pharmacy Information
              </div>

              <div className="form-group">
                <label className="form-label">Pharmacy Trade Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Apollo Chemist &amp; Druggist"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shop Address &amp; Locality</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Shop 4, Station Road, Bandra West"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Opening Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="8:00 AM - 10:00 PM"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'customer' && (
            <div className="form-group">
              <label className="form-label">Address / Locality (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bandra West, Mumbai"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting} style={{ marginTop: '1rem' }}>
            {submitting ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
