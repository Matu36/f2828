import React from "react";
import "../../assets/styles/style.css";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="footer mt-auto py-3 position-fixed bottom-0"
      style={{ width: "100%" }}
    >
      <span> Variables de Procuración - CUCAIBA </span>
      <span className="copy"> SIGLA SISTEMA - versión 2.0 </span>
    </footer>
  );
};

export default Footer;
