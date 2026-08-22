import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicinesApi } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { AvailabilityBadge, FreshnessBadge, ConfidenceBadge } from '../components/StatusBadge';
import { RequestModal } from '../components/RequestModal';
import { ReserveModal } from '../components/ReserveModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Pill, Store, ArrowLeft, Send, CalendarCheck2, ShieldCheck, Phone, MapPin } from 'lucide-react';

export const MedicineDetailPage = () => {
  const { id } = useParams();
  const { currentLocation } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRequestModal, setActiveRequestModal] = useState({ isOpen: false, pharmacy: null, medicine: null });
  const [activeReserveModal, setActiveReserveModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      try {
        const res = await medicinesApi.getById(id, {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        });
        setData(res.data);
      } catch (err) {
        setError('Failed to load medicine details');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id, currentLocation]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2>Medicine Not Found</h2>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  const { medicine, stockingPharmacies } = data;

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Link
          to="/search"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Search Results
        </Link>

        {/* Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-info" style={{ marginBottom: '0.5rem' }}>
                {medicine.category}
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{medicine.name}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                Generic Formulation: <strong>{medicine.genericName}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Dosage Form</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                {medicine.dosageForm} {medicine.strength && `(${medicine.strength})`}
              </div>
            </div>
          </div>

          {medicine.description && (
            <p style={{ marginTop: '1.25rem', color: 'var(--slate-600)', lineHeight: 1.6, borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
              {medicine.description}
            </p>
          )}

          {medicine.aliases && medicine.aliases.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              <span>Common Brand Aliases:</span>
              {medicine.aliases.map((alias) => (
                <span key={alias} style={{ background: 'var(--slate-100)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--slate-700)', fontWeight: 500 }}>
                  {alias}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nearby Pharmacies Section */}
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
          Nearby Stocking Pharmacies ({stockingPharmacies.length})
        </h2>

        {stockingPharmacies.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No registered pharmacies near your location currently have this listed in their inventory.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stockingPharmacies.map((pharm) => (
              <div key={pharm.pharmacyId} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <Link to={`/pharmacy/${pharm.pharmacyId}`} style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      {pharm.pharmacyName}
                    </Link>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-700)', background: 'var(--primary-50)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                      {pharm.distanceKm} km
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span>{pharm.pharmacyAddress}</span>
                    <span>&bull; {pharm.openingHours}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AvailabilityBadge status={pharm.status} />
                    <ConfidenceBadge confidence={pharm.confidence} />
                  </div>
                  <FreshnessBadge freshness={pharm.freshness} lastUpdated={pharm.lastUpdated} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveRequestModal({ isOpen: true, pharmacy: pharm, medicine })}
                  >
                    <Send size={14} /> Request Availability
                  </button>
                  {pharm.status !== 'out' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveReserveModal({ isOpen: true, pharmacy: pharm, medicine })}
                    >
                      <CalendarCheck2 size={14} /> Reserve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RequestModal
        isOpen={activeRequestModal.isOpen}
        onClose={() => setActiveRequestModal({ isOpen: false, pharmacy: null, medicine: null })}
        pharmacy={activeRequestModal.pharmacy}
        medicine={activeRequestModal.medicine}
      />

      <ReserveModal
        isOpen={activeReserveModal.isOpen}
        onClose={() => setActiveReserveModal({ isOpen: false, pharmacy: null, medicine: null })}
        pharmacy={activeReserveModal.pharmacy}
        medicine={activeReserveModal.medicine}
      />
    </div>
  );
};
