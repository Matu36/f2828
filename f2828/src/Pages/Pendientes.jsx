import React from "react";
import TramitesPendientes from "../components/TramitesPendientes";
import Layout from "../components/Layout/LayoutContainer";

const Pendientes = () => {
  return (
    <Layout
      Titulo="Trámites Pendientes"
      Subtitulo="Listado de todos los Trámites Pendientes"
    >
      <TramitesPendientes />
      <br />
    </Layout>
  );
};

export default Pendientes;
