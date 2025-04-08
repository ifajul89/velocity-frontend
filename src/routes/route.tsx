import App from "@/layout/App";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProfilePage from "@/pages/Profile/Profile";
import TrackOrderPage from "@/pages/TrackOrder/TrackOrder";
import { Home } from "lucide-react";
import { createBrowserRouter } from "react-router-dom";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
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
    path: "track-order",
    element: <TrackOrderPage />,
  },
]);

export default routes;
