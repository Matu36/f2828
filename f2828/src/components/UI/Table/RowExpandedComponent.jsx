import React, { useState, useEffect } from "react";
import { useHonorarios } from "../../../hooks/useHonorarios";
import { usePagination } from "../../../hooks/usePagination";
import Modal from "../Modal";
import { useOperativo } from "../../../hooks/useOperativo";
import PostHonorarios from "../../PostHonorarios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HonorariosAPI } from "../../../api/HonorariosAPI";
import DataTable from "react-data-table-component";
import { useAgentes } from "../../../hooks/useAgentes";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useModulos } from "../../../hooks/useModulos";
import EmptyTable from "../../UI/EmptyTable";
import Spinner from "../Spinner";
import { FaPlus, FaTimes, FaTrash, FaUsers } from "react-icons/fa";
import NumberFormatter from "../../../utils/NumberFormatter";
import { MaskCuil } from "../../../utils/Mask";
import Dropdown from "../Dropdown";
import { GrFormCheckmark } from "react-icons/gr";

// Se usa en el componente TablaHonorarios al hacer click en los operativos.

const RowExpandedComponent = ({ data: operativo }) => {
  const { paginationOptions } = usePagination();

  const [toggledClearRows, setToggledClearRows] = useState(false);

  const columns = [
    { name: "DNI", selector: (row) => row.dni, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    {
      name: "Tipo de Pago",
      selector: (row) => (row.tipo_pago == "ch" ? "Cheque" : "Transferencia"),
      sortable: true,
    },
  ];

  //TRAE DATA DE AGENTES DISPONIBLES POR OPERATIVO Y EL REFETCH PARA CUANDO SE CREA EL HONORARIO //

  // REFETCH DE MODULOS ACTIVOS CUANDO SE CREA EL HONORARIO

  const [honorarioData, setHonorarioData] = useState({
    operativo_id: operativo.id,
    agente_id: 0,
    modulo_valor_id: 0,
  });

  const { agentesDisponiblesQuery } = useAgentes(operativo.id || 0);
  const {
    data: agentesDisponibles,
    refetch: refetchAgentesDisponibles,
    isLoading: agentesDispniblesLoading,
    isError: errorAgentesDisponibles,
  } = agentesDisponiblesQuery;

  const { modulosActivosQuery } = useModulos(operativo.id);
  const {
    refetch: refetchModulosActivos,
    data: dataModulosActivos,
    isLoading: loadingModulosActivos,
    isFetched: fetchedModulosActivos,
  } = modulosActivosQuery;

  const { agentesOperativoQuery } = useOperativo(operativo.id);
  const {
    data: agentes,
    isLoading: loadingAgentes,
    refetch: refetchAgentes,
  } = agentesOperativoQuery;

  // Funcionalidades relacionadas a honorarios

  const { honorariosAgenteQuery } = useHonorarios(
    operativo.id,
    honorarioData.agente_id
  );
  const {
    data: honorariosAgente,
    isLoading: honorariosLoading,
    isFetching: honorariosFetching,
    isFetched: honorariosFetched,

    refetch,
  } = honorariosAgenteQuery;

  // FUNCION PARA CREAR EL HONORARIO POR OPERATIVO, SE ELIGE AGENTE Y MODULO //

  const [funcionesAsignadas, setFuncionesAsignadas] = useState({});
  useEffect(() => {
    if (!loadingAgentes && Array.isArray(agentes)) {
      const nuevasFuncionesAsignadas = {};
      agentes.forEach((agente) => {
        nuevasFuncionesAsignadas[`${agente.modulo_id}|${agente.id}`] = true;
      });
      setFuncionesAsignadas(nuevasFuncionesAsignadas);
    }
  }, [loadingAgentes, agentes]);

  useEffect(() => {
    refetchModulosActivos();
  }, [funcionesAsignadas]);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newHonorario) => {
      return await HonorariosAPI.post("", newHonorario);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["honorariosPendientesHome"]);
        refetch();
        refetchAgentes();
        refetchAgentesDisponibles();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Se creó el honorario de manera correcta",
          showConfirmButton: false,
          timer: 3000,
        });
      },
      onError: (err) => {
        return Swal.fire({
          position: "center",
          icon: "error",
          title: "Hubo un error",
          text: err.response.data,
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#4CAF50",
          timer: 3000,
        });
      },
    }
  );

  //DESVINCULAR AGENTE DEL OPERATIVO //

  const deleteH = useMutation(
    async (data) => {
      return await HonorariosAPI.delete("", { data });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["honorariosPendientesHome"]);
        refetch();
        refetchAgentes();
        refetchAgentesDisponibles();
        refetchModulosActivos();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Se desvinculó el agente del operativo de manera correcta",
          showConfirmButton: false,
          timer: 3000,
        });
      },
    }
  );

  const deleteModuloAgente = useMutation(
    async (data) => {
      return await HonorariosAPI.delete("", { data });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["honorariosPendientesHome"]);
        refetch();
        refetchAgentes();
        refetchAgentesDisponibles();
        refetchModulosActivos();
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Se eliminó el módulo seleccionado del Agente",
          showConfirmButton: false,
          timer: 3000,
        });
      },
      onError: () => {
        return Swal.fire({
          position: "center",
          icon: "warning",
          title: "Hubó un error",
          text: "No se pudo eliminar el módulo del agente",
          showConfirmButton: false,
          timer: 3000,
        });
      },
    }
  );

  const handleDelete = (agente_id, operativo_id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción desvinculará al agente del operativo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, desvincular",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteH.mutate({ agenteID: agente_id, operativoID: operativo_id });

        // Actualiza el estado de funcionesAsignadas al eliminar el agente
        setFuncionesAsignadas((prevFunciones) => {
          const nuevasFunciones = { ...prevFunciones };
          // Elimina todas las funciones asignadas al agente
          Object.keys(nuevasFunciones).forEach((funcionAsignada) => {
            if (funcionAsignada.endsWith(`|${agente_id}`)) {
              delete nuevasFunciones[funcionAsignada];
            }
          });
          return nuevasFunciones;
        });
      }
    });
  };

  const handleDeleteModulo = (modulo_id, agente_id, operativo_id) => {
    deleteModuloAgente.mutate({
      agenteID: agente_id,
      operativoID: operativo_id,
      moduloID: modulo_id,
    });
  };

  // FINALIZACION DESVINCULAR AGENTE DEL OPERATIVO //

  const handleClick = (id) => {
    setHonorarioData({ ...honorarioData, agente_id: id });
    refetch();
  };

  const handleChangeModuloId = (id) => {
    setHonorarioData({ ...honorarioData, modulo_valor_id: id });
  };

  const crearHonorario = () => {
    if (
      honorarioData.agente_id == 0 ||
      honorarioData.modulo_valor_id == 0 ||
      honorarioData.operativo_id == 0
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Hubo un error, no se pudo crear el honorario",
        showConfirmButton: true,
      });
      return;
    }
    mutation.mutate({ ...honorarioData, fechaModif: new Date() });
  };

  const agregarAgente = () => {
    crearHonorario();
    setHonorarioData({ ...honorarioData, agente_id: 0, modulo_valor_id: 0 });
  };

  const handleSelectChange = (e) => {
    setToggledClearRows(false);
    if (e.selectedCount > 0) {
      setHonorarioData({ ...honorarioData, agente_id: e.selectedRows[0].id });
    } else {
      setHonorarioData({ ...honorarioData, agente_id: 0 });
    }
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("../../agentes/crear-agente");

    let modalEl = document.getElementById("agregarAgenteModal");
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    modalInstance.hide();
  };

  //-------------------------------- SEARCHBAR --------------------------- //

  const [search, setSearch] = useState("");
  const [filteredAgentes, setFilteredAgentes] = useState(agentesDisponibles);
  const [isFetched, setIsFetched] = useState(false);
  const [searchByApellido, setSearchByApellido] = useState("");
  const [AgentesDispo, setAgentesDispo] = useState(agentes);

  useEffect(() => {
    setFilteredAgentes(agentesDisponibles);
    setIsFetched(true);
  }, [agentesDisponibles]);

  useEffect(() => {
    setAgentesDispo(agentes);
  }, [agentes]);

  useEffect(() => {
    filterByDni(search);
  }, [search]);

  useEffect(() => {
    filterByApellido(searchByApellido);
  }, [searchByApellido]);

  const handleOnChange = (e) => {
    setSearch(e.target.value);
  };

  const handleOnChangeByApellido = (e) => {
    setSearchByApellido(e.target.value);
  };

  const filterByDni = (value) => {
    if (!value) {
      setFilteredAgentes(agentesDisponibles);
    } else {
      const filteredAgents = agentesDisponibles.filter(
        (agent) =>
          agent.dni && agent.dni.toString().includes(value.toLowerCase())
      );
      setFilteredAgentes(filteredAgents);
    }
  };

  const filterByApellido = (value) => {
    if (!value) {
      setAgentesDispo(agentes);
    } else {
      const filteredAgents = agentes.filter(
        (agent) =>
          agent.apellido &&
          agent.apellido.toLowerCase().includes(value.toLowerCase())
      );
      setAgentesDispo(filteredAgents);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  return (
    <>
      <Modal title="Agregar función al Agente" referenceID="formModal">
        <hr className="hrstyle" style={{ marginTop: "-2rem" }} />
        <div className="p-3">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Descripción</th>
                <th scope="col">Valor</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {(honorariosLoading || honorariosFetching) && (
                <tr>
                  <td colSpan={3}>Cargando...</td>
                </tr>
              )}
              {typeof honorariosAgente == "object" &&
                honorariosAgente.map((h) => (
                  <tr key={h[0].id}>
                    <td className="w-50">{h[0].modulo.descripcion}</td>
                    <td>$ {NumberFormatter(h[0].valor)}</td>
                    <td>
                      {!h.opprovisorio_nro && (
                        <button
                          className="btn btn-sm btn-limpiar d-flex align-items-center justify-content-center gap-2"
                          disabled={
                            deleteModuloAgente.isLoading || honorariosFetching
                          }
                          onClick={() =>
                            handleDeleteModulo(
                              h[0].modulo.id,
                              honorarioData.agente_id,
                              honorarioData.operativo_id
                            )
                          }
                        >
                          <FaTimes size="0.90rem" />
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {!honorariosLoading && honorariosAgente == 400 && (
                <tr>
                  <td colSpan={3}>No hay ningún modulo pendiente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PostHonorarios
          handleModuloId={handleChangeModuloId}
          handleClick={crearHonorario}
          disabled={honorariosFetching}
          dataModulosActivos={dataModulosActivos}
          fetchedModulosActivos={fetchedModulosActivos}
          refetchModulosActivos={refetchModulosActivos}
          loadingModulosActivos={loadingModulosActivos}
        />
      </Modal>
      <Modal
        title={`Agregar Agente al Operativo: ${operativo.referencia}`}
        referenceID="agregarAgenteModal"
      >
        <hr className="hrstyle" style={{ marginTop: "-1.5rem" }} />
        <div className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por DNI"
            onMouseLeave={() => setToggledClearRows(false)}
            onChange={handleOnChange}
            onKeyDown={(e) => {
              setHonorarioData({ ...honorarioData, agente_id: 0 });
              setToggledClearRows(true);
            }}
            value={search}
            autoComplete="off"
            disabled={!agentesDisponibles}
          />
          <div>
            {!agentesDispniblesLoading ? (
              <DataTable
                columns={columns}
                data={filteredAgentes}
                pagination
                clearSelectedRows={toggledClearRows}
                selectableRows
                selectableRowsSingle
                selectableRowsHighlight
                onSelectedRowsChange={handleSelectChange}
                striped
                paginationComponentOptions={paginationOptions}
                noDataComponent={
                  <EmptyTable msg="No se encontro el Agente con los datos ingresados">
                    <button
                      type="button"
                      className="btn btn-guardar"
                      onClick={handleNavigate}
                    >
                      Crear Agente
                    </button>
                  </EmptyTable>
                }
              />
            ) : !agentesDispniblesLoading && !errorAgentesDisponibles ? (
              <Spinner />
            ) : (
              <EmptyTable msg="No hay ningún agente disponible para este operativo" />
            )}
          </div>
        </div>
        <PostHonorarios
          handleModuloId={handleChangeModuloId}
          handleClick={agregarAgente}
          disabled={!honorarioData.agente_id}
          dataModulosActivos={dataModulosActivos}
          fetchedModulosActivos={fetchedModulosActivos}
          refetchModulosActivos={refetchModulosActivos}
          loadingModulosActivos={loadingModulosActivos}
        />
      </Modal>
      <div
        className="row_content"
        style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)" }}
      >
        <div>
          <div className="agentes-container">
            <div
              style={{
                backgroundColor: "#f0f0f078",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
              }}
              className="p-3"
            >
              <div className="d-flex align-items-center justify-content-between py-3">
                <div className="d-flex  align-items-center">
                  <FaUsers
                    className="sidebarIcons"
                    color="rgb(0, 79, 132)"
                    size="2rem"
                  />{" "}
                  <h5 style={{ color: "rgb(0, 79, 132)" }} className="mb-0">
                    Agentes asociados
                  </h5>
                </div>

                <button
                  type="btn"
                  className="btn btn-outline-success btn-round py-1"
                  data-bs-toggle="modal"
                  data-bs-target="#agregarAgenteModal"
                  onClick={() => {
                    setHonorarioData({ ...honorarioData, agente_id: 0 });
                    setToggledClearRows(true);
                  }}
                >
                  <FaPlus /> Agregar Agente
                </button>
              </div>
            </div>
            <div className="mt-4" style={{ marginLeft: "1rem" }}>
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: "30%" }}
                placeholder="Buscar por APELLIDO"
                onMouseLeave={() => setToggledClearRows(false)}
                onChange={handleOnChangeByApellido}
                onKeyDown={(e) => {
                  setHonorarioData({ ...honorarioData, agente_id: 0 });
                  setToggledClearRows(true);
                }}
                value={searchByApellido}
                autoComplete="off"
                disabled={AgentesDispo === 204 || !AgentesDispo}
              />
            </div>
            <div className="p-3  border-bottom border-2">
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col">Apellido y Nombre</th>
                    <th scope="col">CUIL</th>
                    <th scope="col">Módulos</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                {loadingAgentes && (
                  <tbody>
                    <tr>
                      <td colSpan={4}>Cargando...</td>
                    </tr>
                  </tbody>
                )}
                {!loadingAgentes && typeof AgentesDispo === "object" ? (
                  <tbody>
                    {AgentesDispo.map((agente) => (
                      <tr key={agente.persona_id}>
                        <td>
                          {agente.apellido} {agente.nombre}
                        </td>

                        <td>{MaskCuil(agente.cuil)}</td>
                        <td>
                          <ul className="list-unstyled">
                            {agente.modulos.map((m, i) => (
                              <li key={i}>
                                <GrFormCheckmark />
                                <i></i> {m.descripcion}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <Dropdown>
                            <button
                              type="button"
                              className="dropdown-item dropdown-item-custom"
                              data-bs-toggle="modal"
                              data-bs-target="#formModal"
                              onClick={() => {
                                handleClick(agente.id);
                              }}
                            >
                              <FaPlus /> Agregar Función
                            </button>
                            {agente.count_pendientes > 0 ? (
                              <button
                                type="button"
                                className="dropdown-item dropdown-item-custom"
                                onClick={() =>
                                  handleDelete(agente.id, operativo.id)
                                }
                              >
                                <FaTrash /> Eliminar Agente
                              </button>
                            ) : null}
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  !loadingAgentes && (
                    <tbody>
                      <tr>
                        <td colSpan={4}>
                          No hay ningún Agente Asociado al Operativo
                        </td>
                      </tr>
                    </tbody>
                  )
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RowExpandedComponent;
