import { useMutation, useQuery } from "@tanstack/react-query";
import { OperativosAPI } from "../api/OperativosAPI";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Función para obtener operativos
const getOperativos = async () => {
  const { data } = await OperativosAPI.get("/");
  return data;
};

// Función para obtener agentes por operativo
const getAgentesByOperativo = async (operativoId) => {
  const { data } = await OperativosAPI.get(`/${operativoId}/agentes`);
  return data[0];
};
// Función para obtener operativos por número de referencia
const getOperativosByRef = async (refValue) => {
  const { data: dataByRef } = await OperativosAPI.get(`/${refValue}`);
  return dataByRef;
};

// Función para crear un nuevo operativo
const postOperativo = async (data) => {
  return await OperativosAPI.post("", data);
};

export const useOperativo = (
  operativoId = 0,
  refValue = 0,
  clicked = false
) => {
  const location = useLocation();
  const operativosQuery = useQuery({
    queryKey: ["operativos"],
    queryFn: () => getOperativos(),
  });

  const operativosByRef = useQuery({
    queryKey: ["operativoByRef", { refValue }],
    queryFn: () => getOperativosByRef(refValue),
    enabled: refValue != 0 && clicked,
  });

  const agentesOperativoQuery = useQuery({
    queryKey: ["agentes", { operativoId }],
    queryFn: () => getAgentesByOperativo(operativoId),
    enabled: operativoId != 0,
  });

  // Mutación para crear un nuevo operativo
  const operativoMutation = useMutation({
    mutationKey: ["operativo-mutation"],
    mutationFn: (data) => postOperativo(data),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "El operativo ha sido creado",
        showConfirmButton: false,
        timer: 2000,
      });
    },
    onError: (data) => {
      // Manejar errores de manera diferente según el status de la respuesta
      switch (data.response.status) {
        case 302:
          Swal.fire({
            position: "center",
            icon: "warning",
            text: "Ya existe un operativo con ese Proceso de Donación",
            title: "Hubo un error",
            showConfirmButton: false,
            timer: 5000,
          });
          break;

        default:
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Hubo un error",
            showConfirmButton: false,
            timer: 2000,
          });
          break;
      }
    },
  });

  return {
    operativosQuery,
    agentesOperativoQuery,
    operativoMutation,
    operativosByRef,
  };
};
