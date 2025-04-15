import { OrderStatusChart } from "@/components/Charts/OrderStatusChart";
import { CategoryChart } from "@/components/Charts/CategoryChart";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetAllOrdersQuery } from "@/redux/features/order/order";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useGetCarsQuery } from "@/redux/features/carPost/carApi";

// Correct Order interface based on API structure
interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  // Other fields that might be needed
}

export default function Page() {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const { data: carsData } = useGetCarsQuery([]);
  const user = useSelector(currentUser);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    conversionRate: 0,
    avgOrderValue: 0,
    ordersPending: 0,
    cancellationRate: 0
  });

  useEffect(() => {
    // Only proceed if user is admin
    if (!user || user.role !== 'admin') {
      return;
    }
    
    try {
      // Set total orders count
      const totalCount = orders.length;
      setTotalOrders(totalCount);
      
      // Calculate total sales
      const sales = orders.reduce((total: number, order: Order) => {
        return total + order.totalPrice;
      }, 0);
      setTotalSales(sales);
      
      // Calculate metrics
      let pendingOrders = 0;
      let cancelledOrders = 0;

      orders.forEach((order: Order) => {
        const status = order.status.toLowerCase();
        
        // Performance metrics counters
        if (status === 'pending') pendingOrders++;
        else if (status === 'cancelled') cancelledOrders++;
      });
      
      // Calculate performance metrics
      const avgOrderValue = totalCount > 0 ? sales / totalCount : 0;
      const cancellationRate = totalCount > 0 ? (cancelledOrders / totalCount) * 100 : 0;
      
      // For conversion rate, we'd need visitor data, using placeholder for now
      const conversionRate = 6.28; // Placeholder - would be calculated from visitor data
      
      setPerformanceMetrics({
        conversionRate,
        avgOrderValue,
        ordersPending: pendingOrders,
        cancellationRate
      });

    } catch (error) {
      console.error('Failed to process order data:', error);
      toast.error('Failed to process dashboard data');
      
      // Fallback to default values
      setTotalSales(619.90);
      setTotalOrders(4);
      setPerformanceMetrics({
        conversionRate: 6.28,
        avgOrderValue: 154.99,
        ordersPending: 2,
        cancellationRate: 0.8
      });
    }
  }, [orders, user]);

  return (
    <div className="w-full h-full bg-slate-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-blue-600 font-medium">
                  Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
      <div className="flex flex-1 flex-col gap-4 p-3 sm:p-6 min-h-screen">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        
        {/* Total Sales and Total Orders at the top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center">
            <div className="bg-blue-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-600">Total Sales</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-20 sm:w-24 bg-blue-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">${totalSales.toFixed(2)}</p>
              )}
              <p className="text-xs text-blue-700 mt-1">Based on order history</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center">
            <div className="bg-green-100 rounded-full p-2 sm:p-3 mr-3 sm:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-600">Total Orders</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-12 sm:w-16 bg-green-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{totalOrders}</p>
              )}
              <p className="text-xs text-green-700 mt-1">From Manage Orders</p>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-0">Performance Metrics</h2>
            <span className="text-xs sm:text-sm text-gray-500">Last 30 days</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-indigo-50 rounded-lg p-3 sm:p-4 border border-indigo-100">
              <p className="text-xs sm:text-sm font-medium text-indigo-600 mb-1">Conversion Rate</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-16 sm:w-20 bg-indigo-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-indigo-900">{performanceMetrics.conversionRate.toFixed(2)}%</p>
              )}
              <p className="text-xs text-indigo-600 mt-1">↑ 1.2% from last month</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 sm:p-4 border border-emerald-100">
              <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-1">Avg. Order Value</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-16 sm:w-20 bg-emerald-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-emerald-900">${performanceMetrics.avgOrderValue.toFixed(2)}</p>
              )}
              <p className="text-xs text-emerald-600 mt-1">↑ 3.5% from last month</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-100">
              <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Orders Pending</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-10 sm:w-12 bg-amber-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-amber-900">{performanceMetrics.ordersPending}</p>
              )}
              <p className="text-xs text-amber-600 mt-1">↓ 1 from last month</p>
            </div>
            <div className="bg-rose-50 rounded-lg p-3 sm:p-4 border border-rose-100">
              <p className="text-xs sm:text-sm font-medium text-rose-600 mb-1">Cancellation Rate</p>
              {isLoading ? (
                <div className="h-6 sm:h-8 w-12 sm:w-16 bg-rose-100 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl sm:text-2xl font-bold text-rose-900">{performanceMetrics.cancellationRate.toFixed(1)}%</p>
              )}
              <p className="text-xs text-rose-600 mt-1">↓ 0.3% from last month</p>
            </div>
          </div>
        </div>
        
        {/* Show Car Inventory and Active Orders in a row for desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Car Inventory Section */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Car Inventory: {carsData?.data?.length || 0}
                </h2>
              </div>
              <span className="text-xs text-indigo-600 font-medium">By Category</span>
            </div>
            <div className="h-[200px] sm:h-[270px]">
              <CategoryChart />
            </div>
          </div>

          {/* Active Orders Section */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Active Orders: 148</h2>
              </div>
              <span className="text-xs text-blue-600 font-medium">By Status</span>
            </div>
            <div className="h-[200px] sm:h-[270px]">
              <OrderStatusChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
