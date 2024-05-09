import React from "react";
import PostAgentes from "../components/PostAgentes";
import Layout from "../components/Layout/LayoutContainer";

const CargaDatos = () => {
  return (
    <Layout
      Subtitulo="Ingresá el DNI de la persona, el legajo o el apellido para la carga de datos"
      Titulo="Carga de Datos"
    >
      <PostAgentes />
      <br />
    </Layout>
  );
};

export default CargaDatos;
