import React, { useState, useEffect } from "react";
import {
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/Dashboard";
import {
  useGetAllOrdersQuery,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
} from "@/redux/features/order/order";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiOrder } from "@/redux/features/order/order";

// Define Order type interface based on the data we're working with
interface OrderProduct {
  product:
    | string
    | {
        _id: string;
        name?: string;
        image?: string;
        brand?: string;
        model?: string;
        price?: number;
      };
  quantity: number;
  price?: number;
  subtotal?: number;
  _id: string;
}

interface TrackingUpdate {
  stage: string;
  timestamp: string;
  message: string;
  _id?: string;
}

interface TrackingStages {
  placed: boolean;
  approved: boolean;
  processed: boolean;
  shipped: boolean;
  delivered: boolean;
  [key: string]: boolean;
}

interface Transaction {
  id: string;
  transactionStatus: string;
  bank_status?: string;
  date_time?: string;
  sp_code?: string;
  sp_message?: string;
}

// OrderModal component for showing detailed order information
const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: ApiOrder & {
    trackingStages?: TrackingStages;
    transaction?: Transaction;
  };
  onClose: () => void;
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white shadow-lg">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-xl font-bold">Order Details: {order._id}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label>Name</Label>
                <div className="text-sm">
                  {order.customerFirstName || "N/A"}{" "}
                  {order.customerLastName || ""}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="text-sm">{order.email || "N/A"}</div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="text-sm">{order.phone || "N/A"}</div>
              </div>
              <div>
                <Label>Address</Label>
                <div className="text-sm">{order.address || "N/A"}</div>
              </div>
              <div>
                <Label>City</Label>
                <div className="text-sm">{order.city || "N/A"}</div>
              </div>
              <div>
                <Label>Zip Code</Label>
                <div className="text-sm">{order.zipCode || "N/A"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label>Order Date</Label>
                <div className="text-sm">
                  {format(new Date(order.createdAt), "MMM d, yyyy, h:mm a")}
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <div className="text-sm">
                  <Badge>{order.status}</Badge>
                </div>
              </div>
              <div>
                <Label>Tracking Number</Label>
                <div className="text-sm">{order.trackingNumber || "N/A"}</div>
              </div>
              <div>
                <Label>Estimated Delivery</Label>
                <div className="text-sm">
                  {order.estimatedDelivery
                    ? format(new Date(order.estimatedDelivery), "MMM d, yyyy")
                    : order.estimatedDeliveryDate
                      ? format(
                          new Date(order.estimatedDeliveryDate),
                          "MMM d, yyyy",
                        )
                      : "N/A"}
                </div>
              </div>
              {order.transaction && (
                <div>
                  <Label>Transaction ID</Label>
                  <div className="text-sm">{order.transaction.id || "N/A"}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((item: OrderProduct, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.product && typeof item.product === "object"
                            ? item.product.name || "Unknown Product"
                            : "Product ID: " + (item.product || "N/A")}
                        </TableCell>
                        <TableCell>{item.quantity || 1}</TableCell>
                        <TableCell className="text-right">
                          ৳{(item.price || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ৳
                          {(
                            item.subtotal ||
                            (item.price ? item.price * item.quantity : 0)
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No products found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col items-end border-t pt-4">
              <div className="space-y-1 text-sm">
                <div className="flex w-48 justify-between">
                  <span>Subtotal</span>
                  <span>৳{(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex w-48 justify-between">
                  <span>Tax</span>
                  <span>৳{(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex w-48 justify-between">
                  <span>Shipping</span>
                  <span>৳{(order.shipping || 0).toFixed(2)}</span>
                </div>
                <div className="flex w-48 justify-between font-bold">
                  <span>Total</span>
                  <span>৳{(order.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          {order.trackingUpdates && order.trackingUpdates.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tracking Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.trackingUpdates.map(
                    (update: TrackingUpdate, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-500 py-2 pl-4"
                      >
                        <div className="text-sm font-medium">
                          {update.stage.charAt(0).toUpperCase() +
                            update.stage.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(
                            new Date(update.timestamp),
                            "MMM d, yyyy, h:mm a",
                          )}
                        </div>
                        <div className="mt-1 text-sm">{update.message}</div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {order.trackingStages && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tracking Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  {Object.entries(order.trackingStages).map(
                    ([stage, completed]: [string, boolean]) => (
                      <div key={stage} className="flex flex-col items-center">
                        <div
                          className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                          {completed ? "✓" : "○"}
                        </div>
                        <div className="text-xs font-medium">
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// DeleteConfirmationModal component for confirming order deletion
const DeleteConfirmationModal = ({
  orderId,
  onConfirm,
  onCancel,
}: {
  orderId: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      console.error("Delete confirmation error:", err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this order? This action cannot be
            undone.
          </p>
          <p className="text-muted-foreground mb-6 text-sm break-all">
            <span className="font-medium">Order ID:</span> {orderId}
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusOptions = [
  {
    value: "placed",
    label: "Placed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "approved",
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "processed",
    label: "Processed",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
  },
];

export default function OrdersManagementPage() {
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useGetAllOrdersQuery();
  const [updateOrderTracking] = useUpdateOrderTrackingMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [filteredOrders, setFilteredOrders] = useState<ApiOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    status: "",
    estimatedDelivery: "",
    message: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Sorting state
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc"); // Default to newest first

  // Modal state
  const [viewingOrder, setViewingOrder] = useState<ApiOrder | null>(null);

  // Add this new state for the delete confirmation modal
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Set filtered orders when orders data is loaded and apply initial sorting
  useEffect(() => {
    if (orders && orders.length > 0) {
      const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
      });
      setFilteredOrders(sortedOrders as ApiOrder[]);
    }
  }, [orders, sortDirection]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Apply search with current sort
  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = orders.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        (order.customerFirstName &&
          order.customerFirstName.toLowerCase().includes(searchLower)) ||
        order.status.toLowerCase().includes(searchLower)
      );
    });

    // Apply current sort to filtered results
    const sortedFiltered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(sortedFiltered as ApiOrder[]);
    setCurrentPage(1);
  };

  // Clear search with current sort
  const clearSearch = () => {
    setSearchQuery("");
    // Apply current sort when clearing search
    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredOrders(sortedOrders as ApiOrder[]);
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEdit = (
    orderId: string,
    currentStatus: string,
    currentEstimatedDelivery: string = "",
    currentMessage: string = "",
  ) => {
    console.log("Edit button clicked for order:", orderId);

    // Find the order to edit
    const orderToEdit = orders.find((o) => o._id === orderId);
    if (!orderToEdit) {
      console.error("Order not found");
      return;
    }

    console.log("Order to edit:", orderToEdit);

    // Get current stage from tracking stages if available
    let activeStage = "placed"; // Default fallback

    // First check if we have tracking stages available and use those
    if (orderToEdit.trackingStages) {
      if (orderToEdit.trackingStages.delivered) activeStage = "delivered";
      else if (orderToEdit.trackingStages.shipped) activeStage = "shipped";
      else if (orderToEdit.trackingStages.processed) activeStage = "processed";
      else if (orderToEdit.trackingStages.approved) activeStage = "approved";
      else if (orderToEdit.trackingStages.placed) activeStage = "placed";
    }
    // If no tracking stages or none active, try to use the current status
    else {
      const normalizedStatus = currentStatus.toLowerCase();
      if (
        ["placed", "approved", "processed", "shipped", "delivered"].includes(
          normalizedStatus,
        )
      ) {
        activeStage = normalizedStatus;
      }
    }

    console.log("Determined active stage:", activeStage);

    // Format the date for the input element (YYYY-MM-DD)
    let formattedDate = "";
    if (currentEstimatedDelivery) {
      try {
        const date = new Date(currentEstimatedDelivery);
        formattedDate = date.toISOString().split("T")[0];
      } catch (error) {
        console.error("Invalid date format", error);
      }
    }

    // Get the most recent message if none was provided
    let messageToUse = currentMessage;
    if (
      !messageToUse &&
      orderToEdit.trackingUpdates &&
      orderToEdit.trackingUpdates.length > 0
    ) {
      messageToUse =
        orderToEdit.trackingUpdates[orderToEdit.trackingUpdates.length - 1]
          .message || "";
    }

    console.log("Setting edit form with:", {
      orderId,
      currentStatus,
      activeStage,
      formattedDate,
      messageToUse,
    });

    setEditingOrder(orderId);
    setTempData({
      status: activeStage,
      estimatedDelivery: formattedDate,
      message: messageToUse,
    });
  };

  const handleStatusChange = (value: string) => {
    console.log("Status changed to:", value);
    setTempData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleEstimatedDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log("Estimated delivery changed to:", e.target.value);
    setTempData((prev) => ({
      ...prev,
      estimatedDelivery: e.target.value,
    }));
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Message changed to:", e.target.value);
    setTempData((prev) => ({
      ...prev,
      message: e.target.value,
    }));
  };

  const handleSave = async (orderId: string) => {
    console.log("=== Save Operation Debug ===");
    console.log("OrderID:", orderId);
    console.log("Current tempData state:", tempData);

    if (!orderId) {
      console.error("No order ID provided");
      toast.error("No order ID provided");
      return;
    }

    // Validate required fields
    if (!tempData.status) {
      toast.error("Please select a status");
      return;
    }

    // Ensure message is not empty
    if (!tempData.message || tempData.message.trim() === "") {
      toast.error("Please provide a status message");
      return;
    }

    try {
      // Create a simplified update payload with just the required fields
      const updateData = {
        // Required fields as per API error message
        stage: tempData.status,
        message: tempData.message.trim(),

        // Additional fields
        status: tempData.status,
        estimatedDelivery: tempData.estimatedDelivery || undefined,
        trackingStages: {
          placed: tempData.status === "placed",
          approved: tempData.status === "approved",
          processed: tempData.status === "processed",
          shipped: tempData.status === "shipped",
          delivered: tempData.status === "delivered",
        },
      };

      console.log(
        "Sending simplified update data:",
        JSON.stringify(updateData, null, 2),
      );

      // Show pending toast
      const toastId = toast.loading("Updating order status...");

      // Call the mutation
      const result = await updateOrderTracking({
        orderId,
        data: updateData,
      }).unwrap();

      console.log("Update response:", result);

      // Find the original order
      const originalOrder = orders.find((o) => o._id === orderId);
      if (!originalOrder) {
        throw new Error("Order not found");
      }

      // Create a properly typed updated order by copying all properties and overriding only what we changed
      const updatedOrder: ApiOrder = {
        ...originalOrder,
        status: tempData.status,
        estimatedDelivery:
          tempData.estimatedDelivery || originalOrder.estimatedDelivery,
        trackingStages: {
          ...(originalOrder.trackingStages || {}),
          placed: tempData.status === "placed",
          approved: tempData.status === "approved",
          processed: tempData.status === "processed",
          shipped: tempData.status === "shipped",
          delivered: tempData.status === "delivered",
        },
      };

      console.log("Manually updated order:", updatedOrder);

      // Update both filtered orders and refresh data from server
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order,
        ),
      );

      // Force refresh data from server
      await refetch();

      // Reset UI state
      setEditingOrder(null);
      setTempData({
        status: "",
        estimatedDelivery: "",
        message: "",
      });

      // Show success message
      toast.success("Order updated successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to update order:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      toast.error(
        "Failed to update order: Stage and message are required for tracking update",
      );
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    setEditingOrder(null);
  };

  // View order details
  const handleViewDetails = (order: ApiOrder) => {
    setViewingOrder(order);
  };

  // Close order details modal
  const handleCloseDetails = () => {
    setViewingOrder(null);
  };

  // Handle order deletion
  const handleDelete = (orderId: string) => {
    // Show delete confirmation modal
    setDeletingOrderId(orderId);
  };

  // Handle confirm deletion
  const handleConfirmDelete = async () => {
    if (!deletingOrderId) return;

    const orderId = deletingOrderId;

    try {
      // Show pending toast
      const toastId = toast.loading("Deleting order...");

      console.log("Deleting order:", orderId);

      // Call the delete API
      await deleteOrder(orderId).unwrap();

      // Update the filtered orders to remove the deleted order
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId),
      );

      // Refetch to ensure data is in sync with server
      await refetch();

      // Clear the deleting order ID
      setDeletingOrderId(null);

      // Update toast to success
      toast.success("Order deleted successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order. Please try again.");
      // Keep the modal open on error
      throw error;
    }
  };

  // Handle cancel deletion
  const handleCancelDelete = () => {
    setDeletingOrderId(null);
  };

  // Add this helper function to the component to determine the active stage
  const getActiveStage = (order: ApiOrder): string => {
    if (order.trackingStages) {
      if (order.trackingStages.delivered) return "Delivered";
      if (order.trackingStages.shipped) return "Shipped";
      if (order.trackingStages.processed) return "Processed";
      if (order.trackingStages.approved) return "Approved";
      if (order.trackingStages.placed) return "Placed";
    }
    // Fallback to capitalizing the status if no tracking stage is active
    return order.status.charAt(0).toUpperCase() + order.status.slice(1);
  };

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

  return (
    <div className="flex h-screen w-full">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <header className="bg-background sticky top-0 z-10 flex h-16 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <Link to={"/"}>
                      <BreadcrumbLink>Admin</BreadcrumbLink>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Orders Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-4">
            <div className="mb-4">
              <h1 className="mb-2 text-2xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">
                Manage order statuses and estimated delivery dates.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Placed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.trackingStages?.placed).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Approved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.trackingStages?.approved).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Processed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.trackingStages?.processed).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Delivered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.trackingStages?.delivered).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Search Orders</CardTitle>
                  <CardDescription>
                    Find orders by ID, customer name, or status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
                    onSubmit={applySearch}
                  >
                    <div className="relative w-full flex-1">
                      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                      <Input
                        type="search"
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <Button type="submit">Search</Button>
                      {searchQuery && (
                        <Button variant="outline" onClick={clearSearch}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
                    <div>
                      <CardTitle>All Orders</CardTitle>
                      <CardDescription>
                        View and manage all customer orders
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSortDirection}
                      className="flex items-center gap-1 self-end sm:self-auto"
                    >
                      Date
                      {sortDirection === "desc" ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full overflow-x-auto">
                    <Table className="w-full min-w-[800px] table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[25%] text-xs">
                            Order ID
                          </TableHead>
                          <TableHead className="w-[12%] text-xs">
                            Customer
                          </TableHead>
                          <TableHead
                            className="hidden w-[10%] cursor-pointer text-xs sm:table-cell"
                            onClick={toggleSortDirection}
                          >
                            <div className="flex items-center gap-1">
                              Date
                              {sortDirection === "desc" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : (
                                <ArrowUp className="h-3 w-3" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="hidden w-[12%] text-xs sm:table-cell">
                            Payment Status
                          </TableHead>
                          <TableHead className="w-[15%] text-xs">
                            Order Stage
                          </TableHead>
                          <TableHead className="hidden w-[15%] text-xs md:table-cell">
                            Estimated Delivery
                          </TableHead>
                          <TableHead className="w-[8%] text-xs">
                            Total
                          </TableHead>
                          <TableHead className="w-[10%] text-xs">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentOrders.map((order) => (
                          <TableRow key={order._id} className="relative">
                            {editingOrder === order._id ? (
                              <>
                                <TableCell colSpan={8}>
                                  <div className="flex flex-col space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="status">
                                          Order Status
                                        </Label>
                                        <Select
                                          value={tempData.status}
                                          onValueChange={handleStatusChange}
                                          defaultValue={tempData.status}
                                        >
                                          <SelectTrigger
                                            id="status"
                                            className="w-full"
                                          >
                                            <SelectValue>
                                              {statusOptions.find(
                                                (s) =>
                                                  s.value === tempData.status,
                                              ) ? (
                                                <div className="flex items-center gap-2">
                                                  <Badge
                                                    className={
                                                      statusOptions.find(
                                                        (s) =>
                                                          s.value ===
                                                          tempData.status,
                                                      )?.color || ""
                                                    }
                                                  >
                                                    {statusOptions.find(
                                                      (s) =>
                                                        s.value ===
                                                        tempData.status,
                                                    )?.label || tempData.status}
                                                  </Badge>
                                                </div>
                                              ) : (
                                                "Select status"
                                              )}
                                            </SelectValue>
                                          </SelectTrigger>
                                          <SelectContent>
                                            {statusOptions.map((status) => (
                                              <SelectItem
                                                key={status.value}
                                                value={status.value}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Badge
                                                    className={status.color}
                                                  >
                                                    {status.label}
                                                  </Badge>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="delivery">
                                          Estimated Delivery
                                        </Label>
                                        <Input
                                          id="delivery"
                                          type="date"
                                          value={tempData.estimatedDelivery}
                                          onChange={
                                            handleEstimatedDeliveryChange
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="message">
                                        Status Message{" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <textarea
                                        id="message"
                                        className="border-input bg-background min-h-[80px] w-full rounded-md border px-3 py-2"
                                        placeholder="Add a message about the status update... (required)"
                                        value={tempData.message}
                                        onChange={handleMessageChange}
                                        required
                                      />
                                      <div className="text-xs text-gray-500">
                                        A message is required for the status
                                        update
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          console.log(
                                            "Save button clicked. Current tempData:",
                                            tempData,
                                          );
                                          handleSave(order._id);
                                        }}
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="text-xs font-medium">
                                  <div
                                    className="overflow-hidden break-all text-ellipsis whitespace-normal"
                                    title={order._id}
                                  >
                                    {order._id}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs">
                                  <div className="truncate">
                                    {order.customerFirstName || "N/A"}{" "}
                                    {order.customerLastName || ""}
                                  </div>
                                  <div
                                    className="text-muted-foreground w-full truncate text-[11px] break-all"
                                    title={order.email || ""}
                                  >
                                    {order.email || "No email provided"}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden text-xs sm:table-cell">
                                  {format(
                                    new Date(order.createdAt),
                                    "MMM d, yyyy",
                                  )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge
                                    className="py-0.5 text-[10px]"
                                    variant={
                                      order.status === "paid" ||
                                      order.status === "completed"
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`py-0.5 text-[10px] ${
                                      order.trackingStages?.delivered
                                        ? "border-green-200 bg-green-100 text-green-800"
                                        : order.trackingStages?.shipped
                                          ? "border-purple-200 bg-purple-100 text-purple-800"
                                          : order.trackingStages?.processed
                                            ? "border-indigo-200 bg-indigo-100 text-indigo-800"
                                            : order.trackingStages?.approved
                                              ? "border-green-200 bg-green-100 text-green-800"
                                              : "border-blue-200 bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {getActiveStage(order)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden text-xs md:table-cell">
                                  {order.estimatedDelivery
                                    ? format(
                                        new Date(order.estimatedDelivery),
                                        "MMM d, yyyy",
                                      )
                                    : order.estimatedDeliveryDate
                                      ? format(
                                          new Date(order.estimatedDeliveryDate),
                                          "MMM d, yyyy",
                                        )
                                      : "N/A"}
                                </TableCell>
                                <TableCell className="text-xs">
                                  ৳{Number(order.totalPrice).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex h-7 items-center gap-1 text-xs"
                                      >
                                        <MoreHorizontal className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleViewDetails(order)}
                                        className="cursor-pointer text-xs"
                                      >
                                        <Eye className="mr-2 h-3 w-3" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleEdit(
                                            order._id,
                                            order.status,
                                            order.estimatedDelivery ||
                                              order.estimatedDeliveryDate ||
                                              "",
                                            order.trackingUpdates &&
                                              order.trackingUpdates.length > 0
                                              ? order.trackingUpdates[
                                                  order.trackingUpdates.length -
                                                    1
                                                ].message
                                              : "",
                                          )
                                        }
                                        className="cursor-pointer text-xs"
                                      >
                                        <Pencil className="mr-2 h-3 w-3" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDelete(order._id)}
                                        className="cursor-pointer text-xs text-red-500"
                                      >
                                        <Trash className="mr-2 h-3 w-3" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <div className="flex flex-col items-center justify-between gap-2 border-t px-3 py-3 text-sm sm:flex-row sm:px-4">
                  <div className="text-muted-foreground text-center sm:text-left">
                    Showing {indexOfFirstOrder + 1} to{" "}
                    {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                    {filteredOrders.length} orders
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className="h-7 w-7 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>

      {/* Order Details Modal */}
      {viewingOrder && (
        <OrderDetailsModal order={viewingOrder} onClose={handleCloseDetails} />
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrderId && (
        <DeleteConfirmationModal
          orderId={deletingOrderId}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
