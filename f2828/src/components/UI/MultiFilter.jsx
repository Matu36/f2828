import React from "react";

const MultiFilter = ({ children }) => {
  return (
    <div className="dropdown my-3">
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside"
      >
        Filtros
      </button>
      <div className="dropdown-menu mb-3 p-4">{children}</div>
    </div>
  );
};

export default MultiFilter;
