import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import {
  Users,
  Store,
  Boxes,
  ClipboardList,
  CalendarCheck2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Banner */}
        <div className="card" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--primary-200)', marginBottom: '0.5rem' }}>
                <ShieldCheck size={13} /> Platform Administrator Console
              </div>
              <h1 style={{ fontSize: '1.85rem', color: '#ffffff' }}>System Overview</h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                Monitoring pharmacies, medicines catalogue, users, and community availability reports.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <Activity size={16} color="var(--success)" />
              <span>Database Engine: <strong>{stats?.dbStatus?.type || 'In-Memory / MongoDB'}</strong></span>
            </div>
          </div>
        </div>

        {/* 6 Metric Grid */}
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
              <Users size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalUsers}</div>
              <div className="stat-lbl">Registered Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <Store size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalPharmacies}</div>
              <div className="stat-lbl">Registered Pharmacies</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7e22ce' }}>
              <Boxes size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalMedicines}</div>
              <div className="stat-lbl">Medicines in Catalogue</div>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fff7ed', color: '#ea580c' }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalRequests}</div>
              <div className="stat-lbl">Total Availability Inquiries</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)' }}>
              <CalendarCheck2 size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalReservations}</div>
              <div className="stat-lbl">Medicine Pickup Holds</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="stat-val">{loading ? '-' : stats?.totalReports}</div>
              <div className="stat-lbl">Community Verifications</div>
            </div>
          </div>
        </div>

        {/* Action Navigation Panels */}
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <Link to="/admin/pharmacies" className="card card-interactive" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-700)' }}>
                <Store size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Pharmacy Verification Manager</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Approve, review, or suspend participating pharmacies.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--slate-400)" />
          </Link>

          <Link to="/admin/medicines" className="card card-interactive" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce' }}>
                <Boxes size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Global Medicine Catalogue</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Manage brand medicines, salt formulations, and categories.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--slate-400)" />
          </Link>

          <Link to="/admin/users" className="card card-interactive" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-700)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>User Management</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  View customer and pharmacist accounts.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--slate-400)" />
          </Link>

          <Link to="/admin/reports" className="card card-interactive" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-text)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>Community Reports &amp; Feedback</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Review patient verification audits on stock accuracy.
                </p>
              </div>
            </div>
            <ArrowRight size={20} color="var(--slate-400)" />
          </Link>
        </div>
      </div>
    </div>
  );
};
