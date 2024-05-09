import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import HonorariosPorAgente from "../components/HonorariosPorAgentes";

const HonorariosPorAgentes = () => {
  return (
    <Layout
      Titulo="Honorarios"
      Subtitulo="Carga de Honorarios Variables por Agente"
    >
      <HonorariosPorAgente />
      <br />
    </Layout>
  );
};

export default HonorariosPorAgentes;
