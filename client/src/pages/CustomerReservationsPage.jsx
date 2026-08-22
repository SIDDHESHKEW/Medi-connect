import React, { useState, useEffect } from 'react';
import { reservationsApi } from '../services/api';
import { CalendarCheck2, Store, Pill, Clock, CheckCircle2, QrCode, XCircle } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { FeedbackModal } from '../components/FeedbackModal';
import { Link } from 'react-router-dom';

export const CustomerReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  const fetchReservations = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await reservationsApi.getUserReservations();
      setReservations(res.data || []);
    } catch (err) {
      console.error('Error loading reservations:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations(false);
    const timer = setInterval(() => {
      fetchReservations(true);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--slate-900)' }}>My Reservations</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              In-store pickup holds (3-hour guarantee)
            </p>
          </div>
          <Link to="/search" className="btn btn-secondary btn-sm">
            + Search Medicine
          </Link>
        </div>

        {/* Reservations List */}
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : reservations.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            <CalendarCheck2 size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No Active Reservations</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Reserve medicines after availability confirmation to hold them at the store.</p>
            <Link to="/search" className="btn btn-primary btn-sm">
              Find Medicines
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reservations.map((resItem) => {
              const isActive = resItem.status === 'active';
              const isCollected = resItem.status === 'collected';

              return (
                <div
                  key={resItem._id || resItem.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `4px solid ${isActive ? 'var(--primary-600)' : isCollected ? 'var(--success)' : 'var(--slate-300)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <Pill size={16} color="var(--primary-600)" />
                        <strong style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>
                          {resItem.medicine?.name}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>&bull; Qty: {resItem.quantity || 1}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                        <Store size={13} />
                        <strong>{resItem.pharmacy?.name}</strong>
                        <span>&bull; {resItem.pharmacy?.address}</span>
                      </div>
                    </div>

                    {/* Pickup Code Pill */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', backgroundColor: 'var(--primary-50)', border: '1px dashed var(--primary-500)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase' }}>Pickup Code</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                          {resItem.pickupCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--slate-50)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {isActive && (
                        <>
                          <Clock size={13} color="var(--primary-600)" />
                          <span style={{ color: 'var(--primary-800)', fontWeight: 600 }}>Active Hold</span>
                          <span style={{ color: 'var(--slate-500)' }}>&bull; Show code at counter</span>
                        </>
                      )}
                      {isCollected && (
                        <>
                          <CheckCircle2 size={13} color="var(--success)" />
                          <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>Collected at Pharmacy</span>
                        </>
                      )}
                    </div>

                    {isCollected && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => setFeedbackModal({ isOpen: true, pharmacy: resItem.pharmacy, medicine: resItem.medicine })}
                      >
                        ✓ Leave Feedback
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal({ isOpen: false, pharmacy: null, medicine: null })}
        pharmacy={feedbackModal.pharmacy}
        medicine={feedbackModal.medicine}
      />
    </div>
  );
};
