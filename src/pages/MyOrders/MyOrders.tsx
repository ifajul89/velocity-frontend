import React, { useState, useEffect } from "react";
import { Package, Calendar, Clock, ChevronRight, ShoppingCart } from "lucide-react";
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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderService, Order } from "@/services/OrderService";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders on component mount
  useEffect(() => {
    // Simulate API call with timeout
    setTimeout(() => {
      const userOrders = OrderService.getUserOrders();
      setOrders(userOrders);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Loading your orders...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your order history.
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
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>My Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">
            View and track your order history
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="mb-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">No orders found</h3>
              <p className="mb-4 text-center text-muted-foreground">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild>
                <Link to="/all-product">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-md overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Order # {order.id}</span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {order.date}
                    </span>
                  </div>
                  <Badge className={order.statusColor}>
                    {order.status}
                  </Badge>
                </div>
                
                <div className="px-4 py-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Items</TableHead>
                        <TableHead>Delivery</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="align-top">
                          <div className="flex items-center gap-1 mb-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm py-0.5">
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-center gap-1 mb-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{order.estimatedDelivery}</span>
                          </div>
                          {order.trackingNumber !== "Not available yet" && (
                            <div className="text-sm py-0.5">
                              Tracking: {order.trackingNumber}
                            </div>
                          )}
                          <div className="text-sm py-0.5">
                            Carrier: {order.carrier}
                          </div>
                        </TableCell>
                        <TableCell className="text-right align-top">
                          <div className="text-lg font-semibold mb-4">{order.total}</div>
                          <Button asChild variant="outline" size="sm" className="ml-auto">
                            <Link to={`/track-order/${order.id}`}>
                              Track Order
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 