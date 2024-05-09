import React from "react";
import PostAdHonorem from "../components/PostAdHonorem";
import Layout from "../components/Layout/LayoutContainer";

const AdHonorem = () => {
  return (
    <Layout
      Titulo="Servicios Ad-Honórem"
      Subtitulo="Completá los datos para cargar los Servicios Ad-Honórem"
    >
      <PostAdHonorem />
      <br />
    </Layout>
  );
};

export default AdHonorem;
