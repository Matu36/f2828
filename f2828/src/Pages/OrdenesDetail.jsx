import React from "react";
import { OrdenDetail } from "../components/OrdenDetail";
import Layout from "../components/Layout/LayoutContainer";

export const OrdenesDetail = () => {
  return (
    <Layout Titulo="Órden de Pago" Subtitulo="Detalle de la órden de pago">
      <OrdenDetail />
      <br />
    </Layout>
  );
};

export default OrdenesDetail;
