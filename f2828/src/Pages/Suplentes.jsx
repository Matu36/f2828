import React from "react";
import PostServiciosSuplentes from "../components/PostServiciosSuplentes";

import Layout from "../components/Layout/LayoutContainer";

const Suplentes = () => {
  return (
    <Layout
      Subtitulo="Completá los campos para la carga de Servicios Suplentes"
      Titulo="Servicios Suplentes"
    >
      <PostServiciosSuplentes />
      <br />
    </Layout>
  );
};

export default Suplentes;
