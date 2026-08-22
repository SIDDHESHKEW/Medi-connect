import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

const DEFAULT_LOCATIONS = [
  { label: 'MP Nagar, Bhopal', lat: 23.2332, lng: 77.4338 },
  { label: 'Arera Colony, Bhopal', lat: 23.2135, lng: 77.4265 },
  { label: 'New Market, Bhopal', lat: 23.2422, lng: 77.3995 },
  { label: 'Kolar Road, Bhopal', lat: 23.1780, lng: 77.4150 },
  { label: 'Hoshangabad Road, Bhopal', lat: 23.1950, lng: 77.4480 },
];

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    label: 'MP Nagar, Bhopal',
    lat: 23.2332,
    lng: 77.4338,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCurrentLocation({
          label: 'Current GPS Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error / permission denied:', err.message);
        setLocationError('Using demo default location (MP Nagar, Bhopal).');
      },
      { timeout: 8000 }
    );
  };

  const setManualLocation = (loc) => {
    setCurrentLocation(loc);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocating,
        locationError,
        requestBrowserLocation,
        setManualLocation,
        presetLocations: DEFAULT_LOCATIONS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
