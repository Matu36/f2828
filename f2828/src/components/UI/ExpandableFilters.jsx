import React from "react";
import { FaFilter } from "react-icons/fa";
import "../styles/expandableFilter.css";

const ExpandableFilters = ({ children }) => {
  return (
    <div className="mb-3">
      {" "}
      <button
        className="btn btn-outline-secondary btn-round mb-2 py-1 d-flex align-items-center gap-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseFiltros"
        aria-expanded="false"
        aria-controls="collapseFiltros"
      >
        <FaFilter />
        Filtros
      </button>
      <div className="collapse" id="collapseFiltros">
        {children}
      </div>
    </div>
  );
};

export default ExpandableFilters;
