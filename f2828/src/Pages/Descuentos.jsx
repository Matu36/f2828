import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import GetDescuentos from "../components/GetDescuentos";

const Descuentos = () => {
  return (
    <Layout Titulo="Descuentos" Subtitulo="Descuentos practicados">
      <GetDescuentos />
      <br />
    </Layout>
  );
};

export default Descuentos;
