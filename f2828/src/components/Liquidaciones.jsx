import React, { useEffect, useState } from "react";
import "../assets/styles/detalle.css";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import Spinner from "../components/UI/Spinner";
import Modal from "./UI/Modal";
import { useHonorarios } from "../hooks/useHonorarios";
import NumberFormatter from "../utils/NumberFormatter";
import "../components/styles/Liquidaciones.css";
import moment from "moment";
import { FaFilter } from "react-icons/fa";
import ExpandableFilters from "./UI/ExpandableFilters";
import { MaskCuil } from "../utils/Mask";

// Componente que se encarga de mostrar y de Generar las Ordenes de Pago

const LIMITE = 3350000;

const Liquidaciones = ({ ...props }) => {
  const { data, isFetched } = useHonorarios().honorariosPendientesQuery;

  const [total, setTotal] = useState(0);
  const [inputValue, setInputValue] = useState({
    nroFolio: "",
    nroChequeTransferencia: "",
  });
  const [error, setError] = useState({
    nroFolio: false,
    nroChequeTransferencia: false,
  });

  const { mutate } = useHonorarios().liquidacionesMutation;

  const [search, setSearch] = useState("");
  const [mesSearch, setMesSearch] = useState(0);

  const [liquidaciones, setLiquidaciones] = useState(data);

  const { paginationOptions } = usePagination(data);

  //---------------------------------SPINNER ------------------------------------//

  const [showSpinner, setShowSpinner] = useState(true);

  //ESTO!

  useEffect(() => {
    if (isFetched) {
      if (data) {
        setLiquidaciones(data);
      } else {
        setLiquidaciones([]);
      }
      setShowSpinner(false);
    }
  }, [isFetched, data]);

  //---------------------------------FIN SPINNER ------------------------------------//

  //-------------------------------- SEARCHBAR --------------------------- //

  useEffect(() => {
    filterData();
  }, [search, mesSearch]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  //ESTO

  const filterData = () => {
    if (Array.isArray(data)) {
      const filtered = data.filter((item) => {
        if (
          Number(mesSearch) !== 0 &&
          new Date(item.fecha).getMonth() + 1 !== Number(mesSearch)
        ) {
          return false;
        }
        if (
          search !== "" &&
          !item.apellido.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      setLiquidaciones(filtered);
    } else {
      setLiquidaciones([]);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      name: "Seleccionar",
      cell: (row) => (
        <input
          type="checkbox"
          className="checkbox"
          onMouseOver={(e) => (e.target.style.cursor = "pointer")}
          checked={selectedRows.some((r) => r.id === row.id)}
          onChange={() => {
            setSelectedRows((prevSelected) =>
              prevSelected.some((r) => r.id === row.id)
                ? prevSelected.filter((r) => r.id !== row.id)
                : [
                    ...prevSelected,
                    {
                      ...row,
                      isClicked: true,
                    },
                  ]
            );
            setTotal((prevTotal) =>
              selectedRows.some((r) => r.id === row.id)
                ? prevTotal - Number(row.valor)
                : prevTotal + Number(row.valor)
            );
          }}
        />
      ),
    },
    {
      name: "Fecha Creación",
      selector: (row) => row.fecha,
      format: (row) => moment(row.fecha).format("L"),
      sortable: true,
    },
    {
      name: "Honorario ID",
      selector: (row) => row.id,
      omit: true,
    },
    { name: "PD Nro", selector: (row) => row.referencia, sortable: true },
    {
      name: "APELLIDO",
      selector: (row) => row.apellido,
      sortable: true,
      wrap: true,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "CUIL",
      selector: (row) => row.cuil,
      format: (row) => MaskCuil(row.cuil),
      sortable: true,
    },
    {
      name: "DESCRIPCIÓN",
      selector: (row) => row.descripcion,
      sortable: true,
      wrap: true,
    },
    {
      name: "VALOR",
      selector: (row) => `$ ${NumberFormatter(row.valor)}`,
      sortable: true,
    },
  ];

  const handleClick = (event) => {
    event.preventDefault();
    const selectedData = selectedRows.map((row) => ({
      honorario_id: row.id,
    }));

    const data = { array: selectedData, ...inputValue };
    if (
      inputValue.nroFolio.length > 0 &&
      inputValue.nroChequeTransferencia.length > 0 &&
      total <= LIMITE
    ) {
      setInputValue({ nroFolio: "", nroChequeTransferencia: "" });
      mutate(data);
      setSelectedRows([]);
      setTotal(0);
    }
  };

  const handleChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: e.target.value.length == 0 });
  };

  const selectAllRows = () => {
    setSelectedRows(data);
  

    const selectedTotal = data.reduce((acc, row) => acc + Number(row.valor), 0);

    setTotal(selectedTotal);
  };

  const clearSelection = () => {
    const deselectedTotal = selectedRows.reduce(
      (acc, row) => acc + Number(row.valor),
      0
    );
    const newTotal = total - deselectedTotal;
    setTotal(newTotal);
    setSelectedRows([]);
  };

  return (
    <>
      {isFetched ? (
        <>
          <Modal
            title="Generar Orden de Pago"
            referenceID="opModal"
            customFooter={true}
          >
            <div>
              <hr className="hrstyle" style={{ marginTop: "-2rem" }} />
              <div className="d-flex w-full justify-content-evenly mt-4">
                <div className="mb-3">
                  <label htmlFor="inputFolio" className="form-label mt-5">
                    Nro de Folio Banco: <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="inputFolio"
                    aria-describedby="inputFolioHelp"
                    name="nroFolio"
                    value={inputValue.nroFolio}
                    autoComplete="off"
                    placeholder="N° de Folio Banco"
                    onChange={handleChange}
                  />
                  {error.nroFolio && (
                    <span className="spanObligatorio">
                      El nro de Folio es obligatorio
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="inputCheque-Transferencia"
                    className="form-label mt-5"
                  >
                    Nro de Cheque/Transferencia:{" "}
                    <span className="spanObligatorio">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputCheque-Transferencia"
                    aria-describedby="inputCheque-TransferenciaHelp"
                    name="nroChequeTransferencia"
                    value={inputValue.nroChequeTransferencia}
                    autoComplete="off"
                    placeholder="N° de Cheque/Transferencia"
                    onChange={handleChange}
                  />
                  {error.nroChequeTransferencia && (
                    <span className="spanObligatorio">
                      El Nro de Cheque/Transferencia es obligatorio
                    </span>
                  )}
                </div>
              </div>
              <hr className="hrstyle2" />
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn btn-guardar"
                  onClick={handleClick}
                  disabled={
                    inputValue.nroFolio.length == 0 ||
                    inputValue.nroChequeTransferencia.length == 0
                  }
                >
                  Generar OP
                </button>
              </div>
            </div>
          </Modal>
          <div>
            {" "}
            <ExpandableFilters>
              <div className="card mb-3">
                <div className="input-group mb-3 d-flex align-items-center w-100 gap-4">
                  <div
                    className="d-flex flex-column gap-2"
                    style={{ width: "60%" }}
                  >
                    <label>Apellido:</label>
                    <input
                      type="text"
                      className="form-control w-100"
                      placeholder="Buscar por APELLIDO o CUIL"
                      onChange={handleOnChange}
                      value={search}
                      autoComplete="off"
                      disabled={liquidaciones.length == 0}
                    />
                  </div>

                  <div
                    className="d-flex flex-column gap-2"
                    style={{ width: "30%" }}
                  >
                    <label>Mes:</label>
                    <select
                      className="form-select form-control"
                      placeholder="Elegí un mes"
                      value={mesSearch}
                      onChange={(e) => {
                        setMesSearch(e.target.value);
                      }}
                      disabled={liquidaciones.length == 0}
                    >
                      <option defaultChecked value="0">
                        Todos
                      </option>
                      <option value="1">Enero</option>
                      <option value="2">Febrero</option>
                      <option value="3">Marzo</option>
                      <option value="4">Abril</option>
                      <option value="5">Mayo</option>
                      <option value="6">Junio</option>
                      <option value="7">Julio</option>
                      <option value="8">Agosto</option>
                      <option value="9">Septiembre</option>
                      <option value="10">Octubre</option>
                      <option value="11">Noviembre</option>
                      <option value="12">Diciembre</option>
                    </select>
                  </div>
                </div>
              </div>
            </ExpandableFilters>
            <br />
            <div>
              <button className="btn btn-buscar" onClick={selectAllRows} disabled={liquidaciones.length == 0}>
                Seleccionar Todo
              </button>

              <button
                className="btn btn-limpiar"
                onClick={clearSelection}
                style={{ marginLeft: "1rem" }}
                disabled={liquidaciones.length == 0}
              >
                Limpiar Selección
              </button>
              {showSpinner ? (
                <Spinner />
              ) : typeof liquidaciones === "object" &&
                liquidaciones.length > 0 ? (
                <DataTable
                  columns={columns}
                  data={liquidaciones}
                  pagination
                  selectableRowsSelected={selectedRows.map((row) => row.index)}
                  selectableRowsHideCheck={false}
                  onSelectedRowsChange={({ selectedRows }) =>
                    setSelectedRows(selectedRows.map((row) => data[row.index]))
                  }
                  striped
                  paginationComponentOptions={paginationOptions}
                  noDataComponent={
                    <EmptyTable msg="No se encontró el Agente con los datos proporcionados" />
                  }
                  {...props}
                />
              ) : (
                <EmptyTable msg="No hay ningún Agente pendiente de pago" />
              )}
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <div>
                  <h5>
                    Total: $<span>{NumberFormatter(total)}</span>
                  </h5>
                  {total > LIMITE && (
                    <span className="spanObligatorio">
                      <p>Te estas excediendo del limite de $3,500,000.00</p>
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-guardar"
                  disabled={selectedRows.length == 0 || total > LIMITE}
                  data-bs-toggle="modal"
                  data-bs-target="#opModal"
                >
                  {" "}
                  Generar Orden de Pago{" "}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Liquidaciones;
