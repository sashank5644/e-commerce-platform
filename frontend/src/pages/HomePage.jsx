import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';
import Footer from './Footer'; // Import Footer component
import "../styling/HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products to only show those with featured: true
  const featuredProducts = products.filter(product => product.featured === true);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure the container takes at least the full viewport height
      }}
    >
      <div style={{ flex: '1 0 auto' }}> {/* Main content grows to fill space */}
        <div className="home-container">
          {/* Modern Hero Section with Glassmorphism Effect */}
          <section className="hero-section">
            {/* Abstract Background Elements */}
            <div className="hero-background">
              {/* Animated Blob Shapes */}
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="blob-animation">
                <defs>
                  <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a5568" />
                    <stop offset="100%" stopColor="#2d3748" />
                  </linearGradient>
                  <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                  </filter>
                </defs>
                <g filter="url(#goo)">
                  <circle cx="300" cy="300" r="150" fill="url(#blob-gradient)">
                    <animate attributeName="cy" values="300;320;300;280;300" dur="10s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="300;320;340;320;300" dur="12s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="400" r="120" fill="url(#blob-gradient)">
                    <animate attributeName="cy" values="400;380;400;420;400" dur="9s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="600;580;560;580;600" dur="11s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="750" cy="600" r="180" fill="url(#blob-gradient)">
                    <animate attributeName="cy" values="600;620;600;580;600" dur="13s" repeatCount="indefinite" />
                    <animate attributeName="cx" values="750;770;790;770;750" dur="14s" repeatCount="indefinite" />
                  </circle>
                </g>
              </svg>
            </div>

            {/* Geometric Grid Overlay */}
            <div className="hero-grid"></div>

            {/* Glass Card for Hero Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                Discover Exceptional Products
                {/* Decorative Element */}
                <span className="title-underline"></span>
              </h1>
              <p className="hero-description">
                Explore our curated collection of premium items at unbeatable prices
              </p>
              <Link
                to="/cart"
                className="shop-now-button"
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
                  e.target.style.color = '#2c5282';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                  e.target.style.color = '#1a365d';
                }}
              >
                Shop Now
                <span className="arrow">→</span>
              </Link>
            </div>

            {/* Modern Wave Separator */}
            <div className="wave-container">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1200 120" 
                preserveAspectRatio="none"
                className="wave-svg"
              >
                <path 
                  d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
                  fill="#f8f9fc"
                ></path>
              </svg>
            </div>
          </section>

          {/* Features Section */}
          <section style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '3rem 2rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: '⚡', title: 'Fast Delivery', desc: '2-3 business days' },
              { icon: '💯', title: 'Quality Guarantee', desc: '30-day money back' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Encrypted transactions' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                flex: '1 1 200px',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{ fontSize: '1.8rem' }}>{feature.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a2e44', margin: '0 0 5px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6b7c93', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Featured Products Section */}
          <section
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '4rem 2rem',
            }}
          >
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1a2e44',
                marginBottom: '1.5rem',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <span style={{
                display: 'inline-block',
                position: 'relative',
                paddingBottom: '10px',
              }}>
                Featured Products
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #0d47a1, #42a5f5)',
                    borderRadius: '2px',
                  }}
                />
              </span>
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#6b7c93', 
              textAlign: 'center', 
              maxWidth: '600px', 
              margin: '0 auto 3rem',
              lineHeight: 1.6,
            }}>
              Discover our hand-picked selection of best-selling items that combine quality, style, and value
            </p>

            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 0',
                animation: 'pulse 1.5s infinite ease-in-out' 
              }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '48px',
                  height: '48px',
                  border: '3px solid rgba(65, 105, 225, 0.3)',
                  borderRadius: '50%',
                  borderTopColor: '#4169e1',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1rem', color: '#6b7c93', fontSize: '1.1rem' }}>Loading amazing products...</p>
              </div>
            )}

            {error && (
              <div style={{ 
                textAlign: 'center', 
                backgroundColor: '#fff5f5', 
                color: '#e53e3e', 
                padding: '2rem', 
                borderRadius: '8px',
                margin: '2rem auto',
                maxWidth: '600px',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.1)'
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Oops! Something went wrong.</p>
                <p style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '0.5rem' }}>{error.message || 'Unable to load products. Please try again later.'}</p>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2.5rem',
                padding: '1rem 0.5rem',
              }}
            >
              {featuredProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    textDecoration: 'none',
                    position: 'relative',
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0,
                    animationDelay: `${Math.random() * 0.5}s`,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={product.image || 'https://placehold.co/300x200'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '260px',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: '#ff4d87',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 10px rgba(255, 77, 135, 0.3)',
                      opacity: Math.random() > 0.5 ? '1' : '0',
                      pointerEvents: 'none',
                    }}>
                      New
                    </div>
                  </div>
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          color: '#1a2e44',
                          marginBottom: '0.5rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p style={{
                          fontSize: '0.95rem',
                          color: '#6b7c93',
                          marginBottom: '1rem',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '45px',
                        }}>
                          {product.description || 'Premium quality product for your everyday needs.'}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <p
                        style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#0d47a1',
                          margin: 0,
                        }}
                      >
                        ${product.price}
                      </p>
                      <button style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #0d47a1',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0d47a1',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }} onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0d47a1';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.1)';
                      }} onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#0d47a1';
                        e.target.style.transform = 'scale(1)';
                      }}>
                        →
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter Section */}
          <section style={{
            background: 'linear-gradient(to right, #f5f7fa, #e4ecfb)',
            padding: '6rem 2rem',
            textAlign: 'center',
            marginTop: '4rem',
            position: 'relative',
          }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ 
                fontSize: '2.2rem', 
                fontWeight: 700, 
                color: '#1a2e44',
                marginBottom: '1.5rem' 
              }}>
                Stay Updated
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#6b7c93', 
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}>
                Subscribe to our newsletter for exclusive deals, new arrivals, and more!
              </p>
              <div style={{ 
                display: 'flex', 
                maxWidth: '450px', 
                margin: '0 auto',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                borderRadius: '50px',
                overflow: 'hidden',
              }}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    border: 'none',
                    outline: 'none',
                  }}
                />
                <button style={{
                  backgroundColor: '#0d47a1',
                  color: 'white',
                  padding: '1rem 1.8rem',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }} onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1565c0';
                }} onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#0d47a1';
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer /> {/* Add Footer at the bottom */}
    </div>
  );
};

export default HomePage;