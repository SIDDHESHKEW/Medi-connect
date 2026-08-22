import React from 'react';
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Renders Availability status badge (Available, Low, Out)
 */
export const AvailabilityBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();

  if (norm === 'available') {
    return (
      <span className="badge badge-success">
        <span className="pulse-dot dot-available"></span>
        Available
      </span>
    );
  }
  if (norm === 'low') {
    return (
      <span className="badge badge-warning">
        <span className="pulse-dot dot-low"></span>
        Low Stock
      </span>
    );
  }
  return (
    <span className="badge badge-danger">
      <span className="pulse-dot dot-out"></span>
      Out of Stock
    </span>
  );
};

/**
 * Renders Freshness pill (Fresh / Aging / Stale)
 */
export const FreshnessBadge = ({ freshness, lastUpdated }) => {
  if (!freshness) return null;

  const { level, label, timeAgoStr } = freshness;

  let badgeClass = 'badge-success';
  if (level === 'aging') badgeClass = 'badge-warning';
  if (level === 'stale') badgeClass = 'badge-danger';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <span className={`badge ${badgeClass}`} title={freshness.description}>
        <Clock size={11} />
        {label}
      </span>
      <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
        Updated {timeAgoStr}
      </span>
    </div>
  );
};

/**
 * Renders Availability Confidence Rating
 */
export const ConfidenceBadge = ({ confidence }) => {
  if (!confidence) return null;

  const { rating, badgeClass, reason } = confidence;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        padding: '0.2rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: rating.includes('HIGH')
          ? 'var(--success-bg)'
          : rating.includes('MEDIUM')
          ? 'var(--warning-bg)'
          : 'var(--danger-bg)',
        color: rating.includes('HIGH')
          ? 'var(--success-text)'
          : rating.includes('MEDIUM')
          ? 'var(--warning-text)'
          : 'var(--danger-text)',
        border: `1px solid ${
          rating.includes('HIGH')
            ? 'var(--success-border)'
            : rating.includes('MEDIUM')
            ? 'var(--warning-border)'
            : 'var(--danger-border)'
        }`,
      }}
      title={reason}
    >
      <ShieldCheck size={12} />
      <span>{rating}</span>
    </div>
  );
};
