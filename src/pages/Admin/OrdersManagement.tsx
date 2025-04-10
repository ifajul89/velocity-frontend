// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { format } from "date-fns";
// import { OrderService, Order } from "@/services/OrderService";
// import { Link } from "react-router-dom";
// import { Dashboard } from "@/components/Dashboard";

// const statusOptions = [
//   {
//     value: "Pending",
//     label: "Pending",
//     color: "bg-yellow-100 text-yellow-800 border-yellow-200",
//   },
//   {
//     value: "Processing",
//     label: "Processing",
//     color: "bg-blue-100 text-blue-800 border-blue-200",
//   },
//   {
//     value: "In Transit",
//     label: "In Transit",
//     color: "bg-indigo-100 text-indigo-800 border-indigo-200",
//   },
//   {
//     value: "Shipped",
//     label: "Shipped",
//     color: "bg-purple-100 text-purple-800 border-purple-200",
//   },
//   {
//     value: "Delivered",
//     label: "Delivered",
//     color: "bg-green-100 text-green-800 border-green-200",
//   },
//   {
//     value: "Cancelled",
//     label: "Cancelled",
//     color: "bg-red-100 text-red-800 border-red-200",
//   },
// ];

// export default function OrdersManagementPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [editingOrder, setEditingOrder] = useState<string | null>(null);
//   const [tempData, setTempData] = useState({
//     status: "",
//     estimatedDelivery: "",
//   });
//   const [lastUpdated, setLastUpdated] = useState(new Date());

//   // Load orders on component mount
//   useEffect(() => {
//     setOrders(OrderService.getAllOrders());
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Filter orders based on search query
//     if (searchQuery.trim()) {
//       const lowerQuery = searchQuery.toLowerCase();
//       const filteredOrders = OrderService.getAllOrders().filter(
//         (order) =>
//           order.id.toLowerCase().includes(lowerQuery) ||
//           order.contactInfo.name.toLowerCase().includes(lowerQuery) ||
//           order.status.toLowerCase().includes(lowerQuery),
//       );
//       setOrders(filteredOrders);
//     } else {
//       // If search query is empty, show all orders
//       setOrders(OrderService.getAllOrders());
//     }
//   };

//   const handleEdit = (
//     orderId: string,
//     currentStatus: string,
//     currentEstimatedDelivery: string,
//   ) => {
//     setEditingOrder(orderId);
//     setTempData({
//       status: currentStatus,
//       estimatedDelivery: currentEstimatedDelivery,
//     });
//   };

//   const handleStatusChange = (value: string) => {
//     setTempData({
//       ...tempData,
//       status: value,
//     });
//   };

//   const handleEstimatedDeliveryChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setTempData({
//       ...tempData,
//       estimatedDelivery: e.target.value,
//     });
//   };

//   const handleSave = (orderId: string) => {
//     // Update order in the service
//     const updatedOrder = OrderService.updateOrderStatus(
//       orderId,
//       tempData.status,
//       tempData.estimatedDelivery,
//     );

//     if (updatedOrder) {
//       // Refresh orders list
//       setOrders(OrderService.getAllOrders());

//       // Update last updated timestamp
//       setLastUpdated(new Date());

//       // Reset editing state
//       setEditingOrder(null);
//     }
//   };

//   const handleCancel = () => {
//     // Cancel editing
//     setEditingOrder(null);
//   };

//   const handleDelete = (orderId: string) => {
//     // Delete from service
//     console.log(orderId);
//     setOrders(
//       OrderService.getAllOrders().filter((order) => order.id !== orderId),
//     );
//   };

//   return (
//     <SidebarProvider>
//       <Dashboard />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b">
//           <div className="flex items-center gap-2 px-3">
//             <SidebarTrigger />
//             <Separator orientation="vertical" className="mr-2 h-4" />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <Link to={'/'}><BreadcrumbLink>Admin</BreadcrumbLink></Link>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Orders Management</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>

//         <div className="container mx-auto p-6">
//           <div className="mb-6">
//             <h1 className="mb-2 text-2xl font-bold">Orders Management</h1>
//             <p className="text-muted-foreground">
//               Manage order statuses and estimated delivery dates.
//             </p>
//           </div>

//           <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Orders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{orders.length}</div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">Pending</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {orders.filter((o) => o.status === "Pending").length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   In Transit
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {orders.filter((o) => o.status === "In Transit").length}
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-sm font-medium">Delivered</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {orders.filter((o) => o.status === "Delivered").length}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             {/* Search and Filters */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Search Orders</CardTitle>
//                 <CardDescription>
//                   Find orders by ID, customer name, or status
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSearch} className="flex gap-2">
//                   <Input
//                     placeholder="Search orders..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="flex-1"
//                   />
//                   <Button type="submit">
//                     <Search className="mr-2 h-4 w-4" />
//                     Search
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Orders Table */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>All Orders</CardTitle>
//                 <CardDescription>
//                   Manage and update order statuses
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Order ID</TableHead>
//                       <TableHead>Customer</TableHead>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Est. Delivery</TableHead>
//                       <TableHead>Total</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {orders.map((order) => (
//                       <TableRow key={order.id}>
//                         <TableCell className="font-medium">
//                           {order.id}
//                         </TableCell>
//                         <TableCell>
//                           <div>{order.contactInfo.name}</div>
//                           <div className="text-muted-foreground text-sm">
//                             {order.contactInfo.email}
//                           </div>
//                         </TableCell>
//                         <TableCell>{order.date}</TableCell>
//                         <TableCell>
//                           {editingOrder === order.id ? (
//                             <Select
//                               value={tempData.status}
//                               onValueChange={handleStatusChange}
//                             >
//                               <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select status" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {statusOptions.map((status) => (
//                                   <SelectItem
//                                     key={status.value}
//                                     value={status.value}
//                                   >
//                                     <div className="flex items-center gap-2">
//                                       <Badge className={status.color}>
//                                         {status.label}
//                                       </Badge>
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           ) : (
//                             <Badge className={order.statusColor}>
//                               {order.status}
//                             </Badge>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           {editingOrder === order.id ? (
//                             <div className="flex flex-col space-y-1">
//                               <Label
//                                 htmlFor={`est-delivery-${order.id}`}
//                                 className="text-xs"
//                               >
//                                 Estimated Delivery:
//                               </Label>
//                               <Input
//                                 id={`est-delivery-${order.id}`}
//                                 value={tempData.estimatedDelivery}
//                                 onChange={handleEstimatedDeliveryChange}
//                                 className="h-8"
//                               />
//                             </div>
//                           ) : (
//                             order.estimatedDelivery
//                           )}
//                         </TableCell>
//                         <TableCell>{order.total}</TableCell>
//                         <TableCell>
//                           {editingOrder === order.id ? (
//                             <div className="flex space-x-2">
//                               <Button
//                                 size="sm"
//                                 variant="default"
//                                 onClick={() => handleSave(order.id)}
//                                 className="h-8"
//                               >
//                                 Save
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={handleCancel}
//                                 className="h-8"
//                               >
//                                 Cancel
//                               </Button>
//                             </div>
//                           ) : (
//                             <div className="flex space-x-2">
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() =>
//                                   handleEdit(
//                                     order.id,
//                                     order.status,
//                                     order.estimatedDelivery,
//                                   )
//                                 }
//                                 className="h-8"
//                               >
//                                 Edit
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => handleDelete(order.id)}
//                                 className="h-8"
//                               >
//                                 Delete
//                               </Button>
//                             </div>
//                           )}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <div className="text-muted-foreground text-sm">
//                   Showing {orders.length} orders
//                 </div>
//                 <div className="text-muted-foreground text-sm">
//                   Last updated: {format(lastUpdated, "MMM d, yyyy 'at' h:mm a")}
//                 </div>
//               </CardFooter>
//             </Card>

//             {/* Order Statistics */}
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
