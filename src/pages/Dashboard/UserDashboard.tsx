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
    <div className="w-full h-full bg-slate-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <NavLink to="/dashboard" className="text-blue-600 font-medium">
                  Dashboard
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">User Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-gray-600 mb-6">
            Manage your orders and account details from this personal dashboard.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">My Orders</h3>
                <p className="text-blue-700 mb-4 max-w-xs">View and track all your previous orders in one central location.</p>
                <NavLink to="/dashboard/my-orders" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  View Orders
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </NavLink>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Track Orders</h3>
                <p className="text-purple-700 mb-4 max-w-xs">Get real-time updates on your current orders and shipments.</p>
                <NavLink to="/dashboard/track-order" className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                  Track Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
            <div className="divide-y">
              <div className="py-4 first:pt-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Order Placed</h3>
                    <p className="text-sm text-gray-600 mt-1">Your order #ORD-12347 has been placed successfully.</p>
                    <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Profile Updated</h3>
                    <p className="text-sm text-gray-600 mt-1">You successfully updated your profile information.</p>
                    <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Account Created</h3>
                    <p className="text-sm text-gray-600 mt-1">Welcome to your new account!</p>
                    <p className="text-xs text-gray-500 mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Summary</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">MEMBER SINCE</h3>
                  <span className="text-sm font-medium text-gray-900">Jan 2023</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">TOTAL ORDERS</h3>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">SAVED ADDRESSES</h3>
                  <span className="text-sm font-medium text-gray-900">1</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">REWARD POINTS</h3>
                  <span className="text-sm font-medium text-gray-900">250</span>
                </div>
              </div>
              <div className="mt-4">
                <NavLink to="/profile" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                  View Full Profile
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 