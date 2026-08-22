import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Heart, MapPin, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--slate-900)', color: 'var(--slate-300)', marginTop: 'auto', borderTop: '1px solid var(--slate-800)' }}>
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Activity size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
                Medi<span style={{ color: 'var(--primary-500)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: '1rem' }}>
              “Find the Right Medicine. Right Place. Right Time.” Solving last-mile healthcare discovery without requiring complex inventory systems.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--slate-800)', color: 'var(--slate-300)' }}>
              <Sparkles size={12} color="var(--primary-500)" /> College Hackathon MVP Edition
            </div>
          </div>

          {/* Customer Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>
              For Patients & Customers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/search" style={{ color: 'var(--slate-400)' }}>Search Medicine Availability</Link></li>
              <li><Link to="/login" style={{ color: 'var(--slate-400)' }}>Customer Login</Link></li>
              <li><Link to="/register" style={{ color: 'var(--slate-400)' }}>Create Customer Account</Link></li>
              <li><Link to="/requests" style={{ color: 'var(--slate-400)' }}>Track Availability Requests</Link></li>
            </ul>
          </div>

          {/* Pharmacy Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>
              For Local Pharmacies
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/register" style={{ color: 'var(--slate-400)' }}>Register Your Pharmacy</Link></li>
              <li><Link to="/login" style={{ color: 'var(--slate-400)' }}>Pharmacist Portal</Link></li>
              <li><Link to="/pharmacy/inventory" style={{ color: 'var(--slate-400)' }}>1-Tap Availability Update</Link></li>
              <li><Link to="/pharmacy/requests" style={{ color: 'var(--slate-400)' }}>Live Request Queue</Link></li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>
              Problem Statement
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              Eliminating the frustration of visiting 4-5 medical stores during emergencies. Request, confirm & reserve before traveling.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Shield size={14} color="var(--accent-emerald)" /> Zero Fake Real-Time Claims
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--slate-800)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
          <div>
            &copy; {new Date().getFullYear()} MediConnect. Built for Last-Mile Healthcare Accessibility.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>MERN Full Stack Prototype</span>
            <span>REST API + Resilient Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
