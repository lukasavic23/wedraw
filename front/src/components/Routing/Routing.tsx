import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { URLRoutes } from "../../enums/Routes";
import Login from "../../containers/Login/Login";

const Routing = () => {
  const router = createBrowserRouter([
    {
      path: URLRoutes.Empty,
      element: <Login />,
    },
    {
      path: URLRoutes.Register,
      element: <p>biocrack</p>,
    },
    {
      path: URLRoutes.Welcome,
      element: <p>welcome to my page</p>,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routing;
