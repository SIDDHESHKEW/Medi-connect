import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Store,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  AlertCircle,
  Pill,
  Send,
  CalendarCheck2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export const LandingPage = () => {
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(quickQuery)}`);
  };

  const sampleMedicines = ['Paracetamol 650', 'Cetirizine 10', 'Azithromycin 500', 'ORS', 'Ibuprofen 400'];

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)', padding: '4.5rem 0 3.5rem', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '840px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> Problem Solved: Last-Mile Medicine Access
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: 'var(--slate-950)', letterSpacing: '-0.03em', marginBottom: '1.25rem', fontWeight: 800 }}>
            Find the medicine you need <span style={{ color: 'var(--primary-600)', background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>before you travel.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
            Connect with local neighbourhood pharmacies in real time. Search medicine availability, request instant 1-click confirmation from pharmacists, and reserve for physical pickup.
          </p>

          {/* Prominent Quick Search Box */}
          <form onSubmit={handleQuickSearch} style={{ maxWidth: '640px', margin: '0 auto 1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '0.75rem', gap: '0.6rem' }}>
                <Search size={22} color="var(--primary-600)" />
                <input
                  type="text"
                  placeholder="Search medicine (e.g. Paracetamol 650, Azithromycin)..."
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.05rem', color: 'var(--slate-800)' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-lg)' }}>
                Search Medicine
              </button>
            </div>
          </form>

          {/* Quick pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '2.5rem' }}>
            <span>Popular Searches:</span>
            {sampleMedicines.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => navigate(`/search?q=${encodeURIComponent(m)}`)}
                style={{
                  background: 'white',
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--primary-700)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/search" className="btn btn-primary btn-lg">
              Explore Nearby Pharmacies <ArrowRight size={18} />
            </Link>
            <Link to="/register?role=pharmacist" className="btn btn-secondary btn-lg">
              Register Your Pharmacy
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Story: Traditional Process vs MediConnect */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>The Last-Mile Reality</h2>
            <p style={{ color: 'var(--slate-600)' }}>
              Medicines exist locally, but people waste hours visiting multiple pharmacies during illness or emergencies.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* Traditional */}
            <div className="card" style={{ borderColor: 'var(--danger-border)', backgroundColor: '#fffbfb' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--danger-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-text)', fontWeight: 700 }}>
                  <XCircle size={20} color="var(--danger)" />
                  <span>Traditional Frustration</span>
                </div>
                <span className="badge badge-danger">4-5 Visits</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>1</div>
                    <span>Patient or caregiver travels to Pharmacy #1</span>
                  </div>
                  <div style={{ paddingLeft: '2.5rem', color: 'var(--danger)', fontWeight: 600 }}>&rarr; Medicine Out of Stock</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>2</div>
                    <span>Travels to Pharmacy #2 across town</span>
                  </div>
                  <div style={{ paddingLeft: '2.5rem', color: 'var(--danger)', fontWeight: 600 }}>&rarr; Not Available / Closed</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>3</div>
                    <span>Wasted 90 minutes, fuel, money & critical emergency time</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MediConnect */}
            <div className="card" style={{ borderColor: 'var(--success-border)', backgroundColor: '#fcfdfd' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--success-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-text)', fontWeight: 700 }}>
                  <CheckCircle2 size={20} color="var(--success)" />
                  <span>With MediConnect</span>
                </div>
                <span className="badge badge-success">Single Confirmed Trip</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>1</div>
                    <span>Search medicine & discover nearby pharmacies</span>
                  </div>
                  <div style={{ paddingLeft: '2.5rem', color: 'var(--primary-600)', fontWeight: 600 }}>&rarr; See live distance & freshness score</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>2</div>
                    <span>Click <em>Request Availability</em> &rarr; Pharmacist confirms in seconds</span>
                  </div>
                  <div style={{ paddingLeft: '2.5rem', color: 'var(--success)', fontWeight: 600 }}>&rarr; Confirmed Available &amp; Reserved!</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--slate-700)' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>3</div>
                    <span>Visit the right pharmacy directly with your pickup code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How It Works</h2>
            <p style={{ color: 'var(--slate-600)' }}>A simple, 4-step workflow engineered for speed and reliability.</p>
          </div>

          <div className="grid-4">
            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Search</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Enter your required brand or generic medicine formulation.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-600)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Discover</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                See verified nearby pharmacies, live distance, and freshness indicators.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center', borderColor: 'var(--primary-300)', boxShadow: 'var(--shadow-glow)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-teal)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Confirm</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Request direct 1-tap confirmation from the on-duty pharmacist.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                04
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Reserve</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Reserve your medicine with a pickup code and visit with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Innovation: Request & Confirm */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
            <div>
              <div className="badge badge-info" style={{ marginBottom: '1rem' }}>
                Key Innovation
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                Request &amp; Confirm: Zero Dependence on Heavy Software
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Small neighbourhood medical stores rarely have expensive ERP systems. MediConnect empowers pharmacists to update status in <strong>under 3 seconds</strong> or respond to customer availability requests with a single tap:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                    Pharmacist receives: <em>“Is Paracetamol 650 available right now?”</em>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                    Pharmacist taps <strong>[✓ Available]</strong> or <strong>[✕ Not Available]</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span style={{ fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                    Customer receives instant verified confirmation &amp; pickup code
                  </span>
                </div>
              </div>

              <Link to="/search" className="btn btn-primary">
                Try Live Medicine Search
              </Link>
            </div>

            {/* Visual simulation card */}
            <div className="card" style={{ boxShadow: 'var(--shadow-xl)', border: '1px solid var(--primary-200)', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
              <div className="card-header" style={{ background: 'var(--primary-600)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Send size={16} /> Pharmacist Live Request Queue
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  Live Alert
                </span>
              </div>
              <div className="card-body">
                <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '1rem', backgroundColor: 'white', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>Paracetamol 650</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>2 mins ago</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '0.85rem' }}>
                    Customer #1024 inquiring availability before traveling
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-success btn-sm btn-block" style={{ pointerEvents: 'none' }}>
                      ✓ Available
                    </button>
                    <button className="btn btn-secondary btn-sm btn-block" style={{ pointerEvents: 'none' }}>
                      ✕ Not Available
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  <Clock size={14} /> Takes &lt; 3 seconds for the pharmacist to respond.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freshness & Trust Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Availability Freshness &amp; Trust</h2>
            <p style={{ color: 'var(--slate-600)' }}>
              We never show fake real-time inventory. Every status explicitly reveals when it was updated so you can make informed decisions.
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-success">Fresh</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>&lt; 2 hours ago</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>High Confidence</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Recently verified or updated by the pharmacy. Stock is almost certainly available right away.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-warning">Aging</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>2–24 hours ago</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Medium Confidence</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Information was updated earlier today. Quick 1-click confirmation is recommended for certainty.
              </p>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-danger">Stale</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>&gt; 24 hours ago</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Request Confirmation</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Older listing. Tap <em>Request Availability</em> to have the pharmacist verify physical stock before you leave.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(135deg, var(--slate-900) 0%, var(--primary-900) 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.4rem', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to find your medicine without the guesswork?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--slate-300)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join thousands of patients and neighbourhood pharmacies using MediConnect for fast, verified, last-mile access.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn btn-primary btn-lg" style={{ background: '#ffffff', color: 'var(--primary-700)' }}>
              <Search size={18} /> Search Medicine Now
            </Link>
            <Link to="/register?role=pharmacist" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
              Register Your Pharmacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
