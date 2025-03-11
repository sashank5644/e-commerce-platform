import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <div
      style={{
        maxWidth: '450px',
        margin: '0 auto',
        padding: '3rem 2rem',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#1a2e44',
          marginBottom: '2rem',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeIn 0.8s ease-in',
        }}
      >
        Login
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
      {error && (
        <p style={{ color: '#dc3545', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.1rem', animation: 'fadeIn 0.5s ease-in' }}>
          {error.message}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 0.8s ease-in',
        }}
      >
        <div>
          <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', color: '#666', fontWeight: 500, marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(90deg, #2a5298, #1e3c72)',
            color: '#ffffff',
            padding: '0.9rem',
            borderRadius: '25px',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            opacity: loading ? '0.7' : '1',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;