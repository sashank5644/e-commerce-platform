import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../store/slices/orderSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'credit_card',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, addressLine1, city, state, postalCode, phone, paymentMethod } = formData;
    if (!fullName || !addressLine1 || !city || !state || !postalCode || !phone || !paymentMethod) {
      alert('Please fill in all fields');
      return;
    }

    const shippingAddress = { fullName, addressLine1, city, state, postalCode, phone };
    try {
      await dispatch(createOrder({ shippingAddress, paymentMethod })).unwrap();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to place order: ' + (error.message || 'Unknown error'));
    }
  };

  const total = cart?.totalAmount || 0;

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
        Checkout
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.8s ease-in',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1a2e44',
              marginBottom: '1.5rem',
            }}
          >
            Billing Information
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  backgroundColor: '#ffffff',
                  color: '#1a2e44',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2a5298';
                  e.target.style.boxShadow = '0 0 5px rgba(42, 82, 152, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'inset 0 2px 5px rgba(0, 0, 0, 0.05)';
                }}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </form>
        </div>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.8s ease-in',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1a2e44',
              marginBottom: '1.5rem',
            }}
          >
            Order Summary
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Total: <span style={{ color: '#2a5298', fontWeight: 600 }}>${total.toFixed(2)}</span>
          </p>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              display: 'block',
              textAlign: 'center',
              background: 'linear-gradient(90deg, #2a5298, #1e3c72)',
              color: '#ffffff',
              padding: '0.9rem',
              borderRadius: '25px',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              width: '100%',
              cursor: 'pointer',
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
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;