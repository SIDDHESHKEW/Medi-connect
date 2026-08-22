import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestsApi } from '../services/api';
import { Send, Store, Pill, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestModal = ({ isOpen, onClose, pharmacy, medicine, onSuccess }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [note, setNote] = useState('Need availability confirmation before I travel.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !pharmacy || !medicine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to send an availability request.' } });
      return;
    }

    if (!isCustomer) {
      error('Only customer accounts can send availability requests.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await requestsApi.create({
        pharmacyId: pharmacy.pharmacyId || pharmacy.id || pharmacy._id,
        medicineId: medicine._id || medicine.id,
        customerNote: note,
      });

      success('Availability request sent to pharmacist!');
      if (onSuccess) onSuccess(res.data);
      onClose();
      navigate('/requests');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>Request Availability</h3>
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
            <div style={{ backgroundColor: 'var(--slate-50)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--slate-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem', fontWeight: 700 }}>
                <Pill size={16} color="var(--primary-600)" />
                <span style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>{medicine.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--slate-600)' }}>
                <Store size={13} />
                <span>{pharmacy.pharmacyName || pharmacy.name}</span>
                {pharmacy.distanceKm && <span>&bull; {pharmacy.distanceKm} km away</span>}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Note for Pharmacist (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. Need 2 strips urgently"
              />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              The pharmacist will receive this in real-time on their terminal to verify physical stock on the counter.
            </p>
          </div>

          {/* Footer */}
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Request Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
