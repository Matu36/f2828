import { createBrowserRouter } from "react-router-dom";

import { Home } from "../Pages/Home";
import Layout from "../components/Layout/Layout";
import CargaDatos from "../Pages/CargaDatos";
import { ServiciosJurisdicción } from "../Pages/ServiciosJurisdicción";
import Pendientes from "../Pages/Pendientes";
import AdHonorem from "../Pages/AdHonorem";
import Suplentes from "../Pages/Suplentes";
import ErrorPage from "../Pages/ErrorPage";
import Licencias from "../Pages/Licencias";
import Cargos from "../Pages/Cargos";
import Descuentos from "../Pages/Descuentos";
import Adicionales from "../Pages/Adicionales";
import DetalleTramite from "../Pages/DetalleTramite";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/personas",

        children: [
          {
            path: "/personas/ver-TramitesPendientes",
            element: <Pendientes />,
          },
          {
            path: "/personas/persona/:id",
            element: <DetalleTramite />,
          },
          {
            path: "/personas/carga-datos",
            element: <CargaDatos />,
          },
        ],
      },
      {
        path: "/servicios",

        children: [
          {
            path: "/servicios/jurisdicción",
            element: <ServiciosJurisdicción />,
          },
        ],
      },
      {
        path: "/cargos",

        children: [
          {
            path: "/cargos/agregar-cargos",
            children: [
              {
                index: true,
                element: <Cargos />,
              },
            ],
          },
        ],
      },
      {
        path: "/adicionales",
        element: <Adicionales />,
      },
      {
        path: "/descuentos",
        element: <Descuentos />,
      },

      {
        path: "/licencias",
        children: [
          {
            index: true,
            element: <Licencias />,
          },
        ],
      },
      {
        path: "/ad-honorem",

        children: [
          {
            path: "/ad-honorem/cargar",
            element: <AdHonorem />,
          },
        ],
      },
      {
        path: "/suplentes",
        element: <Suplentes />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);

export default router;
