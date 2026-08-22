import React, { useState, useEffect } from 'react';
import { medicinesApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Boxes, PlusCircle, Trash2, Edit2, Search, X, Pill } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminMedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Pain Relief & Fever');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [strength, setStrength] = useState('');
  const [description, setDescription] = useState('');
  const [aliases, setAliases] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const res = await medicinesApi.getAll();
      setMedicines(res.data || []);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const openCreateModal = () => {
    setEditingMed(null);
    setName('');
    setGenericName('');
    setCategory('Pain Relief & Fever');
    setDosageForm('Tablet');
    setStrength('');
    setDescription('');
    setAliases('');
    setIsModalOpen(true);
  };

  const openEditModal = (med) => {
    setEditingMed(med);
    setName(med.name || '');
    setGenericName(med.genericName || '');
    setCategory(med.category || 'Pain Relief & Fever');
    setDosageForm(med.dosageForm || 'Tablet');
    setStrength(med.strength || '');
    setDescription(med.description || '');
    setAliases(Array.isArray(med.aliases) ? med.aliases.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name,
        genericName,
        category,
        dosageForm,
        strength,
        description,
        aliases: aliases.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingMed) {
        await medicinesApi.update(editingMed._id || editingMed.id, payload);
        success('Medicine updated successfully!');
      } else {
        await medicinesApi.create(payload);
        success('Medicine created and added to global catalogue!');
      }
      setIsModalOpen(false);
      loadMedicines();
    } catch (err) {
      error(err.message || 'Failed to save medicine');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, medName) => {
    if (!window.confirm(`Delete "${medName}" from catalogue?`)) return;
    try {
      await medicinesApi.delete(id);
      success(`${medName} deleted`);
      setMedicines((prev) => prev.filter((m) => (m._id || m.id) !== id));
    } catch (err) {
      error(err.message || 'Failed to delete medicine');
    }
  };

  const filtered = medicines.filter((m) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.genericName?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>Global Medicine Catalogue</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Maintain verified brand names, active salt formulations, and dosage categories.
            </p>
          </div>

          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add New Medicine
          </button>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search catalogue by brand name, generic formulation, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((med) => (
              <div
                key={med._id || med.id}
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--slate-900)' }}>{med.name}</strong>
                    <span className="badge badge-info">{med.category}</span>
                    <span className="badge badge-neutral">{med.dosageForm}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                    Generic: <strong>{med.genericName}</strong> {med.strength && `• ${med.strength}`}
                  </div>
                  {med.aliases && med.aliases.length > 0 && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
                      Aliases: {med.aliases.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(med)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(med._id || med.id, med.name)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header" style={{ background: 'var(--slate-50)' }}>
              <h3 style={{ fontSize: '1.15rem' }}>
                {editingMed ? `Edit ${editingMed.name}` : 'Add New Medicine Formulation'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Brand Medicine Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Paracetamol 650"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Generic Active Chemical Formulation *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    placeholder="e.g. Acetaminophen 650mg"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    <label className="form-label">Dosage Form</label>
                    <select
                      className="form-select"
                      value={dosageForm}
                      onChange={(e) => setDosageForm(e.target.value)}
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Sachet">Sachet</option>
                      <option value="Injection">Injection</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Drops">Drops</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Strength / Concentration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    placeholder="e.g. 650 mg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Common Brand Aliases (Comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={aliases}
                    onChange={(e) => setAliases(e.target.value)}
                    placeholder="e.g. Dolo 650, Calpol 650, Crocin"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Clinical Purpose</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
