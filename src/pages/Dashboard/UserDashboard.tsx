import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { NavLink } from "react-router-dom";

export default function UserDashboard() {
  const user = useAppSelector(currentUser);

  return (
    <div className="h-full w-full bg-slate-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <NavLink to="/dashboard" className="font-medium text-blue-600">
                  Dashboard
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">
                  User Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex min-h-screen flex-1 flex-col gap-6 p-6">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="mb-6 text-gray-600">
            Manage your orders and account details from this personal dashboard.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="relative z-10">
                <h3 className="mb-2 text-lg font-semibold text-blue-800">
                  My Orders
                </h3>
                <p className="mb-4 max-w-xs text-blue-700">
                  View and track all your previous orders in one central
                  location.
                </p>
                <NavLink
                  to="/dashboard/my-orders"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  View Orders
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </NavLink>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 text-blue-500"
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
            </div>

            <div className="relative overflow-hidden rounded-xl border border-purple-100 bg-purple-50 p-5">
              <div className="relative z-10">
                <h3 className="mb-2 text-lg font-semibold text-purple-800">
                  Track Orders
                </h3>
                <p className="mb-4 max-w-xs text-purple-700">
                  Get real-time updates on your current orders and shipments.
                </p>
                <NavLink
                  to="/dashboard/track-order"
                  className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                >
                  Track Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </NavLink>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
