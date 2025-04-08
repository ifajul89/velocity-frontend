import React, { useState } from "react"
import { Search, Package, CheckCircle, MapPin, Phone, Mail, User } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample order data
const sampleOrders = [
  {
    id: "ORD-12345",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-800 border-blue-200",
    date: "May 15, 2023",
    estimatedDelivery: "May 18, 2023",
    items: [
      { name: "Product A", quantity: 2, price: "$49.99" },
      { name: "Product B", quantity: 1, price: "$29.99" }
    ],
    total: "$129.97",
    trackingNumber: "TRK987654321",
    carrier: "FedEx",
    currentLocation: "Distribution Center, Chicago, IL",
    timeline: [
      { date: "May 15, 2023", time: "10:30 AM", status: "Order Placed", completed: true },
      { date: "May 15, 2023", time: "2:45 PM", status: "Order Confirmed", completed: true },
      { date: "May 16, 2023", time: "9:15 AM", status: "Picked Up", completed: true },
      { date: "May 16, 2023", time: "5:30 PM", status: "In Transit", completed: true },
      { date: "May 17, 2023", time: "11:20 AM", status: "Out for Delivery", completed: false },
      { date: "May 18, 2023", time: "9:00 AM", status: "Delivered", completed: false }
    ],
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    contactInfo: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com"
    }
  },
  {
    id: "ORD-12346",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-800 border-green-200",
    date: "May 10, 2023",
    estimatedDelivery: "May 13, 2023",
    items: [
      { name: "Product C", quantity: 1, price: "$79.99" }
    ],
    total: "$79.99",
    trackingNumber: "TRK123456789",
    carrier: "UPS",
    currentLocation: "Delivered to Customer",
    timeline: [
      { date: "May 10, 2023", time: "3:20 PM", status: "Order Placed", completed: true },
      { date: "May 10, 2023", time: "5:45 PM", status: "Order Confirmed", completed: true },
      { date: "May 11, 2023", time: "10:15 AM", status: "Picked Up", completed: true },
      { date: "May 11, 2023", time: "4:30 PM", status: "In Transit", completed: true },
      { date: "May 12, 2023", time: "9:20 AM", status: "Out for Delivery", completed: true },
      { date: "May 13, 2023", time: "11:00 AM", status: "Delivered", completed: true }
    ],
    shippingAddress: "456 Oak Ave, New York, NY 10002",
    contactInfo: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com"
    }
  }
]

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(sampleOrders[0])
  const [activeTab, setActiveTab] = useState("tracking")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search for orders
    console.log("Searching for:", searchQuery)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
            <h1 className="text-2xl font-bold mb-2">Track My Order</h1>
            <p className="text-muted-foreground">Enter your order number or tracking number to check the status of your order.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Search Section */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Tracking</CardTitle>
                  <CardDescription>Find your order by entering your order number or tracking number</CardDescription>
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
                      <Search className="h-4 w-4 mr-2" />
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
                    {sampleOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className={`p-4 cursor-pointer hover:bg-accent ${selectedOrder.id === order.id ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <Badge className={order.statusColor}>{order.status}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Package className="h-4 w-4 mr-1" />
                          <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
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
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order {selectedOrder.id}</CardTitle>
                      <CardDescription>Placed on {selectedOrder.date}</CardDescription>
                    </div>
                    <Badge className={selectedOrder.statusColor}>{selectedOrder.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="tracking">Tracking</TabsTrigger>
                      <TabsTrigger value="details">Order Details</TabsTrigger>
                      <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tracking">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Tracking Number</p>
                            <p className="font-medium">{selectedOrder.trackingNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Carrier</p>
                            <p className="font-medium">{selectedOrder.carrier}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                            <p className="font-medium">{selectedOrder.estimatedDelivery}</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute left-4 top-0 h-full w-0.5 bg-border"></div>
                          <div className="space-y-6">
                            {selectedOrder.timeline.map((event, index) => (
                              <div key={index} className="relative pl-10">
                                <div className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${
                                  event.completed 
                                    ? 'bg-primary border-primary' 
                                    : 'bg-background border-muted-foreground'
                                }`}></div>
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">{event.status}</p>
                                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                                  </div>
                                  {event.completed && (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-accent p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Current Location</p>
                              <p className="text-sm text-muted-foreground">{selectedOrder.currentLocation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Order Items</h3>
                          <div className="border rounded-lg divide-y">
                            {selectedOrder.items.map((item, index) => (
                              <div key={index} className="p-4 flex justify-between">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-medium">{item.price}</p>
                              </div>
                            ))}
                            <div className="p-4 flex justify-between bg-accent">
                              <p className="font-medium">Total</p>
                              <p className="font-medium">{selectedOrder.total}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shipping">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                          <div className="p-4 border rounded-lg">
                            <p>{selectedOrder.shippingAddress}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder.contactInfo.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder.contactInfo.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedOrder.contactInfo.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Download Invoice</Button>
                  <Button>Contact Support</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 