import React from "react";
import { VerOrdenes } from "../components/Ver-Ordenes";
import Layout from "../components/Layout/LayoutContainer";

const VerOrden = () => {
  return (
    <Layout
      Titulo="Órdenes de Pago"
      Subtitulo="Listado de todas las órdenes de pago"
    >
      <VerOrdenes />
      <br />
    </Layout>
  );
};

export default VerOrden;
