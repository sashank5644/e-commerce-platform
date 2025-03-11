import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { Link } from 'react-router-dom';
import '../styling/CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Capitalize category name for display
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Filter products by category
      let filtered = products.filter(product => 
        product.category?.toLowerCase() === categoryName.toLowerCase()
      );
      
      // Apply price filter
      filtered = filtered.filter(product => 
        product.price >= priceRange.min && product.price <= priceRange.max
      );
      
      // Apply sorting
      switch(sortOption) {
        case 'priceLow':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'priceHigh':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default: // 'featured'
          // Keep default order or implement custom featured logic
          break;
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, categoryName, sortOption, priceRange]);

  const handlePriceChange = (e, boundary) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({ ...prev, [boundary]: value }));
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <div className="category-header-content">
          <h1>{formattedCategoryName}</h1>
          <p>Explore our collection of premium {categoryName.toLowerCase()} products</p>
        </div>
      </div>

      <div className="category-content">
        {/* Sidebar with filters */}
        <aside className="category-sidebar">
          <div className="filter-section">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <div className="price-input">
                  <label>Min:</label>
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, 'min')}
                    min="0"
                  />
                </div>
                <div className="price-input">
                  <label>Max:</label>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, 'max')}
                    min="0"
                  />
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, 'max')}
                className="price-slider"
              />
            </div>
            
            <div className="filter-group">
              <h4>Availability</h4>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" defaultChecked />
                  In Stock
                </label>
              </div>
            </div>
            
            <div className="filter-group">
              <h4>Ratings</h4>
              <div className="checkbox-group">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating}>
                    <input type="checkbox" />
                    {rating}+ Stars
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content with products */}
        <main className="category-main">
          <div className="sort-controls">
            <p>{filteredProducts.length} products found</p>
            <div className="sort-select">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p>Oops! Something went wrong.</p>
              <p>{error.message || 'Unable to load products. Please try again later.'}</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No products found in this category.</p>
              <p>Try adjusting your filters or check back later for new arrivals.</p>
            </div>
          )}

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-card"
              >
                <div className="product-image">
                  <img
                    src={product.image || 'https://placehold.co/300x200'}
                    alt={product.name}
                  />
                  {product.inStock < 5 && product.inStock > 0 && (
                    <span className="product-badge low-stock">Almost Gone!</span>
                  )}
                  {product.isNew && (
                    <span className="product-badge new">New</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description || 'Premium quality product for your everyday needs.'}</p>
                  <div className="product-footer">
                    <p className="product-price">${product.price}</p>
                    <button className="view-button">
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;