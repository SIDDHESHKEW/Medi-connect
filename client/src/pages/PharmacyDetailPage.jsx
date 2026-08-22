import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pharmaciesApi } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { AvailabilityBadge, FreshnessBadge, ConfidenceBadge } from '../components/StatusBadge';
import { RequestModal } from '../components/RequestModal';
import { ReserveModal } from '../components/ReserveModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Store, MapPin, Phone, Clock, ShieldCheck, ArrowLeft, Send, CalendarCheck2, Star, ThumbsUp } from 'lucide-react';

export const PharmacyDetailPage = () => {
  const { id } = useParams();
  const { currentLocation } = useLocation();
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRequestModal, setActiveRequestModal] = useState({ isOpen: false, pharmacy: null, medicine: null });
  const [activeReserveModal, setActiveReserveModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  useEffect(() => {
    const fetchPharmacy = async () => {
      setLoading(true);
      try {
        const res = await pharmaciesApi.getById(id, {
          lat: currentLocation.lat,
          lng: currentLocation.lng,
        });
        setPharmacy(res.data);
      } catch (err) {
        setError('Failed to load pharmacy');
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacy();
  }, [id, currentLocation]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2>Pharmacy Not Found</h2>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <Link
          to="/search"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)', marginBottom: '1.5rem', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} /> Back to Search Results
        </Link>

        {/* Pharmacy Profile Header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-700)' }}>
                <Store size={30} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <h1 style={{ fontSize: '1.75rem' }}>{pharmacy.name}</h1>
                  <span className="badge badge-success">
                    <ShieldCheck size={12} /> {pharmacy.verificationStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--slate-600)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--primary-600)" /> {pharmacy.address}, {pharmacy.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={14} color="var(--primary-600)" /> {pharmacy.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Distance & Badges */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                {pharmacy.distanceKm} km away
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <Clock size={13} /> {pharmacy.openingHours}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--success-text)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                <ThumbsUp size={12} /> {pharmacy.totalConfirmations || 0} community confirmations
              </div>
            </div>
          </div>
        </div>

        {/* Live Catalogue */}
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
          Medicine Stock &amp; Freshness ({pharmacy.inventory?.length || 0})
        </h2>

        {(!pharmacy.inventory || pharmacy.inventory.length === 0) ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
            No medicines listed by this pharmacy yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pharmacy.inventory.map((item) => (
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
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--slate-900)' }}>
                    {item.medicine.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Generic: {item.medicine.genericName} &bull; {item.medicine.category}
                  </div>
                  {item.unitPrice && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)', marginTop: '0.2rem' }}>
                      MRP: ₹{item.unitPrice}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AvailabilityBadge status={item.status} />
                    <ConfidenceBadge confidence={item.confidence} />
                  </div>
                  <FreshnessBadge freshness={item.freshness} lastUpdated={item.lastUpdated} />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveRequestModal({ isOpen: true, pharmacy, medicine: item.medicine })}
                  >
                    <Send size={14} /> Request Availability
                  </button>
                  {item.status !== 'out' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveReserveModal({ isOpen: true, pharmacy, medicine: item.medicine })}
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
