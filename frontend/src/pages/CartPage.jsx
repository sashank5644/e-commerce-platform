import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, clearCart, resetCartError } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1a2e44', marginBottom: '2rem', textAlign: 'center' }}>
          Your Cart
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
          Please <Link to="/login" style={{ color: '#2a5298', textDecoration: 'underline', fontWeight: 500 }}>log in</Link> to view your cart.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem', backgroundColor: '#f5f7fa' }}>
      <h2
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
        Your Cart
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
      </h2>

      {loading && (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
          Loading...
        </p>
      )}
      {error && (
        <p style={{ textAlign: 'center', color: '#dc3545', marginBottom: '1.5rem', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
          {error.message || 'An error occurred'}
          <button
            onClick={() => dispatch(resetCartError())}
            style={{ marginLeft: '1rem', color: '#2a5298', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            Dismiss
          </button>
        </p>
      )}

      {!loading && !cart?.items?.length && (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
          Your cart is empty.{' '}
          <Link to="/" style={{ color: '#2a5298', textDecoration: 'underline', fontWeight: 500 }}>
            Continue shopping
          </Link>.
        </p>
      )}

      {cart?.items?.length > 0 && (
        <>
          <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
            {cart.items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  transition: 'transform 0.3s ease',
                  animation: 'fadeIn 0.8s ease-in',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
              >
                <img
                  src={item.image || 'https://placehold.co/100x100'}
                  alt={item.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginRight: '2rem',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 600,
                      color: '#1a2e44',
                      marginBottom: '0.8rem',
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '1.1rem',
                      color: '#2a5298',
                      marginBottom: '1rem',
                      fontWeight: 500,
                    }}
                  >
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: item.quantity <= 1 ? '#d1d5db' : '#b0b9c6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        if (item.quantity > 1) e.target.style.backgroundColor = '#9ca3af';
                      }}
                      onMouseLeave={(e) => {
                        if (item.quantity > 1) e.target.style.backgroundColor = '#b0b9c6';
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.1rem', color: '#1a2e44', fontWeight: 500 }}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: '#2a5298',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = '#1e3c72')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = '#2a5298')}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      style={{
                        padding: '0.4rem 1rem',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        fontSize: '1rem',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#b02a37';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'right', marginBottom: '3rem' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1a2e44', marginBottom: '0.5rem' }}>
              Subtotal: ${cart.totalAmount.toFixed(2)}
            </p>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1.5rem' }}>
              Taxes and shipping will be calculated at checkout.
            </p>
            <button
              onClick={handleClearCart}
              style={{
                padding: '0.8rem 2.5rem',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                marginRight: '1.5rem',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b02a37';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              style={{
                display: 'inline-block',
                padding: '0.8rem 2.5rem',
                background: 'linear-gradient(90deg, #2a5298, #1e3c72)',
                color: '#ffffff',
                borderRadius: '25px',
                fontWeight: 600,
                fontSize: '1.1rem',
                textDecoration: 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;