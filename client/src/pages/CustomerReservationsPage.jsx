import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { FeedbackModal } from '../components/FeedbackModal';
import { LoadingSkeleton, EmptyState } from '../components/LoadingSkeleton';
import { CalendarCheck2, Store, Pill, Clock, CheckCircle2, XCircle, Phone, MapPin, Search, ThumbsUp, ShieldAlert } from 'lucide-react';

export const CustomerReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeedbackModal, setActiveFeedbackModal] = useState({ isOpen: false, reservation: null });
  const { success, error } = useToast();

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await reservationsApi.getUserReservations();
      setReservations(res.data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this medicine reservation?')) return;
    try {
      await reservationsApi.updateStatus(id, {
        status: 'cancelled',
        cancellationReason: 'Cancelled by customer',
      });
      success('Reservation cancelled');
      loadReservations();
    } catch (err) {
      error(err.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>Your Medicine Reservations</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Show your Pickup Code at the pharmacy counter for instant physical collection.
            </p>
          </div>
          <Link to="/search" className="btn btn-primary btn-sm">
            <Search size={15} /> Find More Medicine
          </Link>
        </div>

        {/* Notice alert */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.25rem', backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', color: 'var(--primary-900)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          <ShieldAlert size={18} color="var(--primary-600)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Store Pickup Reminder:</strong> Reservations are held for in-store collection (up to 3 hours). Payment is made directly at the pharmacy counter.
          </span>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : reservations.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="No medicine reservations"
            description="When you or the pharmacist confirms availability, reserve your medicine to hold it for collection."
            actionText="Search Available Medicines"
            onAction={() => window.location.assign('/search')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reservations.map((res) => {
              const isActive = res.status === 'active';
              const isCollected = res.status === 'collected';
              const isCancelled = res.status === 'cancelled';

              return (
                <div key={res._id} className="card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isActive ? 'var(--primary-50)' : isCollected ? 'var(--success-bg)' : 'var(--slate-100)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'var(--primary-700)' : isCollected ? 'var(--success-text)' : 'var(--slate-500)',
                          flexShrink: 0,
                        }}
                      >
                        <Pill size={24} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.25rem' }}>{res.medicine?.name}</h3>
                          <span className="badge badge-neutral">Qty: {res.quantity}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '0.4rem' }}>
                          Generic: {res.medicine?.genericName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Store size={14} color="var(--primary-600)" />
                            <strong>{res.pharmacy?.name}</strong>
                          </span>
                          <span style={{ color: 'var(--slate-400)' }}>&bull; {res.pharmacy?.address}</span>
                          {res.pharmacy?.phone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--slate-600)' }}>
                              <Phone size={12} /> {res.pharmacy?.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pickup Code Box */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Pickup Code
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--primary-300)', display: 'inline-block' }}>
                        {res.pickupCode}
                      </div>
                    </div>
                  </div>

                  {/* Status & Expiry Bar */}
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isActive && (
                        <span className="badge badge-success">
                          <Clock size={12} /> Active Hold
                        </span>
                      )}
                      {isCollected && (
                        <span className="badge badge-neutral" style={{ color: 'var(--success-text)', background: 'var(--success-bg)' }}>
                          <CheckCircle2 size={12} /> Collected Successfully
                        </span>
                      )}
                      {isCancelled && (
                        <span className="badge badge-danger">
                          <XCircle size={12} /> Cancelled
                        </span>
                      )}
                      <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                        Reserved on {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div style={{ color: 'var(--slate-600)', fontSize: '0.8rem' }}>
                      {isActive && `Valid until: ${new Date(res.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {isActive && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleCancel(res._id)}
                      >
                        Cancel Reservation
                      </button>
                    )}

                    {/* Community feedback trigger */}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveFeedbackModal({ isOpen: true, reservation: res })}
                    >
                      <ThumbsUp size={14} /> Was it Available? (Feedback)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={activeFeedbackModal.isOpen}
        onClose={() => setActiveFeedbackModal({ isOpen: false, reservation: null })}
        reservation={activeFeedbackModal.reservation}
        onSuccess={loadReservations}
      />
    </div>
  );
};
