import React from "react";
import PostAgentes from "../components/PostAgentes";
import Layout from "../components/Layout/LayoutContainer";

const CrearAgente = () => {
  return (
    <Layout
      Subtitulo="Ingresá el DNI de la persona, el legajo o el número de órden para la carga de datos"
      Titulo="Carga de Datos"
    >
      <PostAgentes />
      <br />
    </Layout>
  );
};

export default CrearAgente;
