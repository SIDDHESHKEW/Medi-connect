import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

const DEFAULT_LOCATIONS = [
  { label: 'Bandra West, Mumbai (Default Demo)', lat: 19.0596, lng: 72.8350 },
  { label: 'Khar West, Mumbai', lat: 19.0680, lng: 72.8310 },
  { label: 'Santacruz West, Mumbai', lat: 19.0810, lng: 72.8380 },
  { label: 'BKC / Kurla, Mumbai', lat: 19.0674, lng: 72.8656 },
  { label: 'Andheri West, Mumbai', lat: 19.1197, lng: 72.8464 },
];

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    label: 'Bandra West, Mumbai',
    lat: 19.0596,
    lng: 72.8350,
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
          label: 'Your Current Location (GPS)',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error / permission denied:', err.message);
        setLocationError('Using demo default location (Bandra West). You can switch below.');
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
