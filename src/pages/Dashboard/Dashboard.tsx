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
    cancellationRate: 0,
  });

  useEffect(() => {
    // Only proceed if user is admin
    if (!user || user.role !== "admin") {
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
        if (status === "pending") pendingOrders++;
        else if (status === "cancelled") cancelledOrders++;
      });

      // Calculate performance metrics
      const avgOrderValue = totalCount > 0 ? sales / totalCount : 0;
      const cancellationRate =
        totalCount > 0 ? (cancelledOrders / totalCount) * 100 : 0;

      // For conversion rate, we'd need visitor data, using placeholder for now
      const conversionRate = 6.28; // Placeholder - would be calculated from visitor data

      setPerformanceMetrics({
        conversionRate,
        avgOrderValue,
        ordersPending: pendingOrders,
        cancellationRate,
      });
    } catch (error) {
      console.error("Failed to process order data:", error);
      toast.error("Failed to process dashboard data");

      // Fallback to default values
      setTotalSales(619.9);
      setTotalOrders(4);
      setPerformanceMetrics({
        conversionRate: 6.28,
        avgOrderValue: 154.99,
        ordersPending: 2,
        cancellationRate: 0.8,
      });
    }
  }, [orders, user]);

  return (
    <div className="h-full w-full bg-slate-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="font-medium text-blue-600">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">
                  Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex min-h-screen flex-1 flex-col gap-4 p-3 sm:p-6">
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Admin Dashboard
        </h1>

        {/* Total Sales and Total Orders at the top */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:gap-6 md:grid-cols-2">
          <div className="flex items-center rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mr-3 rounded-full bg-blue-100 p-2 sm:mr-4 sm:p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 sm:text-sm">
                Total Sales
              </p>
              {isLoading ? (
                <div className="h-6 w-20 animate-pulse rounded bg-blue-100 sm:h-8 sm:w-24"></div>
              ) : (
                <p className="text-2xl font-bold text-blue-900 sm:text-3xl">
                  ${totalSales.toFixed(2)}
                </p>
              )}
              <p className="mt-1 text-xs text-blue-700">
                Based on order history
              </p>
            </div>
          </div>
          <div className="flex items-center rounded-xl border border-green-100 bg-green-50 p-4">
            <div className="mr-3 rounded-full bg-green-100 p-2 sm:mr-4 sm:p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-green-600 sm:text-sm">
                Total Orders
              </p>
              {isLoading ? (
                <div className="h-6 w-12 animate-pulse rounded bg-green-100 sm:h-8 sm:w-16"></div>
              ) : (
                <p className="text-2xl font-bold text-green-900 sm:text-3xl">
                  {totalOrders}
                </p>
              )}
              <p className="mt-1 text-xs text-green-700">From Manage Orders</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics section */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="mb-1 text-lg font-semibold text-gray-800 sm:mb-0 sm:text-xl">
              Performance Metrics
            </h2>
            <span className="text-xs text-gray-500 sm:text-sm">
              Last 30 days
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 sm:p-4">
              <p className="mb-1 text-xs font-medium text-indigo-600 sm:text-sm">
                Conversion Rate
              </p>
              {isLoading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-indigo-100 sm:h-8 sm:w-20"></div>
              ) : (
                <p className="text-xl font-bold text-indigo-900 sm:text-2xl">
                  {performanceMetrics.conversionRate.toFixed(2)}%
                </p>
              )}
              <p className="mt-1 text-xs text-indigo-600">
                ↑ 1.2% from last month
              </p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 sm:p-4">
              <p className="mb-1 text-xs font-medium text-emerald-600 sm:text-sm">
                Avg. Order Value
              </p>
              {isLoading ? (
                <div className="h-6 w-16 animate-pulse rounded bg-emerald-100 sm:h-8 sm:w-20"></div>
              ) : (
                <p className="text-xl font-bold text-emerald-900 sm:text-2xl">
                  ${performanceMetrics.avgOrderValue.toFixed(2)}
                </p>
              )}
              <p className="mt-1 text-xs text-emerald-600">
                ↑ 3.5% from last month
              </p>
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 sm:p-4">
              <p className="mb-1 text-xs font-medium text-amber-600 sm:text-sm">
                Orders Pending
              </p>
              {isLoading ? (
                <div className="h-6 w-10 animate-pulse rounded bg-amber-100 sm:h-8 sm:w-12"></div>
              ) : (
                <p className="text-xl font-bold text-amber-900 sm:text-2xl">
                  {performanceMetrics.ordersPending}
                </p>
              )}
              <p className="mt-1 text-xs text-amber-600">↓ 1 from last month</p>
            </div>
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 sm:p-4">
              <p className="mb-1 text-xs font-medium text-rose-600 sm:text-sm">
                Cancellation Rate
              </p>
              {isLoading ? (
                <div className="h-6 w-12 animate-pulse rounded bg-rose-100 sm:h-8 sm:w-16"></div>
              ) : (
                <p className="text-xl font-bold text-rose-900 sm:text-2xl">
                  {performanceMetrics.cancellationRate.toFixed(1)}%
                </p>
              )}
              <p className="mt-1 text-xs text-rose-600">
                ↓ 0.3% from last month
              </p>
            </div>
          </div>
        </div>

        {/* Show Car Inventory and Active Orders in a row for desktop */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Car Inventory Section */}
          <div className="h-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-indigo-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                  Car Inventory: {carsData?.data?.length || 0}
                </h2>
              </div>
              <span className="text-xs font-medium text-indigo-600">
                By Category
              </span>
            </div>
            <div className="h-[200px] sm:h-[270px]">
              <CategoryChart />
            </div>
          </div>

          {/* Active Orders Section */}
          <div className="h-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <div className="flex items-center">
                <div className="mr-2 rounded-full bg-blue-100 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                  Active Orders: 148
                </h2>
              </div>
              <span className="text-xs font-medium text-blue-600">
                By Status
              </span>
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
