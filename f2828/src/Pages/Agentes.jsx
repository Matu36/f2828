import React from "react";
import TramitesPendientes from "../components/TramitesPendientes";
import Layout from "../components/Layout/LayoutContainer";

const Agentes = () => {
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

export default Agentes;
