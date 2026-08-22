import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { inventoryApi } from '../services/api';
import { PlusCircle, ArrowLeft, Pill, CheckCircle2, AlertTriangle, XCircle, Save } from 'lucide-react';

export const PharmacyAddMedicinePage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Pain Relief & Fever');
  const [status, setStatus] = useState('available');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName.trim()) {
      error('Please enter a medicine name');
      return;
    }

    try {
      setSubmitting(true);
      await inventoryApi.addItem({
        pharmacyId: user?.pharmacy || 'pharm_1',
        medicineName: medicineName.trim(),
        genericName: genericName.trim() || medicineName.trim(),
        category,
        status,
        quantity: quantity ? parseInt(quantity, 10) : null,
        unitPrice: unitPrice ? parseFloat(unitPrice) : null,
        notes,
      });

      success(`${medicineName} added to your inventory!`);
      navigate('/pharmacy/inventory');
    } catch (err) {
      error(err.message || 'Failed to add medicine to inventory');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <Link
          to="/pharmacy/inventory"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Inventory
        </Link>

        <div className="card">
          <div className="card-header" style={{ background: 'var(--primary-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <PlusCircle size={18} color="var(--primary-600)" />
              <h2 style={{ fontSize: '1.25rem' }}>Add Medicine to Inventory</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Medicine Brand Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Paracetamol 650, Dolo 650, Azee 500"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Generic Formulation Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acetaminophen 650mg, Azithromycin 500mg"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                />
                <p className="form-hint">Enables patients searching by salt formulation to discover your pharmacy.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Pain Relief & Fever">Pain Relief &amp; Fever</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Allergy & Respiratory">Allergy &amp; Respiratory</option>
                  <option value="First Aid & Rehydration">First Aid &amp; Rehydration</option>
                  <option value="Gastrointestinal">Gastrointestinal</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="General Healthcare">General Healthcare</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Availability Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStatus('available')}
                    className={`btn ${status === 'available' ? 'btn-success' : 'btn-secondary'}`}
                  >
                    <CheckCircle2 size={15} /> Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('low')}
                    className={`btn ${status === 'low' ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    <AlertTriangle size={15} /> Low Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('out')}
                    className={`btn ${status === 'out' ? 'btn-danger' : 'btn-secondary'}`}
                  >
                    <XCircle size={15} /> Out of Stock
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Quantity in Stock (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="form-hint">Optional for quick pharmacy updates.</p>
                </div>

                <div className="form-group">
                  <label className="form-label">MRP (₹ per unit/strip) (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 32"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Shelf / Counter Location Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rack B, Section 2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Link to="/pharmacy/inventory" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Save size={16} /> {submitting ? 'Saving Item...' : 'Save to Inventory'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
