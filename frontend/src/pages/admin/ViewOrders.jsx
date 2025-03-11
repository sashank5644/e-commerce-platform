import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../store/slices/orderSlice';

const ViewOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--dark)',
          marginBottom: '1.5rem',
        }}
      >
        View Orders
      </h1>
      {loading && <p style={{ color: 'var(--gray)' }}>Loading...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error.message}</p>}
      {orders.length === 0 ? (
        <p style={{ color: 'var(--gray)' }}>No orders found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              backgroundColor: 'var(--white)',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--dark)',
                    fontWeight: '600',
                  }}
                >
                  Order ID
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--dark)',
                    fontWeight: '600',
                  }}
                >
                  User
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--dark)',
                    fontWeight: '600',
                  }}
                >
                  Total
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--dark)',
                    fontWeight: '600',
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: 'var(--dark)',
                    fontWeight: '600',
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  style={{
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '1rem', color: 'var(--gray)' }}>{order._id}</td>
                  <td style={{ padding: '1rem', color: 'var(--gray)' }}>{order.userId}</td>
                  <td style={{ padding: '1rem', color: 'var(--gray)' }}>${order.total || 'N/A'}</td>
                  <td style={{ padding: '1rem', color: 'var(--gray)' }}>{order.status}</td>
                  <td style={{ padding: '1rem', color: 'var(--gray)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;