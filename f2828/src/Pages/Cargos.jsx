import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import PostCargo from "../components/PostCargo";

const Cargos = () => {
  return (
    <Layout
      Titulo="Cargos"
      Subtitulo="Completá los campos para agregar los Cargos"
    >
      <PostCargo />
      <br />
    </Layout>
  );
};

export default Cargos;
