import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Pill, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const POPULAR_MEDICINES = [
  'Paracetamol 650',
  'Cetirizine 10',
  'ORS',
  'Ibuprofen 400',
  'Azithromycin 500',
  'Pantoprazole 40',
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim() || 'Paracetamol 650';
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleQuickSelect = (med) => {
    navigate(`/search?q=${encodeURIComponent(med)}`);
  };

  return (
    <div className="main-content" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Search Section */}
      <section style={{ padding: '3.5rem 1rem 3rem', background: 'radial-gradient(ellipse at top, #f0f9ff 0%, #ffffff 70%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-50)', color: 'var(--primary-700)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid var(--primary-100)' }}>
            <MapPin size={13} />
            <span>Live in {currentLocation.label.replace(' (Default Demo)', '')}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--slate-900)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
            Find your medicine nearby.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Check verified stock across local pharmacies, request instant confirmation, and reserve for pickup.
          </p>

          {/* Large Search Box */}
          <form onSubmit={handleSearch} style={{ maxWidth: '640px', margin: '0 auto 1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#ffffff', padding: '0.4rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 0 0 1px var(--slate-200)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '0.75rem' }}>
                <Search size={20} color="var(--slate-400)" />
                <input
                  type="text"
                  className="form-input"
                  style={{ border: 'none', boxShadow: 'none', fontSize: '1.05rem', padding: '0.6rem 0.75rem' }}
                  placeholder="Search medicine (e.g. Paracetamol 650, ORS)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
                Search <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Popular Medicine Chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)', fontWeight: 500 }}>Popular:</span>
            {POPULAR_MEDICINES.map((med) => (
              <button
                key={med}
                type="button"
                onClick={() => handleQuickSelect(med)}
                style={{
                  background: 'var(--slate-100)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-50)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--slate-100)')}
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Simple Visual Workflow */}
      <section style={{ padding: '3rem 1rem 4rem', backgroundColor: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="grid-3">
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>1. Search Medicine</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                View nearby pharmacies with distance and real-time availability status.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>2. Request Confirmation</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                Pharmacist 1-click confirms physical stock on counter before you travel.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid var(--slate-200)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>3. Reserve for Pickup</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                Get a 3-hour pickup hold with a pickup code for zero waiting.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
