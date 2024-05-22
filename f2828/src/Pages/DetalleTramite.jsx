import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import GetDetalleTramite from "../components/GetDetalleTramite";

const DetalleTramite = () => {
  return (
    <Layout
      Titulo="Detalle del Trámite"
      Subtitulo="Verificá la información para finalizar el Trámite"
    >
      <GetDetalleTramite />
      <br />
    </Layout>
  );
};

export default DetalleTramite;
