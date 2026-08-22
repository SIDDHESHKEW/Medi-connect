import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestsApi } from '../services/api';
import { ReserveModal } from '../components/ReserveModal';
import { LoadingSkeleton, EmptyState } from '../components/LoadingSkeleton';
import { ClipboardList, Store, Pill, CalendarCheck2, Clock, CheckCircle2, XCircle, Search, ArrowRight } from 'lucide-react';

export const CustomerRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReserveModal, setActiveReserveModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await requestsApi.getUserRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>Your Availability Requests</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Track direct confirmation responses from neighbourhood pharmacists.
            </p>
          </div>
          <Link to="/search" className="btn btn-primary btn-sm">
            <Search size={15} /> Search More Medicines
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : requests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No availability requests yet"
            description="When you find a medicine with uncertain stock, tap 'Request Availability' to have the pharmacist verify before you travel."
            actionText="Search Medicine Catalogue"
            onAction={() => window.location.assign('/search')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((req) => {
              const isAvailable = req.status === 'available';
              const isPending = req.status === 'pending';
              const isUnavailable = req.status === 'not_available';

              return (
                <div
                  key={req._id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: `4px solid ${
                      isAvailable ? 'var(--success)' : isPending ? 'var(--warning)' : 'var(--danger)'
                    }`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isAvailable ? 'var(--success-bg)' : isPending ? 'var(--warning-bg)' : 'var(--danger-bg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isAvailable ? 'var(--success-text)' : isPending ? 'var(--warning-text)' : 'var(--danger-text)',
                          flexShrink: 0,
                        }}
                      >
                        <Pill size={22} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{req.medicine?.name}</h3>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                          Generic: {req.medicine?.genericName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                          <Store size={15} color="var(--primary-600)" />
                          <strong>{req.pharmacy?.name}</strong>
                          <span style={{ color: 'var(--slate-400)' }}>&bull; {req.pharmacy?.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isAvailable && (
                        <span className="badge badge-success" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                          <CheckCircle2 size={14} /> Confirmed Available
                        </span>
                      )}
                      {isPending && (
                        <span className="badge badge-warning" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                          <Clock size={14} /> Awaiting Pharmacist
                        </span>
                      )}
                      {isUnavailable && (
                        <span className="badge badge-danger" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                          <XCircle size={14} /> Not Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes & Timestamp */}
                  <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>
                      <strong>Your note:</strong> "{req.customerNote || 'Inquiring availability before traveling'}"
                    </div>
                    {req.pharmacistNote && (
                      <div style={{ color: isAvailable ? 'var(--success-text)' : 'var(--danger-text)', fontWeight: 500 }}>
                        <strong>Pharmacist response:</strong> "{req.pharmacistNote}"
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                      Requested: {new Date(req.createdAt).toLocaleString()}
                      {req.respondedAt && ` • Confirmed: ${new Date(req.respondedAt).toLocaleTimeString()}`}
                    </div>
                  </div>

                  {/* Action row */}
                  {isAvailable && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => setActiveReserveModal({ isOpen: true, pharmacy: req.pharmacy, medicine: req.medicine })}
                      >
                        <CalendarCheck2 size={15} /> Reserve Medicine for Pickup <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ReserveModal
        isOpen={activeReserveModal.isOpen}
        onClose={() => setActiveReserveModal({ isOpen: false, pharmacy: null, medicine: null })}
        pharmacy={activeReserveModal.pharmacy}
        medicine={activeReserveModal.medicine}
      />
    </div>
  );
};
