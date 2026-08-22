import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonLoading 1.5s infinite',
            borderRadius: 'var(--radius-md)',
            height: type === 'stat' ? '90px' : type === 'pill' ? '32px' : '140px',
          }}
        />
      ))}
      <style>{`
        @keyframes skeletonLoading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction }) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--slate-300)',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--slate-500)',
          }}
        >
          <Icon size={26} />
        </div>
      )}
      <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
