import { useState } from "react";
import Swal from "sweetalert2";
import { useOperativo } from "../hooks/useOperativo";
import { validateFecha } from "../utils/Validaciones";
import InputField from "./UI/InputField";

//Componente para crear el OPERATIVO

const PostServiciosJurisdiccion = () => {
  const { mutate } = useOperativo().operativoMutation;

  const [showError, setShowError] = useState({
    referencia: false,
    fecha: 0,
  });

  const validateString = (inputName, value) => {
    switch (inputName) {
      case "referencia":
        const regexReferencia = /^[0-9]+$/;
        if (!regexReferencia.test(value)) {
          setShowError({ ...showError, referencia: true });
        } else {
          setShowError({ ...showError, referencia: false });
        }
        break;
    }
  };

  //---------------------------- CREACION OPERATIVO ---------------------------- //

  const [operativo, setOperativo] = useState({
    referencia: "",
    fechaEgreso: "",
    fechaIngreso: "",
    descripcion: "",
    fechapago: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (operativo.referencia && operativo.fecha) {
      if (showError.fecha) {
        return;
      }

      const newOperativo = {
        ...operativo,
        fecha: operativo.fecha,
      };

      mutate(newOperativo);

      setOperativo({
        referencia: "",
        fecha: "",
        descripcion: "",
      });
      setShowError({ fecha: false, referencia: false });
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Por favor, completa todos los campos",
        showConfirmButton: true,
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-2">
          <InputField
            required
            label="Dependencia"
            inputType="number"
            inputKey="referencia"
            value={operativo.referencia}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue >= 0) {
                setOperativo({ ...operativo, referencia: e.target.value });
                validateString(e.target.name, e.target.value);
              }
            }}
          />
          {showError.referencia && (
            <div style={{ color: "red" }}>
              El proceso de donación no puede tener letras
            </div>
          )}
        </div>
        <div className="mb-3">
          <InputField
            required
            min="2022-01-01"
            label="Fecha de Egreso"
            inputType="date"
            inputKey="Fecha"
            value={operativo.fechaEgreso}
            onChange={(e) => {
              setOperativo({ ...operativo, fechaEgreso: e.target.value });

              setShowError({
                ...showError,
                fechaEgreso: validateFecha(e.target.value)
                  ? 1
                  : e.target.value < e.target.min
                  ? 2
                  : 0,
              });
            }}
          />
          {showError.fechaEgreso == 1 && (
            <div style={{ color: "red" }}>
              La fecha no puede ser posterior al día de hoy
            </div>
          )}
          {showError.fechaEgreso == 2 && (
            <div style={{ color: "red" }}>
              La fecha no puede ser anterior al año 2022
            </div>
          )}
        </div>
        <div className="mb-3">
          <InputField
            required
            label="Fecha de Ingreso"
            inputType="date"
            inputKey="Fecha"
            value={operativo.fechaIngreso}
            onChange={(e) => {
              setOperativo({ ...operativo, fechaIngreso: e.target.value });
              -setShowError({
                ...showError,
                fechaIngreso: validateFecha(e.target.value)
                  ? 1
                  : e.target.value < e.target.min
                  ? 2
                  : 0,
              });
            }}
          />
          {showError.fechaIngreso == 1 && (
            <div style={{ color: "red" }}>
              La fecha no puede ser posterior al día de hoy
            </div>
          )}
        </div>
        <br />
        <hr />
        <span style={{ fontWeight: "bold" }}>
          2.1.1 - Servicios Prestados en la Jurisdicción
        </span>
        <br />

        <div className="d-flex justify-content-end">
          <div>
            <button
              type="submit"
              className="btn btn-guardar btn-md"
              disabled={
                showError.referencia ||
                showError.fecha !== 0 ||
                !operativo.fecha ||
                !operativo.referencia
              }
            >
              Agregar Servicio
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostServiciosJurisdiccion;