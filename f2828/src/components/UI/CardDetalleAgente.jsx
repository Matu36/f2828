import React from "react";
import NumberFormatter from "../../utils/NumberFormatter";

function formatText(value) {
  let lowercase = value.toLowerCase();
  return lowercase[0].toUpperCase() + lowercase.slice(1, lowercase.length);
}

const CardItem = ({ title, value }) => {
  return (
    <li className="list-group-item">
      <div className="mb-2">
        {typeof value != "object" ? (
          <>
            <h5 className="card-title">{formatText(value)}</h5>
            <h6 className="card-subtitle text-muted">{title}</h6>
          </>
        ) : (
          <>
            <ul className="p-0">
              {value.map((v, i) => (
                <li key={i}>{formatText(v)}</li>
              ))}
            </ul>
            <h6 className="card-subtitle mt-2 text-muted">{title}</h6>
          </>
        )}
      </div>
    </li>
  );
};

const CardDetalleAgente = ({ data }) => {
  const dateFormatted = new Date(data.fecha);
  const arrDate = [
    dateFormatted.getDate() + 1,
    dateFormatted.getMonth() + 1,
    dateFormatted.getFullYear(),
  ];
  const fullDate = arrDate.join("/");
  return (
    <div className="col">
      <div className="card h-100 w-100 p-0">
        <div className="card-header bg-light" style={{ fontWeight: 600 }}>
          <small className="text-muted">
            {console.log(data)}
            {data.liquidacion_id || data.op_nro
              ? `Orden de Pago${!data.op_nro ? " (Provisoria)" : ""}: #${
                  data.op_nro ?? data.liquidacion_id
                }`
              : "Sin Orden de Pago"}
          </small>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <CardItem title="Proceso de Donación" value={data.referencia} />
            <CardItem title="Funciones" value={data.descripciones} />
            <CardItem
              title="Total Valor"
              value={`$${NumberFormatter(Number.parseFloat(data.total_valor))}`}
            />
          </ul>
        </div>

        <div className="card-footer">
          <small className="text-muted">{fullDate}</small>
        </div>
      </div>
    </div>
  );
};

export default CardDetalleAgente;
