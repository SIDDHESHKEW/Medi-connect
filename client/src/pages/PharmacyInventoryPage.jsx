import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { inventoryApi } from '../services/api';
import { AvailabilityBadge, FreshnessBadge } from '../components/StatusBadge';
import { LoadingSkeleton, EmptyState } from '../components/LoadingSkeleton';
import {
  Boxes,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Trash2,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const PharmacyInventoryPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [inventory, setInventory] = useState([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const pharmacyId = user?.pharmacy || 'pharm_1';

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getByPharmacy(pharmacyId);
      setInventory(res.data || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [pharmacyId]);

  // Instant 1-tap status update
  const handleQuickStatusChange = async (itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await inventoryApi.updateStatus(itemId, { status: newStatus });
      success(`Updated to ${newStatus.toUpperCase()} in real time!`);

      // Update state in place
      setInventory((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status: newStatus,
                lastUpdated: new Date().toISOString(),
                freshness: {
                  level: 'fresh',
                  label: 'Fresh',
                  timeAgoStr: 'Just now',
                  description: 'Recently updated by pharmacist',
                },
              }
            : item
        )
      );
    } catch (err) {
      error(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (itemId, name) => {
    if (!window.confirm(`Remove ${name} from your pharmacy inventory?`)) return;
    try {
      await inventoryApi.removeItem(itemId);
      success(`${name} removed from inventory`);
      setInventory((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      error(err.message || 'Failed to remove medicine');
    }
  };

  const filteredItems = inventory.filter((item) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const nameMatch = item.medicine?.name?.toLowerCase().includes(q);
    const genericMatch = item.medicine?.genericName?.toLowerCase().includes(q);
    return nameMatch || genericMatch;
  });

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              <Sparkles size={13} /> Update Medicine Availability in Seconds
            </div>
            <h1 style={{ fontSize: '1.75rem' }}>Pharmacy Inventory Manager</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Keep availability fresh with 1-tap buttons so patients don't travel needlessly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={loadInventory} className="btn btn-secondary btn-sm" title="Refresh list">
              <RefreshCw size={15} />
            </button>
            <Link to="/pharmacy/inventory/add" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Add Medicine
            </Link>
          </div>
        </div>

        {/* Filter Search Bar */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Filter your inventory (e.g. Paracetamol, Dolo, Azithromycin)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title={filterQuery ? 'No matching medicines' : 'Your inventory is empty'}
            description="Add medicines that your pharmacy regularly stocks, and keep their status updated with single clicks."
            actionText="Add Medicine to Inventory"
            onAction={() => window.location.assign('/pharmacy/inventory/add')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredItems.map((item) => {
              const isUpdating = updatingId === item.id;

              return (
                <div
                  key={item.id}
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
                  {/* Medicine Info */}
                  <div style={{ flex: '1 1 260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>
                        {item.medicine?.name}
                      </strong>
                      <span className="badge badge-neutral">{item.medicine?.category}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      Generic: <strong>{item.medicine?.genericName}</strong>
                      {item.medicine?.strength && ` • ${item.medicine?.strength}`}
                    </div>
                    {item.notes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                        Note: {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Current Freshness Badge */}
                  <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <AvailabilityBadge status={item.status} />
                    <FreshnessBadge freshness={item.freshness} lastUpdated={item.lastUpdated} />
                  </div>

                  {/* 1-Tap Quick Availability Switcher */}
                  <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--slate-100)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleQuickStatusChange(item.id, 'available')}
                      className={`btn btn-sm ${item.status === 'available' ? 'btn-success' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                    >
                      <CheckCircle2 size={13} /> Available
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleQuickStatusChange(item.id, 'low')}
                      className={`btn btn-sm ${item.status === 'low' ? 'btn-warning' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                    >
                      <AlertTriangle size={13} /> Low Stock
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleQuickStatusChange(item.id, 'out')}
                      className={`btn btn-sm ${item.status === 'out' ? 'btn-danger' : 'btn-secondary'}`}
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                    >
                      <XCircle size={13} /> Out of Stock
                    </button>
                  </div>

                  {/* Delete Action */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id, item.medicine?.name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', padding: '0.4rem' }}
                    title="Remove from inventory"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
