import { useMutation, useQuery } from "@tanstack/react-query";
import { ModulosAPI } from "../api/ModulosAPI";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { ModulosValorAPI } from "../api/ModuloValorAPI";

// Función para obtener módulos según el operativo
const getModulos = async (operativoId, valor) => {
  if (!operativoId) {
    // Obtener todos los módulos
    const { data } = await ModulosAPI.get(
      `/?valor=${valor ? "true" : "false"}`
    );
    return data[0];
  }
};

const getModulosActivosById = async (operativoId) => {
  if (operativoId == 0) return [];
  const { data } = await ModulosValorAPI.get(`/activos/${operativoId}`);
  return data;
};

const getModulosValor = async () => {
  const { data } = await ModulosValorAPI.get("");
  return data;
};

export const useModulos = (operativoId = 0, valor = false) => {
  const location = useLocation();
  const navigate = useNavigate();

  const modulosQuery = useQuery({
    queryKey: ["modulos", { valor }],
    queryFn: () => getModulos(0, valor),
    enabled: location.pathname.includes("modulos"),
  });

  const modulosValorQuery = useQuery({
    queryKey: ["modulos-valor"],
    queryFn: () => getModulosValor(),
  });

  const modulosActivosQuery = useQuery({
    queryKey: ["modulos-activos", { operativoId }],
    queryFn: () => getModulosActivosById(operativoId),
    enabled: operativoId != 0,
  });

  const crearModulo = useMutation({
    mutationKey: ["crear-modulo"],
    mutationFn: async (data) =>
      await ModulosAPI.post("", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "El modulo ha sido creado",
        showConfirmButton: false,
        timer: 3000,
      });

      // window.close();

      window.location.reload();
    },
    onError: (err) => {
      switch (err.response.status) {
        case 409:
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Ya existe un módulo con esa descripción",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#4CAF50",
          });
          break;

        default:
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Hubo un error",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#4CAF50",
          });
          break;
      }
    },
  });

  const crearModuloValor = useMutation({
    mutationKey: ["crear-modulo-valor"],
    mutationFn: async (data) =>
      await ModulosValorAPI.post("", {
        moduloId: data.id,
        fechaDesde: data.fechaDesde,
        valor: data.valor,
      }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha asignado el valor correctamente",
        showConfirmButton: false,
        timer: 3000,
      });

      window.close();

      window.location.reload();
    },
    onError: (err) => {
      switch (err.response.status) {
        case 404:
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Hubo un error",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#4CAF50",
          });
          break;

        default:
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Hubo un error",
            showConfirmButton: true,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#4CAF50",
          });
          break;
      }
    },
  });

  const cerrarModuloValor = useMutation({
    mutationKey: ["cerrar-modulo"],
    mutationFn: async (data) =>
      await ModulosValorAPI.put(`/cerrar/${data.id}`, {
        fechaHasta: data.fechaHasta,
      }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se cerro el período del módulo",

        showConfirmButton: false,
        timer: 4000,
      });
      let modalEl = document.getElementById("periodoModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      modulosValorQuery.refetch();
    },
    onError: (err) => {
      let fecha = new Date(err.response.data);
      switch (err.response.status) {
        case 405:
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Hubo un problema",
            text: `La fecha mínima tiene que ser posterior al ${fecha.getDate()}/${
              fecha.getMonth() + 1
            }/${fecha.getFullYear()}`,
            showConfirmButton: false,
            timer: 4000,
          });
          let modalEl = document.getElementById("periodoModal");
          let modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance.hide();
          break;
      }
    },
  });

  // Mutación para dar de baja un módulo
  const modulosMutation = useMutation({
    mutationKey: ["baja-modulo"],
    mutationFn: async (data) =>
      await ModulosValorAPI.put(`/baja/${data.id}`, {
        fechaHasta: data.fechaHasta,
      }),
    onSuccess: () => {
      modulosQuery.refetch();
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Se dio de baja el modulo",
        showConfirmButton: false,
        timer: 4000,
      });
      let modalEl = document.getElementById("bajaModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      modulosValorQuery.refetch();
    },
    onError: (error) => {
      // Manejar errores de manera diferente según el status de la respuesta
      let fecha = new Date(error.response.data);
      switch (error.response.status) {
        case 405:
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Hubo un problema",
            text: `La fecha mínima tiene que ser posterior al ${fecha.getDate()}/${
              fecha.getMonth() + 1
            }/${fecha.getFullYear()}`,
            showConfirmButton: false,
            timer: 4000,
          });
          let modalEl = document.getElementById("bajaModal");
          let modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance.hide();
          break;

        default:
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Hubo un problema",
            text: error.response.data,
            showConfirmButton: false,
            timer: 4000,
          });
          break;
      }
    },
  });

  const editarModulo = useMutation({
    mutationKey: ["editar-modulo"],
    mutationFn: async (data) =>
      await ModulosValorAPI.put(`/editar/${data.id}`, {
        valor: data.valor,
        fechaDesde: data.fechaDesde,
      }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se actualizó el módulo",
        showConfirmButton: false,
        timer: 4000,
      });
      let modalEl = document.getElementById("editModuloModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      modulosValorQuery.refetch();
    },
    onError: (error) => {
      let { data } = error.response;
      if (typeof data == "object") {
        const lista = data
          .map(
            (o) =>
              `<li>Nro. Órden de Pago Provisorio: <span class="fw-bold">${o.opprovisorio_nro}</span></li>`
          )
          .join("");
        const container = document.createElement("div");
        container.innerHTML = `
        <div class="d-flex gap-1 flex-column align-items-center justify-content-center">
          <p>Hay órdenes de pago Provisorias asociadas al módulo. Debe eliminar las siguientes O.P</p>
          <div>
            <ul class="d-flex flex-column justify-content-start align-items-start">${lista}</ul>
          </div>
        <div>
        `;
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Hubo un error",
          html: container,
          showConfirmButton: true,
          confirmButtonText: "Ver órdenes de pago",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          confirmButtonColor: "#4CAF50",
        }).then((value) => {
          if (value.isConfirmed) navigate("/ordenes/ver-ordenes");
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Hubo un error",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          showConfirmButton: false,
          text: `${data}`,
        });
      }
      let modalEl = document.getElementById("editModuloModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
    },
  });

  const actualizarValor = useMutation({
    mutationKey: ["actualizar-valor"],
    mutationFn: async (data) =>
      await ModulosValorAPI.put(`/actualizar/${data.id}`, {
        valor: data.valor,
        fechaDesde: data.fechaDesde,
      }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se generó un nuevo modulo, con nueva fecha de inicio y valor",
        showConfirmButton: false,
        timer: 4000,
      });
      let modalEl = document.getElementById("valorModal");
      let modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      modulosValorQuery.refetch();
    },
  });

  return {
    modulosQuery,
    modulosValorQuery,
    modulosActivosQuery,
    modulosMutation,
    crearModulo,
    crearModuloValor,
    editarModulo,
    cerrarModuloValor,
    actualizarValor,
  };
};
