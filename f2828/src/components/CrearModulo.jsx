import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "../assets/styles/style.css";
import { validateFecha } from "../utils/Validaciones";
import { useModulos } from "../hooks/useModulos";
import { FaPlus } from "react-icons/fa";
import "../components/styles/CrearModulo.css";
import { MaskMoneda } from "../utils/Mask";

const NUMBER_REGEX = /^[0-9]+$/;
const STRING_REGEX = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ].*(?:\d| )*$/;

//Componente para crear el módulo

const CrearModulo = ({ handleCerrarFormulario, data }) => {
  const { crearModulo } = useModulos();
  const { mutate } = crearModulo;
  const [selectValue, setSelectValue] = useState(null);

  const crearModuloButtonRef = useRef(null);

  const [showError, setShowError] = useState({
    fecha: false,
    descripcion: 0,
    valor: false,
  });

  /// CREACION DE MODULO ///
  const [modulo, setModulo] = useState({
    valor: "",
    descripcion: "",
    fechaDesde: "",
    id: 0,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      crearModuloButtonRef.current.click();
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (modulo.descripcion && !modulo.fechaDesde && !modulo.valor) {
      mutate(modulo);

      setModulo({
        valor: "",
        fechaDesde: "",
        id: 0,
      });
      setSelectValue(null);
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Asignar valor",
        text: "¿Estás seguro que queres asignarle un valor automaticamente?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, asignar",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          mutate(modulo);
        }
      });
    }
  };

  return (
    <div className="form-container pt-2 container">
      <form
        onSubmit={handleOnSubmit}
        className="row g-3 pt-4"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target !== crearModuloButtonRef.current) {
            e.preventDefault();
          }
        }}
      >
        <div className="modalPersonalizado">
          <h6 style={{ color: "#5dade2" }}>CREAR M&Oacute;DULO</h6>
        </div>
        <hr className="hrstyle" />
        <div className="col-md-6"></div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="descripcion">
              Descripción <span className="spanObligatorio">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={modulo.descripcion}
              onChange={(e) => {
                let { value } = e.target;
                if (value.length > 0) {
                  let result = 0;

                  if (value.endsWith(" ") || !STRING_REGEX.test(value)) {
                    result = 2;
                  }

                  setShowError({
                    ...showError,
                    descripcion: result,
                  });
                }
                setModulo({
                  ...modulo,
                  descripcion: value
                    .normalize("NFD")
                    .replace(
                      /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
                      ""
                    )
                    .toUpperCase()
                    .replace(/ñ/g, "Ñ"),
                });
              }}
            />

            {showError.descripcion == 2 && (
              <div style={{ color: "red" }}>
                <p>* La descripción no puede estar vacia</p>
                <p>* La descripción no puede contener espacios sueltos</p>
              </div>
            )}
          </div>
          <div className="col-md-3">
            <label htmlFor="valor">Valor</label>
            <input
              onKeyDown={handleKeyDown}
              type="number"
              className="form-control"
              name="valor"
              value={modulo.valor}
              autoComplete="off"
              placeholder="Valor"
              onChange={(e) => {
                const newValue = e.target.value;
                setShowError({
                  ...showError,
                  valor: !NUMBER_REGEX.test(newValue),
                });
                if (newValue === "" || newValue >= 0) {
                  setModulo({
                    ...modulo,
                    valor: newValue === "" ? "" : Number(newValue),
                  });
                  setShowError({
                    ...showError,
                    valor: false,
                  });
                }
              }}
            />
            {showError.valor && (
              <div style={{ color: "red" }}>
                El valor solo puede ser númerico
              </div>
            )}
          </div>
          <div className="col-md-3">
            <label htmlFor="fechaDesde">Fecha Desde</label>
            <input
              onKeyDown={handleKeyDown}
              type="date"
              className="form-control"
              name="fechaDesde"
              min="2022-01-01"
              value={modulo.fechaDesde}
              autoComplete="off"
              placeholder="Fecha Desde"
              onChange={(e) => {
                setModulo({
                  ...modulo,
                  fechaDesde: e.target.value,
                });
                setShowError({
                  ...showError,
                  fecha: validateFecha(e.target.value)
                    ? 1
                    : e.target.value < e.target.min
                    ? 2
                    : 0,
                });
                if (e.target.value === "") {
                  setModulo({
                    ...modulo,
                    fechaDesde: "",
                  });
                  setShowError({
                    ...showError,
                    fecha: false,
                  });
                }
              }}
            />
            {showError.fecha == 1 ? (
              <div style={{ color: "red" }}>
                La fecha no puede ser posterior al día de hoy
              </div>
            ) : (
              showError.fecha == 2 && (
                <div style={{ color: "red" }}>
                  La fecha no puede ser anterior al año 2022
                </div>
              )
            )}
          </div>
          <p className="text-muted mt-2">
            (En caso de ingresar Valor y Fecha Desde, se le va a estar asociando
            un valor al módulo creado)
          </p>
        </div>
        <hr className="hrstyle2 mt-6" />

        <div className="d-flex justify-content-end align-items-center">
          <button
            onClick={handleCerrarFormulario}
            type="submit"
            className="btn btn-outline-secondary "
            style={{ marginRight: "10px" }}
          >
            Cerrar
          </button>
          <button
            type="submit"
            ref={crearModuloButtonRef}
            className="btn btn-guardar pt-2"
            disabled={
              showError.descripcion != 0 ||
              !modulo.descripcion ||
              showError.fecha ||
              showError.valor
            }
          >
            Crear M&oacute;dulo
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearModulo;
