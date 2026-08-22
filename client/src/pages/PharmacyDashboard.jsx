import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inventoryApi, requestsApi, reservationsApi, pharmaciesApi } from '../services/api';
import {
  Boxes,
  ClipboardList,
  CalendarCheck2,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Store,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        setLoading(true);
        // Find pharmacy ID
        const targetPharmacyId = user?.pharmacy || 'pharm_1';

        const [invRes, reqRes, resRes, pharmRes] = await Promise.all([
          inventoryApi.getByPharmacy(targetPharmacyId).catch(() => ({ data: [] })),
          requestsApi.getPharmacyRequests(targetPharmacyId).catch(() => ({ data: [] })),
          reservationsApi.getPharmacyReservations(targetPharmacyId).catch(() => ({ data: [] })),
          pharmaciesApi.getById(targetPharmacyId).catch(() => ({ data: null })),
        ]);

        setInventory(invRes.data || []);
        setRequests(reqRes.data || []);
        setReservations(resRes.data || []);
        setPharmacy(pharmRes.data);
      } catch (err) {
        console.error('Error loading pharmacy dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyData();
  }, [user]);

  const availableCount = inventory.filter((i) => i.status === 'available').length;
  const lowCount = inventory.filter((i) => i.status === 'low').length;
  const outCount = inventory.filter((i) => i.status === 'out').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeReservations = reservations.filter((r) => r.status === 'active');

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Pharmacy Top Bar */}
        <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--primary-200)', marginBottom: '0.5rem' }}>
                <Store size={12} /> Pharmacist Operator Terminal
              </div>
              <h1 style={{ fontSize: '1.85rem', color: '#ffffff' }}>
                {pharmacy?.name || 'ABC Medical Store'}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                {pharmacy?.address || 'Main Road, Bandra West'} &bull; {pharmacy?.openingHours || '8:00 AM - 11:00 PM'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/pharmacy/inventory/add" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Add Medicine
              </Link>
              <Link to="/pharmacy/inventory" className="btn btn-secondary btn-sm" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'transparent' }}>
                <Boxes size={15} /> Update Availability
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Metrics (6-Card Dashboard Matrix) */}
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
              <Boxes size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : inventory.length}</div>
              <div className="stat-lbl">Total Medicines Listed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : availableCount}</div>
              <div className="stat-lbl">In Stock (Available)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : lowCount}</div>
              <div className="stat-lbl">Low Stock Alerts</div>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
              <XCircle size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : outCount}</div>
              <div className="stat-lbl">Out of Stock</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderColor: pendingRequests.length > 0 ? 'var(--warning-border)' : 'var(--slate-200)' }}>
            <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <div className="stat-val" style={{ color: pendingRequests.length > 0 ? '#ea580c' : 'inherit' }}>
                {loading ? '-' : pendingRequests.length}
              </div>
              <div className="stat-lbl">Pending Customer Requests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7e22ce' }}>
              <CalendarCheck2 size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : activeReservations.length}</div>
              <div className="stat-lbl">Active Hold Pickups</div>
            </div>
          </div>
        </div>

        {/* Live Queues Preview Grid */}
        <div className="grid-2" style={{ gap: '2rem' }}>
          {/* Incoming Customer Requests */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <ClipboardList size={18} color="var(--primary-600)" />
                <span>Live Availability Requests</span>
              </div>
              <Link to="/pharmacy/requests" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Open Queue ({pendingRequests.length}) &rarr;
              </Link>
            </div>

            <div className="card-body">
              {loading ? (
                <LoadingSkeleton count={2} />
              ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
                  No customer availability requests at the moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {requests.slice(0, 3).map((req) => (
                    <div
                      key={req._id}
                      style={{
                        padding: '0.85rem 1rem',
                        border: '1px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: req.status === 'pending' ? '#fffbeb' : 'white',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <strong style={{ color: 'var(--slate-900)' }}>{req.medicine?.name}</strong>
                        <span className={`badge ${req.status === 'pending' ? 'badge-warning' : req.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
                        Customer: <strong>{req.customer?.name || 'Customer'}</strong> &bull; {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {req.status === 'pending' && (
                        <Link to="/pharmacy/requests" className="btn btn-primary btn-sm btn-block">
                          Respond in Queue &rarr;
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Reservations */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <CalendarCheck2 size={18} color="var(--accent-teal)" />
                <span>Pickup Orders (Showroom Holds)</span>
              </div>
              <Link to="/pharmacy/reservations" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Manage All &rarr;
              </Link>
            </div>

            <div className="card-body">
              {loading ? (
                <LoadingSkeleton count={2} />
              ) : reservations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-500)' }}>
                  No customer pickup reservations yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div>
                          <strong style={{ color: 'var(--slate-900)' }}>{res.medicine?.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginLeft: '0.5rem' }}>
                            (Qty: {res.quantity})
                          </span>
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                          {res.pickupCode}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                        Customer: {res.customer?.name} &bull; Status: <strong style={{ textTransform: 'capitalize', color: res.status === 'collected' ? 'var(--success)' : 'var(--primary-600)' }}>{res.status}</strong>
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
