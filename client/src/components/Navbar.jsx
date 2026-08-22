import React, { useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isPharmacist, logout } = useAuth();
  const { currentLocation, requestBrowserLocation } = useLocation();
  const navigate = useNavigate();
  const routeLoc = useRouteLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="brand-icon-wrap" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
            <Activity size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
              Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span>
            </span>
          </div>
        </Link>

        {/* Right Section: Location + Desktop Nav + Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Location Indicator (Subtle) */}
          {!isPharmacist && (
            <button
              onClick={requestBrowserLocation}
              title="Click to detect GPS location"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--slate-100)',
                border: '1px solid var(--slate-200)',
                cursor: 'pointer',
                color: 'var(--slate-700)',
              }}
            >
              <MapPin size={12} color="var(--primary-600)" />
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentLocation.label.replace(' (Default Demo)', '')}
              </span>
            </button>
          )}

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {/* Public Links */}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/search" className={`nav-link ${routeLoc.pathname === '/search' ? 'active' : ''}`}>
                      <Search size={14} style={{ display: 'inline', marginRight: '4px' }} /> Search
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
                    <Link to="/search" className={`nav-link ${routeLoc.pathname === '/search' ? 'active' : ''}`}>
                      <Search size={14} style={{ display: 'inline', marginRight: '4px' }} /> Search
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests" className={`nav-link ${routeLoc.pathname === '/requests' ? 'active' : ''}`}>
                      <ClipboardList size={14} style={{ display: 'inline', marginRight: '4px' }} /> My Requests
                    </Link>
                  </li>
                  <li>
                    <Link to="/reservations" className={`nav-link ${routeLoc.pathname === '/reservations' ? 'active' : ''}`}>
                      <CalendarCheck2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Reservations
                    </Link>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.25rem' }}>
                    <span className="badge badge-info" style={{ textTransform: 'none', fontWeight: 600 }}>
                      <User size={12} /> {user.name.split(' ')[0]}
                    </span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: '0.3rem 0.5rem' }}>
                      <LogOut size={13} />
                    </button>
                  </li>
                </>
              )}

              {/* Pharmacist Navigation */}
              {isAuthenticated && isPharmacist && (
                <>
                  <li>
                    <Link to="/pharmacy/dashboard" className={`nav-link ${routeLoc.pathname === '/pharmacy/dashboard' ? 'active' : ''}`} style={{ fontWeight: 600 }}>
                      <Bell size={14} style={{ display: 'inline', marginRight: '4px', color: 'var(--primary-600)' }} /> Requests Queue
                    </Link>
                  </li>
                  <li>
                    <Link to="/pharmacy/inventory" className={`nav-link ${routeLoc.pathname === '/pharmacy/inventory' ? 'active' : ''}`}>
                      <Boxes size={14} style={{ display: 'inline', marginRight: '4px' }} /> Inventory
                    </Link>
                  </li>
                  <li>
                    <Link to="/pharmacy/reservations" className={`nav-link ${routeLoc.pathname === '/pharmacy/reservations' ? 'active' : ''}`}>
                      <CalendarCheck2 size={14} style={{ display: 'inline', marginRight: '4px' }} /> Pickups
                    </Link>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.25rem' }}>
                    <span className="badge badge-success" style={{ textTransform: 'none', fontWeight: 600 }}>
                      <Store size={12} /> Pharmacist
                    </span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out" style={{ padding: '0.3rem 0.5rem' }}>
                      <LogOut size={13} />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/search" onClick={closeMobileMenu} className="mobile-nav-link">
                    <Search size={16} /> Search Medicine
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={closeMobileMenu} className="btn btn-secondary btn-block">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/register" onClick={closeMobileMenu} className="btn btn-primary btn-block">
                    Register
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && isCustomer && (
              <>
                <li style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--primary-50)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Logged in as:</div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--primary-900)' }}>{user.name}</strong>
                </li>
                <li>
                  <Link to="/search" onClick={closeMobileMenu} className="mobile-nav-link">
                    <Search size={16} /> Search Medicine
                  </Link>
                </li>
                <li>
                  <Link to="/requests" onClick={closeMobileMenu} className="mobile-nav-link">
                    <ClipboardList size={16} /> My Requests
                  </Link>
                </li>
                <li>
                  <Link to="/reservations" onClick={closeMobileMenu} className="mobile-nav-link">
                    <CalendarCheck2 size={16} /> My Reservations
                  </Link>
                </li>
                <li style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--slate-200)' }}>
                  <button onClick={handleLogout} className="btn btn-danger btn-block btn-sm">
                    <LogOut size={14} /> Log Out
                  </button>
                </li>
              </>
            )}

            {isAuthenticated && isPharmacist && (
              <>
                <li style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>Pharmacist:</div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--success-text)' }}>{user.pharmacyName || user.name}</strong>
                </li>
                <li>
                  <Link to="/pharmacy/dashboard" onClick={closeMobileMenu} className="mobile-nav-link">
                    <Bell size={16} /> Live Requests Queue
                  </Link>
                </li>
                <li>
                  <Link to="/pharmacy/inventory" onClick={closeMobileMenu} className="mobile-nav-link">
                    <Boxes size={16} /> 1-Tap Inventory
                  </Link>
                </li>
                <li>
                  <Link to="/pharmacy/reservations" onClick={closeMobileMenu} className="mobile-nav-link">
                    <CalendarCheck2 size={16} /> Pickups
                  </Link>
                </li>
                <li style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--slate-200)' }}>
                  <button onClick={handleLogout} className="btn btn-danger btn-block btn-sm">
                    <LogOut size={14} /> Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};
