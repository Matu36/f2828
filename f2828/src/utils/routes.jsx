import {
  Navigate,
  Outlet,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";

import { Home } from "../Pages/Home";
import Layout from "../components/Layout/Layout";

//   const RedirectComponent = () => {
//     const location = useLocation();

//     switch (location.pathname) {
//       case "/agentes":
//         return <Navigate to="/agentes/ver-agentes" />;

//       case "/operativos":
//         return <Navigate to="/operativos/ver-operativos" />;

//       case "/honorarios":
//         return <Navigate to="/honorarios/variables" />;

//       case "/ordenes":
//         return <Navigate to="/ordenes/ver-ordenes" />;
//     }

//     return <Outlet />;
//   };

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
