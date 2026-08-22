import React from 'react';
import { Link, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  Activity,
  Search,
  Store,
  ShieldCheck,
  User,
  LogOut,
  MapPin,
  ClipboardList,
  CalendarCheck2,
  Boxes,
  PlusCircle,
  BarChart3,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isPharmacist, isAdmin, logout } = useAuth();
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
        <Link to="/" className="nav-brand">
          <div className="brand-icon-wrap">
            <Activity size={22} />
          </div>
          <div>
            <span>Medi<span style={{ color: 'var(--primary-600)' }}>Connect</span></span>
            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--slate-500)', letterSpacing: '0.04em' }}>
              LAST-MILE MEDICINE ACCESS
            </span>
          </div>
        </Link>

        {/* Location chip (Customer/Public) */}
        {!isPharmacist && !isAdmin && (
          <button
            onClick={requestBrowserLocation}
            title="Click to detect current GPS location"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--slate-100)',
              border: '1px solid var(--slate-200)',
              cursor: 'pointer',
              color: 'var(--slate-700)',
            }}
          >
            <MapPin size={14} color="var(--primary-600)" />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentLocation.label}
            </span>
          </button>
        )}

        {/* Dynamic Navigation Links by Role */}
        <nav>
          <ul className="nav-links">
            {/* Public Links */}
            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/search"
                    className={`nav-link ${routeLoc.pathname === '/search' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Search size={16} /> Search Medicine
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
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Search size={16} /> Search
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className={`nav-link ${routeLoc.pathname === '/dashboard' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <BarChart3 size={16} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className={`nav-link ${routeLoc.pathname === '/requests' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <ClipboardList size={16} /> Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reservations"
                    className={`nav-link ${routeLoc.pathname === '/reservations' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <CalendarCheck2 size={16} /> Reservations
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <Link
                    to="/profile"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <User size={15} /> {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                    <LogOut size={15} />
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
                  >
                    <BarChart3 size={16} style={{ display: 'inline', marginRight: '4px' }} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pharmacy/inventory"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/inventory' ? 'active' : ''}`}
                  >
                    <Boxes size={16} style={{ display: 'inline', marginRight: '4px' }} /> Inventory
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pharmacy/requests"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/requests' ? 'active' : ''}`}
                  >
                    <ClipboardList size={16} style={{ display: 'inline', marginRight: '4px' }} /> Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pharmacy/reservations"
                    className={`nav-link ${routeLoc.pathname === '/pharmacy/reservations' ? 'active' : ''}`}
                  >
                    <CalendarCheck2 size={16} style={{ display: 'inline', marginRight: '4px' }} /> Pickups
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <Link
                    to="/pharmacy/profile"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Store size={15} /> Pharmacy
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                    <LogOut size={15} />
                  </button>
                </li>
              </>
            )}

            {/* Admin Navigation */}
            {isAuthenticated && isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link ${routeLoc.pathname === '/admin/dashboard' ? 'active' : ''}`}
                  >
                    <BarChart3 size={16} style={{ display: 'inline', marginRight: '4px' }} /> Admin Stats
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/pharmacies"
                    className={`nav-link ${routeLoc.pathname === '/admin/pharmacies' ? 'active' : ''}`}
                  >
                    <Store size={16} style={{ display: 'inline', marginRight: '4px' }} /> Pharmacies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/medicines"
                    className={`nav-link ${routeLoc.pathname === '/admin/medicines' ? 'active' : ''}`}
                  >
                    <Boxes size={16} style={{ display: 'inline', marginRight: '4px' }} /> Medicines
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/reports"
                    className={`nav-link ${routeLoc.pathname === '/admin/reports' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} /> Reports
                  </Link>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                    <LogOut size={15} /> Admin Logout
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
