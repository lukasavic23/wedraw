import { BrowserRouter, Route, Routes } from "react-router-dom";
import { URLRoutes } from "../../enums/Routes";
import Login from "../../containers/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "../../containers/Welcome/Welcome";

const guestRoutes = [
  { path: URLRoutes.Empty, component: <Login /> },
  { path: URLRoutes.Register, component: <p>Register</p> },
];

const secureRoutes = [{ path: URLRoutes.Welcome, component: <Welcome /> }];

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {guestRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        {secureRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.component}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
