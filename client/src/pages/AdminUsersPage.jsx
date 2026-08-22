import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { success, error } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (userId) => {
    try {
      const res = await adminApi.toggleUser(userId);
      success(res.message || 'User status updated');
      loadUsers();
    } catch (err) {
      error(err.message || 'Failed to toggle status');
    }
  };

  const filtered = users.filter((u) => {
    if (!query.trim()) return true;
    return (
      u.name?.toLowerCase().includes(query.toLowerCase()) ||
      u.email?.toLowerCase().includes(query.toLowerCase()) ||
      u.role?.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="main-content" style={{ backgroundColor: 'var(--slate-50)', padding: '2rem 0 4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem' }}>User Accounts Management</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Overview of registered customers, pharmacists, and system administrators.
          </p>
        </div>

        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search user name, email or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((u) => (
              <div
                key={u._id || u.id}
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>{u.name}</strong>
                    <span className={`badge ${u.role === 'admin' ? 'badge-neutral' : u.role === 'pharmacist' ? 'badge-info' : 'badge-success'}`}>
                      {u.role?.toUpperCase()}
                    </span>
                    {u.isActive === false && <span className="badge badge-danger">SUSPENDED</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                    {u.email} &bull; {u.phone} {u.city && `• ${u.city}`}
                  </div>
                </div>

                <div>
                  {u.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleToggle(u._id || u.id)}
                      className={`btn btn-sm ${u.isActive === false ? 'btn-success' : 'btn-secondary'}`}
                      style={{ color: u.isActive === false ? 'white' : 'var(--danger)' }}
                    >
                      {u.isActive === false ? 'Reactivate Account' : 'Suspend Account'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
