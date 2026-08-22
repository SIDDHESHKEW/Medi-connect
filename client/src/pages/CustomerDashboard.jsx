import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestsApi, reservationsApi } from '../services/api';
import {
  Search,
  ClipboardList,
  CalendarCheck2,
  Clock,
  ArrowRight,
  Pill,
  Store,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, resRes] = await Promise.all([
          requestsApi.getUserRequests().catch(() => ({ data: [] })),
          reservationsApi.getUserReservations().catch(() => ({ data: [] })),
        ]);
        setRequests(reqRes.data || []);
        setReservations(resRes.data || []);
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeRequests = requests.filter((r) => r.status === 'pending');
  const confirmedRequests = requests.filter((r) => r.status === 'available');
  const activeReservations = reservations.filter((r) => r.status === 'active');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)', color: 'white', border: 'none' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '0.75rem' }}>
              <Sparkles size={12} /> Patient &amp; Customer Portal
            </div>
            <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Welcome, {user?.name || 'Customer'}!
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Find medicines at verified neighbourhood pharmacies, request availability before leaving home, and reserve for physical pickup.
            </p>

            {/* Quick Search bar inside banner */}
            <form onSubmit={handleSearchSubmit}>
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.4rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '0.75rem', gap: '0.5rem' }}>
                  <Search size={18} color="var(--slate-400)" />
                  <input
                    type="text"
                    placeholder="Search medicine (e.g. Paracetamol 650, Dolo, Azithromycin)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--slate-800)' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.25rem' }}>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : activeRequests.length}</div>
              <div className="stat-lbl">Active Pending Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : confirmedRequests.length}</div>
              <div className="stat-lbl">Confirmed Available</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7e22ce' }}>
              <CalendarCheck2 size={24} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : activeReservations.length}</div>
              <div className="stat-lbl">Active Reservations for Pickup</div>
            </div>
          </div>
        </div>

        {/* Action Content Grid */}
        <div className="grid-2" style={{ gap: '2rem' }}>
          {/* Confirmed / Active Requests Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <ClipboardList size={18} color="var(--primary-600)" />
                <span>Recent Availability Requests</span>
              </div>
              <Link to="/requests" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                View All &rarr;
              </Link>
            </div>

            <div className="card-body">
              {loading ? (
                <LoadingSkeleton count={2} />
              ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
                  No requests sent yet. Search for a medicine and tap <em>Request Availability</em>.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {requests.slice(0, 3).map((req) => (
                    <div
                      key={req._id}
                      style={{
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: req.status === 'available' ? 'var(--success-bg)' : 'white',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong style={{ color: 'var(--slate-900)' }}>{req.medicine?.name}</strong>
                        {req.status === 'available' && (
                          <span className="badge badge-success">✓ Confirmed Available</span>
                        )}
                        {req.status === 'pending' && (
                          <span className="badge badge-warning">Awaiting Pharmacist</span>
                        )}
                        {req.status === 'not_available' && (
                          <span className="badge badge-danger">Out of Stock</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Store size={13} /> {req.pharmacy?.name}
                      </div>
                      {req.status === 'available' && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <Link to="/reservations" className="btn btn-success btn-sm">
                            <CalendarCheck2 size={13} /> Reserve Now
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Reservations Card */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <CalendarCheck2 size={18} color="var(--accent-teal)" />
                <span>Pickup Reservations</span>
              </div>
              <Link to="/reservations" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Manage All &rarr;
              </Link>
            </div>

            <div className="card-body">
              {loading ? (
                <LoadingSkeleton count={2} />
              ) : reservations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
                  No active medicine reservations. When a pharmacy confirms availability, you can hold it for pickup.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reservations.slice(0, 3).map((res) => (
                    <div
                      key={res._id}
                      style={{
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'white',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <div>
                          <strong style={{ color: 'var(--slate-900)' }}>{res.medicine?.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginLeft: '0.5rem' }}>
                            (Qty: {res.quantity})
                          </span>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          {res.pickupCode}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)', marginBottom: '0.4rem' }}>
                        {res.pharmacy?.name} &bull; {res.pharmacy?.address}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                        <span>Status: <strong style={{ textTransform: 'capitalize', color: res.status === 'collected' ? 'var(--success)' : 'var(--primary-600)' }}>{res.status}</strong></span>
                        <span>Show code at counter</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
