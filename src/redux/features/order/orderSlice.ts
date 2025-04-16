import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';

interface Product {
  product: string;
  quantity: number;
}

export interface OrderData {
  customerFirstName: string;
  customerLastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  totalPrice: number;
  products: Product[];
}

interface OrderResponse {
  success?: boolean;
  status?: boolean;
  statusCode?: number;
  message: string;
  checkout_url?: string;
  data?: string | {
    checkoutUrl?: string;
    order?: {
      orderId?: string;
      trackingNumber?: string;
      totalPrice?: number;
      status?: string;
      estimatedDeliveryDate?: string;
    };
    [key: string]: unknown;
  };
  order?: {
    id: string;
    status: string;
    estimatedDeliveryDate?: string;
    [key: string]: unknown;
  }
}

interface OrderState {
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  checkoutUrl: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: OrderData, { rejectWithValue }) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Authentication required. Please log in.');
      }

      console.log('Sending order data to API:', JSON.stringify(orderData, null, 2));
      console.log('Using token:', token);

      const response = await fetch('https://velocity-backend.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order creation failed:', errorText);
        
        try {
          // Try to parse the error as JSON
          const errorData = JSON.parse(errorText);
          console.error('Parsed error:', errorData);
          return rejectWithValue(errorData.message || 'Failed to create order');
        } catch {
          // If it's not valid JSON, return the raw text
          return rejectWithValue(errorText || 'Failed to create order');
        }
      }

      const data = await response.json();
      console.log('Order creation successful - FULL response:', JSON.stringify(data, null, 2));
      
      // Check structure of response to ensure we have the URL
      if (data.data && typeof data.data === 'string' && data.data.includes('http')) {
        console.log('Found checkout URL in data.data:', data.data);
      } else if (data.checkout_url) {
        console.log('Found checkout URL in data.checkout_url:', data.checkout_url);
      } else {
        console.warn('No checkout URL found in API response. Response structure:', JSON.stringify(data, null, 2));
      }
      
      return data;
    } catch (error) {
      console.error('Order creation exception:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCheckoutUrl: (state) => {
      state.checkoutUrl = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.isLoading = false;
        
        // Handle different response formats
        let checkoutUrl = action.payload.checkout_url;
        
        // Check if URL is in data as a string
        if (!checkoutUrl && typeof action.payload.data === 'string' && action.payload.data.includes('http')) {
          checkoutUrl = action.payload.data;
        }
        
        // Check if URL is in data.checkoutUrl (new format)
        if (!checkoutUrl && typeof action.payload.data === 'object' && action.payload.data?.checkoutUrl) {
          checkoutUrl = action.payload.data.checkoutUrl;
        }
        
        console.log("Final checkout URL extracted:", checkoutUrl);
        state.checkoutUrl = checkoutUrl || null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'An unknown error occurred';
      });
  }
});

export const { clearCheckoutUrl } = orderSlice.actions;
export const selectCheckoutUrl = (state: RootState) => state.order.checkoutUrl;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;

export default orderSlice.reducer; 