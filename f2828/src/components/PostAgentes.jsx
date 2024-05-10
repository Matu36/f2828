import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { usePersona } from "../hooks/usePersona";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import InputField from "../components/UI/InputField";

//Componente que busca la persona en el SQLServer y autocompleta los campos del formulario para la creación del agente

const INITIALSTATE = {
  apellido: "",
  nombre: "",
  personaid: 0,
  nroDocumento: "",
  legajo: 0,
  fechaNacimiento: "",
};

const postAgente = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [agente, setAgente] = useState(INITIALSTATE);
  const [showForm, setShowForm] = useState(false);

  const [statusForm, setStatusForm] = useState("create");

  const [clicked, setClicked] = useState(false);

  const [showError, setShowError] = useState({ empty: false, length: false });

  const {
    data: personaData,
    refetch,
    isFetched,
    isFetching,
  } = usePersona(agente.nroDocumento, clicked).personaQuery;

  const handleFindPersona = () => {
    if (showError.empty || showError.length || !agente.nroDocumento) return;

    setClicked(true);
    refetch();
  };

  useEffect(() => {
    if (isFetched) {
      if (typeof personaData == "object") {
        setShowForm(true);
        setAgente({
          ...agente,
          apellido: personaData.Apellido,
          nombre: personaData.Nombre,
          cuil: personaData.NroDocumento,
          fechaNacimiento: personaData.FechaNacimiento,
          personaid: personaData.IdPersona,
          legajo: personaData.Legajo,
        });

        if (typeof personaData[0] == "string") {
          switch (personaData[0]) {
            case "update":
              setStatusForm("update");
              setAgente({
                ...agente,
                apellido: personaData[1].apellido,
                nombre: personaData[1].nombre,
                fechaNacimiento: personaData[1].FechaNacimiento,
                personaid: personaData[1].IdPersona,
                legajo: personaData[1].legajo,
              });
              Swal.fire({
                position: "center",
                icon: "info",
                title: "Se actualizaron los datos del agente",
                showConfirmButton: false,
                timer: 2000,
              });
              break;

            case "found":
              setStatusForm("found");
              setAgente({
                ...agente,
                apellido: personaData[1].apellido,
                nombre: personaData[1].nombre,
                cuil: personaData[1].cuil,
                fechaNacimiento: personaData[1].FechaNacimiento,
                personaid: personaData[1].id,
                legajo: personaData[1].legajo,
              });
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Ya Existe la persona indicada",
                showConfirmButton: false,
                timer: 2000,
              });
              break;
          }
        } else {
          setStatusForm("create");
        }
        setClicked(false);
      } else {
        setShowForm(false);
        setAgente(INITIALSTATE);
        Swal.fire({
          position: "center",
          icon: "info",
          title:
            "El DNI ingresado no se encontró en la base de datos de empleados",
          showConfirmButton: true,
          confirmButtonText: "Cerrar",
          confirmButtonColor: "#4CAF50",
        });
        setClicked(false);
      }
    }
  }, [isFetched, clicked]);

  let isFormValid = true;

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    localStorage.removeItem("Persona");

    if (isFormValid && typeof personaData == "object" && agente) {
      const newAgente = {
        apellido: agente.apellido,
        nombre: agente.nombre,
        personaid: personaData.IdPersona,
        dni: agente.nroDocumento,
        legajo: agente.legajo,
        fechaNacimiento: agente.fechaNacimiento,
      };

      console.log(newAgente);
      localStorage.setItem("Persona", JSON.stringify(newAgente));
      await Swal.fire({
        position: "center",
        icon: "success",
        title: "El Agente ha sido creado",
        showConfirmButton: false,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
        timer: 2000,
      }).then(() => {
        queryClient.removeQueries(["persona", agente.nroDocumento]);
        setAgente(INITIALSTATE);
        setClicked(false);
        setShowForm(false);
      });
      navigate("/servicios/jurisdicción");
    } else if (!agente.nroDocumento) {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Por favor, ingresa un DNI válido",
        showConfirmButton: true,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#4CAF50",
      });
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleOnSubmit}>
          <div className="mb-3">
            <div className="d-flex gap-3 mb-2">
              <label htmlFor="inputFechadePago" className="form-label">
                DNI:
              </label>
              {isFetching && (
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              )}
            </div>

            <div className="mb-3 d-flex flex-md-row formAgente gap-2 align-items-center">
              <input
                maxLength="9"
                min="0"
                type="number"
                className="form-control"
                id="inputDNI"
                aria-describedby="DNIHelp"
                name="DNI"
                value={agente.nroDocumento}
                disabled={isFetching}
                autoComplete="off"
                placeholder="DNI"
                onInput={(e) => {
                  const newValue = e.target.value;
                  if (newValue >= 0 && newValue.length <= 9) {
                    setAgente({ ...agente, nroDocumento: newValue });
                    setShowError({ empty: false, length: false });
                  }

                  if (!newValue) {
                    setShowError({ ...showError, empty: true });
                  }
                  if (newValue.length <= 7)
                    setShowError({ ...showError, length: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFindPersona();
                  }
                }}
              />
              <button
                className="btn btn-buscar btn btn-md"
                type="button"
                onClick={handleFindPersona}
                style={{ display: "inline-flex", alignItems: "center" }}
                disabled={
                  isFetching ||
                  showError.empty ||
                  showError.length ||
                  !agente.nroDocumento
                }
              >
                <FaSearch style={{ marginRight: "5px" }} /> Buscar
              </button>
            </div>

            {showError.length && (
              <div id="dniErrorMessage" className="spanObligatorio">
                * El DNI debe tener más de 7 caracteres
              </div>
            )}

            {showError.empty && (
              <div className="spanObligatorio">
                * El campo DNI no puede estar vacío
              </div>
            )}
          </div>
          {/* <div className="mb-3">
            <div className="d-flex gap-3 mb-2">
              <label htmlFor="inputFechadePago" className="form-label">
                LEGAJO:
              </label>
              {isFetching && (
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              )}
            </div>

            <div className="mb-3 d-flex flex-md-row formAgente gap-2 align-items-center">
              <input
                maxLength="9"
                min="0"
                type="number"
                className="form-control"
                id="inputLEGAJO"
                aria-describedby="LEGAJOHelp"
                name="LEGAJO"
                value={agente.nroDocumento}
                disabled={isFetching}
                autoComplete="off"
                placeholder="LEGAJO"
                onInput={(e) => {
                  const newValue = e.target.value;
                  if (newValue >= 0 && newValue.length <= 9) {
                    setAgente({ ...agente, nroDocumento: newValue });
                    setShowError({ empty: false, length: false });
                  }

                  if (!newValue) {
                    setShowError({ ...showError, empty: true });
                  }
                  if (newValue.length <= 7)
                    setShowError({ ...showError, length: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFindPersona();
                  }
                }}
              />
              <button
                className="btn btn-buscar btn btn-md"
                type="button"
                onClick={handleFindPersona}
                style={{ display: "inline-flex", alignItems: "center" }}
                disabled={
                  isFetching ||
                  showError.empty ||
                  showError.length ||
                  !agente.nroDocumento
                }
              >
                <FaSearch style={{ marginRight: "5px" }} /> Buscar
              </button>
            </div>

            {showError.length && (
              <div id="dniErrorMessage" className="spanObligatorio">
                * El DNI debe tener más de 7 caracteres
              </div>
            )}

            {showError.empty && (
              <div className="spanObligatorio">
                * El campo DNI no puede estar vacío
              </div>
            )}
          </div>
          <div className="mb-3">
            <div className="d-flex gap-3 mb-2">
              <label htmlFor="inputFechadePago" className="form-label">
                APELLIDO Y NOMBRE:
              </label>
              {isFetching && (
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>
              )}
            </div>

            <div className="mb-3 d-flex flex-md-row formAgente gap-2 align-items-center">
              <input
                type="text"
                className="form-control"
                id="inputAPELLIDO"
                aria-describedby="APELLIDOHelp"
                name="APELLIDO"
                value={agente.nroDocumento}
                disabled={isFetching}
                autoComplete="off"
                placeholder="Buscar por APELLIDO"
                onInput={(e) => {
                  const newValue = e.target.value;
                  if (newValue >= 0 && newValue.length <= 9) {
                    setAgente({ ...agente, nroDocumento: newValue });
                    setShowError({ empty: false, length: false });
                  }

                  if (!newValue) {
                    setShowError({ ...showError, empty: true });
                  }
                  if (newValue.length <= 7)
                    setShowError({ ...showError, length: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFindPersona();
                  }
                }}
              />
              <button
                className="btn btn-buscar btn btn-md"
                type="button"
                onClick={handleFindPersona}
                style={{ display: "inline-flex", alignItems: "center" }}
                disabled={
                  isFetching ||
                  showError.empty ||
                  showError.length ||
                  !agente.nroDocumento
                }
              >
                <FaSearch style={{ marginRight: "5px" }} /> Buscar
              </button>
            </div>

            {showError.length && (
              <div id="dniErrorMessage" className="spanObligatorio">
                * El DNI debe tener más de 7 caracteres
              </div>
            )}

            {showError.empty && (
              <div className="spanObligatorio">
                * El campo DNI no puede estar vacío
              </div>
            )}
          </div> */}
          {showForm && (
            <div className="row">
              <div className="col-md-6">
                {" "}
                <InputField
                  inputKey="Apellido"
                  inputType="text"
                  value={agente.apellido}
                  label="Apellido"
                  disabled
                  onChange={(e) =>
                    setAgente({ ...agente, apellido: e.target.value })
                  }
                />
                <InputField
                  inputKey="Nombre"
                  inputType="text"
                  value={agente.nombre}
                  label="Nombre"
                  disabled
                  onChange={(e) =>
                    setAgente({ ...agente, nombre: e.target.value })
                  }
                />
                <InputField
                  inputKey="Legajo"
                  inputType="text"
                  value={agente.legajo}
                  label="Legajo"
                  disabled
                  onChange={(e) =>
                    setAgente({ ...agente, legajo: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <InputField
                  inputKey="FECHANACIMIENTO"
                  inputType="date"
                  value={
                    agente.fechaNacimiento
                      ? agente.fechaNacimiento.slice(0, 10)
                      : ""
                  }
                  label="FECHA DE NACIMIENTO"
                  disabled
                  onChange={(e) =>
                    setAgente({ ...agente, fechaNacimiento: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <input
                  type="hidden"
                  className="form-control"
                  id="inputID"
                  aria-describedby="IDHelp"
                  name="PersId"
                  value={agente.personaid}
                  autoComplete="off"
                  placeholder="pERSID"
                  disabled
                  onChange={(e) =>
                    setAgente({ ...agente, personaid: e.target.value })
                  }
                />
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  {statusForm == "create" && (
                    <button
                      type="submit"
                      className="btn btn-guardar btn btn-md"
                    >
                      Guardar y continuar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default postAgente;
