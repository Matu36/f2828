import React, { useState } from "react";

export default function PostLicencias() {
  const [licenciaConMedioSueldo, setLicenciaConMedioSueldo] = useState({
    fechaDesde: "",
    fechaHasta: "",
    causal: "",
    sueldo: "",
    observaciones: "",
  });

  const [licenciaSinSueldo, setLicenciaSinSueldo] = useState({
    fechaDesde: "",
    fechaHasta: "",
    causal: "",
    sueldo: "",
    observaciones: "",
  });

  const handleChangeConMedioSueldo = (e) => {
    const { name, value } = e.target;
    setLicenciaConMedioSueldo({
      ...licenciaConMedioSueldo,
      [name]: value,
    });
  };

  const handleChangeSinSueldo = (e) => {
    const { name, value } = e.target;
    setLicenciaSinSueldo({
      ...licenciaSinSueldo,
      [name]: value,
    });
  };

  const handleSubmitConMedioSueldo = (e) => {
    e.preventDefault();
    console.log("Licencia con medio sueldo:", licenciaConMedioSueldo);
  };

  const handleSubmitSinSueldo = (e) => {
    e.preventDefault();
    console.log("Licencia sin sueldo:", licenciaSinSueldo);
  };

  return (
    <div>
      <div>
        <h5
          style={{
            textAlign: "center",
            background: "#cceeff",
            padding: "5px",
          }}
        >
          Licencias con medio sueldo
        </h5>
        <form onSubmit={handleSubmitConMedioSueldo}>
          <div className="mb-3">
            <label htmlFor="fechaDesde1">Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              id="fechaDesde1"
              name="fechaDesde"
              value={licenciaConMedioSueldo.fechaDesde}
              onChange={handleChangeConMedioSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fechaHasta1">Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              id="fechaHasta1"
              name="fechaHasta"
              value={licenciaConMedioSueldo.fechaHasta}
              onChange={handleChangeConMedioSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="causal1">Causal</label>
            <input
              type="text"
              className="form-control"
              id="causal1"
              name="causal"
              value={licenciaConMedioSueldo.causal}
              onChange={handleChangeConMedioSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sueldo1">Sueldo</label>
            <input
              type="number"
              className="form-control"
              id="sueldo1"
              name="sueldo"
              value={licenciaConMedioSueldo.sueldo}
              onChange={handleChangeConMedioSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="observaciones1">Observaciones</label>
            <textarea
              className="form-control"
              id="observaciones1"
              name="observaciones"
              value={licenciaConMedioSueldo.observaciones}
              onChange={handleChangeConMedioSueldo}
              required
            ></textarea>
          </div>
          <br />
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-guardar btn-md">
              Agregar Licencia
            </button>
          </div>
        </form>
      </div>
      <br />
      <div>
        <h5
          style={{
            textAlign: "center",
            background: "#cceeff",
            padding: "5px",
          }}
        >
          Licencias sin sueldo
        </h5>
        <form onSubmit={handleSubmitSinSueldo}>
          <div className="mb-3">
            <label htmlFor="fechaDesde2">Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              id="fechaDesde2"
              name="fechaDesde"
              value={licenciaSinSueldo.fechaDesde}
              onChange={handleChangeSinSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fechaHasta2">Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              id="fechaHasta2"
              name="fechaHasta"
              value={licenciaSinSueldo.fechaHasta}
              onChange={handleChangeSinSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="causal2">Causal</label>
            <input
              type="text"
              className="form-control"
              id="causal2"
              name="causal"
              value={licenciaSinSueldo.causal}
              onChange={handleChangeSinSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="sueldo2">Sueldo</label>
            <input
              type="number"
              className="form-control"
              id="sueldo2"
              name="sueldo"
              value={licenciaSinSueldo.sueldo}
              onChange={handleChangeSinSueldo}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="observaciones2">Observaciones</label>
            <textarea
              className="form-control"
              id="observaciones2"
              name="observaciones"
              value={licenciaSinSueldo.observaciones}
              onChange={handleChangeSinSueldo}
              required
            ></textarea>
          </div>
          <br />
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-guardar btn-md">
              Agregar Licencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
