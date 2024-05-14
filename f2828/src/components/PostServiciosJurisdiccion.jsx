import { useState, useEffect } from "react";
import Swal from "sweetalert2";
// import { useOperativo } from "../hooks/useOperativo";
import InputField from "./UI/InputField";

//Componente para crear el SERVICIO

const PostServiciosJurisdiccion = () => {
  // const { mutate } = useOperativo().operativoMutation;
  const [persona, setPersona] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [fechaDesdeInsalubre, setFechaDesdeInsalubre] = useState("");
  const [fechaHastaInsalubre, setFechaHastaInsalubre] = useState("");
  const [fechaDesdeProvAnteriores, setFechaDesdeProvAnteriores] = useState("");
  const [fechaHastaProvAnteriores, setFechaHastaProvAnteriores] = useState("");
  const [fechaDesdeSeguridad, setFechaDesdeSeguridad] = useState("");
  const [fechaHastaSeguridad, setFechaHastaSeguridad] = useState("");
  const [fechaDesdeDocentes, setFechaDesdeDocentes] = useState("");
  const [fechaHastaDocentes, setFechaHastaDocentes] = useState("");
  const [fechaDesdeObstetricia, setFechaDesdeObstetricia] = useState("");
  const [fechaHastaObstetricia, setFechaHastaObstetricia] = useState("");
  const [fechaDesdePrevisionales, setFechaDesdePrevisionales] = useState("");
  const [fechaHastaPrevisionales, setFechaHastaPrevisionales] = useState("");

  const calcularAniosMesesDias = (fechaDesde, fechaHasta) => {
    const fechaInicio = new Date(fechaDesde);
    const fechaFin = new Date(fechaHasta);

    const diferenciaMilisegundos = fechaFin - fechaInicio;
    const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);
    const anios = Math.floor(diferenciaDias / 365);
    const mesesRestantes = Math.floor((diferenciaDias % 365) / 30);
    const diasRestantes = Math.floor((diferenciaDias % 365) % 30);

    return { anios, meses: mesesRestantes, dias: diasRestantes };
  };

  useEffect(() => {
    const personaGuardada = localStorage.getItem("Persona");

    if (personaGuardada) {
      setPersona(JSON.parse(personaGuardada));
    }
  }, []);

  //---------------------------- CREACION SERVICIOS JURISDICCIONAL ---------------------------- //

  const [servicio, setServicio] = useState({
    dependencia: "",
    fechaEgreso: "",
    fechaIngreso: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      dependencia: servicio.dependencia,
      fechaEgreso: servicio.fechaEgreso,
      fechaIngreso: servicio.fechaIngreso,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      fechaDesdeInsalubre: fechaDesdeInsalubre,
      fechaHastaInsalubre: fechaHastaInsalubre,
      fechaDesdeProvAnteriores: fechaDesdeProvAnteriores,
      fechaHastaProvAnteriores: fechaHastaProvAnteriores,
      fechaDesdeSeguridad: fechaDesdeSeguridad,
      fechaHastaSeguridad: fechaHastaSeguridad,
      fechaDesdeDocentes: fechaDesdeDocentes,
      fechaHastaDocentes: fechaHastaDocentes,
      fechaDesdeObstetricia: fechaDesdeObstetricia,
      fechaHastaObstetricia: fechaHastaObstetricia,
      fechaDesdePrevisionales: fechaDesdePrevisionales,
      fechaHastaPrevisionales: fechaHastaPrevisionales,
    };

    console.log(formData);

    if (servicio.dependencia && servicio.fechaEgreso && servicio.fechaIngreso) {
      const newServicio = {
        ...servicio,
      };

      mutate(newServicio);

      setServicio({
        dependencia: "",
        fechaEgreso: "",
        fechaIngreso: "",
      });
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
      <div>
        {persona ? (
          <div className="PerdosaDatosShow">
            <div>
              <p>Apellido: {persona.apellido}</p>
              <p>Nombre: {persona.nombre}</p>
              <p>DNI: {persona.dni}</p>
            </div>
          </div>
        ) : null}
      </div>
      <form onSubmit={handleOnSubmit}>
        <div className="mb-2">
          <InputField
            required
            label="Dependencia"
            inputType="number"
            inputKey="referencia"
            value={servicio.dependencia}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue >= 0) {
                setServicio({ ...servicio, dependencia: e.target.value });
              }
            }}
          />
        </div>
        <div className="mb-3">
          <InputField
            required
            min="2022-01-01"
            label="Fecha de Egreso"
            inputType="date"
            inputKey="Fecha"
            value={servicio.fechaEgreso}
            onChange={(e) => {
              setServicio({ ...servicio, fechaEgreso: e.target.value });
            }}
          />
        </div>
        <div className="mb-3">
          <InputField
            required
            label="Fecha de Ingreso"
            inputType="date"
            inputKey="Fecha"
            value={servicio.fechaIngreso}
            onChange={(e) => {
              setServicio({ ...servicio, fechaIngreso: e.target.value });
            }}
          />
        </div>
        <br />
        <hr />
        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.1.1 - Servicios Prestados en la Jurisdicción
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={calcularAniosMesesDias(fechaDesde, fechaHasta).anios}
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={calcularAniosMesesDias(fechaDesde, fechaHasta).meses}
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={calcularAniosMesesDias(fechaDesde, fechaHasta).dias}
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.1.2-Servicios reconocidos insalubres conforme Acta generada por el
            Honorable Directorio del I.P.S. de la Pcia de Bs.As.
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdeInsalubre}
            onChange={(e) => setFechaDesdeInsalubre(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaInsalubre}
            onChange={(e) => setFechaHastaInsalubre(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeInsalubre, fechaHastaInsalubre)
                .anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeInsalubre, fechaHastaInsalubre)
                .meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeInsalubre, fechaHastaInsalubre)
                .dias
            }
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.2-Servicios Provinciales anteriores
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdeProvAnteriores}
            onChange={(e) => setFechaDesdeProvAnteriores(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaProvAnteriores}
            onChange={(e) => setFechaHastaProvAnteriores(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdeProvAnteriores,
                fechaHastaProvAnteriores
              ).anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdeProvAnteriores,
                fechaHastaProvAnteriores
              ).meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdeProvAnteriores,
                fechaHastaProvAnteriores
              ).dias
            }
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.3-Servicios en el Item de Seguridad
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdeSeguridad}
            onChange={(e) => setFechaDesdeSeguridad(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaSeguridad}
            onChange={(e) => setFechaHastaSeguridad(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeSeguridad, fechaHastaSeguridad)
                .anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeSeguridad, fechaHastaSeguridad)
                .meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeSeguridad, fechaHastaSeguridad)
                .dias
            }
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.4-Servicios Docentes al frente de alumnos
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdeDocentes}
            onChange={(e) => setFechaDesdeDocentes(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaDocentes}
            onChange={(e) => setFechaHastaDocentes(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeDocentes, fechaHastaDocentes)
                .anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeDocentes, fechaHastaDocentes)
                .meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(fechaDesdeDocentes, fechaHastaDocentes)
                .dias
            }
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.5-Servicios en tareas Insalubres del 07-07-14 al 09-11-23
            (Servicio de Obstetricia y Ginecología - Res. N° 3349/14, Dec. N°
            2144/11) 2.4-Servicios Docentes al frente de alumnos
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdeObstetricia}
            onChange={(e) => setFechaDesdeObstetricia(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaObstetricia}
            onChange={(e) => setFechaHastaObstetricia(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaHastaObstetricia,
                fechaHastaObstetricia
              ).anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaHastaObstetricia,
                fechaHastaObstetricia
              ).meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaHastaObstetricia,
                fechaHastaObstetricia
              ).dias
            }
            disabled
          />
        </div>

        <div className="tituloInputJurisficcion">
          <span style={{ fontWeight: "bold" }}>
            2.6-Servicios con mayores aportes previsionales según el
            Considerando del Acta nº, generada por el Honorable Directorio del
            I.P.S. de la Pcia de Bs.As.
          </span>
        </div>
        <div className="fechadesdefechahasta">
          <label htmlFor="fechaDesde">Fecha Desde:</label>
          <input
            className="form-control"
            type="date"
            id="fechaDesde"
            value={fechaDesdePrevisionales}
            onChange={(e) => setFechaDesdePrevisionales(e.target.value)}
          />
          <label htmlFor="fechaHasta">Fecha Hasta:</label>
          <input
            className="form-control"
            type="date"
            id="fechaHasta"
            value={fechaHastaPrevisionales}
            onChange={(e) => setFechaHastaPrevisionales(e.target.value)}
          />
        </div>
        <div className="añomesdia">
          <label>Años:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdePrevisionales,
                fechaHastaPrevisionales
              ).anios
            }
            disabled
          />
          <label>Meses:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdePrevisionales,
                fechaHastaPrevisionales
              ).meses
            }
            disabled
          />
          <label>Días:</label>
          <input
            className="form-control"
            type="number"
            value={
              calcularAniosMesesDias(
                fechaDesdePrevisionales,
                fechaHastaPrevisionales
              ).dias
            }
            disabled
          />
        </div>
        <br />
        <br />
        <br />

        <div className="d-flex justify-content-end">
          <div>
            <button
              type="submit"
              className="btn btn-guardar btn-md"
              disabled={
                !servicio.fechaIngreso ||
                !servicio.fechaEgreso ||
                !servicio.dependencia
              }
            >
              Guardar y Continuar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostServiciosJurisdiccion;
