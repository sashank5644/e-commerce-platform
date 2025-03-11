import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        display: 'flex',
        gap: '1.5rem',
      }}
    >
      <aside
        style={{
          width: '250px',
          backgroundColor: 'var(--white)',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--dark)',
            marginBottom: '1rem',
          }}
        >
          Admin Menu
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link
            to="/admin/products"
            style={{
              color: 'var(--gray)',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--gray)')}
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            style={{
              color: 'var(--gray)',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--gray)')}
          >
            View Orders
          </Link>
        </nav>
      </aside>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;