import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HonorariosAPI } from "../api/HonorariosAPI";
import Swal from "sweetalert2";

// Función para obtener honorarios según el operativo
const getHonorarios = async (operativoId) => {
  const { data } = await HonorariosAPI.get(
    `/${operativoId != 0 ? `operativo/${operativoId}` : ""}`
  );

  return data[0];
};

// Función para obtener honorarios por agente y operativo

const getHonorariosByAgente = async (agenteId, operativoId) => {
  const { data } = await HonorariosAPI.get(
    `/modulo/${agenteId}/${operativoId}`
  );

  return data[0];
};

// Funciones para obtener honorarios pendientes
const getHonorariosPendientes = async () => {
  const { data } = await HonorariosAPI.get("/pendientes");

  return data[0];
};

export const getHonorariosPendienteshome = async () => {
  const { data } = await HonorariosAPI.get("/pendienteshome");

  return data;
};

export const useHonorarios = (operativoId = 0, agenteId = 0) => {
  const queryClient = useQueryClient();
  const honorariosQuery = useQuery({
    queryKey: ["honorarios", { operativoId }],
    queryFn: () => getHonorarios(operativoId),
  });

  const honorariosAgenteQuery = useQuery({
    queryKey: ["honorarios-agente", { agenteId, operativoId }],
    queryFn: () => getHonorariosByAgente(agenteId, operativoId),
    enabled: agenteId != 0,
  });

  const honorariosPendientesQuery = useQuery({
    queryKey: ["honorariosPendientes"],
    queryFn: () => getHonorariosPendientes(),
  });

  // Mutación para liquidar honorarios
  const liquidacionesMutation = useMutation({
    mutationKey: ["liquidar-honorarios"],
    mutationFn: async (data) => await HonorariosAPI.put("/liquidar", data),
    onSuccess: (data) => {
      // Refrescar la consulta de honorarios pendientes
      queryClient.refetchQueries(["honorariosPendientesHome"]);
      honorariosPendientesQuery.refetch();
      // Mostrar SweetAlert si hubo éxito
      Swal.fire({
        title: "Se genero la orden de pago",
        html:
          "<div>" +
          "<h5>" +
          "Nro. O.P Provisorio:" +
          `<span style={{ fontWeight: "bold" }}> ${data.data[1][2]}</span>` +
          "</h5>" +
          "<p>" +
          "Monto de la Orden de Pago: $" +
          `<span style={{ fontWeight: "bold" }}> ${data.data[1][1]}</span>` +
          "</p>" +
          "</div>",
        position: "center",
        icon: "success",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });
      let modalEl = document.getElementById("opModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    },
    onError: () => {
      //Muestra mensaje de error
      Swal.fire({
        title: "Hubo un error",
        position: "center",
        icon: "error",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });
      let modalEl = document.getElementById("opModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    },
  });

  return {
    honorariosQuery,
    honorariosAgenteQuery,
    honorariosPendientesQuery,
    liquidacionesMutation,
  };
};
