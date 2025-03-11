import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const product = products.find((p) => p._id === id);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      console.error('User not logged in. Redirecting to login page.');
      return;
    }

    if (!product || !product._id) {
      console.error('Invalid product data:', product);
      return;
    }

    if (isNaN(quantity) || quantity < 1) {
      console.error('Invalid quantity:', quantity);
      return;
    }

    console.log('Dispatching addToCart with:', { productId: product._id, quantity });
    dispatch(addToCart({ productId: product._id, quantity }))
      .then(() => {
        console.log('Item added to cart successfully');
      })
      .catch((error) => {
        console.error('Failed to add item to cart:', error.message);
      });
  };

  if (loading) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
      Loading...
    </p>
  );
  if (error) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#dc3545', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
      {error.message}
    </p>
  );
  if (!product) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#666', fontSize: '1.2rem', animation: 'fadeIn 0.5s ease-in' }}>
      Product not found.
    </p>
  );

  if (!user) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem' }}>
          Please <Link to="/login" style={{ color: '#2a5298', textDecoration: 'underline', fontWeight: 500 }}>log in</Link> to add items to your cart.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 2rem',
        backgroundColor: '#f5f7fa',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          animation: 'fadeIn 0.8s ease-in',
        }}
      >
        <img
          src={product.image || 'https://placehold.co/400'}
          alt={product.name}
          style={{
            width: '50%',
            height: '450px',
            objectFit: 'cover',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />
        <div style={{ flex: 1, padding: '1rem' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1a2e44',
              marginBottom: '1.2rem',
              letterSpacing: '0.5px',
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              fontSize: '1.8rem',
              fontWeight: 600,
              color: '#2a5298',
              marginBottom: '1.5rem',
            }}
          >
            ${product.price}
          </p>
          <p
            style={{
              color: '#666',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '2rem',
            }}
          >
            {product.description || 'No description available.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <label htmlFor="quantity" style={{ fontSize: '1.1rem', color: '#1a2e44', fontWeight: 500 }}>
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              style={{
                padding: '0.6rem',
                width: '80px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2a5298')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>
          <button
            onClick={handleAddToCart}
            style={{
              background: 'linear-gradient(90deg, #2a5298, #1e3c72)',
              color: '#ffffff',
              padding: '0.9rem 2.5rem',
              borderRadius: '25px',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
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
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;