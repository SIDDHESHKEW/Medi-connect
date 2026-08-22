import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestsApi } from '../services/api';
import { LoadingSkeleton, EmptyState } from '../components/LoadingSkeleton';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Pill,
  User,
  Phone,
  RefreshCw,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

export const PharmacyRequestsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const pharmacyId = user?.pharmacy || 'pharm_1';

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await requestsApi.getPharmacyRequests(pharmacyId);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching pharmacy requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [pharmacyId]);

  const handleRespond = async (requestId, status, medicineName) => {
    try {
      setRespondingId(requestId);
      const res = await requestsApi.respond(requestId, {
        status,
        pharmacistNote:
          status === 'available'
            ? 'Yes, medicine is physically available at counter'
            : 'Sorry, currently out of stock',
      });

      success(
        status === 'available'
          ? `✓ Confirmed ${medicineName} as AVAILABLE to customer!`
          : `Marked ${medicineName} as NOT AVAILABLE`
      );

      // Update in state
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? res.data : r))
      );
    } catch (err) {
      error(err.message || 'Failed to respond to request');
    } finally {
      setRespondingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const pastRequests = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Sparkles size={13} /> Real-Time Customer Inquiries
            </div>
            <h1 style={{ fontSize: '1.75rem' }}>Customer Availability Requests</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Respond with 1-click so customers know they can travel to your pharmacy safely.
            </p>
          </div>

          <button onClick={loadRequests} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh Queue
          </button>
        </div>

        {/* Pending Requests Queue */}
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
          Pending Requests ({pendingRequests.length})
        </h2>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : pendingRequests.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', marginBottom: '2.5rem' }}>
            🎉 No pending requests in queue right now!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {pendingRequests.map((req) => {
              const isSubmitting = respondingId === req._id;

              return (
                <div
                  key={req._id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: '5px solid #ea580c',
                    backgroundColor: '#fffcf7',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#ffedd5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ea580c',
                          flexShrink: 0,
                        }}
                      >
                        <Pill size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          {req.medicine?.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                          Generic: {req.medicine?.genericName} &bull; {req.medicine?.category}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <User size={14} color="var(--primary-600)" /> {req.customer?.name || 'Customer'}
                          </span>
                          {req.customer?.phone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--slate-500)' }}>
                              <Phone size={12} /> {req.customer?.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-warning">
                        <Clock size={12} /> Pending Response
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {req.customerNote && (
                    <div style={{ backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)', fontSize: '0.875rem', color: 'var(--slate-700)', marginBottom: '1.25rem' }}>
                      <strong>Customer Question:</strong> "{req.customerNote}"
                    </div>
                  )}

                  {/* 1-Click Pharmacist Decision Row */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRespond(req._id, 'not_available', req.medicine?.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                    >
                      <XCircle size={15} /> ✕ Not Available
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRespond(req._id, 'available', req.medicine?.name)}
                      className="btn btn-success"
                      style={{ padding: '0.6rem 1.5rem', fontWeight: 700 }}
                    >
                      <CheckCircle2 size={16} /> ✓ Yes, Available in Stock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Past Responses Log */}
        {pastRequests.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
              Completed Responses ({pastRequests.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pastRequests.map((req) => (
                <div
                  key={req._id}
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
                    <strong style={{ color: 'var(--slate-900)' }}>{req.medicine?.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Customer: {req.customer?.name} &bull; Responded at {new Date(req.respondedAt || req.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div>
                    <span className={`badge ${req.status === 'available' ? 'badge-success' : 'badge-danger'}`}>
                      {req.status === 'available' ? '✓ Confirmed Available' : '✕ Out of Stock'}
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
