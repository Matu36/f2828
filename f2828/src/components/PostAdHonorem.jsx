import React, { useState, useEffect } from "react";

const PostAdHonorem = () => {
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const personaGuardada = localStorage.getItem("Persona");

    if (personaGuardada) {
      setPersona(JSON.parse(personaGuardada));
    }
  }, []);
  const [formData, setFormData] = useState({
    fechaDesde: "",
    fechaHasta: "",
    cargo: "",
    sueldo: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <div className="PerdosaDatosShow">
        {persona ? (
          <div>
            <p>Apellido: {persona.apellido}</p>
            <p>Nombre: {persona.nombre}</p>
            <p>DNI: {persona.dni}</p>
          </div>
        ) : null}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fechaDesde" className="form-label">
            Fecha Desde
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaDesde"
            name="fechaDesde"
            value={formData.fechaDesde}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fechaHasta" className="form-label">
            Fecha Hasta
          </label>
          <input
            type="date"
            className="form-control"
            id="fechaHasta"
            name="fechaHasta"
            value={formData.fechaHasta}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cargo" className="form-label">
            Cargo
          </label>
          <input
            type="text"
            className="form-control"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sueldo" className="form-label">
            Sueldos
          </label>
          <input
            type="number"
            className="form-control"
            id="sueldo"
            name="sueldo"
            value={formData.sueldo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="observaciones" className="form-label">
            Observaciones
          </label>
          <input
            type="text"
            className="form-control"
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-guardar btn-md">
            Agregar Servicio
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostAdHonorem;
