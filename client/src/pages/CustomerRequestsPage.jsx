import React, { useState, useEffect } from 'react';
import { requestsApi } from '../services/api';
import { Pill, Store, Clock, CheckCircle2, XCircle, CalendarCheck2, ArrowRight } from 'lucide-react';
import { ReserveModal } from '../components/ReserveModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Link } from 'react-router-dom';

export const CustomerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReserveModal, setActiveReserveModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  const fetchRequests = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const res = await requestsApi.getUserRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(false);
    // Real-time polling every 3.5s so when Pharmacist confirms in Tab 2, Tab 1 updates dynamically
    const timer = setInterval(() => {
      fetchRequests(true);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--slate-900)' }}>My Availability Requests</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Live verification status from local pharmacy counters
            </p>
          </div>
          <Link to="/search" className="btn btn-secondary btn-sm">
            + Search Medicine
          </Link>
        </div>

        {/* Requests List */}
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : requests.length === 0 ? (
          <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            <Pill size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-700)', marginBottom: '0.25rem' }}>No Requests Yet</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Search for any medicine and request live stock verification.</p>
            <Link to="/search" className="btn btn-primary btn-sm">
              Search Medicines Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.map((req) => {
              const isPending = req.status === 'pending';
              const isAvailable = req.status === 'available';
              const isNotAvailable = req.status === 'not_available';

              return (
                <div
                  key={req._id || req.id}
                  className="card"
                  style={{
                    padding: '1.15rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    borderLeft: `4px solid ${
                      isAvailable ? 'var(--success)' : isPending ? 'var(--warning)' : 'var(--danger)'
                    }`,
                  }}
                >
                  {/* Medicine & Pharmacy Info */}
                  <div style={{ flex: '1 1 240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Pill size={16} color="var(--primary-600)" />
                      <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>
                        {req.medicine?.name}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                      <Store size={13} />
                      <span>{req.pharmacy?.name}</span>
                      <span>&bull; {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {req.customerNote && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        "{req.customerNote}"
                      </div>
                    )}
                  </div>

                  {/* Status Indicator & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {isPending && (
                      <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}>
                        <Clock size={12} /> Waiting for Confirmation
                      </span>
                    )}

                    {isAvailable && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}>
                          <CheckCircle2 size={12} /> AVAILABLE &bull; Confirmed
                        </span>

                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveReserveModal({ isOpen: true, pharmacy: req.pharmacy, medicine: req.medicine })}
                        >
                          <CalendarCheck2 size={13} /> Reserve Medicine
                        </button>
                      </div>
                    )}

                    {isNotAvailable && (
                      <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}>
                        <XCircle size={12} /> Not Available
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReserveModal
        isOpen={activeReserveModal.isOpen}
        onClose={() => {
          setActiveReserveModal({ isOpen: false, pharmacy: null, medicine: null });
          fetchRequests(true);
        }}
        pharmacy={activeReserveModal.pharmacy}
        medicine={activeReserveModal.medicine}
      />
    </div>
  );
};
