import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { reportsApi } from '../services/api';
import { ThumbsUp, ThumbsDown, X, MessageSquare, ShieldCheck } from 'lucide-react';

export const FeedbackModal = ({ isOpen, onClose, reservation, onSuccess }) => {
  const { success, error } = useToast();
  const [result, setResult] = useState('available');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await reportsApi.create({
        pharmacyId: reservation.pharmacy._id || reservation.pharmacy.id,
        medicineId: reservation.medicine._id || reservation.medicine.id,
        result,
        comment,
      });

      success('Thank you for community feedback! It helps thousands of others find medicines accurately.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header" style={{ background: 'var(--slate-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1.1rem' }}>Community Availability Feedback</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Did you find <strong>{reservation.medicine.name}</strong> physically available at <strong>{reservation.pharmacy.name}</strong> upon your visit?
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`btn btn-block ${result === 'available' ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => setResult('available')}
                style={{ padding: '1rem' }}
              >
                <ThumbsUp size={18} /> Yes, Available!
              </button>
              <button
                type="button"
                className={`btn btn-block ${result === 'unavailable' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setResult('unavailable')}
                style={{ padding: '1rem' }}
              >
                <ThumbsDown size={18} /> No, Unavailable
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Optional Comments</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="E.g. Great staff, got my medicine in 2 minutes"
              />
            </div>
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Skip
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
