import React, { useState, useEffect } from 'react';
import { adminApi, pharmaciesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Store, ShieldCheck, Check, X, Phone, MapPin, Search } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminPharmaciesPage = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { success, error } = useToast();

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPharmacies();
      setPharmacies(res.data || []);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await pharmaciesApi.updateStatus(id, { verificationStatus: status });
      success(`Pharmacy status updated to ${status.toUpperCase()}`);
      loadPharmacies();
    } catch (err) {
      error(err.message || 'Failed to update pharmacy status');
    }
  };

  const filtered = pharmacies.filter((p) => {
    if (!query.trim()) return true;
    return (
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.city?.toLowerCase().includes(query.toLowerCase()) ||
      p.address?.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>Pharmacy Verification Manager</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Approve, verify, or suspend participating pharmacy listings.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search pharmacy name or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filtered.map((pharm) => {
              const isVerified = pharm.verificationStatus === 'verified';
              const isSuspended = pharm.verificationStatus === 'suspended';

              return (
                <div
                  key={pharm._id || pharm.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: '1 1 300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>{pharm.name}</strong>
                      <span className={`badge ${isVerified ? 'badge-success' : isSuspended ? 'badge-danger' : 'badge-warning'}`}>
                        {pharm.verificationStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span>{pharm.address}, {pharm.city}</span>
                      <span>&bull; {pharm.phone}</span>
                      <span>&bull; License: {pharm.licenseNumber || 'DL-MH-2024'}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                      Confirmations: <strong>{pharm.totalConfirmations || 0}</strong> &bull; Unavailable reports: <strong style={{ color: 'var(--danger)' }}>{pharm.unavailableReports || 0}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isVerified && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(pharm._id || pharm.id, 'verified')}
                        className="btn btn-success btn-sm"
                      >
                        <Check size={14} /> Verify Pharmacy
                      </button>
                    )}
                    {!isSuspended ? (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(pharm._id || pharm.id, 'suspended')}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                      >
                        <X size={14} /> Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(pharm._id || pharm.id, 'verified')}
                        className="btn btn-secondary btn-sm"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
