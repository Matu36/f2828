import React from "react";
import DetalleAgente from "../components/DetalleAgente";
import Layout from "../components/Layout/LayoutContainer";

const Detail = () => {
  return (
    <Layout
      Subtitulo="Datos relevantes del agente y aquellos operativos en los que
    participo"
      Titulo="Detalle del Agente"
    >
      <DetalleAgente />
      <br />
    </Layout>
  );
};

export default Detail;
