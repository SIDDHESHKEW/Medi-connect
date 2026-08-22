import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reservationsApi } from '../services/api';
import { CalendarCheck2, Store, Pill, X, Clock, ShieldAlert } from 'lucide-react';
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
      error('Only customers can reserve medicine.');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarCheck2 size={18} color="var(--success)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--success-text)' }}>Reserve for Physical Pickup</h3>
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
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <Store size={14} />
                <span>{pharmacy.pharmacyName || pharmacy.name}</span>
                {pharmacy.pharmacyAddress && <span>&bull; {pharmacy.pharmacyAddress}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity Required (Packs/Strips)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
              <p className="form-hint">Physical pickup hold is held for 3 hours from confirmation.</p>
            </div>

            <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-md)', padding: '0.85rem', fontSize: '0.825rem', color: 'var(--primary-900)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                <Clock size={15} color="var(--primary-600)" />
                <span>3-Hour Hold Guarantee</span>
              </div>
              <p>
                A unique <strong>Pickup Code</strong> will be generated. Simply show the code at the pharmacy counter to collect and pay directly at the store.
              </p>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              <ShieldAlert size={14} />
              <span>Physical store pickup only &bull; No online delivery or digital prepayment.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? 'Generating Reservation...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
