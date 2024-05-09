import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import Moment from "moment";
import CrearValor from "./CrearValor";
import Spinner from "./UI/Spinner";
import "../assets/styles/detalle.css";
import Swal from "sweetalert2";
import { useModulos } from "../hooks/useModulos";
import NumberFormatter from "../utils/NumberFormatter";
import "../components/styles/Modulos.css";
import Dropdown from "./UI/Dropdown";
import { FaCalendar, FaEdit, FaRedo, FaSync, FaTimes } from "react-icons/fa";
import "./styles/ordenes.css";
import Modal from "./UI/Modal";
import { validateFecha } from "../utils/Validaciones";

const formatDate = (fecha, cant = 2) => {
  let date = new Date(fecha);
  date.setDate(date.getDate() + cant);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//Componente que muestra los MODULOS y que permite la edición de los mismos.

const Modulos = ({ ...props }) => {
  const {
    modulosQuery,
    modulosValorQuery,
    modulosMutation,
    editarModulo,
    cerrarModuloValor,
    actualizarValor,
  } = useModulos(0, true);
  const { data, isFetched, refetch } = modulosValorQuery;
  const { data: modulos, isFetched: fetchedModulos } = modulosQuery;
  const { mutate } = modulosMutation;
  const { mutate: editMutate } = editarModulo;
  const { mutate: cerrarMutate } = cerrarModuloValor;
  const { mutate: actualizarMutate } = actualizarValor;

  const orderData = (data) => {
    if (data && data.length > 0) {
      return data
        .slice()
        .sort((a, b) => a.descripcion.localeCompare(b.descripcion));
    }
    return [];
  };

  const [showSpinner, setShowSpinner] = useState(true);
  useEffect(() => {
    if (isFetched) {
      const orderedData = orderData(data);
      setModulo(orderedData);
      setShowSpinner(false);
    }
  }, [isFetched, data]);

  const { paginationOptions } = usePagination(orderData);

  const [modulo, setModulo] = useState(orderData);

  useEffect(() => {
    if (isFetched) {
      setModulo(orderData);
    }
  }, []);

  // SEARCHBAR
  const [search, setSearch] = useState("");

  useEffect(() => {
    filterByDescripcion(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByDescripcion = (value) => {
    if (!value) {
      setModulo(orderData(data));
    } else {
      const arrayCache = data.filter((mod) =>
        mod.descripcion.toLowerCase().includes(value.toLowerCase())
      );
      setModulo(arrayCache);
    }
  };

  //MOSTRANDO EL FORMULARIO DE CREACION //

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  function handleMostrarFormulario() {
    setMostrarFormulario(true);
  }

  function handleCerrarFormulario() {
    setMostrarFormulario(false);
  }

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  //EDITAR PRECIO

  const [fechaCierre, setFechaCierre] = useState("");
  const [indexModulo, setIndexModulo] = useState(0);
  const [newModulo, setNewModulo] = useState({ valor: 0, fechaDesde: "" });
  const [fechaAnterior, setFechaAnterior] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [prevValue, setPrevValue] = useState({ valor: 0, fechaDesde: "" });
  const [editState, setEditState] = useState({
    valor: {
      value: 0,
      canEdit: true,
      edited: false,
    },
    fechaDesde: {
      value: "",
      canEdit: false,
      edited: false,
    },
  });

  const handleSave = (option) => {
    let moduloData = { id: indexModulo };
    if (option == "editar") {
      moduloData = {
        ...moduloData,
        valor: editState.valor.edited ? editState.valor.value : 0,
        fechaDesde: editState.fechaDesde.edited
          ? editState.fechaDesde.value
          : "",
      };

      editMutate(moduloData);
      refetch();
      setEditState({
        valor: {
          value: 0,
          canEdit: true,
          edited: false,
        },
        fechaDesde: {
          value: "",
          canEdit: true,
          edited: false,
        },
      });
    } else if (option == "cerrar") {
      moduloData = {
        ...moduloData,
        fechaHasta: fechaCierre,
      };
      cerrarMutate(moduloData);
      refetch();
      setFechaCierre("");
    } else if (option == "actualizar") {
      moduloData = {
        ...moduloData,
        valor: newModulo.valor,
        fechaDesde: newModulo.fechaDesde,
      };
      actualizarMutate(moduloData);
      refetch();
      setNewModulo({ valor: 0, fechaDesde: "" });
    }

    setIndexModulo(0);
  };

  const handleBaja = (id) => {
    Swal.fire({
      title: "Dar de baja al módulo",
      text: `¿Usted esta seguro de que desea dar de baja el módulo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate({ id, fechaHasta: fechaCierre });
        setFechaCierre("");
      }
    });
  };

  //FIN EDITAR PRECIO

  //----------------------------------COLUMNAS ------------------------------//

  Moment.locale("es-mx");
  const columns = [
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      grow: 2,
      wrap: true,
      sortFunction: (a, b) =>
        a.descripcion.toUpperCase() > b.descripcion.toUpperCase()
          ? 1
          : a.descripcion.toUpperCase() < b.descripcion.toUpperCase()
          ? -1
          : 0,
    },
    {
      name: "Valor",
      selector: (row) => `$ ${NumberFormatter(row.valor)}`,
      sortable: true,
    },
    {
      name: "Fecha Desde",
      selector: (row) => row.fecha_desde,
      sortable: true,
      format: (row) => Moment(row.fecha_desde).format("L"),
    },
    {
      name: "Fecha hasta",
      selector: (row) => row.fecha_hasta,
      format: (row) =>
        row.fecha_hasta ? (
          Moment(row.fecha_hasta).format("L")
        ) : (
          <i>En Vigencia</i>
        ),
      sortFunction: (a, b) => (a.fecha_hasta ? 1 : b.fecha_hasta ? -1 : 0),
      sortable: true,
    },
    {
      name: "Acción",
      cell: (row) =>
        (row.estado != 0 && row.unico) ||
        row.estado == 3 ||
        (!row.fecha_hasta && !row.unico) ? (
          <Dropdown>
            {!row.fecha_hasta && (
              <button
                className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2
              }`}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#editModuloModal"
                onClick={() => {
                  setIndexModulo(row.id);
                  setEditState({
                    valor: {
                      canEdit: true,
                      value: row.valor,
                    },
                    fechaDesde: {
                      canEdit: row.unico,
                      value: row.fecha_desde.split("T")[0],
                    },
                  });
                  setPrevValue({
                    valor: row.valor,
                    fechaDesde: row.fecha_desde.split("T")[0],
                  });
                }}
              >
                <FaEdit />
                Editar M&oacute;dulo
              </button>
            )}
            {!row.fecha_hasta && (
              <button
                className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2
              }`}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#periodoModal"
                onClick={() => {
                  setIndexModulo(row.id);
                  setFechaAnterior(row.fecha_desde);
                }}
              >
                <FaCalendar />
                Cerrar Período
              </button>
            )}
            {row.estado == 3 && (
              <button
                className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2
              }`}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#valorModal"
                onClick={() => {
                  setIndexModulo(row.id);
                  setNewModulo({
                    ...newModulo,
                    fechaDesde: formatDate(row.fecha_hasta, 2),
                  });
                }}
              >
                <FaSync />
                Actualizar Valor
              </button>
            )}
            {!row.fecha_hasta && (
              <button
                className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2`}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#bajaModal"
                onClick={() => {
                  setIndexModulo(row.id);
                  setFechaAnterior(row.fecha_desde);
                }}
              >
                <FaTimes />
                Dar de Baja
              </button>
            )}
          </Dropdown>
        ) : null,
    },
  ];

  return (
    <>
      <Modal
        title="Editar Módulo"
        referenceID="editModuloModal"
        customFooter={true}
        handleClose={() => {
          setEditState({
            valor: { ...editState.valor, value: 0, edited: false },
            fechaDesde: { ...editState.fechaDesde, value: "", edited: false },
          });
          setIndexModulo(0);
        }}
        isStatic={true}
      >
        <div>
          <hr className="hrstyle" style={{ marginTop: "-2rem" }} />
          <div className="d-flex align-items-start justify-content-center gap-4 flex-md-row flex-sm-column">
            {editState.fechaDesde.canEdit && (
              <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-50 mt-5">
                <h6 className="text-muted">Editar Fecha</h6>
                <div>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaDesde"
                    min="2022-01-01"
                    value={editState.fechaDesde.value}
                    autoComplete="off"
                    placeholder="Fecha Desde"
                    onChange={(e) => {
                      setEditState({
                        ...editState,
                        fechaDesde: {
                          ...editState.fechaDesde,
                          value: e.target.value,
                          edited: e.target.value != prevValue.fechaDesde,
                        },
                      });
                      setDisabledButton(validateFecha(e.target.value));
                    }}
                  />
                </div>
                {editState.fechaDesde.edited &&
                  validateFecha(editState.fechaDesde.value) && (
                    <div>
                      <p
                        style={{
                          color: "red",
                          fontSize: "16px",
                        }}
                      >
                        La fecha de cierre no puede ser posterior al día de hoy
                      </p>
                    </div>
                  )}
              </div>
            )}
            {editState.valor.canEdit && (
              <div className="d-flex justify-content-center gap-2 flex-column align-items-center w-50 mt-5">
                <h6 className="text-muted">Editar Valor</h6>
                <div>
                  <input
                    className="form-control"
                    type="number"
                    value={editState.valor.value}
                    onChange={(e) => {
                      setEditState({
                        ...editState,
                        valor: {
                          ...editState.valor,
                          value: e.target.value,
                          edited: e.target.value != prevValue.valor,
                        },
                      });
                      setDisabledButton(!e.target.value || e.target.value == 0);
                    }}
                    min={0}
                  />
                </div>
              </div>
            )}
          </div>
          <hr className="hrstyle2" />
          <div className="modal-footer mt-4" style={{ border: "none" }}>
            <button
              type="button"
              onClick={() => {
                setEditState({
                  valor: { ...editState.valor, value: 0, edited: false },
                  fechaDesde: {
                    ...editState.fechaDesde,
                    value: "",
                    edited: false,
                  },
                });
                setDisabledButton(false);
              }}
              className="btn btn-limpiar d-flex align-items-center justify-content-center gap-2"
            >
              <FaRedo />
              <span>Limpiar campos</span>
            </button>
            <button
              type="button"
              className="btn btn-guardar"
              onClick={() => handleSave("editar")}
              disabled={
                (!editState.valor.edited && !editState.fechaDesde.edited) ||
                disabledButton
              }
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Cerrar Período"
        referenceID="periodoModal"
        size="modal-md"
        customFooter={true}
        isStatic={true}
        showHr={true}
        showHr2={true}
        handleClose={() => {
          setFechaCierre("");
          setIndexModulo(0);
        }}
      >
        <div>
          <hr className="hrstyle" style={{ marginTop: "-1.5rem" }} />
          <div className="d-flex align-items-center justify-content-center gap-4 flex-md-row flex-sm-column ">
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-50 mt-5">
              <h6 className="text-muted">Fecha de Cierre</h6>
              <div>
                <input
                  type="date"
                  className="form-control"
                  name="fechaHasta"
                  min={formatDate(fechaAnterior)}
                  value={fechaCierre}
                  autoComplete="off"
                  placeholder="Fecha Hasta"
                  onChange={(e) => {
                    setFechaCierre(e.target.value);
                    setDisabledButton(validateFecha(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
          <hr className="hrstyle2" />
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              onClick={() => {
                setFechaCierre("");
                setDisabledButton(false);
              }}
              className="btn btn-limpiar d-flex align-items-center justify-content-center gap-2"
            >
              <FaRedo />
              <span>Limpiar campos</span>
            </button>
            <button
              type="button"
              className="btn btn-guardar"
              onClick={() => handleSave("cerrar")}
              disabled={
                !fechaCierre ||
                new Date(formatDate(fechaAnterior)).getTime() >
                  new Date(formatDate(fechaCierre)).getTime()
              }
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Baja de Módulo"
        referenceID="bajaModal"
        size="modal-md"
        customFooter={true}
        isStatic={true}
        showHr={true}
        showHr2={true}
        handleClose={() => {
          setFechaCierre("");
          setIndexModulo(0);
        }}
      >
        <div>
          <hr className="hrstyle" style={{ marginTop: "-1.5rem" }} />
          <div className="d-flex align-items-center justify-content-center gap-4 flex-md-row flex-sm-column ">
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-50 mt-5">
              <h6 className="text-muted">Fecha de Baja</h6>
              <div>
                <input
                  type="date"
                  className="form-control"
                  name="fechaHasta"
                  min={formatDate(fechaAnterior)}
                  value={fechaCierre}
                  autoComplete="off"
                  placeholder="Fecha Hasta"
                  onChange={(e) => {
                    setFechaCierre(e.target.value);
                    setDisabledButton(validateFecha(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div style={{ marginLeft: "2rem" }}>
            {disabledButton && (
              <p
                style={{
                  color: "red",
                  fontSize: "16px",
                }}
              >
                La fecha de baja no puede ser posterior al día de hoy
              </p>
            )}
          </div>
          <hr className="hrstyle2" />
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              onClick={() => {
                setFechaCierre("");
                setDisabledButton(false);
              }}
              className="btn btn-limpiar d-flex align-items-center justify-content-center gap-2"
            >
              <span>Limpiar Campos</span>
            </button>
            <button
              type="button"
              className="btn btn-guardar"
              onClick={() => handleBaja(indexModulo)}
              disabled={!fechaCierre || disabledButton}
            >
              Dar de Baja
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Actualizar Valor"
        referenceID="valorModal"
        customFooter={true}
        isStatic={true}
        handleClose={() => setIndexModulo(0)}
      >
        <div>
          <div className="d-flex align-items-center justify-content-center gap-4 flex-md-row flex-sm-column">
            <div className="d-flex flex-column gap-2 justify-content-center align-items-center w-50 mb-2">
              <h6 className="text-muted">Fecha de Inicio</h6>
              <div>
                <input
                  type="date"
                  className="form-control"
                  name="fechaDesde"
                  value={newModulo.fechaDesde}
                  autoComplete="off"
                  placeholder="Fecha Desde"
                  disabled
                />
              </div>
            </div>
            <div className="d-flex justify-content-center gap-2 flex-column align-items-center w-50">
              <h6 className="text-muted">Nuevo Valor</h6>
              <div>
                <input
                  className="form-control"
                  type="number"
                  value={newModulo.valor}
                  onChange={(e) =>
                    setNewModulo({ ...newModulo, valor: e.target.value })
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer mt-4">
            <button
              type="button"
              onClick={() => {
                setNewModulo({ ...newModulo, valor: 0 });
                setDisabledButton(false);
              }}
              className="btn btn-limpiar d-flex align-items-center justify-content-center gap-2"
            >
              <FaRedo />
              <span>Limpiar campos</span>
            </button>
            <button
              type="button"
              className="btn btn-guardar"
              onClick={() => handleSave("actualizar")}
              disabled={
                !newModulo.fechaDesde ||
                !newModulo.valor ||
                newModulo.valor <= 0
              }
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </Modal>
      <div>
        <div
          className="d-flex gap-2 w-100 justify-content-between align-items-center"
          style={{ flexDirection: window.innerWidth < 1000 ? "column" : "row" }}
        >
          <div
            className="input-group mb-3"
            style={{
              zIndex: 1,
              width: window.innerWidth < 1000 ? "100%" : "45%",
            }}
          >
            <input
              type="text"
              className={`form-control ${
                window.innerWidth < 1000 ? "" : "inputSearch"
              }`}
              placeholder="Buscar por Descripción"
              onChange={handleOnChange}
              value={search}
              disabled={showSpinner || !data}
              autoComplete="off"
            />
          </div>
          <button
            className={`btn btn-dark ${
              window.innerWidth < 1000 ? "btn-sm" : "btn-md"
            }`}
            onClick={handleMostrarFormulario}
            disabled={showSpinner || !fetchedModulos}
          >
            + Asignar Valor
          </button>

          {mostrarFormulario && (
            <div className="form-modulo">
              <CrearValor
                handleCerrarFormulario={handleCerrarFormulario}
                data={modulos}
              />
            </div>
          )}
        </div>
        {showSpinner && <Spinner />}
        {!showSpinner && (
          <DataTable
            columns={columns}
            data={modulo}
            pagination
            striped
            paginationComponentOptions={paginationOptions}
            noDataComponent={<EmptyTable msg="No se encontro ningún Módulo" />}
            className="del-overflow"
            {...props}
          />
        )}
      </div>
    </>
  );
};

export default Modulos;
