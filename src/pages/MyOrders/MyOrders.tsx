import { Link } from "react-router-dom";
import { Package, Calendar, ChevronRight, AlertCircle, CreditCard, Truck, CircleSlash } from "lucide-react";
import { useGetUserOrdersQuery } from "@/redux/features/order/order";
import { useSelector } from "react-redux";
import { currentToken } from "@/redux/features/auth/authSlice";
import { format } from "date-fns";

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
        <h1 className="text-lg font-bold text-gray-900 mb-2">My Orders</h1>

        {!hasOrders ? (
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 text-center">
            <CircleSlash className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No orders found</h3>
            <Link 
              to="/all-product" 
              className="inline-block mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all text-xs">
                {/* Order Header */}
                <div className="bg-gray-50 py-1.5 px-2 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900"># {order.transaction?.id || order._id.substring(0, 8)}</span>
                    <span className="text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-0.5" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                {/* Order Content */}
                <div className="p-2">
                  <div className="flex flex-row gap-2">
                    {/* Left Column - Customer Info */}
                    <div className="w-1/5 min-w-[110px]">
                      <div className="bg-gray-50 p-1.5 rounded border border-gray-200 text-[10px] h-full">
                        <div className="font-medium text-xs mb-0.5 text-gray-700 border-b pb-0.5">Customer</div>
                        <div className="grid gap-y-0.5">
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
                      <div className="mb-1.5 border border-gray-200 rounded">
                        <div className="bg-gray-50 px-2 py-1 border-b flex justify-between items-center text-[10px]">
                          <div className="flex items-center">
                            <Package className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Products ({order.products?.length || 0})</span>
                          </div>
                          <span>Total: <span className="font-medium">{formatCurrency(order.totalPrice)}</span></span>
                        </div>
                        
                        <div className="max-h-20 overflow-y-auto">
                          {order.products?.map((item) => (
                            <div key={item._id} className="p-1.5 flex items-center gap-1.5 border-b last:border-b-0">
                              {item.product?.image ? (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="w-8 h-8 object-cover rounded border border-gray-200"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                  <Package className="h-3 w-3 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-[11px] truncate">{item.product.name}</div>
                                <div className="text-[10px] text-gray-500 truncate">
                                  {item.product.brand} {item.product.model} • {item.quantity} × {formatCurrency(item.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shipment and Payment */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="border border-gray-200 rounded text-[10px]">
                          <div className="bg-gray-50 px-2 py-1 border-b flex items-center">
                            <Truck className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Shipment</span>
                          </div>
                          <div className="p-1.5">
                            <div className="mb-0.5 font-medium truncate">Tracking ID: {order.trackingNumber || "Not available"}</div>
                            {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                              <div className="text-gray-500 truncate">
                                Status: {order.trackingUpdates[0].stage}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded text-[10px]">
                          <div className="bg-gray-50 px-2 py-1 border-b flex items-center">
                            <CreditCard className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="font-medium text-gray-700">Payment</span>
                          </div>
                          <div className="p-1.5">
                            <div className="grid grid-cols-2 gap-y-0.5">
                              <span className="text-gray-500">Subtotal:</span>
                              <span className="text-right">{formatCurrency(order.subtotal)}</span>
                              <span className="text-gray-500">Tax + Ship:</span>
                              <span className="text-right">{formatCurrency(order.tax + order.shipping)}</span>
                              <span className="font-medium border-t pt-0.5 mt-0.5">Total:</span>
                              <span className="text-right font-bold border-t pt-0.5 mt-0.5">{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex justify-end mt-1.5">
                        <Link 
                          to={`/track-order/${order._id}`}
                          className="inline-flex items-center px-2 py-1 text-[10px] rounded font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Track Order
                          <ChevronRight className="ml-0.5 h-2.5 w-2.5" />
                        </Link>
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