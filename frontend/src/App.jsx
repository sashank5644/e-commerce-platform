import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ViewOrders from './pages/admin/ViewOrders';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Ensure the container takes at least the full viewport height
            margin: 0, // Remove default margins
          }}
        >
          <Header />
          <main
            style={{
              flex: '1 0 auto', // Grow to fill space but don't shrink
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<div><h1 style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px', fontSize: '1.875rem', fontWeight: '700', color: '#4a5568' }}>Admin Dashboard</h1></div>} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="orders" element={<ViewOrders />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;