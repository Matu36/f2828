import React, { useState, useEffect } from "react";
import { useAgentes } from "../hooks/useAgentes";
import { useModulos } from "../hooks/useModulos";
import Spinner from "./UI/Spinner";
import Swal from "sweetalert2";
import Select from "react-select";
import { useOperativo } from "../hooks/useOperativo";
import { GrFormCheckmark } from "react-icons/gr";
import { FaRedo, FaSearch } from "react-icons/fa";
import { formatFecha } from "../utils/MesAño";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsPersonFill } from "react-icons/bs";
import { HonorariosAPI } from "../api/HonorariosAPI";
import axios from "axios";
import { OperativosAPI } from "../api/OperativosAPI";
import { useNavigate } from "react-router-dom";
import EmptyTable from "./UI/EmptyTable";
import NumberFormatter from "../utils/NumberFormatter";

const STRING_REGEX = /^[a-zA-Z].*(?:\d| )*$/;

const HonorariosPorAgente = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useAgentes().agentesQuery;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [refValue, setRefValue] = useState("");
  const [clicked, setClicked] = useState(false);
  const [estaHabilitado, setEstaHabilitado] = useState(false);
  const [operativoData, setOperativoData] = useState({});
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    queryClient.removeQueries();
  }, []);

  const handleNavigate = () => {
    navigate("../../agentes/crear-agente");
  };

  //TRAE DATA DE OPERATIVO POR REFERENCIA

  const {
    refetch: validarOperativoRefetch,
    data: dataByRef,
    isFetching: operativoFetching,
    isFetched: operativoFetched,
    isError,
  } = useQuery({
    enabled: false,
    queryKey: ["validar-operativo"],
    queryFn: async () => {
      const { data } = await OperativosAPI.get(
        `/verificar/${refValue}/${selectValue.value.split("|")[0]}`
      );
      return data;
    },
    onSuccess: (data) => {
      setEstaHabilitado(true);
      setOperativoData(data);
      setClicked(false);
      setHonorarioData({ ...honorarioData, operativo_id: data.id });
      refetchModulosActivos();
    },
    onError: (error) => {
      switch (error.response.status) {
        case 404:
          Swal.fire({
            title: "Hubo un error",
            text: "El operativo que ingreso no se encontró",
            icon: "error",
            timer: 3000,
            showCancelButton: false,
            showConfirmButton: false,
          });
          break;

        case 409:
          Swal.fire({
            title:
              "El agente no se encontraba activo durante la fecha del operativo",
            text: `${error.response.data}`,
            icon: "info",
            timer: 3000,
            showCancelButton: false,
            showConfirmButton: false,
          });
          break;
      }

      queryClient.removeQueries(["operativoByRef", { refValue: refValue }]);
      setRefValue("");
      setClicked(false);
      setOperativoData({});
      setEstaHabilitado(false);
    },
  });

  const [honorarioData, setHonorarioData] = useState({
    operativo_id: 0,
    agente_id: 0,
    persona_id: 0,
    modulos: [],
  });

  // FINALIZA LA CREACION DEL HONORARIO //

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setRefValue(newValue);
    if (newValue.length <= 0) {
      setSelectedOptions([]);
      setEstaHabilitado(false);
      queryClient.removeQueries([
        "operativoByRef",
        { refValue: operativoData.referencia },
      ]);
    }
  };

  // BUSCA POR REFERENCIA DE OPERATIVO

  const handleBuscarClick = () => {
    setClicked(true);
    validarOperativoRefetch();
    if (operativoData.referencia != refValue) {
      setOptionsModulos([]);
    }
  };

  //DATA QUE TRAE AGENTE POR OPERATIVO

  const { agentesOperativoQuery } = useOperativo(operativoData.id);
  const {
    data: agentes,
    isLoading: loadingAgentes,
    refetch: refetchAgentes,
  } = agentesOperativoQuery;

  // TRAE LA DATA DE LOS AGENTES //
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setOptions(
        data.map((a) => ({
          value: `${a.personaId}|${a.id}`,
          label: `${a.apellido}, ${a.nombre} (DNI: ${a.dni})`,
        }))
      );
    }
  }, [data, isLoading]);

  const [selectValue, setSelectValue] = useState(null);
  const [showError, setShowError] = useState({
    apellido: 0,
  });

  //TRAE LOS MODULOS ACTIVOS POR ID DE OPERATIVO //
  const { modulosActivosQuery } = useModulos(honorarioData.operativo_id);

  const {
    refetch: refetchModulosActivos,
    data: dataModulosActivos,
    isLoading: loadingModulosActivos,
    isFetched: fetchedModulosActivos,
    isFetching: fetchingModulosActivos,
  } = modulosActivosQuery;

  // SELECCIONA LAS FUNCIONES DESDE EL SELECT, LAS MUESTRA PERMITE ELIMINARLAS //

  const [optionsModulos, setOptionsModulos] = useState([]);

  useEffect(() => {
    if (!loadingModulosActivos && dataModulosActivos) {
      if (dataModulosActivos && Array.isArray(dataModulosActivos)) {
        setOptionsModulos(
          dataModulosActivos.map((m) => ({
            value: m.id,
            label: `${m.descripcion} ($${NumberFormatter(m.valor)})`,
          }))
        );
      } else {
        setOptionsModulos([]);
      }
    }
  }, [dataModulosActivos, loadingModulosActivos]);

  //CREAR HONORARIO //

  const crearHonorarioPorAgente = useMutation({
    mutationKey: ["crear-honorarios-agente"],
    mutationFn: async () =>
      await HonorariosAPI.post("/Agente", { ...honorarioData }),

    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se creó el Honorario correctamente",
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        window.location.reload();
      });
    },
    onError: () => {
      Swal.fire({
        title: "Hubo un error al crear el Honorario",
        position: "center",
        icon: "error",
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });
    },
  });

  /// ACTUALIZAMOS EL ESTADO honorarioData cada vez que se modifica selectedOptiones que es el estado que almacena los módulos (se quedaba con el modulo anterior)

  useEffect(() => {
    const modulosData = selectedOptions.map((o) => o.value);
    const agenteId = parseInt(honorarioData.agente_id, 10);
    setHonorarioData({
      ...honorarioData,
      agente_id: agenteId,
      modulos: modulosData,
    });
  }, [selectedOptions]);

  const handleCreate = () => {
    if (isCreating) {
      return;
    }

    setIsCreating(true);

    crearHonorarioPorAgente
      .mutate(honorarioData)
      .then(() => {
        setIsCreating(false);
      })
      .catch((error) => {
        console.error(error);
        setIsCreating(false);
      });
  };

  // crearHonorarioPorAgente.mutate(honorarioData);

  //FINALIZA LA CREACION DEL HONORARIO

  return (
    <div className="honorariosPorAgente">
      <div>
        {isLoading ? (
          <Spinner />
        ) : (
          !selectValue && (
            <div>
              <h5>Buscar agente</h5>
              <Select
                id="select-agentes"
                options={options}
                value={selectValue}
                placeholder="Seleccionar Agente por Apellido o DNI"
                noOptionsMessage={() => (
                  <EmptyTable msg="El agente no se encuentra cargado">
                    <button
                      type="button"
                      className="btn btn-guardar"
                      onClick={handleNavigate}
                    >
                      Crear Agente
                    </button>
                  </EmptyTable>
                )}
                classNamePrefix="select2"
                classNames={{ container: () => "select2-container" }}
                onInputChange={(e) => {
                  setEstaHabilitado(false);
                  setRefValue("");
                  setClicked(false);
                  if (e.length > 0) {
                    let result = 0;

                    if (e.endsWith(" ") || !STRING_REGEX.test(e)) {
                      result = 2;
                    }

                    setShowError({
                      ...showError,
                      apellido: result,
                    });
                  }
                }}
                onChange={(e) => {
                  setSelectValue(e);
                  setHonorarioData(() => {
                    let dataAgente = e.value.split("|");
                    return {
                      ...honorarioData,
                      agente_id: dataAgente[1],
                      persona_id: dataAgente[0],
                    };
                  });
                  setShowDropdown(true);
                  setEstaHabilitado(false);
                  queryClient.removeQueries(["operativoByRef"]);
                  setRefValue("");
                  setClicked(false);
                }}
              />
            </div>
          )
        )}
        <form action="submit">
          {showDropdown && !isLoading && (
            <div className="custom-dropdown p-0 rounded-1">
              <div
                className="d-flex align-items-center justify-content-between p-2"
                style={{
                  height: "50px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,.1)",
                  backgroundColor: "#f7f7f7",
                }}
              >
                <div>
                  <p style={{ fontWeight: "bold" }} className="m-0">
                    {selectValue
                      ? `${selectValue.label.split(" (DNI:")[0]}`
                      : ""}{" "}
                    (
                    {selectValue.label
                      .split(" (DNI:")[1]
                      .trim()
                      .replace(/^(\d{2})(\d{3})(\d{3}).*/, "$1.$2.$3")}
                    )
                  </p>
                </div>
                <div>
                  <BsPersonFill size="1.5rem" />
                </div>
              </div>
              <br />
              <div className="form-group p-2">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginLeft: "0.5rem",
                  }}
                >
                  OPERATIVO
                </label>

                <div className="input-group gap-4 mt-1">
                  <input
                    style={{ maxWidth: "40%" }}
                    type="number"
                    placeholder="Introducir PD"
                    onChange={handleInputChange}
                    className="form-control"
                    value={refValue}
                    min={0}
                  />
                  <div className="input-group-append d-flex gap-2 align-items-center">
                    <button
                      type="button"
                      className="btn btn-buscar d-flex align-items-center justify-content-center gap-2 ml-2"
                      style={{ zIndex: 0 }}
                      onClick={handleBuscarClick}
                      disabled={operativoFetching || !refValue || refValue == 0}
                    >
                      {operativoFetching ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <FaSearch />
                      )}
                      Buscar
                    </button>
                  </div>
                </div>
                <br />

                {operativoData?.id && (
                  <div className="p-0 mb-3 card">
                    <div className="card-header">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Datos del operativo
                      </label>
                    </div>
                    <div className="card-body justify-content-evenly d-flex gap-2 detalleAgente">
                      <div className="data-row">
                        <div className="value">{operativoData.referencia}</div>
                        <div className="label">Proceso de Donación</div>
                      </div>
                      <div className="data-row">
                        <div className="value">
                          {formatFecha(operativoData.fecha)}
                        </div>
                        <div className="label"> Fecha</div>
                      </div>
                      <div className="data-row">
                        <div className="value">
                          {operativoData.descripcion ?? <i>Sin Descripción</i>}
                        </div>
                        <div className="label"> Descripción</div>
                      </div>
                      <br />
                    </div>
                  </div>
                )}
              </div>
              <br />
              {agentes && agentes.length > 0 && selectValue
                ? agentes.map(
                    (agente) =>
                      agente.id ===
                        parseInt(selectValue.value.split("|")[1]) && (
                        <div
                          className="card-body justify-content-center d-flex gap-2 detalleAgente"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "80%",
                            padding: "10px",
                            margin: "0 auto",
                            border: "1px solid #87CEEB",
                            boxShadow: "2px 2px 5px #888888",
                          }}
                        >
                          <div key={agente.id} className="data-row">
                            <div className="card-header">
                              <label
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  marginLeft: "0.5rem",
                                }}
                              >
                                El Agente ya se encuentra asociado al Operativo
                              </label>
                            </div>
                            <div className="value">
                              {agente.modulos.map((modulo) => (
                                <div key={modulo.id}>
                                  <GrFormCheckmark /> {modulo.descripcion}
                                </div>
                              ))}
                            </div>
                            <div className="label">Funciones Asociadas</div>
                          </div>
                        </div>
                      )
                  )
                : null}
              <br />

              {operativoData && operativoData.id ? (
                <div className="form-group p-2">
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      marginLeft: "0.5rem",
                    }}
                  >
                    Seleccione M&oacute;dulos:
                  </label>
                  <Select
                    isMulti
                    name="modulos"
                    options={optionsModulos}
                    classNames={{ container: () => "select2-container" }}
                    placeholder="Seleccioné una opción"
                    classNamePrefix="select2"
                    noOptionsMessage={() => "No hay módulos disponibles"}
                    id="select-modulos"
                    isDisabled={!estaHabilitado || loadingModulosActivos}
                    value={selectedOptions}
                    onChange={(e) => {
                      setSelectedOptions(e);
                    }}
                  />
                </div>
              ) : null}
              <br />
              <br />
              <div className="d-flex align-items-center justify-content-between p-2">
                <button
                  type="button"
                  className="btn btn-limpiar d-flex gap-2 align-items-center"
                  onClick={() => {
                    setSelectValue(null);
                    setShowDropdown(false);
                    setOperativoData({});
                    setSelectedOptions([]);
                    setOptionsModulos([]);
                  }}
                >
                  <FaRedo />
                  Nueva búsqueda
                </button>
                <button
                  type="button"
                  className="btn btn-guardar"
                  onClick={() => handleCreate()}
                  disabled={isCreating || selectedOptions.length == 0}
                >
                  Crear Honorario
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default HonorariosPorAgente;
