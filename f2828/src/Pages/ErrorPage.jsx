import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="container pb-5">
      <div
        className="card text-info bg-light my-5 shadow-sm"
        style={{ borderTop: "5px solid var(--ms-main-color)" }}
      >
        <div
          className="card-header font-weight-bold"
          style={{ color: "#e01e37" }}
        >
          404 - Página no encontrada
          <i className="fas fa-sitemap fa-lg float-right"></i>
        </div>
        <div className="card-body bg-white">
          <p className="card-text text-dark">
            La página a la que desea acceder no existe.
          </p>
          <p className="card-text">
            <Link className="btn btn-outline-dark" to="/">
              Ir a la página de inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
