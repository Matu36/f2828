import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "../assets/styles/style.css";
import { validateFecha } from "../utils/Validaciones";
import { useModulos } from "../hooks/useModulos";
import { FaPlus } from "react-icons/fa";
import "../components/styles/CrearModulo.css";

const NUMBER_REGEX = /^[0-9]+$/;
const STRING_REGEX = /^[a-zA-Z].*(?:\d| )*$/;

//Componente para crear el módulo

const CrearValor = ({ handleCerrarFormulario, data }) => {
  const { crearModuloValor } = useModulos();
  const { mutate } = crearModuloValor;
  const [create, setCreate] = useState(false);
  const [options, setOptions] = useState(
    data.map((m) => ({
      value: m.id,
      label: m.descripcion,
    }))
  );
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

    if (modulo.valor && modulo.descripcion && modulo.fechaDesde) {
      if (showError.fecha) return;

      const newModulo = {
        ...modulo,
      };

      mutate(newModulo);

      setModulo({
        valor: "",
        fechaDesde: "",
        id: 0,
      });
      setSelectValue(null);
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Por favor, completa todos los campos",
        showConfirmButton: true,
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
        <div className="modulo">
          <h6 style={{ color: "#5dade2" }}>ASIGNAR VALOR</h6>
        </div>
        <hr className="hrstyle" />
        <div className="col-md-6"></div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="descripcion">
              Descripción <span className="spanObligatorio">*</span>
            </label>
            <Select
              options={options}
              value={selectValue}
              placeholder="Descripción"
              noOptionsMessage={() => "No existe el módulo"}
              classNamePrefix="select2"
              classNames={{ container: () => "select2-container" }}
              onInputChange={(e) => {
                if (e.length > 0) {
                  let result = 0;

                  if (e.endsWith(" ") || !STRING_REGEX.test(e)) {
                    result = 2;
                  }

                  setShowError({
                    ...showError,
                    descripcion: result,
                  });
                }
              }}
              onChange={(e) => {
                setSelectValue(e);
                setModulo({
                  ...modulo,
                  descripcion: e.label,
                  id: e && e.value,
                });
              }}
            />

            {showError.descripcion == 2 && (
              <div style={{ color: "red" }}>
                <p>* La descripción no puede estar vacia</p>
                <p>* La descripción no puede contener espacios sueltos</p>
              </div>
            )}
            {showError.descripcion == 1 && (
              <div style={{ color: "red" }}>
                <p>* El módulo ya existe</p>
              </div>
            )}
          </div>
          <div className="col-md-3">
            <label htmlFor="valor">
              Valor <span className="spanObligatorio">*</span>
            </label>
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
                }
              }}
            />
            {showError.valor && (
              <div style={{ color: "red" }}>
                El valor solo puede ser númerico y no estar vacio
              </div>
            )}
          </div>
          <div className="col-md-3">
            <label htmlFor="fechaDesde">
              Fecha Desde <span className="spanObligatorio">*</span>
            </label>
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
        </div>
        <hr className="hrstyle2" />
        <div className="d-flex justify-content-end">
          <button
            onClick={handleCerrarFormulario}
            type="submit"
            className="btn btn-outline-secondary pb-2"
            style={{ marginRight: "10px" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            ref={crearModuloButtonRef}
            className="btn btn-guardar pt-2"
            disabled={
              showError.fecha ||
              showError.descripcion != 0 ||
              showError.valor ||
              !modulo.valor ||
              !modulo.fechaDesde ||
              !selectValue
            }
          >
            Asignar Valor
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearValor;
