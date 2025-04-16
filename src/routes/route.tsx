import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import UserManagementPage from "@/pages/Admin/UserManagement";
import MyOrdersPage from "@/pages/MyOrders/MyOrders";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import Checkout from "@/pages/Checkout/Checkout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Dashboard } from "@/components/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct";
import AllProducts from "@/pages/AllProducts/AllProducts";
import Product from "@/pages/Product/Product";
import ManageProduct from "@/pages/Admin/ManageProduct";
import About from "@/pages/About/About";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardPage from "@/pages/Dashboard/Dashboard";

import { createBrowserRouter } from "react-router-dom";
import { currentToken, currentUser } from "@/redux/features/auth/authSlice";
import { store } from "@/redux/store";
import { LoaderFunctionArgs } from "react-router-dom";
import OrderVerification from "@/pages/Checkout/verifyOrder";

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  interface User {
    name?: string;
    email?: string;
    role?: string;
    id?: string;
    [key: string]: unknown;
  }

  const id = params.id;
  console.log(`Fetching car with ID: ${id}`);
  const state = store.getState();
  const user = currentUser(state) as User;
  console.log(user);

  // Check Redux store first, then localStorage
  let token = currentToken(state);

  if (!token) {
    // Try to get from localStorage
    token = localStorage.getItem("token");
    console.log("Using token from localStorage:", token);
  }

  console.log("token", token);

  if (!token) {
    console.log("No token found, redirecting to login");
    // Return a redirect object with the proper format
    return {
      redirect: "/login",
      message: "You must be logged in to view this product",
    };
  }

  try {
    const response = await fetch(
      `https://velocity-car-shop-backend.vercel.app/api/cars/${id}`,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Error ${response.status}: ${errorText || "Failed to fetch car details."}`,
      );
      return {
        error: true,
        message: errorText || "Failed to fetch car data",
      };
    }

    const json = await response.json();
    console.log("Car data successfully loaded:", json);
    return { data: json.data }; // return only the car object
  } catch (error) {
    console.error("Loader Error:", error);
    return {
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while fetching the product data.",
    };
  }
};

import Contact from "@/pages/Contact/Contact";

const routes = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <Product />,
        loader: ({ params }) =>
          fetch(`https://velocity-car-shop-backend.vercel.app/api/cars/${params.id}`),
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
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "order/verify",
        element: (
          <ProtectedRoute>
            <OrderVerification />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "carDetails/:id",
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        ),
        loader: productLoader,
      },
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
    ],
  },

  // Authentication routes
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "add-product",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "manage-products",
        element: <ManageProduct />,
      },
      {
        path: "my-orders",
        element: <MyOrdersPage />,
      },
      {
        path: "track-order",
        element: <TrackOrderPage />,
      },
    ],
  },

  {
    path: "admin/orders",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <OrdersManagementPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },

  {
    path: "admin/users",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <UserManagementPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
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
    loader: () => fetch(`https://velocity-car-shop-backend.vercel.app/api/cars/`),
  },
  // User protected routes
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

export default routes;
