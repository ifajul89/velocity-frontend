import React, { useState, useEffect } from "react";
import { Search, Package, CheckCircle, User, Phone, Mail } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderService, Order } from "@/services/OrderService";

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("tracking");

  // Load orders on component mount
  useEffect(() => {
    const allOrders = OrderService.getUserOrders();
    setOrders(allOrders);
    if (allOrders.length > 0) {
      setSelectedOrder(allOrders[0]);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    // Search for order by ID or tracking number
    const order = OrderService.getAllOrders().find(
      (o) =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (order) {
      setSelectedOrder(order);
    } else {
      // In a real app, we'd show a message that the order wasn't found
      console.log("Order not found:", searchQuery);
    }
  };

  // If no orders loaded or no selected order, show loading indicator or message
  if (!selectedOrder) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Loading orders...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your order data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Track My Order</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Track My Order</h1>
          <p className="text-muted-foreground">
            Enter your order number or tracking number to check the status of
            your order.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Search Section */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription>
                  Find your order by entering your order number or tracking
                  number
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Enter order number or tracking number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order List */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recent order history</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {orders.map((order: Order) => (
                    <div
                      key={order.id}
                      className={`hover:bg-accent cursor-pointer p-4 ${selectedOrder && selectedOrder.id === order.id ? "bg-accent" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-muted-foreground text-sm">
                            {order.date}
                          </p>
                        </div>
                        <Badge className={order.statusColor}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex items-center text-sm">
                        <Package className="mr-1 h-4 w-4" />
                        <span>
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Order {selectedOrder.id}</CardTitle>
                    <CardDescription>
                      Placed on {selectedOrder.date}
                    </CardDescription>
                  </div>
                  <Badge className={selectedOrder.statusColor}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </CardHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b px-6">
                  <TabsList>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                    <TabsTrigger value="details">Order Details</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="pt-6">
                  <TabsContent value="tracking">
                    <div className="space-y-8">
                      {/* Stepper Progress */}
                      <div className="relative mb-8 flex items-center justify-between">
                        {/* Horizontal line connecting all steps */}
                        <div className="absolute top-6 right-0 left-0 z-0 h-0.5 bg-gray-200"></div>

                        {selectedOrder.timeline.map((step, index) => (
                          <div
                            key={index}
                            className="relative z-10 flex flex-col items-center"
                          >
                            {/* Step circle */}
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                step.completed
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle
                                className={`h-6 w-6 ${step.completed ? "text-green-600" : "text-gray-400"}`}
                              />
                            </div>

                            {/* Label */}
                            <p className="mt-2 text-sm font-medium">
                              {step.status}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Timeline Details */}
                      <div className="space-y-4">
                        <h3 className="border-l-4 border-blue-500 pl-2 text-lg font-semibold">
                          APPROVAL
                        </h3>
                        <div className="mb-6 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-500">Placed</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">
                              {selectedOrder.timeline[0].date}{" "}
                              {selectedOrder.timeline[0].time}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-green-600">
                              Your Order Is Successfully Placed
                            </p>
                          </div>
                        </div>

                        {selectedOrder.status === "Delivered" && (
                          <>
                            <h3 className="border-l-4 border-green-500 pl-2 text-lg font-semibold">
                              DELIVERED
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                              <p className="font-medium text-green-700">
                                Your order is completed and delivered on{" "}
                                {selectedOrder.timeline[4].date}{" "}
                                {selectedOrder.timeline[4].time}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3 font-medium">Order Items</h3>
                        <div className="divide-y rounded-md border">
                          {selectedOrder.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between p-4"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground text-sm">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">{item.price}</p>
                            </div>
                          ))}
                          <div className="bg-muted/50 flex justify-between p-4">
                            <p className="font-medium">Total</p>
                            <p className="font-bold">{selectedOrder.total}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3 font-medium">Shipping Address</h3>
                        <div className="rounded-md border p-4">
                          <p>{selectedOrder.contactInfo.name}</p>
                          <p className="text-muted-foreground mt-1">
                            {selectedOrder.shippingAddress}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 font-medium">
                          Contact Information
                        </h3>
                        <div className="space-y-3 rounded-md border p-4">
                          <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span>{selectedOrder.contactInfo.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span>{selectedOrder.contactInfo.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-4 w-4" />
                            <span>{selectedOrder.contactInfo.email}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 font-medium">
                          Delivery Information
                        </h3>
                        <div className="space-y-3 rounded-md border p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Shipping Method
                            </span>
                            <span>{selectedOrder.carrier}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Tracking Number
                            </span>
                            <span>{selectedOrder.trackingNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Estimated Delivery
                            </span>
                            <span>{selectedOrder.estimatedDelivery}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>

              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-muted-foreground text-sm">
                  Order status last updated: Today, 10:30 AM
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
