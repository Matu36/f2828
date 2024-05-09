import React from "react";
import Liquidaciones from "../components/Liquidaciones";
import Layout from "../components/Layout/LayoutContainer";

const LiquidacionesPendientes = () => {
  return (
    <Layout
      Titulo="Órdenes de Pago"
      Subtitulo="Listado de agentes Pendientes de Orden de Pago"
    >
      <Liquidaciones />
      <br />
    </Layout>
  );
};

export default LiquidacionesPendientes;
