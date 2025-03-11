import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderApi } from '../../api/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await orderApi.get('/user');
    const { orders } = response.data; // Expect { orders: [...] } from backend
    if (!Array.isArray(orders)) {
      throw new Error('Invalid data format: orders is not an array');
    }
    return orders;
  } catch (error) {
    console.error('Fetch orders error:', error.response?.status, error.response?.data);
    return rejectWithValue(error.response?.data || 'Failed to fetch orders');
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async ({ shippingAddress, paymentMethod }, { dispatch, rejectWithValue }) => {
  try {
    const response = await orderApi.post('/', { shippingAddress, paymentMethod });
    const { order } = response.data; // Expect { order: {...} } from backend
    // Refetch orders to ensure the latest list
    await dispatch(fetchOrders());
    return order;
  } catch (error) {
    console.error('Create order error:', error.response?.status, error.response?.data);
    return rejectWithValue(error.response?.data || 'Failed to create order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [], // Ensure initial state is an array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Should be an array
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        // State is updated by fetchOrders, no need to push here
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;