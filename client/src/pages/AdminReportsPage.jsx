import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { ShieldCheck, ThumbsUp, ThumbsDown, Store, Pill, User, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getReports();
        setReports(res.data || []);
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem' }}>Community Availability Reports</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Patient feedback on whether medicines were physically in stock upon store visit.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : reports.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No community feedback reports submitted yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reports.map((rep) => {
              const isAvailable = rep.result === 'available';

              return (
                <div
                  key={rep._id || rep.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderLeft: `4px solid ${isAvailable ? 'var(--success)' : 'var(--danger)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>
                          {rep.medicine?.name}
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                          at <strong>{rep.pharmacy?.name}</strong>
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                        Reported by {rep.customer?.name || 'Patient'} &bull; {new Date(rep.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                      {isAvailable ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                      {isAvailable ? 'Available on Visit' : 'Unavailable Report'}
                    </span>
                  </div>

                  {rep.comment && (
                    <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--slate-700)', marginTop: '0.5rem' }}>
                      "{rep.comment}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
