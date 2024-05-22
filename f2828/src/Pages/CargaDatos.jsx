import React from "react";
import PostAgentes from "../components/PostAgentes";
import Layout from "../components/Layout/LayoutContainer";

const CargaDatos = () => {
  return (
    <Layout Subtitulo="Ingresá el DNI de la persona" Titulo="Buscar Personal">
      <PostAgentes />
      <br />
    </Layout>
  );
};

export default CargaDatos;
