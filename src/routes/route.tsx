import App from "@/App";
import { createBrowserRouter } from "react-router";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

export default routes;
