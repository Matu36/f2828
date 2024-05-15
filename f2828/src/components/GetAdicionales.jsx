import React from "react";

export default function GetAdicionales() {
  return (
    <div>
      {" "}
      <h5
        style={{
          textAlign: "center",
          background: "#54cbdb",
          padding: "5px",
        }}
      >
        4.1 CON DESCUENTOS PROVISIONALES (A LA FECHA DE CESE)
      </h5>
      <div className="descuentosContainer">
        <div>
          <label htmlFor="concepto">Concepto</label>
          <input type="text" id="concepto" className="form-control" />
        </div>

        <div>
          <label htmlFor="desde">Desde</label>
          <input type="date" id="desde" className="form-control" />
        </div>

        <div>
          <label htmlFor="hasta">Hasta</label>
          <input type="date" id="hasta" className="form-control" />
        </div>

        <div>
          <label htmlFor="monto">Monto</label>
          <input type="number" id="monto" className="form-control" />
        </div>
      </div>
    </div>
  );
}
