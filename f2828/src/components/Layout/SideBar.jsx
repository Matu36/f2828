import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHospitalSymbol,
  FaUsers,
  FaCity,
  FaGift,
  FaExchangeAlt,
} from "react-icons/fa";
import { TbLicense } from "react-icons/tb";
import { GrUserWorker } from "react-icons/gr";
import { MdDiscount } from "react-icons/md";
import { VscDiffAdded } from "react-icons/vsc";

import "../styles/sidebar.css";

function SideBar({ isOpen, setIsOpen }) {
  const Perfil = 1;
  const [isPersonaInLocalStorage, setIsPersonaInLocalStorage] = useState(false);

  useEffect(() => {
    const persona = localStorage.getItem("Persona");
    setIsPersonaInLocalStorage(persona !== null);
  }, []);

  const handleDisabledLinkClick = (e) => {
    if (!isPersonaInLocalStorage) {
      e.preventDefault();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`sidebar-nav navbar-collapse offcanvas-collapse ${
        isOpen ? "open" : "null"
      }`}
      style={{
        zIndex: 10,
      }}
    >
      <label
        style={{
          padding: ".85rem 0",
          marginBottom: "1px",
          color: "var(--bs-secondary-color)",
          letterSpacing: "1px",
          fontWeight: "600",
        }}
      >
        Menú de navegación
      </label>
      <ul className="metismenu side-menu" id="side-menu">
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            <FaHospitalSymbol
              className="sidebarIcons text-muted"
              size="1.25em"
            />{" "}
            Inicio
          </Link>
        </li>
        <li>
          <a
            aria-controls="collapseAgentes"
            aria-expanded="false"
            className="nav-link dropdown-toggle"
            data-bs-toggle="collapse"
            href="#collapseAgentes"
            role="button"
          >
            <FaUsers className="sidebarIcons text-muted" size="1.50em" /> Datos
            Personales
          </a>
          <ul className="collapse sub-menu" id="collapseAgentes">
            <li>
              <Link to="/personas/carga-datos" onClick={() => setIsOpen(false)}>
                Buscar Personal
              </Link>
            </li>
            <li>
              <Link
                to="/personas/ver-TramitesPendientes"
                onClick={() => setIsOpen(false)}
              >
                Trámites Pendientes
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <a
            aria-controls="collapseExample"
            aria-expanded="false"
            className={`nav-link dropdown-toggle ${!isPersonaInLocalStorage ? "disabled-link" : ""}`}
            data-bs-toggle="collapse"
            href="#collapseOperativos"
            role="button"
          >
            <FaCity className="sidebarIcons text-muted" size="1.50em" />{" "}
            Servicios Jurisdicción
          </a>
          <ul className="collapse sub-menu" id="collapseOperativos">
            <li>
              <Link
                to="/servicios/jurisdicción"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                Cargar Servicios
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <a
            aria-controls="collapseExample"
            aria-expanded="false"
            className={`nav-link dropdown-toggle ${!isPersonaInLocalStorage ? "disabled-link" : ""}`}
            data-bs-toggle="collapse"
            href="#collapseHonorarios"
            role="button"
          >
            <GrUserWorker className="sidebarIcons text-muted" size="1.50em" />{" "}
            Cargos
          </a>
          <ul className="collapse sub-menu" id="collapseHonorarios">
            <li>
              <Link
                to="/cargos/agregar-cargos"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                Agregar Cargos
              </Link>
            </li>
          </ul>
        </li>

        {Perfil === 1 && (
          <>
            <li>
              <Link
                to="/adicionales"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                <VscDiffAdded
                  className="sidebarIcons text-muted"
                  size="1.50em"
                />{" "}
                Adicionales
              </Link>
            </li>
            <li>
              <Link
                to="/descuentos"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                <MdDiscount className="sidebarIcons text-muted" size="1.50em" />{" "}
                Descuentos
              </Link>
            </li>
          </>
        )}
        <li>
          <a
            aria-controls="collapseModulos"
            aria-expanded="false"
            className={`nav-link dropdown-toggle ${!isPersonaInLocalStorage ? "disabled-link" : ""}`}
            data-bs-toggle="collapse"
            href="#collapseModulos"
            role="button"
          >
            <TbLicense className="sidebarIcons text-muted" size="1.50em" />{" "}
            Licencias
          </a>
          <ul className="collapse sub-menu" id="collapseModulos">
            <li>
              <Link
                to="/licencias"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                Agregar Licencias
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <a
            aria-controls="collapseExample"
            aria-expanded="false"
            className={`nav-link dropdown-toggle ${!isPersonaInLocalStorage ? "disabled-link" : ""}`}
            data-bs-toggle="collapse"
            href="#collapseOrdenes"
            role="button"
          >
            <FaGift className="sidebarIcons text-muted" size="1.50em" />{" "}
            Servicios Ad-Honórem
          </a>
          <ul className="collapse sub-menu" id="collapseOrdenes">
            <li>
              <Link
                to="/ad-honorem/cargar"
                className={!isPersonaInLocalStorage ? "disabled-link" : ""}
                onClick={handleDisabledLinkClick}
              >
                Cargar Servicios
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            to="/suplentes"
            className={!isPersonaInLocalStorage ? "disabled-link" : ""}
            onClick={handleDisabledLinkClick}
          >
            <FaExchangeAlt className="sidebarIcons text-muted" size="1.50em" />{" "}
            Servicios Suplentes
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
