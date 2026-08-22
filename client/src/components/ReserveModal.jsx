import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../services/api';
import { CalendarCheck2, Store, Pill, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReserveModal = ({ isOpen, onClose, pharmacy, medicine, onSuccess }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !pharmacy || !medicine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to reserve medicine.' } });
      return;
    }

    if (!isCustomer) {
      error('Only customer accounts can reserve medicine.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await reservationsApi.create({
        pharmacyId: pharmacy.pharmacyId || pharmacy.id || pharmacy._id,
        medicineId: medicine._id || medicine.id,
        quantity: parseInt(quantity, 10),
      });

      success(res.message || 'Medicine reserved for pickup!');
      if (onSuccess) onSuccess(res.data);
      onClose();
      navigate('/reservations');
    } catch (err) {
      error(err.message || 'Failed to reserve medicine');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="card-header" style={{ background: 'var(--success-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck2 size={18} color="var(--success)" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--success-text)' }}>Reserve Medicine</h3>
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

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Quantity</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} color="var(--primary-600)" style={{ flexShrink: 0 }} />
              <span>
                Held for <strong>3 hours</strong>. Show the generated <strong>Pickup Code</strong> at the pharmacy counter.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Reserving...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
