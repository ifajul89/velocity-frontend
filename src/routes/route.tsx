import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
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
    console.log(user)
    
    // Check Redux store first, then localStorage
    let token = currentToken(state);
    
    if (!token) {
        // Try to get from localStorage
        token = localStorage.getItem('token');
        console.log('Using token from localStorage:', token);
    }
    
    console.log('token', token)

    if (!token) {
        console.log('No token found, redirecting to login');
        // Return a redirect object with the proper format
        return {
            redirect: '/login',
            message: 'You must be logged in to view this product'
        };
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error ${response.status}: ${errorText || 'Failed to fetch car details.'}`);
            return { 
                error: true, 
                message: errorText || "Failed to fetch car data"
            };
        }

        const json = await response.json();
        console.log("Car data successfully loaded:", json);
        return { data: json.data }; // return only the car object
    } catch (error) {
        console.error("Loader Error:", error);
        return { 
            error: true, 
            message: error instanceof Error ? error.message : "Something went wrong while fetching the product data."
        };
    }
};


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
        path: "product",
        element: <Product />,
      },
      {
        path: "all-product",
        element: <AllProducts />,
      },
      {
        path: "checkout",
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,
      },
      {
        path: "order/verify",
        element: <ProtectedRoute><OrderVerification /></ProtectedRoute>,
      },
      {
        path: "track-order",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <TrackOrderPage />,
          }
        ],
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "carDetails/:id",
        element: <ProtectedRoute><Product /></ProtectedRoute>,
        loader: productLoader,
      },
    ],
  },

  // Authentication routes
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <ErrorBoundary />,
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
    path: "admin/orders",
    element: <OrdersManagementPage />,
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
  
  // Protected routes
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "track-my-order",
    element: (
      <ProtectedRoute>
        <TrackOrderPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
]);

export default routes;
