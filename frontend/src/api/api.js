import axios from 'axios';

const API_URLS = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL,
  product: import.meta.env.VITE_PRODUCT_SERVICE_URL,
  cart: import.meta.env.VITE_CART_SERVICE_URL,
  order: import.meta.env.VITE_ORDER_SERVICE_URL,
  payment: import.meta.env.VITE_PAYMENT_SERVICE_URL, // Added Payment Service
};

const authApi = axios.create({ baseURL: API_URLS.auth });
const productApi = axios.create({ baseURL: API_URLS.product });
const cartApi = axios.create({ baseURL: API_URLS.cart });
const orderApi = axios.create({ baseURL: API_URLS.order });
const paymentApi = axios.create({ baseURL: API_URLS.payment }); // Added Payment Service instance

const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const publicRoutes = ['/products']; // Public routes don’t need auth
      const isPublicRoute = publicRoutes.some((route) => config.url.includes(route));
      if (!isPublicRoute) {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        else console.warn('No token found in localStorage for request to:', config.url);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('Response Error for', error.config.url, ':', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      return Promise.reject(error);
    }
  );
};

[authApi, productApi, cartApi, orderApi, paymentApi].forEach(addAuthInterceptor);

export { authApi, productApi, cartApi, orderApi, paymentApi };