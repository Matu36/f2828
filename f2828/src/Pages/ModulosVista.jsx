import React from "react";
import Layout from "../components/Layout/LayoutContainer";
import ListaModulos from "../components/ListaModulos";

const ModulosVista = () => {
  return (
    <Layout
      Titulo="M&oacute;dulos"
      Subtitulo="Listado de todos los m&oacute;dulos disponibles del sistema"
    >
      <ListaModulos />
    </Layout>
  );
};

export default ModulosVista;
