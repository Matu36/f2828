import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import Dropdown from "../components/UI/Dropdown";
import { Link } from "react-router-dom";
import { FaPrint, FaSearch, FaTimes } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import PDF from "./PDF";
import Spinner from "./UI/Spinner";
import { MaskCuil } from "../utils/Mask";
import { useAgentes } from "../hooks/useAgentes";

//Componente que muestra los AGENTES

const TramitesPendientes = ({ ...props }) => {
  // const { data, isLoading } = useAgentes().agentesQuery;
  const [search, setSearch] = useState("");
  const [agente, setAgente] = useState([]);

  const [clicked, setClicked] = useState({ isClicked: false });

  const data = [
    {
      id: 1,
      Legajo: 45678,
      Dni: 31552583,
      FechaDeNacimiento: "03/07/1985",
      Apellido: "Pineda",
      Nombre: "Matías",
    },
    {
      id: 2,
      Legajo: 12345,
      Dni: 12345678,
      FechaDeNacimiento: "15/02/1990",
      Apellido: "Gonzalez",
      Nombre: "Maria",
    },
    {
      id: 3,
      Legajo: 78901,
      Dni: 87654321,
      FechaDeNacimiento: "20/09/1983",
      Apellido: "Martinez",
      Nombre: "Juan",
    },
    {
      id: 4,
      Legajo: 23456,
      Dni: 98765432,
      FechaDeNacimiento: "10/05/1978",
      Apellido: "Lopez",
      Nombre: "Carlos",
    },
    {
      id: 5,
      Legajo: 67890,
      Dni: 54321678,
      FechaDeNacimiento: "28/11/1995",
      Apellido: "Rodriguez",
      Nombre: "Laura",
    },
  ];

  const { paginationOptions, customStyles } = usePagination(data);

  // useEffect(() => {
  //   setAgente(data);
  // }, [data]);

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
          oper.Legajo.toString().includes(value) ||
          oper.Dni.toString().includes(value)
      );
      setAgente(arrayCache);
    }
  };

  //-------------------------------- FIN SEARCHBAR --------------------------- //

  const columns = [
    { name: "Apellido", selector: (row) => row.Apellido, sortable: true },
    { name: "Nombre", selector: (row) => row.Nombre, sortable: true },
    { name: "DNI", selector: (row) => row.Dni, sortable: true },
    { name: "LEGAJO", selector: (row) => row.Legajo, sortable: true },
    {
      name: "Fecha de Nac",
      selector: (row) => row.FechaDeNacimiento,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <Dropdown handleClick={() => setClicked({ isClicked: true })}>
          <Link className="dropdown-item dropdown-item-custom">
            <FaSearch size="0.85em" />
            <span style={{ marginLeft: "5px" }}>Ver Trámite</span>
          </Link>

          <button
            onClick={() => eliminarTramite(row.id)}
            className="dropdown-item dropdown-item-custom"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#opDefinitiva"
          >
            <MdDeleteOutline size="0.85em" />
            <span style={{ marginLeft: "5px" }}>Eliminar Trámite</span>{" "}
          </button>

          <button className="dropdown-item w-100 dropdown-item-custom pdf-download-link">
            <FaPrint size="0.85em" />
            <span style={{ marginLeft: "5px" }}></span>{" "}
            <PDF clicked={clicked} />
          </button>
        </Dropdown>
      ),
    },
  ];

  const eliminarTramite = (id) => {
    const nuevosTramites = agente.filter((tramite) => tramite.id !== id);

    setAgente(nuevosTramites);

    setClicked({ isClicked: false });
  };

  //---------------------------------SPINNER ------------------------------------//

  const [showSpinner, setShowSpinner] = useState(true);

  // useEffect(() => {
  //   setShowSpinner(isLoading);
  // }, [isLoading]);

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
            placeholder="Buscar por DNI o Legajo"
            onChange={handleOnChange}
            value={search}
            autoComplete="off"
            disabled={!data}
          />
        </div>

        {/* {!showSpinner ? ( */}
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
        {/* ) : (
          <Spinner />
        )} */}
      </div>
    </>
  );
};

export default TramitesPendientes;
