import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../api/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartApi.get(''); // Resolves to http://localhost:3004/api/carts
    //console.log('Fetch Cart Response:', response.data);
    return response.data.cart; // Extract the cart object
  } catch (error) {
    console.error('Fetch Cart Error:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch cart' });
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    console.log('Adding to cart - productId:', productId, 'quantity:', quantity);
    if (!productId || !quantity) {
      throw new Error('Product ID and quantity are required');
    }
    if (isNaN(quantity) || quantity < 1) {
      throw new Error('Quantity must be a positive number');
    }
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      throw new Error('Invalid product ID format');
    }

    const response = await cartApi.post('/items', { productId, quantity }); // Resolves to http://localhost:3004/api/carts/items
    console.log('Add to Cart Response:', response.data, 'Status:', response.status);
    return response.data.cart;
  } catch (error) {
    console.error('Add to Cart Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return rejectWithValue(error.response?.data || { message: error.message || 'Failed to add item to cart' });
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await cartApi.put('/items', { productId, quantity }); // Resolves to http://localhost:3004/api/carts/items
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update cart item' });
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await cartApi.delete(`/items/${productId}`); // Resolves to http://localhost:3004/api/carts/items/{productId}
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to remove item from cart' });
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartApi.delete(''); // Resolves to http://localhost:3004/api/carts
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to clear cart' });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { items: [], totalAmount: 0 }, // Default to empty cart with totalAmount
    loading: false,
    error: null,
  },
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [], totalAmount: 0 };
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [], totalAmount: 0 };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [], totalAmount: 0 };
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [], totalAmount: 0 };
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [], totalAmount: 0 };
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;