import React, { useEffect, useState } from "react";
import "../assets/styles/style.css";
import Notificacion from "../components/UI/LandingNotificacion.jsx";
import { FaCloudDownloadAlt } from "react-icons/fa";

export const Home = () => {
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fecha = new Date();
      const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
      const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
      setFechaActual(fechaFormateada);
    };

    obtenerFechaActual();
  }, []);

  return (
    <div className="container-fluid container-lg my-lg-5 my-3 pb-5">
      <div className="titulo-principal d-flex align-items-center mb-3">
        <div>
          <span className="fa-stack fa-2x">
            <i className="far fa-circle fa-stack-2x text-info"></i>
            <i className="fas fa-hospital-symbol fa-stack-1x text-muted"></i>
          </span>
        </div>
        <div>
          <h4 className="font-weight-bold text-muted mb-0">
            VARIABLES DE PROCURACIÓN
          </h4>
          <h6 className="text-info mb-0"> CUCAIBA</h6>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="card-text">
            <p>Bienvenida/o, Usuario del Cucaiba </p>
            <p>
              Tu usuario está asociado al <strong> C.U.C.A.I.B.A</strong>. Ante
              cualquier problema, por favor comunicate a la brevedad con el
              <a href="mailto:usuarios@ms.gba.gov.ar">
                {" "}
                Departamento de Atención de Usuarios
              </a>{" "}
              para solicitar la corrección.
            </p>
            <p></p>
            <p>
              El sistema habilita, entre otras opciones, registrar operativos y
              generar las liquidaciones a los agentes participantes de dichos
              operativos.
            </p>
            {/* <p>
              Para m&aacute;s detalles sobre las opciones y uso del sistema
              descargue el Manual del Usuario.
            </p>
            <br />
            <div className="d-flex align-items-center justify-content-center">
              <a className="btn btn-default link-manual" href="#" download>
                <FaCloudDownloadAlt
                  size="1.25em"
                  style={{ marginRight: "5px" }}
                />
                Manual del Usuario
              </a>
            </div> */}
          </div>
        </div>
      </div>
      <div className="notificacion" style={{ marginBlockEnd: "0px" }}>
        <Notificacion />
      </div>
      {/* <div className="row mb-1">
        <div className="col">
          <h2 className="text-muted text-left mb-0">
            <i className="fas fa-rss fa-fw" style={{ color: "#fd4700" }}></i>
            <strong>NOVEDADES</strong>
          </h2>
        </div>
      </div>
      <div className="card">
        <div className="card-header bg-white text-danger font-weight-bold">
          {fechaActual} - Actualización
          <i
            className="fas fa-exclamation-triangle float-right"
            style={{ lineHeight: "1.5" }}
          ></i>
        </div>
        <div className="card-body">
          <p className="card-text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad dicta
            dignissimos dolor eos est et ipsam laudantium nihil pariatur
            provident, quisquam saepe sed sit suscipit temporibus. At eveniet
            nulla quidem!
            <br />
            Cualquier duda comunicate con XXXX al mail{" "}
            <a href="mailto:xxxx@ms.gba.gov.ar">xxxx@ms.gba.gov.ar</a>
          </p>
          <p>Atte.-</p>
        </div>
      </div> */}
    </div>
  );
};
