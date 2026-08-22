import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestsApi } from '../services/api';
import { Send, Store, Pill, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestModal = ({ isOpen, onClose, pharmacy, medicine, onSuccess }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [note, setNote] = useState('Inquiring if this medicine is in stock right now before I travel.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !pharmacy || !medicine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to send an availability request.' } });
      return;
    }

    if (!isCustomer) {
      error('Only customer accounts can send availability requests. Please switch or log in as customer.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await requestsApi.create({
        pharmacyId: pharmacy.pharmacyId || pharmacy.id || pharmacy._id,
        medicineId: medicine._id || medicine.id,
        customerNote: note,
      });

      success('Availability request sent to pharmacist! You will see confirmation in your dashboard.');
      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="card-header" style={{ background: 'var(--primary-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Send size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>Request Availability</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-500)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                <Pill size={16} color="var(--primary-600)" />
                <span>{medicine.name}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 400 }}>({medicine.genericName})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <Store size={14} />
                <span>{pharmacy.pharmacyName || pharmacy.name}</span>
                {pharmacy.distanceKm && <span>&bull; {pharmacy.distanceKm} km away</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Note for Pharmacist (Optional)</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. Need 2 strips urgently, can visit in 20 mins"
              />
              <p className="form-hint">
                The pharmacist will receive this instantly on their dashboard and confirm whether it is currently in stock.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-600)', background: 'var(--warning-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--warning-border)' }}>
              <AlertCircle size={16} color="var(--warning-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Zero Unnecessary Visits:</strong> Wait for the pharmacist to click <em>Available</em> before you travel!
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending Request...' : 'Send Request Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
