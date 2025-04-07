import App from "@/layout/App";
import { createBrowserRouter } from "react-router";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/test",
        element: <div>Hello</div>,
      },
    ],
  },
]);

export default routes;
