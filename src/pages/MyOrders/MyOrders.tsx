import { Link } from "react-router-dom";
import { Package, Calendar, AlertCircle, CreditCard, Truck, CircleSlash } from "lucide-react";
import { useGetUserOrdersQuery } from "@/redux/features/order/order";
import { useSelector } from "react-redux";
import { currentToken } from "@/redux/features/auth/authSlice";
import { format } from "date-fns";

// Helper function to get estimated delivery date from order data
const getEstimatedDelivery = (order: unknown): string | undefined => {
  if (!order || typeof order !== 'object') return undefined;
  
  const data = order as Record<string, unknown>;
  
  // Check direct properties first
  if (data.estimatedDelivery && typeof data.estimatedDelivery === 'string') {
    return data.estimatedDelivery;
  }
  
  if (data.estimatedDeliveryDate && typeof data.estimatedDeliveryDate === 'string') {
    return data.estimatedDeliveryDate;
  }
  
  // Check for nested properties
  if (data.shipping && typeof data.shipping === 'object') {
    const shipping = data.shipping as Record<string, unknown>;
    if (shipping.estimatedDelivery && typeof shipping.estimatedDelivery === 'string') return shipping.estimatedDelivery;
    if (shipping.estimatedDeliveryDate && typeof shipping.estimatedDeliveryDate === 'string') return shipping.estimatedDeliveryDate;
  }
  
  // API might have different casing
  if (data.estimated_delivery && typeof data.estimated_delivery === 'string') {
    return data.estimated_delivery;
  }
  
  // Last resort - calculate our own estimated delivery if we have created date
  if (data.createdAt && typeof data.createdAt === 'string') {
    try {
      const createdDate = new Date(data.createdAt);
      const estimatedDate = new Date(createdDate);
      estimatedDate.setDate(createdDate.getDate() + 7); // Default: 7 days from creation
      
      return estimatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error calculating estimated delivery date:', error);
    }
  }
  
  return "7 days from order date"; // Default fallback
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'delivered':
    case 'completed':
      return "bg-green-100 text-green-800";
    case 'processing':
    case 'shipped':
      return "bg-blue-100 text-blue-800";
    case 'pending':
      return "bg-yellow-100 text-yellow-800";
    case 'cancelled':
    case 'failed':
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export default function MyOrdersPage() {
  // Get auth token
  const token = useSelector(currentToken);
  console.log("User token:", token);

  // Use RTK Query hook with proper error handling
  const { data: orders = [], isLoading, error } = useGetUserOrdersQuery();

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded-md shadow-sm text-center max-w-sm mx-auto">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <h2 className="text-base font-medium mb-1 text-gray-800">Loading orders...</h2>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 rounded-md shadow-sm text-center max-w-sm mx-auto">
          <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          <h2 className="text-base font-medium mb-1 text-gray-800">Error loading orders</h2>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main content with safe array check
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex h-12 items-center border-b bg-white px-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
          <div className="w-px h-3.5 bg-gray-300 mx-1"></div>
          <nav className="flex">
            <div className="flex items-center text-xs">
              <Link to="/" className="text-gray-600 hover:text-gray-900 hidden md:block hover:underline">Home</Link>
              <span className="mx-1 text-gray-400 hidden md:block">/</span>
              <span className="font-medium text-gray-900">My Orders</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-2 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">My Orders</h1>
        <p className="text-red-600 mb-5">Track Your Order Status using Tracking Number from Track Order status page. View order status and delivery details.</p>

        {!hasOrders ? (
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 text-center">
            <CircleSlash className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <Link 
              to="/all-cars" 
              className="inline-block mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-base"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all text-sm">
                {/* Order Header */}
                <div className="bg-gray-50 py-2 px-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-base">Tracking Number :<span className="text-red-600">{order.trackingNumber}</span></span>
                    
                    <span className="text-gray-500 flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-0.5" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                {/* Order Content */}
                <div className="p-3">
                  <div className="flex flex-row gap-3">
                    {/* Left Column - Customer Info */}
                    <div className="w-1/5 min-w-[110px]">
                      <div className="bg-gray-50 p-2 rounded border border-gray-200 text-xs h-full">
                        <div className="font-medium text-sm mb-1 text-gray-700 border-b pb-1">Customer</div>
                        <div className="grid gap-y-1">
                          <div className="truncate">{order.customerFirstName} {order.customerLastName}</div>
                          <div className="truncate">{order.email}</div>
                          <div className="truncate">{order.phone}</div>
                          <div className="truncate">{order.address}, {order.city}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Order Details */}
                    <div className="flex-1">
                      {/* Products */}
                      <div className="mb-2 border border-gray-200 rounded">
                        <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center text-xs">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Products ({order.products?.length || 0})</span>
                          </div>
                          <span>Total: <span className="font-medium">{formatCurrency(order.totalPrice)}</span></span>
                        </div>
                        
                        <div className="max-h-24 overflow-y-auto">
                          {order.products?.map((item) => (
                            <div key={item._id} className="p-2 flex items-center gap-2 border-b last:border-b-0">
                              {typeof item.product === 'object' && item.product?.image ? (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-10 h-10 object-cover rounded border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {typeof item.product === 'object' ? item.product.name : 'Product'}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {typeof item.product === 'object' ? 
                                    <>{item.product.brand} {item.product.model} • {item.quantity} × {formatCurrency('price' in item ? item.price ?? 0 : 0)}</> : 
                                    <>{item.quantity} × {formatCurrency('price' in item ? item.price ?? 0 : 0)}</>
                                  }
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shipment and Payment */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border border-gray-200 rounded text-xs">
                          <div className="bg-gray-50 px-3 py-2 border-b flex items-center">
                            <Truck className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Shipment</span>
                          </div>
                          <div className="p-2">
                            <div className="mb-1 font-medium truncate">Tracking ID: {order.trackingNumber || "Not available"}</div>
                            {getEstimatedDelivery(order) && (
                              <div className="text-gray-500 truncate mb-1">
                                Est. Delivery: {getEstimatedDelivery(order)}
                              </div>
                            )}
                            {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                              <div className="text-gray-500 truncate">
                                Status: {order.trackingUpdates[0].stage}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded text-xs">
                          <div className="bg-gray-50 px-3 py-2 border-b flex items-center">
                            <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Payment</span>
                          </div>
                          <div className="p-2">
                            <div className="grid grid-cols-2 gap-y-1">
                              <span className="text-gray-500">Subtotal:</span>
                              <span className="text-right">{formatCurrency(order.subtotal ?? 0)}</span>
                              <span className="text-gray-500">Tax + Ship:</span>
                              <span className="text-right">{formatCurrency((order.tax ?? 0) + (order.shipping ?? 0))}</span>
                              <span className="font-medium border-t pt-1 mt-1">Total:</span>
                              <span className="text-right font-bold border-t pt-1 mt-1">{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 