import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import GetAdicionales from "../components/GetAdicionales";

const Adicionales = () => {
  return (
    <Layout Titulo="Adicionales" Subtitulo="Adicionales aplicados">
      <GetAdicionales />
      <br />
    </Layout>
  );
};

export default Adicionales;
