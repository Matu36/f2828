import React from "react";
import GetAgentes from "../components/GetAgentes";
import Layout from "../components/Layout/LayoutContainer";

const Agentes = () => {
  return (
    <Layout Titulo="Agentes" Subtitulo="Listado de todos los Agentes cargados">
      <GetAgentes />
      <br />
    </Layout>
  );
};

export default Agentes;
