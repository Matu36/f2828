import React from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

// Boton de volver a la página anterior

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="btn btn-volver-super">
      <FaAngleLeft className="mr-2" size="1.25em" /> Volver
    </button>
  );
};

export default BackButton;
