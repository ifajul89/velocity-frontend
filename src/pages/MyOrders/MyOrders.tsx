import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  AlertCircle,
  CreditCard,
  Truck,
  CircleSlash,
} from "lucide-react";
import { useGetUserOrdersQuery } from "@/redux/features/order/order";
import { useSelector } from "react-redux";
import { currentToken } from "@/redux/features/auth/authSlice";
import { format } from "date-fns";

// Helper function to get estimated delivery date from order data
const getEstimatedDelivery = (order: unknown): string | undefined => {
  if (!order || typeof order !== "object") return undefined;

  const data = order as Record<string, unknown>;

  // Check direct properties first
  if (data.estimatedDelivery && typeof data.estimatedDelivery === "string") {
    return data.estimatedDelivery;
  }

  if (
    data.estimatedDeliveryDate &&
    typeof data.estimatedDeliveryDate === "string"
  ) {
    return data.estimatedDeliveryDate;
  }

  // Check for nested properties
  if (data.shipping && typeof data.shipping === "object") {
    const shipping = data.shipping as Record<string, unknown>;
    if (
      shipping.estimatedDelivery &&
      typeof shipping.estimatedDelivery === "string"
    )
      return shipping.estimatedDelivery;
    if (
      shipping.estimatedDeliveryDate &&
      typeof shipping.estimatedDeliveryDate === "string"
    )
      return shipping.estimatedDeliveryDate;
  }

  // API might have different casing
  if (data.estimated_delivery && typeof data.estimated_delivery === "string") {
    return data.estimated_delivery;
  }

  // Last resort - calculate our own estimated delivery if we have created date
  if (data.createdAt && typeof data.createdAt === "string") {
    try {
      const createdDate = new Date(data.createdAt);
      const estimatedDate = new Date(createdDate);
      estimatedDate.setDate(createdDate.getDate() + 7); // Default: 7 days from creation

      return estimatedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error calculating estimated delivery date:", error);
    }
  }

  return "7 days from order date"; // Default fallback
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-sm rounded-md bg-white p-4 text-center shadow-sm">
          <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <h2 className="mb-1 text-base font-medium text-gray-800">
            Loading orders...
          </h2>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="mx-auto max-w-sm rounded-md bg-white p-4 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
          <h2 className="mb-1 text-base font-medium text-gray-800">
            Error loading orders
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex h-12 items-center border-b bg-white px-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100">
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="mx-1 h-3.5 w-px bg-gray-300"></div>
          <nav className="flex">
            <div className="flex items-center text-xs">
              <Link
                to="/"
                className="hidden text-gray-600 hover:text-gray-900 hover:underline md:block"
              >
                Home
              </Link>
              <span className="mx-1 hidden text-gray-400 md:block">/</span>
              <span className="font-medium text-gray-900">My Orders</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl flex-1 p-2">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mb-5 text-gray-600">
          Track Your Order Status using Tracking Number from Track status page.
          View order status and delivery details.
        </p>

        {!hasOrders ? (
          <div className="rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm">
            <CircleSlash className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <Link
              to="/all-cars"
              className="mt-2 inline-block rounded-md bg-red-600 px-4 py-2 text-base text-white hover:bg-red-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-md border border-gray-200 bg-white text-sm shadow-sm transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900">
                      Tracking Number :{order.trackingNumber}
                    </span>

                    <span className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-0.5 h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Content */}
                <div className="p-3">
                  <div className="flex flex-row gap-3">
                    {/* Left Column - Customer Info */}
                    <div className="w-1/5 min-w-[110px]">
                      <div className="h-full rounded border border-gray-200 bg-gray-50 p-2 text-xs">
                        <div className="mb-1 border-b pb-1 text-sm font-medium text-gray-700">
                          Customer
                        </div>
                        <div className="grid gap-y-1">
                          <div className="truncate">
                            {order.customerFirstName} {order.customerLastName}
                          </div>
                          <div className="truncate">{order.email}</div>
                          <div className="truncate">{order.phone}</div>
                          <div className="truncate">
                            {order.address}, {order.city}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Order Details */}
                    <div className="flex-1">
                      {/* Products */}
                      <div className="mb-2 rounded border border-gray-200">
                        <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2 text-xs">
                          <div className="flex items-center">
                            <Package className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Products ({order.products?.length || 0})
                            </span>
                          </div>
                          <span>
                            Total:{" "}
                            <span className="font-medium">
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </span>
                        </div>

                        <div className="max-h-24 overflow-y-auto">
                          {order.products?.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-2 border-b p-2 last:border-b-0"
                            >
                              {typeof item.product === "object" &&
                              item.product?.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded border border-gray-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">
                                  {typeof item.product === "object"
                                    ? item.product.name
                                    : "Product"}
                                </div>
                                <div className="truncate text-xs text-gray-500">
                                  {typeof item.product === "object" ? (
                                    <>
                                      {item.product.brand} {item.product.model}{" "}
                                      • {item.quantity} ×{" "}
                                      {formatCurrency(
                                        "price" in item ? (item.price ?? 0) : 0,
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {item.quantity} ×{" "}
                                      {formatCurrency(
                                        "price" in item ? (item.price ?? 0) : 0,
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipment and Payment */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded border border-gray-200 text-xs">
                          <div className="flex items-center border-b bg-gray-50 px-3 py-2">
                            <Truck className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Shipment
                            </span>
                          </div>
                          <div className="p-2">
                            <div className="mb-1 truncate font-medium">
                              Tracking ID:{" "}
                              {order.trackingNumber || "Not available"}
                            </div>
                            {getEstimatedDelivery(order) && (
                              <div className="mb-1 truncate text-gray-500">
                                Est. Delivery: {getEstimatedDelivery(order)}
                              </div>
                            )}
                            {order.trackingUpdates &&
                              order.trackingUpdates.length > 0 && (
                                <div className="truncate text-gray-500">
                                  Status: {order.trackingUpdates[0].stage}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="rounded border border-gray-200 text-xs">
                          <div className="flex items-center border-b bg-gray-50 px-3 py-2">
                            <CreditCard className="mr-1 h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Payment
                            </span>
                          </div>
                          <div className="p-2">
                            <div className="grid grid-cols-2 gap-y-1">
                              <span className="text-gray-500">Subtotal:</span>
                              <span className="text-right">
                                {formatCurrency(order.subtotal ?? 0)}
                              </span>
                              <span className="text-gray-500">Tax + Ship:</span>
                              <span className="text-right">
                                {formatCurrency(
                                  (order.tax ?? 0) + (order.shipping ?? 0),
                                )}
                              </span>
                              <span className="mt-1 border-t pt-1 font-medium">
                                Total:
                              </span>
                              <span className="mt-1 border-t pt-1 text-right font-bold">
                                {formatCurrency(order.totalPrice)}
                              </span>
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
