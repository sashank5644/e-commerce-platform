import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `${API_URL}/api/products/${editingProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingProduct(null);
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({ name: '', price: '', description: '', image: '' });
      dispatch(fetchProducts());
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      image: product.image || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchProducts());
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

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
        Manage Products
      </h1>
      <div
        style={{
          backgroundColor: 'var(--white)',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
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
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label style={{ display: 'block', color: 'var(--gray)', fontWeight: '500' }}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--gray)', fontWeight: '500' }}>
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--gray)', fontWeight: '500' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--gray)', fontWeight: '500' }}>
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--white)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: '600',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', description: '', image: '' });
                }}
                style={{
                  color: 'var(--gray)',
                  padding: '0.75rem 1.5rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--dark)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--gray)')}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--dark)',
          marginBottom: '1rem',
        }}
      >
        Product List
      </h2>
      {loading && <p style={{ color: 'var(--gray)' }}>Loading...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error.message}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              backgroundColor: 'var(--white)',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--dark)',
                }}
              >
                {product.name}
              </h3>
              <p style={{ color: 'var(--gray)' }}>${product.price}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(product)}
                style={{
                  color: '#3b82f6',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#2563eb')}
                onMouseLeave={(e) => (e.target.style.color = '#3b82f6')}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                style={{
                  color: '#ef4444',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.color = '#dc2626')}
                onMouseLeave={(e) => (e.target.style.color = '#ef4444')}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;