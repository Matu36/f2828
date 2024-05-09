import { useMutation, useQuery } from "@tanstack/react-query";
import { OrdenesDePagoAPI } from "../api/OrdenesDePagoApi";
import Swal from "sweetalert2";

// Función para obtener orden por ID de liquidación
const getOrdenByLiquidacionId = async (liquidacion_id) => {
  const { data } = await OrdenesDePagoAPI.get(`/${liquidacion_id}`);
  return data;
};

// Función para manejar consulta de orden por ID de liquidación
export const useOrdenPorLiquidacionId = (liquidacion_id, clicked = false) => {
  const ordenesPorIdQuery = useQuery({
    queryKey: ["ordenes-por-id", { liquidacion_id }],
    queryFn: () => getOrdenByLiquidacionId(liquidacion_id),
    enabled: !!liquidacion_id && clicked.isClicked && clicked.liq_id == liquidacion_id,
  });

  return {
    ordenesPorIdQuery,
  };
};

// Función para ver órdenes de pago
const verOrdenDePago = async (definitivo) => {
  const { data } = await OrdenesDePagoAPI.get(
    `/ver/all?definitivo=${definitivo}`
  );
  return data;
};

// Función para manejar consulta de ver órdenes de pago
export const useVerOrdenDePago = (definitivo = false) => {
  const verOrdenesQuery = useQuery({
    queryKey: ["ordenes-all", { definitivo }],
    queryFn: () => verOrdenDePago(definitivo),
  });

  return {
    verOrdenesQuery,
  };
};

//Funcion para borrar Orden de Pago



// Función para asignar numeración definitiva a órdenes de pago
const asignarDefinitivoOP = async (data) => {
  return await OrdenesDePagoAPI.post("/asignar-definitiva", data);
};

// Función para manejar mutación de asignar numeración definitiva
export const useOrdenesMutation = () => {
  // Obtener refetch de la consulta de ver órdenes de pago
  const { refetch } = useVerOrdenDePago().verOrdenesQuery;

  // Mutación para asignar numeración definitiva
  const asignarDefinitivo = useMutation({
    mutationKey: ["asignarDefinitivo"],
    mutationFn: (data) => asignarDefinitivoOP(data),
    onSuccess: (data) => {
      // Refrescar la consulta de ver órdenes de pago
      refetch();
      Swal.fire({
        title: "Se asigno la numeración definitiva a la O.P",
        timer: 5000,
        icon: "success",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });

      let modalEl = document.getElementById("opDefinitiva");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    },
    onError: (error) => {
      Swal.fire({
        title: "Hubo un error",
        timer: 5000,
        html: error.response.data,
        icon: "error",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });
      let modalEl = document.getElementById("opDefinitiva");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    },
  });

  return { asignarDefinitivo };
};
