import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestsApi, reservationsApi, inventoryApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Bell,
  CheckCircle2,
  XCircle,
  CalendarCheck2,
  Boxes,
  Clock,
  Pill,
  User,
  Store,
  RefreshCw,
} from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [requests, setRequests] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const pharmacyId = user?.pharmacy || user?.pharmacyId;

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [reqRes, resRes, invRes] = await Promise.all([
        requestsApi.getPharmacyRequests(pharmacyId),
        reservationsApi.getPharmacyReservations(pharmacyId),
        inventoryApi.getByPharmacy(pharmacyId),
      ]);

      setRequests(reqRes.data || []);
      setReservations(resRes.data || []);
      setInventory(invRes.data || []);
    } catch (err) {
      console.error('Error fetching pharmacy dashboard data:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    // Real-time polling every 3.5 seconds
    const timer = setInterval(() => {
      fetchData(true);
    }, 3500);
    return () => clearInterval(timer);
  }, [pharmacyId]);

  const handleRespond = async (requestId, status) => {
    try {
      setRespondingId(requestId);
      await requestsApi.respond(requestId, {
        status,
        pharmacistNote: status === 'available' ? 'Confirmed in stock on counter' : 'Currently out of stock',
      });
      success(`Request marked ${status === 'available' ? 'AVAILABLE' : 'NOT AVAILABLE'}`);
      fetchData(true);
    } catch (err) {
      toastError(err.message || 'Failed to update request');
    } finally {
      setRespondingId(null);
    }
  };

  const handleConfirmCollection = async (resId) => {
    try {
      await reservationsApi.updateStatus(resId, { status: 'collected' });
      success('Medicine marked collected! Reservation completed.');
      fetchData(true);
    } catch (err) {
      toastError(err.message || 'Failed to update reservation');
    }
  };

  const handleQuickStatusToggle = async (invItem, newStatus) => {
    try {
      await inventoryApi.updateStatus(invItem._id || invItem.id, {
        status: newStatus,
        quantity: newStatus === 'available' ? 50 : newStatus === 'low' ? 5 : 0,
      });
      success(`${invItem.medicine?.name} updated to ${newStatus.toUpperCase()}`);
      fetchData(true);
    } catch (err) {
      toastError(err.message || 'Failed to update inventory status');
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeReservations = reservations.filter((r) => r.status === 'active');

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Pharmacist Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <Store size={14} /> Pharmacist Terminal
            </div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--slate-900)' }}>
              {user?.pharmacyName || user?.name || 'My Pharmacy'}
            </h1>
          </div>

          {/* Minimal Status Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span className="badge badge-neutral">{inventory.length} Stocked</span>
            <span className={`badge ${pendingRequests.length > 0 ? 'badge-warning' : 'badge-neutral'}`}>
              {pendingRequests.length} Pending Requests
            </span>
            <span className={`badge ${activeReservations.length > 0 ? 'badge-info' : 'badge-neutral'}`}>
              {activeReservations.length} Active Holds
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. TOP SPOTLIGHT: LIVE INCOMING REQUESTS */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-900)' }}>
                  <Bell size={18} color="var(--primary-600)" />
                  Incoming Availability Requests
                  {pendingRequests.length > 0 && (
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>
                      {pendingRequests.length} NEW
                    </span>
                  )}
                </h2>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.9rem', backgroundColor: '#ffffff' }}>
                  ✓ All caught up! No pending requests waiting for your confirmation.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pendingRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning-text)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                          ● New Request from Customer
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          <Pill size={18} color="var(--primary-600)" />
                          <span>{req.medicine?.name}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                          Customer: <strong>{req.customer?.name || 'Patient'}</strong> &bull; {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {req.customerNote && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontStyle: 'italic', marginTop: '0.35rem', backgroundColor: '#ffffff', padding: '0.35rem 0.6rem', borderRadius: '4px', border: '1px solid #fef3c7' }}>
                            "{req.customerNote}"
                          </div>
                        )}
                      </div>

                      {/* 1-Click Confirmation Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={respondingId === (req._id || req.id)}
                          onClick={() => handleRespond(req._id || req.id, 'available')}
                          style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
                        >
                          <CheckCircle2 size={16} /> Confirm Available
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={respondingId === (req._id || req.id)}
                          onClick={() => handleRespond(req._id || req.id, 'not_available')}
                        >
                          <XCircle size={14} /> Not Available
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 2. ACTIVE PICKUP RESERVATIONS */}
            <section>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                <CalendarCheck2 size={18} color="var(--accent-teal)" />
                Active In-Store Pickup Holds
              </h2>

              {activeReservations.length === 0 ? (
                <div className="card" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                  No active customer pickup holds at the counter right now.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {activeReservations.map((resItem) => (
                    <div
                      key={resItem._id || resItem.id}
                      className="card"
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        borderLeft: '4px solid var(--primary-600)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                            {resItem.medicine?.name}
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>&bull; Qty: {resItem.quantity || 1}</span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)', marginTop: '0.15rem' }}>
                          Customer: <strong>{resItem.customer?.name || 'Customer'}</strong> &bull; Pickup Code: <strong style={{ color: 'var(--primary-700)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{resItem.pickupCode}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleConfirmCollection(resItem._id || resItem.id)}
                      >
                        <CheckCircle2 size={14} /> Confirm Collection
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 3. 1-TAP INVENTORY QUICK STATUS */}
            <section>
              <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
                <Boxes size={18} color="var(--slate-700)" />
                1-Tap Availability Updater
              </h2>

              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {inventory.map((inv) => (
                    <div
                      key={inv._id || inv.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1.25rem',
                        borderBottom: '1px solid var(--slate-100)',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                          {inv.medicine?.name}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                          Updated {new Date(inv.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* 1-Tap Toggle Pills */}
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusToggle(inv, 'available')}
                          className={`btn btn-sm ${inv.status === 'available' ? 'btn-success' : 'btn-secondary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        >
                          ● Available
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusToggle(inv, 'low')}
                          className={`btn btn-sm ${inv.status === 'low' ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', backgroundColor: inv.status === 'low' ? 'var(--warning)' : '' }}
                        >
                          ▲ Low
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusToggle(inv, 'out')}
                          className={`btn btn-sm ${inv.status === 'out' ? 'btn-danger' : 'btn-secondary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        >
                          ✕ Out
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
