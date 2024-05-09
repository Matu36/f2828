import React from "react";
import PostServiciosJurisdiccion from "../components/PostServiciosJurisdiccion";
import Layout from "../components/Layout/LayoutContainer";

export const ServiciosJurisdicción = () => {
  return (
    <Layout
      Titulo="Servicios de Jurisdicción"
      Subtitulo="Completa los campos para agregar el Servicio de Jurisdicción"
    >
      <PostServiciosJurisdiccion />
      <br />
    </Layout>
  );
};
