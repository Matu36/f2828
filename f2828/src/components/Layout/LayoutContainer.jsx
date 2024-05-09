import React from "react";
import BackButton from "../UI/BackButton";

const Layout = ({ Titulo, Subtitulo, children }) => {
  return (
    <div className="container-fluid container-lg py-5 mb-3">
      <div className="header d-flex align-items-center justify-content-between">
        <div>
          <h1 className="section-title">{Titulo}</h1>
          <h2 className="section-subtitle">{Subtitulo}</h2>
        </div>
        <BackButton />
      </div>
      <div className="p-4 my-4 card">
        <div className="content">{children}</div>
        <br />
      </div>
    </div>
  );
};

export default Layout;
