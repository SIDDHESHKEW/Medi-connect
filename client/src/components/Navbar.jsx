import React from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  Activity,
  Search,
  Store,
  User,
  LogOut,
  MapPin,
  ClipboardList,
  CalendarCheck2,
  Boxes,
  Bell,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isPharmacist, logout } = useAuth();
  const { currentLocation, requestBrowserLocation } = useLocation();
  const navigate = useNavigate();
  const routeLoc = useRouteLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="brand-icon-wrap" style={{ width: '34px', height: '34px', borderRadius: '8px' }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
            </span>
          </div>
        </Link>

        {/* Location Indicator (Subtle & Clean) */}
        {!isPharmacist && (
          <button
            onClick={requestBrowserLocation}
            title="Click to detect GPS location"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '0.3rem 0.7rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--slate-100)',
              border: '1px solid var(--slate-200)',
              cursor: 'pointer',
              color: 'var(--slate-700)',
            }}
          >
            <MapPin size={13} color="var(--primary-600)" />
            <span>{currentLocation.label.replace(' (Default Demo)', '')}</span>
          </button>
        )}

        {/* Dynamic Navigation */}
        <nav>
          <ul className="nav-links">
            {/* Public Links */}
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/search"
                    className={`nav-link ${routeLoc.pathname === '/search' ? 'active' : ''}`}
                  >
                    <Search size={15} style={{ display: 'inline', marginRight: '4px' }} /> Search
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Customer Navigation */}
            {isAuthenticated && isCustomer && (
              <>
                <li>
                  <Link
                    to="/search"
                    className={`nav-link ${routeLoc.pathname === '/search' ? 'active' : ''}`}
                  >
                    <Search size={15} style={{ display: 'inline', marginRight: '4px' }} /> Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className={`nav-link ${routeLoc.pathname === '/requests' ? 'active' : ''}`}
                  >
                    <ClipboardList size={15} style={{ display: 'inline', marginRight: '4px' }} /> My Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reservations"
                    className={`nav-link ${routeLoc.pathname === '/reservations' ? 'active' : ''}`}
                  >
                    <CalendarCheck2 size={15} style={{ display: 'inline', marginRight: '4px' }} /> Reservations
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
                  <span className="badge badge-info" style={{ textTransform: 'none', fontWeight: 600 }}>
                    <User size={12} /> {user.name.split(' ')[0]}
                  </span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: '0.35rem 0.6rem' }}>
                    <LogOut size={14} />
                  </button>
                </li>
              </>
            )}

            {/* Pharmacist Navigation */}
            {isAuthenticated && isPharmacist && (
              <>
                <li>
                  <Link
                    to="/pharmacy/dashboard"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/dashboard' ? 'active' : ''}`}
                    style={{ fontWeight: 600 }}
                  >
                    <Bell size={15} style={{ display: 'inline', marginRight: '4px', color: 'var(--primary-600)' }} /> Requests Queue
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pharmacy/inventory"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/inventory' ? 'active' : ''}`}
                  >
                    <Boxes size={15} style={{ display: 'inline', marginRight: '4px' }} /> Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pharmacy/reservations"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/reservations' ? 'active' : ''}`}
                  >
                    <CalendarCheck2 size={15} style={{ display: 'inline', marginRight: '4px' }} /> Pickups
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
                  <span className="badge badge-success" style={{ textTransform: 'none', fontWeight: 600 }}>
                    <Store size={12} /> Pharmacist
                  </span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: '0.35rem 0.6rem' }}>
                    <LogOut size={14} />
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
