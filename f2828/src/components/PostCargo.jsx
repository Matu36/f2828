import React, { useState, useEffect } from "react";
import InputField from "../components/UI/InputField";

const PostCargo = () => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const personaGuardada = localStorage.getItem("Persona");

    if (personaGuardada) {
      setPersona(JSON.parse(personaGuardada));
    }
  }, []);

  const [cargo, setCargo] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cargo1, setCargo1] = useState("");
  const [fechaDesde1, setFechaDesde1] = useState("");
  const [fechaHasta1, setFechaHasta1] = useState("");

  const [cargo2, setCargo2] = useState("");
  const [fechaDesde2, setFechaDesde2] = useState("");
  const [fechaHasta2, setFechaHasta2] = useState("");

  const handleCargoChange = (e) => {
    setCargo(e.target.value);
  };

  const handleFechaDesdeChange = (e) => {
    setFechaDesde(e.target.value);
  };

  const handleFechaHastaChange = (e) => {
    setFechaHasta(e.target.value);
  };

  const handleCargoChange1 = (e) => {
    setCargo1(e.target.value);
  };

  const handleFechaDesdeChange1 = (e) => {
    setFechaDesde1(e.target.value);
  };

  const handleFechaHastaChange1 = (e) => {
    setFechaHasta1(e.target.value);
  };

  const handleCargoChange2 = (e) => {
    setCargo2(e.target.value);
  };

  const handleFechaDesdeChange2 = (e) => {
    setFechaDesde2(e.target.value);
  };

  const handleFechaHastaChange2 = (e) => {
    setFechaHasta2(e.target.value);
  };

  return (
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

      <div className="postCargo">
        <span>Cargo de mayor jerarquía (Meses consecutivos) LEY:</span>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <label>
            Función:
            <input
              className="form-control funcion"
              type="text"
              value={cargo}
              onChange={handleCargoChange}
            />
          </label>
          <label>
            Fecha Desde:
            <input
              className="form-control"
              type="date"
              value={fechaDesde}
              onChange={handleFechaDesdeChange}
            />
          </label>
          <label>
            Fecha Hasta:
            <input
              className="form-control"
              type="date"
              value={fechaHasta}
              onChange={handleFechaHastaChange}
            />
          </label>
        </div>
      </div>
      <div className="postCargo">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <label>
            Función:
            <input
              className="form-control funcion"
              type="text"
              value={cargo}
              onChange={handleCargoChange1}
            />
          </label>
          <label>
            Fecha Desde:
            <input
              className="form-control"
              type="date"
              value={fechaDesde}
              onChange={handleFechaDesdeChange1}
            />
          </label>
          <label>
            Fecha Hasta:
            <input
              className="form-control"
              type="date"
              value={fechaHasta}
              onChange={handleFechaHastaChange1}
            />
          </label>
        </div>
      </div>
      <div className="postCargo">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <label>
            Función:
            <input
              className="form-control funcion"
              type="text"
              value={cargo}
              onChange={handleCargoChange2}
            />
          </label>
          <label>
            Fecha Desde:
            <input
              className="form-control"
              type="date"
              value={fechaDesde}
              onChange={handleFechaDesdeChange2}
            />
          </label>
          <label>
            Fecha Hasta:
            <input
              className="form-control"
              type="date"
              value={fechaHasta}
              onChange={handleFechaHastaChange2}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PostCargo;
