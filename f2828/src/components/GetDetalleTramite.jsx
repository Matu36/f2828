import React from "react";
import { Navigate, useParams } from "react-router-dom";

export default function GetDetalleTramite() {
  const Perfil = "Admin";

  //   const { data: tramiteData, isLoading } = useTramite(0, id).tramiteQuery;

  const { id } = useParams();

  return (
    <div>
      GetDetalleTramite
      {Perfil === "Admin" ? (
        <div>
          <button type="submit" className="btn btn-guardar btn btn-md">
            Finalizar Trámite
          </button>
        </div>
      ) : null}
    </div>
  );
}
