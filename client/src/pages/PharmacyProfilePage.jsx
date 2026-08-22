import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { pharmaciesApi } from '../services/api';
import { Store, Phone, MapPin, Clock, Save, ShieldCheck } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const PharmacyProfilePage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [pharmacy, setPharmacy] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 10:00 PM');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const pharmacyId = user?.pharmacy || 'pharm_1';

  useEffect(() => {
    const loadPharmacy = async () => {
      try {
        setLoading(true);
        const res = await pharmaciesApi.getById(pharmacyId);
        const p = res.data;
        setPharmacy(p);
        setName(p.name || '');
        setPhone(p.phone || '');
        setAddress(p.address || '');
        setCity(p.city || 'Mumbai');
        setOpeningHours(p.openingHours || '8:00 AM - 10:00 PM');
        if (p.location?.coordinates) {
          setLongitude(p.location.coordinates[0]);
          setLatitude(p.location.coordinates[1]);
        }
      } catch (err) {
        console.error('Failed to load pharmacy profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPharmacy();
  }, [pharmacyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await pharmaciesApi.update(pharmacyId, {
        name,
        phone,
        address,
        city,
        openingHours,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      success('Pharmacy profile details updated successfully!');
    } catch (err) {
      error(err.message || 'Failed to update pharmacy profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '680px' }}>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem' }}>Pharmacy Store Profile</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Configure your store address, phone, opening hours, and GPS coordinates for distance calculation.
          </p>
        </div>

        <div className="card">
          <div className="card-header" style={{ background: 'var(--slate-50)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
              <Store size={18} color="var(--primary-600)" />
              <span>Store Configuration</span>
            </div>
            <span className="badge badge-success">
              <ShieldCheck size={12} /> {pharmacy?.verificationStatus || 'Verified'}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Pharmacy Trade Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Opening Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Physical Address</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--slate-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
                  <MapPin size={14} color="var(--primary-600)" /> Geographic Coordinates (For Distance Calculation)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      className="form-input"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
