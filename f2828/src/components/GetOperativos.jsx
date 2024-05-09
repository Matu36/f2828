import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import Spinner from "./UI/Spinner";
import { obtenerMesYAño } from "../utils/MesAño";
import "../assets/styles/detalle.css";
import { useOperativo } from "../hooks/useOperativo";

// Componente que muestra los OPERATIVOS

const GetOperativos = () => {
  const { data, isLoading } = useOperativo().operativosQuery;
  const [search, setSearch] = useState("");
  const [operativo, setOperativo] = useState([]);
  const { paginationOptions, customStyles } = usePagination(data);

  useEffect(() => {
    setOperativo(data);
  }, [data]);

  //-------------------------------- SEARCHBAR --------------------------- //

  useEffect(() => {
    filterByPD(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByPD = (value) => {
    if (!value) {
      setOperativo(data);
    } else {
      const arrayCache = data.filter(
        (oper) =>
          oper.referencia.toLowerCase().includes(value.toLowerCase()) ||
          (oper.descripcion &&
            oper.descripcion.toLowerCase().includes(value.toLowerCase()))
      );
      setOperativo(arrayCache);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  //---------------------------------SPINNER ------------------------------------//

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setShowSpinner(isLoading);
  }, [isLoading]);

  //---------------------------------FIN SPINNER ------------------------------------//

  const columns = [
    {
      name: "Proceso de Donación",
      selector: (row) => row.referencia,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
      format: (row) => obtenerMesYAño(row.fecha),
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      sortable: true,
      format: (row) => row.descripcion ?? <i>Sin descripción</i>,
    },
  ];

  return (
    <div>
      <div className="input-group mb-3 inputSearch" style={{ maxWidth: "40%" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por PD o Descripción"
          onChange={handleOnChange}
          value={search}
          autoComplete="off"
          disabled={!data}
        />
      </div>

      {!showSpinner ? (
        <DataTable
          columns={columns}
          data={operativo}
          pagination
          striped
          paginationComponentOptions={paginationOptions}
          noDataComponent={<EmptyTable msg="No se encontro el operativo" />}
          customStyles={customStyles}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default GetOperativos;
