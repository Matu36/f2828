import React, { useState } from "react";

export default function PostServiciosSuplentes() {
  const [formData, setFormData] = useState({
    cargo: "",
    sueldo: "",
    observacionesTitulo: "",
    observaciones: "",
    fechaInforme: "",
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
    <form onSubmit={handleSubmit}>
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
          Sueldo
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
        <label htmlFor="observacionesTitulo" className="form-label">
          Observaciones Título
        </label>
        <input
          type="text"
          className="form-control"
          id="observacionesTitulo"
          name="observacionesTitulo"
          value={formData.observacionesTitulo}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="observaciones" className="form-label">
          Observaciones
        </label>
        <textarea
          className="form-control"
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="fechaInforme" className="form-label">
          Fecha Informe
        </label>
        <input
          type="text"
          className="form-control"
          id="fechaInforme"
          name="fechaInforme"
          value={formData.fechaInforme}
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
  );
}
