import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await productApi.get('');
    //console.log('Fetched products:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetch Products Error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;