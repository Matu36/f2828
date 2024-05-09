import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import Moment from "moment";
import CrearModulo from "./CrearModulo";
import Spinner from "./UI/Spinner";
import "../assets/styles/detalle.css";
import Swal from "sweetalert2";
import { useModulos } from "../hooks/useModulos";
import "../components/styles/Modulos.css";
import "./styles/ordenes.css";

const Badge = ({ estado }) => {
  switch (estado) {
    case 0:
      return (
        <span
          className="badge rounded-pill px-3 py-1 text-bg-danger"
          style={{ fontSize: "11px" }}
        >
          Dado de baja
        </span>
      );
    case 1:
      return (
        <span
          className="badge rounded-pill px-3 py-1 text-bg-success"
          style={{ fontSize: "11px" }}
        >
          Sin Valor
        </span>
      );

    case 2:
      return (
        <span
          className="badge rounded-pill px-3 py-1 text-bg-danger"
          style={{ fontSize: "11px" }}
        >
          Con Valor
        </span>
      );
  }
};

//Componente que muestra los MODULOS y que permite la edición de los mismos.

const ListaModulos = ({ ...props }) => {
  const { modulosQuery } = useModulos(0, false);
  const { data, isFetched } = modulosQuery;

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
      setModulo(orderData);
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

  const [editIndex, setEditIndex] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [prevValor, setPrevValor] = useState(0);

  const handleEdit = (id, valor) => {
    setEditIndex(id);
    setEditPrice(valor);
    setPrevValor(valor);
  };

  const handlePriceChange = (valor) => {
    setEditPrice(valor);
  };

  const handleSave = (id) => {
    if (editPrice !== null) {
      const updatedModulo = {
        id: id,
        valor: editPrice,
      };

      refetch();
      setEditIndex(null);
      setEditPrice(null);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "El valor del módulo ha sido modificado",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditPrice(null);
  };

  const handleBaja = (id, descripcion) => {
    Swal.fire({
      title: "Dar de baja al módulo",
      text: `¿Usted esta seguro de que desea eliminar el módulo: ${descripcion}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id);
      }
    });
  };

  //FIN EDITAR PRECIO

  //----------------------------------COLUMNAS ------------------------------//

  Moment.locale("es-mx");
  const columns = [
    {
      name: "#",
      selector: (row, index) => index,
      cell: (row, index) => index + 1,
    },
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
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      cell: (row) => <Badge estado={row.estado} />,
    },
    // {
    //   name: "Acción",
    //   cell: (row) =>
    //     editIndex === row.id ? (
    //       <>
    //         <input
    //           className="input"
    //           style={{ maxWidth: "40%" }}
    //           type="number"
    //           value={editPrice}
    //           onChange={(e) => handlePriceChange(+e.target.value)}
    //           min={0}
    //         />
    //         <div className="acciones">
    //           <button
    //             className="btn btn-guardar btn-sm mt-1"
    //             onClick={() => handleSave(row.id)}
    //             disabled={editPrice <= 0 || prevValor == editPrice}
    //           >
    //             Guardar
    //           </button>
    //           <button
    //             className="btn btn-limpiar btn-sm mb-1"
    //             onClick={handleCancel}
    //           >
    //             Cancelar
    //           </button>
    //         </div>
    //       </>
    //     ) : (
    //       !row.fechaHasta && (
    //         <Dropdown>
    //           <button
    //             className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2
    //           }`}
    //             type="button"
    //             // data-bs-toggle="modal"
    //             // data-bs-target="#opDefinitiva"
    //             onClick={() => handleEdit(row.id, row.valor)}
    //           >
    //             <FaEdit />
    //             Editar Valor
    //           </button>
    //           <button
    //             className={`dropdown-item dropdown-item-custom d-flex align-items-center gap-2`}
    //             type="button"
    //             // data-bs-toggle="modal"
    //             // data-bs-target="#opDefinitiva"
    //             onClick={() => handleBaja(row.id, row.descripcion)}
    //           >
    //             <FaTimes />
    //             Dar de Baja
    //           </button>
    //         </Dropdown>
    //       )
    //     ),
    // },
  ];

  return (
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
          disabled={showSpinner}
        >
          + Crear M&oacute;dulo
        </button>

        {mostrarFormulario && (
          <div className="form-modulo">
            <CrearModulo
              handleCerrarFormulario={handleCerrarFormulario}
              data={modulo}
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
  );
};

export default ListaModulos;
