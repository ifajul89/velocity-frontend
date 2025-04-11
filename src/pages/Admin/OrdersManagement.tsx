import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { OrderService, Order } from "@/services/OrderService";
import { Link } from "react-router-dom";
import { AppSidebar } from "@/components/Dashboard";

const statusOptions = [
  {
    value: "Pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "Processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "In Transit",
    label: "In Transit",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    value: "Shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    value: "Delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [tempData, setTempData] = useState({
    status: "",
    estimatedDelivery: "",
  });

  // Load initial orders
  useEffect(() => {
    // Fetch orders...
    const mockOrders: Order[] = OrderService.getAllOrders();
    
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  const handleEdit = (
    orderId: string,
    currentStatus: string,
    currentEstimatedDelivery: string,
  ) => {
    setEditingOrder(orderId);
    setTempData({
      status: currentStatus,
      estimatedDelivery: currentEstimatedDelivery,
    });
  };

  const handleStatusChange = (value: string) => {
    setTempData({
      ...tempData,
      status: value,
    });
  };

  const handleEstimatedDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTempData({
      ...tempData,
      estimatedDelivery: e.target.value,
    });
  };

  const handleSave = (orderId: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, ...tempData }
          : order
      )
    );
    setFilteredOrders(
      filteredOrders.map((order) =>
        order.id === orderId
          ? { ...order, ...tempData }
          : order
      )
    );
    setEditingOrder(null);
  };

  const handleCancel = () => {
    // Cancel editing
    setEditingOrder(null);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <Link to={'/'}><BreadcrumbLink>Admin</BreadcrumbLink></Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Orders Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <main className="flex-1 p-4">
            <div className="mb-4">
              <h1 className="mb-2 text-2xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">
                Manage order statuses and estimated delivery dates.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "Pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Transit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "In Transit").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "Delivered").length}
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
                    className="flex items-center gap-4" 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFilteredOrders(
                        orders.filter((order) => {
                          const searchLower = searchQuery.toLowerCase();
                          return (
                            order.id.toLowerCase().includes(searchLower) ||
                            order.contactInfo.name.toLowerCase().includes(searchLower) ||
                            order.status.toLowerCase().includes(searchLower)
                          );
                        })
                      );
                    }}
                  >
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button type="submit">Search</Button>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setFilteredOrders(orders);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>
                    View and manage all customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Estimated Delivery</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="relative">
                            {editingOrder === order.id ? (
                              <>
                                <TableCell colSpan={7}>
                                  <div className="flex flex-col space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="status">Order Status</Label>
                                        <Select
                                          value={tempData.status}
                                          onValueChange={handleStatusChange}
                                        >
                                          <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {statusOptions.map((status) => (
                                              <SelectItem
                                                key={status.value}
                                                value={status.value}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Badge className={status.color}>
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
                                          onChange={handleEstimatedDeliveryChange}
                                        />
                                      </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                      >
                                        Cancel
                                      </Button>
                                      <Button onClick={() => handleSave(order.id)}>
                                        Save Changes
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="font-medium">
                                  {order.id}
                                </TableCell>
                                <TableCell>
                                  <div>{order.contactInfo.name}</div>
                                  <div className="text-muted-foreground text-sm">
                                    {order.contactInfo.email}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(order.date), "MMM d, yyyy")}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      order.status === "Delivered"
                                        ? "default"
                                        : order.status === "In Transit"
                                        ? "secondary"
                                        : "default"
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {order.estimatedDelivery
                                    ? format(
                                        new Date(order.estimatedDelivery),
                                        "MMM d, yyyy"
                                      )
                                    : "N/A"}
                                </TableCell>
                                <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(order.id, order.status, order.estimatedDelivery)}
                                  >
                                    Edit
                                  </Button>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <div className="border-t px-4 py-3 text-sm text-muted-foreground">
                  Showing 1 to {filteredOrders.length} of {orders.length} orders
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
