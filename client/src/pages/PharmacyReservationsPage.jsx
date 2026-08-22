import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../services/api';
import { LoadingSkeleton, EmptyState } from '../components/LoadingSkeleton';
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Pill,
  User,
  Phone,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export const PharmacyReservationsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const pharmacyId = user?.pharmacy || 'pharm_1';

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationsApi.getPharmacyReservations(pharmacyId);
      setReservations(res.data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, [pharmacyId]);

  const handleUpdateStatus = async (resId, newStatus) => {
    try {
      await reservationsApi.updateStatus(resId, {
        status: newStatus,
        cancellationReason: newStatus === 'cancelled' ? 'Cancelled by pharmacy operator' : '',
      });

      success(
        newStatus === 'collected'
          ? 'Medicine marked as physically collected by customer!'
          : 'Reservation cancelled'
      );
      loadReservations();
    } catch (err) {
      error(err.message || 'Failed to update reservation status');
    }
  };

  const activeReservations = reservations.filter((r) => r.status === 'active');
  const pastReservations = reservations.filter((r) => r.status !== 'active');

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>Counter Pickup Reservations</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Verify customer pickup code and confirm counter collections.
            </p>
          </div>

          <button onClick={loadReservations} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Pickups
          </button>
        </div>

        {/* Active Reservations */}
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
          Active Holds for Collection ({activeReservations.length})
        </h2>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : activeReservations.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', marginBottom: '2.5rem' }}>
            No active medicine holds awaiting pickup.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {activeReservations.map((res) => (
              <div
                key={res._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderLeft: '5px solid var(--primary-600)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-700)',
                        flexShrink: 0,
                      }}
                    >
                      <Pill size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {res.medicine?.name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.35rem' }}>
                        Quantity Reserved: <strong>{res.quantity}</strong> unit(s)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={14} color="var(--primary-600)" /> {res.customer?.name}
                        </span>
                        {res.customer?.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--slate-500)' }}>
                            <Phone size={12} /> {res.customer?.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Code Box */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      Verify Pickup Code
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)', backgroundColor: 'var(--primary-50)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-200)' }}>
                      {res.pickupCode}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.825rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} />
                    Reserved on {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; Expires: {new Date(res.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%', maxWidth: '340px' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(res._id, 'collected')}
                      className="btn btn-success btn-sm"
                      style={{ fontWeight: 700, flex: '1 1 auto', justifyContent: 'center' }}
                    >
                      <CheckCircle2 size={15} /> Confirm Collection
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(res._id, 'cancelled')}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', flex: '1 1 auto', justifyContent: 'center' }}
                    >
                      Cancel Hold
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Log */}
        {pastReservations.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
              Completed / Past Holds ({pastReservations.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pastReservations.map((res) => (
                <div
                  key={res._id}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <strong style={{ color: 'var(--slate-900)' }}>{res.medicine?.name}</strong> (Qty: {res.quantity})
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Customer: {res.customer?.name} &bull; Code: {res.pickupCode}
                    </div>
                  </div>

                  <div>
                    <span className={`badge ${res.status === 'collected' ? 'badge-success' : 'badge-danger'}`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
