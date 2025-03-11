import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
      Loading...
    </p>
  );
  if (error) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#dc3545', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
      {error.message || error}
    </p>
  );

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 2rem',
        backgroundColor: '#f5f7fa',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#1a2e44',
          marginBottom: '3rem',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeIn 0.8s ease-in',
        }}
      >
        My Orders
        <span
          style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#ff4d87',
            borderRadius: '2px',
          }}
        />
      </h1>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p style={{ color: '#666', fontSize: '1.2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
          No orders found.
        </p>
      ) : Array.isArray(orders) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                animation: 'fadeIn 0.8s ease-in',
              }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              <h2
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#1a2e44',
                  marginBottom: '0.8rem',
                }}
              >
                Order #{order._id}
              </h2>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Total: <span style={{ color: '#2a5298', fontWeight: 500 }}>${order.total || 'N/A'}</span>
              </p>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                Status: <span style={{ color: '#2a5298', fontWeight: 500 }}>{order.status}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#dc3545', fontSize: '1.2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease-in' }}>
          Error: Orders data is not an array.
        </p>
      )}
    </div>
  );
};

export default OrdersPage;