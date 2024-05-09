import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import PostLicencias from "../components/PostLicencias";

const Licencias = () => {
  return (
    <Layout
      Titulo="Licencias"
      Subtitulo="Completá los datos para agregar las Licencias"
    >
      <PostLicencias />
    </Layout>
  );
};

export default Licencias;
