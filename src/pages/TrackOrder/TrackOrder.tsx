import React, { useState } from "react";
import { Search, CheckCircle, User, Phone, Mail } from "lucide-react";
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
import { useTrackOrderQuery } from "@/redux/features/order/order";
import { format } from "date-fns";
import { toast } from "sonner";

// Helper function to get estimated delivery date from order data
const getEstimatedDelivery = (orderData: unknown): string | undefined => {
  if (!orderData || typeof orderData !== 'object') return undefined;
  
  const data = orderData as Record<string, any>;
  
  // Check direct properties first
  if (data.estimatedDelivery && typeof data.estimatedDelivery === 'string') {
    return data.estimatedDelivery;
  }
  
  if (data.estimatedDeliveryDate && typeof data.estimatedDeliveryDate === 'string') {
    return data.estimatedDeliveryDate;
  }
  
  // Check for nested properties
  if (data.shipping && typeof data.shipping === 'object') {
    const shipping = data.shipping as Record<string, any>;
    if (shipping.estimatedDelivery) return shipping.estimatedDelivery;
    if (shipping.estimatedDeliveryDate) return shipping.estimatedDeliveryDate;
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

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTab, setActiveTab] = useState("tracking");

  const {
    data: orderData,
    isLoading,
    isError
  } = useTrackOrderQuery(trackingNumber, {
    skip: !trackingNumber,
  });

  // Debug estimated delivery
  React.useEffect(() => {
    if (orderData) {
      console.log("Order Data:", orderData);
      console.log("Estimated Delivery from API:", orderData.estimatedDelivery);
      console.log("Estimated Delivery from helper:", getEstimatedDelivery(orderData));
    }
  }, [orderData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setTrackingNumber(searchQuery);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Loading order details...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the order information.
          </p>
        </div>
      </div>
    );
  }

  // Show error state if API call fails
  if (isError && trackingNumber) {
    toast.error("Failed to find order with the provided tracking number");
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your tracking number to check the status of
            your order.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Search Section */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription className="text-red-600">
                  Find your order by entering your tracking number (make sure no space in front of your tracking number)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Enter tracking number (Example: TRK-m9gbma3i-7NV7M)"
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

          {orderData && (
            <>
              {/* Order Details */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Order Details</CardTitle>
                        <CardDescription>
                          Tracking Number: {orderData.trackingNumber}
                        </CardDescription>
                        {getEstimatedDelivery(orderData) && (
                          <CardDescription className="mt-1">
                            Estimated Delivery: {getEstimatedDelivery(orderData)}
                          </CardDescription>
                        )}
                      </div>
                      <Badge className={orderData.status === "Paid" ? "bg-green-500" : "bg-amber-500"}>
                        {orderData.status}
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
                          {/* Estimated Delivery Banner */}
                          {getEstimatedDelivery(orderData) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="rounded-full bg-blue-100 p-2 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                    <rect width="16" height="16" x="4" y="4" rx="2" />
                                    <path d="M16 2v4" />
                                    <path d="M8 2v4" />
                                    <path d="M2 10h20" />
                                    <path d="M10 16h4" />
                                  </svg>
                                </div>
                                <div>
                                  {orderData.trackingStages.delivered ? (
                                    <>
                                      <h4 className="font-semibold text-gray-900">Order Delivered</h4>
                                      <p className="text-gray-600">Your order was delivered successfully</p>
                                    </>
                                  ) : (
                                    <>
                                      <h4 className="font-semibold text-gray-900">Estimated Delivery Date</h4>
                                      <p className="text-gray-600">Your order is expected to be delivered on:</p>
                                    </>
                                  )}
                                </div>
                              </div>
                              {!orderData.trackingStages.delivered && (
                                <div className="text-xl font-bold text-blue-700">{getEstimatedDelivery(orderData)}</div>
                              )}
                            </div>
                          )}
                          
                          {/* Stepper Progress */}
                          <div className="relative mb-8 flex items-center justify-between">
                            {/* Horizontal line connecting all steps */}
                            <div className="absolute top-6 right-0 left-0 z-0 h-0.5 bg-gray-200"></div>

                            {/* Placed */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                orderData.trackingStages.placed
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}>
                                <CheckCircle className={`h-6 w-6 ${orderData.trackingStages.placed ? "text-green-600" : "text-gray-400"}`} />
                              </div>
                              <p className="mt-2 text-sm font-medium">Placed</p>
                            </div>

                            {/* Approved */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                orderData.trackingStages.approved
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}>
                                <CheckCircle className={`h-6 w-6 ${orderData.trackingStages.approved ? "text-green-600" : "text-gray-400"}`} />
                              </div>
                              <p className="mt-2 text-sm font-medium">Approved</p>
                            </div>

                            {/* Processed */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                orderData.trackingStages.processed
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}>
                                <CheckCircle className={`h-6 w-6 ${orderData.trackingStages.processed ? "text-green-600" : "text-gray-400"}`} />
                              </div>
                              <p className="mt-2 text-sm font-medium">Processed</p>
                            </div>

                            {/* Shipped */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                orderData.trackingStages.shipped
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}>
                                <CheckCircle className={`h-6 w-6 ${orderData.trackingStages.shipped ? "text-green-600" : "text-gray-400"}`} />
                              </div>
                              <p className="mt-2 text-sm font-medium">Shipped</p>
                            </div>

                            {/* Delivered */}
                            <div className="relative z-10 flex flex-col items-center">
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                                orderData.trackingStages.delivered
                                  ? "border-green-500 bg-green-100 text-green-600"
                                  : "border-gray-300 bg-gray-100 text-gray-400"
                              }`}>
                                <CheckCircle className={`h-6 w-6 ${orderData.trackingStages.delivered ? "text-green-600" : "text-gray-400"}`} />
                              </div>
                              <p className="mt-2 text-sm font-medium">Delivered</p>
                            </div>
                          </div>

                          {/* Delivery Date Summary Card */}
                          <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
                            <div className="flex flex-col space-y-1.5 p-6 pb-4">
                              <h3 className="text-lg font-semibold leading-none tracking-tight">
                                Delivery Information
                              </h3>
                            </div>
                            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {orderData.trackingStages.delivered ? (
                                <div className="flex flex-col gap-2">
                                  <div className="text-sm text-muted-foreground">Status</div>
                                  <div className="text-xl font-bold text-green-600">Order Delivered</div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <div className="text-sm text-muted-foreground">Estimated Delivery Date</div>
                                  <div className="text-xl font-bold">{getEstimatedDelivery(orderData)}</div>
                                </div>
                              )}
                              <div className="flex flex-col gap-2">
                                <div className="text-sm text-muted-foreground">Current Location</div>
                                <div className="font-medium">
                                  {orderData.currentLocation || "Processing facility"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Timeline Details */}
                          <div className="space-y-4">
                            <h3 className="border-l-4 border-blue-500 pl-2 text-lg font-semibold">
                              ORDER TRACKING
                            </h3>
                            
                            {orderData.trackingUpdates.map((update, index) => (
                              <div key={index} className="mb-6 grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-gray-500">{update.stage.charAt(0).toUpperCase() + update.stage.slice(1)}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">
                                    {format(new Date(update.timestamp), "MMM dd, yyyy HH:mm")}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-green-600">
                                    {update.message}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details">
                        <div className="space-y-6">
                          <div>
                            <h3 className="mb-3 font-medium">Order Items</h3>
                            <div className="divide-y rounded-md border">
                              {orderData.products.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between p-4"
                                >
                                  <div>
                                    <p className="font-medium text-lg">{item.product.name}</p>
                                    <p className="text-muted-foreground text-base">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                  <p className="font-medium text-lg">${item.price.toLocaleString()}</p>
                                </div>
                              ))}
                              <div className="bg-muted/50 flex justify-between p-4">
                                <p className="font-medium text-lg">Subtotal</p>
                                <p className="font-bold text-lg">${orderData.subtotal.toLocaleString()}</p>
                              </div>
                              <div className="bg-muted/50 flex justify-between p-4">
                                <p className="font-medium text-lg">Tax</p>
                                <p className="font-bold text-lg">${orderData.tax.toLocaleString()}</p>
                              </div>
                              <div className="bg-muted/50 flex justify-between p-4">
                                <p className="font-medium text-lg">Shipping</p>
                                <p className="font-bold text-lg">${orderData.shipping.toLocaleString()}</p>
                              </div>
                              <div className="bg-muted/50 flex justify-between p-4">
                                <p className="font-medium text-lg">Total</p>
                                <p className="font-bold text-lg">${orderData.totalPrice.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="shipping">
                        <div className="space-y-6">
                          <div>
                            <h3 className="mb-3 font-medium text-xl">Shipping Address</h3>
                            <div className="rounded-md border p-4">
                              <p className="text-lg">{orderData.customerFirstName} {orderData.customerLastName}</p>
                              <p className="text-muted-foreground mt-1 text-base">
                                {orderData.address}, {orderData.city}, {orderData.zipCode}
                              </p>
                            </div>
                          </div>

                          {getEstimatedDelivery(orderData) && (
                            <div>
                              <h3 className="mb-3 font-medium text-xl">Delivery Information</h3>
                              <div className="rounded-md border p-4">
                                {orderData.trackingStages.delivered ? (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium text-green-600">Order Delivered</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Estimated Delivery Date</span>
                                    <span className="font-medium">{getEstimatedDelivery(orderData)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div>
                            <h3 className="mb-3 font-medium text-xl">
                              Contact Information
                            </h3>
                            <div className="space-y-3 rounded-md border p-4">
                              <div className="flex items-center gap-2">
                                <User className="text-muted-foreground h-5 w-5" />
                                <span className="text-lg">{orderData.customerFirstName} {orderData.customerLastName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="text-muted-foreground h-5 w-5" />
                                <span className="text-lg">{orderData.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="text-muted-foreground h-5 w-5" />
                                <span className="text-lg">{orderData.email}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="mb-3 font-medium text-xl">
                              Payment Information
                            </h3>
                            <div className="space-y-3 rounded-md border p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Transaction ID
                                </span>
                                <span>{orderData.transaction.id}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Transaction Status
                                </span>
                                <span>{orderData.transaction.transactionStatus}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Bank Status
                                </span>
                                <span>{orderData.transaction.bank_status}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Date & Time
                                </span>
                                <span>{orderData.transaction.date_time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>

                  <CardFooter className="flex justify-between border-t pt-6">
                    <div className="text-muted-foreground text-sm">
                      Order last updated: {format(new Date(orderData.updatedAt), "MMM dd, yyyy HH:mm")}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
