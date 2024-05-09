import React from "react";
import GetOperativos from "../components/GetOperativos";
import Layout from "../components/Layout/LayoutContainer";

export const Operativos = () => {
  return (
    <Layout Subtitulo="Listado de todos los Operativos" Titulo="Operativos">
      <GetOperativos />

      <br />
    </Layout>
  );
};

export default Operativos;
