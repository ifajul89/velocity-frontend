import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
// import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct";
import AllProducts from "@/pages/AllProducts/AllProducts";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/all-product",
        element: <AllProducts />,
      },
    ],
  },



  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: 'add-product',
        element: <AddProduct/>,
      }
    ]
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
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/all-products",
    element: <AllProducts />,
  },
]);

export default routes;
