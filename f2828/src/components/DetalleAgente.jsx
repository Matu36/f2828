import React from "react";
import { Navigate, useParams } from "react-router-dom";
import "../assets/styles/detalle.css";
import { useAgentes } from "../hooks/useAgentes";
import Spinner from "./UI/Spinner";
import { GoTriangleDown } from "react-icons/go";
import CardDetalleAgente from "./UI/CardDetalleAgente";
import { MaskCuil } from "../utils/Mask";

//Detalle del agente que a su vez usa el componente CardDetalle

const DetalleAgente = () => {
  const { id } = useParams();

  const { data: agenteData, isLoading } = useAgentes(0, id).agenteQuery;

  if (isLoading) {
    return <Spinner />;
  }

  if (!agenteData[0]) {
    return <Navigate to="../../*" replace={true} />;
  }

  return (
    <div className="p-0 mb-3">
      <div className="card-body justify-content-evenly d-flex gap-2 flex-wrap detalleAgente">
        <div className="data-row">
          <div className="value">{agenteData[0].apellido}</div>
          <div className="label">Apellido</div>
        </div>
        <div className="data-row">
          <div className="value">{agenteData[0].nombre}</div>
          <div className="label">Nombre</div>
        </div>
        <div className="data-row">
          <div className="value">{agenteData[0].cbu}</div>
          <div className="label">CBU</div>
        </div>
        <div className="data-row">
          <div className="value">{MaskCuil(agenteData[0].cuil)}</div>
          <div className="label">CUIL</div>
        </div>
        <div className="data-row">
          <div className="value">{agenteData[0].legajo}</div>
          <div className="label">Legajo</div>
        </div>
        <div className="data-row">
          <div className="value">{agenteData[0].dni}</div>
          <div className="label">DNI</div>
        </div>
      </div>

      <div id="accordion" className="m-4">
        <div className="mb-3" id="headingOne">
          <button
            className="btn btn-outline-dark btn-md ml-4 fw-bold"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            Ver Ultimos 15 Operativos asociados{" "}
            <span>
              <GoTriangleDown id="triangleIcon" />
            </span>
          </button>
        </div>

        <div
          id="collapseOne"
          className="collapse"
          aria-labelledby="headingOne"
          data-parent="#accordion"
          style={{ overflowY: "scroll !important", overflowX: "hidden" }}
        >
          <div className="row row-cols-1 row-cols-md-5 g-4 p-md-3  p-1">
            {agenteData[0].operativo_id ? (
              agenteData.map((operativo) => (
                <CardDetalleAgente
                  data={operativo}
                  key={operativo.operativo_id}
                />
              ))
            ) : (
              <div>No hay operativos asociados</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleAgente;
