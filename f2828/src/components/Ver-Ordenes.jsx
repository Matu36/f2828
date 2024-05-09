import React, { useState, useEffect } from "react";
import {
  useOrdenesMutation,
  useVerOrdenDePago,
} from "../hooks/useOrdenesDePago";
import { OrdenesDePagoAPI } from "../api/OrdenesDePagoApi";
import DataTable from "react-data-table-component";
import EmptyTable from "./UI/EmptyTable";
import { usePagination } from "../hooks/usePagination";
import { Link } from "react-router-dom";
import "../assets/styles/detalle.css";
import "./styles/ordenes.css";
import Spinner from "./UI/Spinner";
import Modal from "./UI/Modal";
import InputField from "./UI/InputField";
import PrintOrdenPago from "./PrintOrdenPago";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import PrintOrdenPagoPDFTransferencia from "./UI/PrintPDFTransferencia";

import Dropdown from "./UI/Dropdown";
import { FaPlus, FaPrint, FaSearch, FaTimes } from "react-icons/fa";
import { validateFecha } from "../utils/Validaciones";

const NUMBER_REGEX = /^[0-9]+$/;
const NO_NUMBER_STRING_REGEX = /^[^0-9]+$/;

const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

const labels = [
  {
    label: "Nro. O.P Provisorio",
    disabled: true,
    inputKey: "op_provisorio",
    inputType: "number",
    show: false,
  },

  {
    label: "Tipo Acto",
    disabled: false,
    inputKey: "tipo_acto",
    inputType: "text",
    show: true,
  },
  {
    label: "Año Acto",
    disabled: false,
    inputKey: "anio_acto",
    inputType: "number",
    show: true,
    min: previousYear,
    max: currentYear,
  },

  {
    label: "Nro. Acto",
    disabled: false,
    inputKey: "nro_acto",
    inputType: "number",
    show: true,
  },
  {
    label: "Gdeba Acto",
    disabled: true,
    inputKey: "gdeba_acto",
    inputType: "text",
    show: true,
    value: "GDEBA",
  },
  {
    label: "Reparticion Acto",
    disabled: false,
    inputKey: "reparticion_acto",
    inputType: "text",
    show: true,
  },
  {
    label: "Nro. O.P Definitivo",
    disabled: false,
    inputKey: "nro_op",
    inputType: "number",
    show: true,
  },
  {
    label: "Año O.P Definitivo",
    disabled: false,
    inputKey: "anio_op",
    inputType: "number",
    show: false,
  },
  {
    label: "Fecha de Emisión",
    disabled: false,
    inputKey: "fecha_dispo",
    inputType: "date",
    show: true,
  },
];

const INITIAL_STATE = {};

labels.map((l) => (INITIAL_STATE[l.inputKey] = l.value ?? ""));
INITIAL_STATE["liquidacion_id"] = 0;

export const VerOrdenes = ({ ...props }) => {
  const queryClient = useQueryClient();

  const { data, isFetched, refetch } = useVerOrdenDePago().verOrdenesQuery;

  const [clicked, setClicked] = useState({ isClicked: false, liq_id: 0 });

  const { mutate } = useOrdenesMutation().asignarDefinitivo;

  const [OP, setOP] = useState(INITIAL_STATE);
  const [error, setError] = useState(INITIAL_STATE);

  const { paginationOptions } = usePagination(data);

  // ESTO HABILITA O DESHABILITA EL BOTON DE ASIGNAR OP DEFINITIVA SI HAY ERRORES O SI LOS CAMPOS ESTAN VACIOS

  const checkAllFieldsComplete = () => {
    const incompleteFields = labels.filter((l) => {
      if (l.show && !OP[l.inputKey]) {
        return true;
      }
      return false;
    });

    const nroOpComplete =
      !!OP["nro_op"].trim() ||
      incompleteFields.some((field) => field.inputKey === "nro_op");

    const tipoActoIsNumber = !isNaN(OP["tipo_acto"]);
    const reparticionActoIsNumber = !isNaN(OP["reparticion_acto"]);

    const anioActoIsValid =
      OP["anio_acto"] >= 2022 && OP["anio_acto"] <= new Date().getFullYear();

    const fechaDispoIsValid = !validateFecha(OP["fecha_dispo"]);

    return (
      incompleteFields.length === 0 &&
      nroOpComplete &&
      !tipoActoIsNumber &&
      !reparticionActoIsNumber &&
      anioActoIsValid &&
      fechaDispoIsValid
    );
  };

  const [allFieldsComplete, setAllFieldsComplete] = useState(
    checkAllFieldsComplete()
  );

  useEffect(() => {
    setAllFieldsComplete(checkAllFieldsComplete());
  }, [OP]);

  // TERMINA ACÁ

  //ELIMINAR ORDEN DE PAGO//

  const deleteH = useMutation(
    async ({ pOPProvisorio_Nro }) => {
      return await OrdenesDePagoAPI.delete(`/delete/`, {
        data: { pOPProvisorio_Nro },
      });
    },
    {
      onSuccess: () => {
        refetch();
        queryClient.refetchQueries(["honorariosPendientesHome"]);
        return Swal.fire({
          position: "center",
          icon: "success",
          title: "Se eliminó la orden de pago correctamente",
          showConfirmButton: false,
          timer: 3000,
        });
      },
    }
  );

  const handleDelete = (pOPProvisorio_Nro) => {
    Swal.fire({
      title: "Eliminar orden de pago",
      text: `¿Estás seguro de que deseas eliminar la orden de pago Nro ${pOPProvisorio_Nro}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteH.mutate({ pOPProvisorio_Nro });
      }
    });
  };

  //FINALIZA LA ELIMINACION DE LA ORDEN DE PAGO

  //VALIDACIONES DE CUANDO SE VA ESCRIBIENDO EN LOS INPUT DE GENERAR OP DEFINITIVA
  const handleInputChange = (e) => {
    const labelForAnioActo = labels.find(
      (label) => label.inputKey === "anio_acto"
    );

    switch (e.target.type) {
      case "text":
        setError({
          ...error,
          [e.target.name]:
            e.target.value.trim() === "" ||
            !NO_NUMBER_STRING_REGEX.test(e.target.value),
        });
        break;

      case "number":
        setError({
          ...error,
          [e.target.name]: !NUMBER_REGEX.test(e.target.value),
        });
        break;

      case "date":
        setError({
          ...error,
          [e.target.name]: validateFecha(e.target.value),
        });
        break;
    }

    if (e.target.name === "tipo_acto") {
      setError({
        ...error,
        [e.target.name]: !NO_NUMBER_STRING_REGEX.test(e.target.value),
      });
    }

    if (e.target.name === "reparticion_acto") {
      setError({
        ...error,
        [e.target.name]: !NO_NUMBER_STRING_REGEX.test(e.target.value),
      });
    }

    if (e.target.name === "anio_acto" && labelForAnioActo) {
      setError({
        ...error,
        [e.target.name]:
          e.target.value < labelForAnioActo.min ||
          e.target.value > labelForAnioActo.max
            ? "minmax"
            : null,
      });
    }

    setOP({ ...OP, [e.target.name]: e.target.value });
    setAllFieldsComplete(checkAllFieldsComplete());
  };

  //ACA TERMINA

  const handleSubmit = (e) => {
    e.preventDefault();
    let count = 0;
    OP["anio_op"] = OP["anio_acto"];
    for (const key in OP) {
      if (!OP[key]) count++;
    }

    if (count > 0) {
      Swal.fire({
        title: "Los campos no pueden estar vacíos",
        icon: "warning",
        timer: 3000,
      });
    } else {
      let fecha = OP.fecha_dispo;
      let arr = fecha.split("-").reverse();
      arr[arr.length - 1] = arr[arr.length - 1].slice(2, 4);
      let modifFecha = arr.join("/");
      let modif = {
        ...OP,
        fecha_dispo: modifFecha,
      };
      mutate(modif);
      setOP(INITIAL_STATE);
    }
  };

  const columns = [
    {
      name: "Número de Liquidación",
      selector: (row) => row.liquidacion_id,
      sortable: true,
    },
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
        <Dropdown
          handleClick={() =>
            setClicked({ isClicked: true, liq_id: row.liquidacion_id })
          }
        >
          <Link
            className="dropdown-item dropdown-item-custom"
            to={`/ordenes/ver-ordenes/${row.liquidacion_id}`}
          >
            <FaSearch size="0.85em" />
            <span>Ver orden de pago</span>
          </Link>

          {!row.op_nro && (
            <button
              className="dropdown-item dropdown-item-custom"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#opDefinitiva"
              onClick={() =>
                setOP({
                  ...OP,
                  op_provisorio: row.opprovisorio_nro,
                  liquidacion_id: row.liquidacion_id,
                })
              }
            >
              <FaPlus size="0.85em" />
              <span>Asignar número definitivo</span>
            </button>
          )}


            <button className="dropdown-item w-100 dropdown-item-custom pdf-download-link">
              <FaPrint size="0.85em" />
              <PrintOrdenPago
                liquidacionId={row.liquidacion_id}
                opProvisoria={row.opprovisorio_nro}
                clicked={clicked}
              />
            </button>


            <button className="dropdown-item w-100 dropdown-item-custom pdf-download-link">
              <FaPrint size="0.85em" />
              <PrintOrdenPagoPDFTransferencia
                liquidacionId={row.liquidacion_id}
                opProvisoria={row.opprovisorio_nro}
                clicked={clicked}
              />
            </button>


          {!row.op_nro && row.opprovisorio_nro && (
            <button
              className="dropdown-item dropdown-item-custom"
              onClick={() => handleDelete(row.opprovisorio_nro)}
              type="button"
            >
              <FaTimes size="0.85em" />
              <span>Eliminar</span>
            </button>
          )}
        </Dropdown>
      ),
    },
  ];

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
        if (mod.hasOwnProperty("opprovisorio_nro")) {
          const opNumber = mod.opprovisorio_nro;
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
    <>
      <Modal
        title="Asignar Numeración Definitiva"
        referenceID="opDefinitiva"
        customFooter={true}
      >
        <div>
          <hr className="hrstyle" style={{ marginTop: "-2rem" }} />
          <form>
            <div
              className="d-flex gap-1 align-items-center mt-5"
              style={{
                flexDirection: window.innerWidth < 1000 ? "column" : "row",
              }}
            >
              {labels.slice(0, 6).map((l, i) => {
                const { disabled, inputKey, inputType, label, show, min, max } =
                  l;
                return (
                  show && (
                    <React.Fragment key={i}>
                      <InputField
                        inputKey={inputKey}
                        value={OP[inputKey]}
                        key={inputKey}
                        label={label}
                        error={error[inputKey]}
                        disabled={disabled}
                        inputType={inputType}
                        handleChange={handleInputChange}
                        required={true}
                        min={min ?? null}
                        max={max ?? null}
                      />
                      {i != 5 && <span>-</span>}
                    </React.Fragment>
                  )
                );
              })}
            </div>
            <InputField
              label="Nro. O.P"
              key="nro_op"
              error={error["nro_op"]}
              inputType="number"
              inputKey="nro_op"
              value={OP["nro_op"]}
              handleChange={handleInputChange}
              required={true}
            />
            <InputField
              label="Fecha de Emisión"
              key="fecha_dispo"
              error={error["fecha_dispo"]}
              inputType="date"
              inputKey="fecha_dispo"
              value={OP["fecha_dispo"]}
              handleChange={handleInputChange}
              required={true}
            />
          </form>
          <hr className="hrstyle2" />
          <div className="modal-footer" style={{ border: "none" }}>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Salir
            </button>
            <button
              className="btn btn-guardar btn-md"
              onClick={handleSubmit}
              type="submit"
              disabled={!allFieldsComplete}
            >
              Asignar
            </button>
          </div>
        </div>
      </Modal>
      <div>
        <div className="input-group mb-3" style={{ maxWidth: "40%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por Número de OP Provisorio"
            disabled={!isFetched}
            onChange={handleOnChange}
            value={search}
            autoComplete="off"
          />
        </div>
        {isFetched ? (
          <DataTable
            columns={columns}
            data={Op}
            pagination
            striped
            paginationComponentOptions={paginationOptions}
            noDataComponent={<EmptyTable msg="No hay órdenes de pago" />}
            className="del-overflow"
          />
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
};
