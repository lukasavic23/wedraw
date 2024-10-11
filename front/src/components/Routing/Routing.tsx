import { BrowserRouter, Route, Routes } from "react-router-dom";
import { URLRoutes } from "../../enums/Routes";
import Login from "../../containers/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Welcome from "../../containers/Welcome/Welcome";
import PersistentLogin from "./PersistentLogin";
import Register from "../../containers/Register/Register";

const guestRoutes = [
  { path: URLRoutes.Empty, component: <Login /> },
  { path: URLRoutes.Register, component: <Register /> },
];

const secureRoutes = [{ path: URLRoutes.Welcome, component: <Welcome /> }];

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PersistentLogin isGuestRoute />}>
          {guestRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
        <Route element={<PersistentLogin />}>
          {secureRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.component}</ProtectedRoute>}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
