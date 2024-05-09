import React from "react";

// Usado en el Datatable para mostrar el mensaje vacio

const EmptyTable = ({ msg, children }) => {
  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <div className="p-3 fw-bold">{msg}</div>
      {children}
    </div>
  );
};

export default EmptyTable;
