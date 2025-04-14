import { baseApi } from "@/redux/api/baseApi";

// Define the Order interface based on actual backend data
interface Product {
  _id: string;
  name: string;
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
}

interface OrderProduct {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  _id: string;
}

interface TrackingUpdate {
  stage: string;
  timestamp: string;
  message: string;
  _id: string;
}

interface Transaction {
  id: string;
  transactionStatus: string;
  bank_status: string;
  date_time: string;
  sp_code: string;
  sp_message: string;
}

interface Order {
  _id: string;
  user: string;
  customerFirstName: string;
  customerLastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  products: OrderProduct[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  status: string;
  trackingUpdates: TrackingUpdate[];
  trackingNumber: string;
  transaction: Transaction;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: Order[];
}

interface TrackingStages {
  placed: boolean;
  approved: boolean;
  processed: boolean;
  shipped: boolean;
  delivered: boolean;
}

interface TrackOrderResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    trackingStages: TrackingStages;
    transaction: Transaction;
    _id: string;
    user: string;
    customerFirstName: string;
    customerLastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    products: OrderProduct[];
    subtotal: number;
    tax: number;
    shipping: number;
    totalPrice: number;
    status: string;
    trackingUpdates: TrackingUpdate[];
    trackingNumber: string;
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
  };
}

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (userInfo) => ({
        url: "/orders",
        method: "POST",
        body: userInfo,
      }),
    }),
    getOrders: builder.query({
      query: () => "/order",
    }),
    verifyOrder: builder.query({
      query: (order_id) => ({
        url: "/orders/verify",
        params: { order_id },
        method: "GET",
      }),
    }),
    // Endpoint for getting user orders
    getUserOrders: builder.query<Order[], void>({
      query: () => ({
        url: "/orders/my-orders",
        method: "GET",
      }),
      transformResponse: (response: OrderResponse) => {
        return response?.data || [];
      },
    }),
    // Endpoint for tracking an order by tracking number
    trackOrder: builder.query<TrackOrderResponse['data'], string>({
      query: (trackingNumber) => ({
        url: `/orders/track/${trackingNumber}`,
        method: "GET",
      }),
      transformResponse: (response: TrackOrderResponse) => {
        return response?.data || null;
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useVerifyOrderQuery,
  useGetUserOrdersQuery,
  useTrackOrderQuery,
} = orderApi;