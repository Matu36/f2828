import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import { Link } from "react-router-dom";
import "../assets/styles/detalle.css";
import Spinner from "./UI/Spinner";
import { MaskCuil } from "../utils/Mask";
import "../components/styles/GetAgente.css";
import { useAgentes } from "../hooks/useAgentes";

//Componente que muestra los AGENTES

const GetAgentes = ({ ...props }) => {
  const { data, isLoading } = useAgentes().agentesQuery;
  const [search, setSearch] = useState("");
  const [agente, setAgente] = useState([]);

  const { paginationOptions, customStyles } = usePagination(data);

  useEffect(() => {
    setAgente(data);
  }, [data]);

  //-------------------------------- SEARCHBAR --------------------------- //

  useEffect(() => {
    filterByApellido(search);
  }, [search]);

  const handleOnChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filterByApellido = (value) => {
    if (!value) {
      setAgente(data);
    } else {
      const arrayCache = data.filter(
        (oper) =>
          oper.apellido.toLowerCase().includes(value.toLowerCase()) ||
          oper.cuil.toLowerCase().includes(value.toLowerCase())
      );
      setAgente(arrayCache);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  const columns = [
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "CBU", selector: (row) => row.cbu, sortable: true },
    {
      name: "CUIL",
      selector: (row) => row.cuil,
      sortable: true,
      format: (row) => MaskCuil(row.cuil),
    },
    {
      name: "Ver",
      cell: (row) => (
        <Link to={`/agentes/agente/${row.id}`} className="custom-link">
          <button className="detalle"> + Información</button>
        </Link>
      ),
    },
  ];

  //---------------------------------SPINNER ------------------------------------//

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setShowSpinner(isLoading);
  }, [isLoading]);

  //---------------------------------FIN SPINNER ------------------------------------//

  return (
    <>
      <div>
        <div
          className="input-group mb-3 inputSearch"
          style={{ maxWidth: "40%" }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por APELLIDO o CUIL"
            onChange={handleOnChange}
            value={search}
            autoComplete="off"
            disabled={!data}
          />
        </div>
        {!showSpinner ? (
          <DataTable
            columns={columns}
            data={agente}
            pagination
            striped
            paginationComponentOptions={paginationOptions}
            noDataComponent={
              <EmptyTable msg="No se encontro el Agente con los datos ingresados" />
            }
            {...props}
            customStyles={customStyles}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
};

export default GetAgentes;
