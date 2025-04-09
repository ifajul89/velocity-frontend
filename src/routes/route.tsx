import App from "@/layout/App";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Home from "@/pages/Home";
import Product from "@/pages/Product/Product";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import Checkout from "@/pages/Checkout/Checkout";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

const routes = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },
  
  // Authentication routes
  {
    path: "login",
    element: <SignIn />,
  },
  {
    path: "register",
    element: <SignUp />,
  },
  
  // User protected routes
  {
    path: "dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "profile",
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
  },
  {
    path: "track-order",
    element: <ProtectedRoute><TrackOrderPage /></ProtectedRoute>,
  },
  
  // Admin protected routes
  {
    path: "admin",
    children: [
      {
        path: "orders",
        element: <ProtectedRoute requireAdmin={true}><OrdersManagementPage /></ProtectedRoute>,
      },
      // You can add more admin routes here
    ],
  },
]);

export default routes;
