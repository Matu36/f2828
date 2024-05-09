import React, { useEffect, useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { useVerOrdenDePago } from "../hooks/useOrdenesDePago";
import DataTable from "react-data-table-component";
import EmptyTable from "../components/UI/EmptyTable";
import Spinner from "../components/UI/Spinner";
import { ArchivoAPI } from "../api/ArchivoAPI";
import Modal from "../components/UI/Modal";
import InputField from "../components/UI/InputField";
import Layout from "../components/Layout/LayoutContainer";
import moment from "moment";

const Archivos = () => {
  const { data, isFetched, isFetching } =
    useVerOrdenDePago(true).verOrdenesQuery;
  const { paginationOptions } = usePagination(data);

  const today = moment().format("YYYY-MM-DD");

  const oneYearFromToday = moment().add(1, "year").format("YYYY-MM-DD");

  const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (
      moment(selectedDate).isAfter(yesterday) &&
      moment(selectedDate).isBefore(oneYearFromToday)
    ) {
      setDateInput(selectedDate);
      setErrorDate({ type: 0 });
    } else if (moment(selectedDate).isBefore(today)) {
      setDateInput("");
      setErrorDate({ type: 2 });
    } else {
      setDateInput("");
      setErrorDate({ type: 1 });
    }
  };

  const [dateInput, setDateInput] = useState("");
  const [rowId, setRowId] = useState(0);
  const [errorDate, setErrorDate] = useState({ type: 0 });

  const columns = [
    {
      name: "Nro. O.P Provisorio",
      selector: (row) => row.opprovisorio_nro,
      sortable: true,
    },
    {
      name: "Nro O.P Definitivo",
      selector: (row) => row.op_nro,
      sortable: true,
      format: (row) => row.op_nro ?? <i>Sin Asignar</i>,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <>
          <Modal
            title="Generar Archivo de Transferencia"
            referenceID="modalArchivo"
            size="modal-md"
            handleClose={() => {
              setDateInput(""), setErrorDate({ type: 0 });
            }}
          >
            <div>
              <div className="d-flex gap-2 align-items-center justify-content-center h-full">
                <InputField
                  inputKey="Fecha de Emisión"
                  label="Fecha de Emisión"
                  inputType="date"
                  min={today}
                  value={dateInput}
                  onChange={(e) => handleDateChange(e)}
                />
                <button
                  className="btn btn-sm btn-secondary m-2"
                  onClick={() => {
                    let fecha = dateInput.split("-").reverse().join("/");
                    handleClick(fecha);
                    setDateInput("");
                  }}
                  disabled={errorDate.type != 0 || dateInput == ""}
                >
                  Generar Archivo
                </button>
              </div>
            </div>
          </Modal>
          <button
            className="btn btn-sm btn-secondary m-2"
            data-bs-toggle="modal"
            data-bs-target="#modalArchivo"
            onClick={() => setRowId(row.liquidacion_id)}
          >
            Generar Archivo
          </button>
        </>
      ),
    },
  ];

  const handleClick = async (fechaAcreditacion) => {
    try {
      await ArchivoAPI.post(
        `/generar/${rowId}`,
        { fechaAcreditacion },
        {
          responseType: "arraybuffer",
        }
      ).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/plain", encoding: "ansi" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TR10405A"); //or any other extension
        document.body.appendChild(link);
        link.click();
        setDateInput("");
        setErrorDate({ type: 0 });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [Op, setOp] = useState(data);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOp(data);
  }, [data]);

  useEffect(() => {
    filterByOp(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByOp = (value) => {
    if (!value) {
      setOp(data);
    } else {
      const arrayCache = data.filter((mod) => {
        if (mod.hasOwnProperty("op_nro")) {
          const opNumber = mod.op_nro;
          if (typeof opNumber === "number") {
            return opNumber.toString().includes(value);
          }
        }
        return false;
      });
      setOp(arrayCache);
    }
  };

  return (
    <Layout
      Titulo="Archivos de Transferencia"
      Subtitulo="Listado de todas las órdenes de pago con numeración definitiva"
    >
      {isFetched && !isFetching ? (
        <>
          <div className="input-group mb-3" style={{ maxWidth: "40%" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por Número de OP Definitivo"
              onChange={handleOnChange}
              value={search}
              autoComplete="off"
            />
          </div>

          <DataTable
            columns={columns}
            data={Op}
            pagination
            striped
            paginationComponentOptions={paginationOptions}
            noDataComponent={<EmptyTable msg="No hay órdenes de pago" />}
          />
        </>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Archivos;
