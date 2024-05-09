import React from "react";
import Modulos from "../components/Modulos";
import Layout from "../components/Layout/LayoutContainer";

const ModulosValor = () => {
  return (
    <Layout
      Titulo="Valores"
      Subtitulo="Listado de todos los módulos con sus valores"
    >
      <Modulos />
      <br />
    </Layout>
  );
};

export default ModulosValor;
