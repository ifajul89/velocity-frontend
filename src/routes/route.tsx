import App from "@/layout/App";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import OrdersManagementPage from "@/pages/Admin/OrdersManagement";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn/SignIn";
import SignUp from "@/pages/SignUp/SignUp";
import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import AddProduct from "@/pages/Admin/AddProduct";
import AllProducts from "@/pages/AllProducts/AllProducts";
import ManageProduct from "@/pages/Admin/ManageProduct";
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
      {
        path: "track-order",
        element: <TrackOrderPage />,
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
      },
      {
        path: 'manage-products',
        element: <ManageProduct />,
      },
      {
        path: "orders",
        element: <OrdersManagementPage />,
      },
      {

      }
    ]
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
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
]);

export default routes;
