import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import Checkout from "@/pages/Checkout/Checkout";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Dashboard } from "@/components/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct";
import AllProducts from "@/pages/AllProducts/AllProducts";
import Product from "@/pages/Product/Product";
import ManageProduct from "@/pages/Admin/ManageProduct";
import About from "@/pages/About/About";

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
        path: "/car/:id",
        element: <Product />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/api/cars/${params.id}`),
      },
      {
        path: "/all-cars",
        element: <AllProducts />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "track-order",
        element: <TrackOrderPage />,
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
      { path: "add-product", element: <AddProduct /> },
      {
        path: "manage-products",
        element: <ManageProduct />,
      },
      {
        path: "orders",
        element: <OrdersManagementPage />,
      },
    ],
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },

  {
    path: "admin/orders",
    element: <OrdersManagementPage />,
  },

  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "track-my-order",
    element: <TrackOrderPage />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "register",
    element: <SignUp />,
  },
  {
    path: "/all-products/:id",
    element: <AllProducts />,
    loader: () => fetch(`http://localhost:5000/api/cars/`),
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
  // {
  //   path: "admin",
  //   children: [
  //     {
  //       path: "orders",
  //       element: (
  //         <ProtectedRoute requireAdmin={true}>
  //           <OrdersManagement />
  //         </ProtectedRoute>
  //       ),
  //     },
  //   ],
  // },
]);

export default routes;
