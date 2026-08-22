import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { medicinesApi } from '../services/api';
import { useLocation } from '../context/LocationContext';
import { Search, MapPin, Send, CalendarCheck2, Store, Pill, AlertCircle, Sparkles } from 'lucide-react';
import { RequestModal } from '../components/RequestModal';
import { ReserveModal } from '../components/ReserveModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const QUICK_MEDICINES = [
  'Paracetamol 650',
  'Cetirizine 10',
  'ORS',
  'Ibuprofen 400',
  'Azithromycin 500',
  'Pantoprazole 40',
];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || 'Paracetamol 650';
  const { currentLocation } = useLocation();

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [activeRequestModal, setActiveRequestModal] = useState({ isOpen: false, pharmacy: null, medicine: null });
  const [activeReserveModal, setActiveReserveModal] = useState({ isOpen: false, pharmacy: null, medicine: null });

  const performSearch = async (searchQuery) => {
    const q = searchQuery.trim() || 'Paracetamol 650';
    setLoading(true);
    try {
      const res = await medicinesApi.search({
        q,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
      setResults(res.data || []);
    } catch (err) {
      console.warn('API search fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(queryParam);
  }, [queryParam, currentLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handleChipClick = (medName) => {
    setQuery(medName);
    setSearchParams({ q: medName });
  };

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', minHeight: '85vh', padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Search Header Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--slate-200)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={18}
                color="var(--slate-400)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem', height: '44px', fontSize: '0.95rem' }}
                placeholder="Search medicine (e.g. Paracetamol 650, ORS)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 1.25rem' }}>
              Search
            </button>
          </form>

          {/* Quick Filter Chips & Location */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: 'var(--slate-600)' }}>Try:</span>
              {QUICK_MEDICINES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleChipClick(m)}
                  style={{
                    background: query.toLowerCase() === m.toLowerCase() ? 'var(--primary-100)' : 'var(--slate-100)',
                    color: query.toLowerCase() === m.toLowerCase() ? 'var(--primary-800)' : 'var(--slate-700)',
                    border: '1px solid var(--slate-200)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={13} color="var(--primary-600)" />
              <span>{currentLocation.label.replace(' (Default Demo)', '')}</span>
            </div>
          </div>
        </div>

        {/* Results Title */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
            Nearby Pharmacies for <span style={{ color: 'var(--primary-700)' }}>"{queryParam}"</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {results.length > 0 ? `${results[0]?.pharmacies?.length || 0} stores found` : ''}
          </span>
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton count={3} />}

        {/* Results List */}
        {!loading && results.map(({ medicine, pharmacies }) => (
          <div key={medicine._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pharmacies.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                No nearby pharmacies currently stock {medicine.name}.
              </div>
            ) : (
              pharmacies.map((pharm) => {
                const isAvailable = pharm.status === 'available';
                const isLow = pharm.status === 'low';
                const isOut = pharm.status === 'out';

                return (
                  <div
                    key={pharm.pharmacyId}
                    className="card"
                    style={{
                      padding: '1.15rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft: `4px solid ${
                        isAvailable ? 'var(--success)' : isLow ? 'var(--warning)' : 'var(--danger)'
                      }`,
                    }}
                  >
                    {/* Pharmacy Info & Distance */}
                    <div style={{ flex: '1 1 240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <Store size={16} color="var(--primary-600)" />
                        <strong style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                          {pharm.pharmacyName}
                        </strong>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                          {pharm.distanceKm} km
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                        {pharm.pharmacyAddress} &bull; {pharm.openingHours}
                      </div>
                    </div>

                    {/* Stock Status & Freshness */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem', minWidth: '120px' }}>
                      <span
                        className={`badge ${
                          isAvailable ? 'badge-success' : isLow ? 'badge-warning' : 'badge-danger'
                        }`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        {isAvailable ? '● AVAILABLE' : isLow ? '▲ LOW STOCK' : '✕ OUT OF STOCK'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                        Updated {pharm.freshness?.timeAgoStr || 'recently'}
                      </span>
                    </div>

                    {/* 1-Click Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!isOut && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setActiveRequestModal({ isOpen: true, pharmacy: pharm, medicine })}
                          title="Ask pharmacist to verify physical stock on counter"
                        >
                          <Send size={13} /> Request Availability
                        </button>
                      )}

                      {isAvailable && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveReserveModal({ isOpen: true, pharmacy: pharm, medicine })}
                          title="Reserve for store pickup"
                        >
                          <CalendarCheck2 size={13} /> Reserve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      {/* Popups */}
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
