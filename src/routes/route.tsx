import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
// import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import Checkout from "@/pages/Checkout/Checkout";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Dashboard } from "@/components/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct";
import AllProducts from "@/pages/AllProducts/AllProducts";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Product from "@/pages/Product/Product";

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
        path: "/all-product",
        element: <AllProducts />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
    ],
  },

  // Authentication routes
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "add-product",
        element: <AddProduct />,
      },
    ],
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "track-order",
    element: <TrackOrderPage />,
  },
  {
    path: "admin/orders",
    // element: <OrdersManagementPage />,
  },

  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "register",
    element: <SignUp />,
  },

  // User protected routes
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "track-order",
    element: (
      <ProtectedRoute>
        <TrackOrderPage />
      </ProtectedRoute>
    ),
  },

  // Admin protected routes
  {
    path: "admin",
    children: [
      {
        path: "orders",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <OrdersManagementPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default routes;
