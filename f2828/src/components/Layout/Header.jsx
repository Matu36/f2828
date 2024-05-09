import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import "../styles/header.css";
import SideBar from "./SideBar";

function Header({ data, isFetched }) {
  const [isOpen, setIsOpen] = useState(false);

  const honorariosPendientesCount = isFetched ? data : 0;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ----------------------- CADA VEZ QUE SE HACE CLICK SE CIERRA LA SIDEBAR -------- //

  const handleOutsideClick = (event) => {
    if (isOpen) {
      if (!event.target.closest(".navbar-ms")) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <header className="container">
      <nav className="navbar fixed-top navbar-offcanvas navbar-ms">
        <div className="row w-100 flex-nowrap">
          {" "}
          <button
            className="navbar-toggler border-0"
            id="navToggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars size="1.25em" />
          </button>
          <div className="col-9 pl-0 pl-md-2 intranet-logo">
            <span className="fst-line">INTRANET</span>
            <span className="snd-line">MINISTERIO DE SALUD</span>
          </div>
          <div className="col-3 d-flex justify-content-end align-items-center">
            <div></div>

            <div>
              <button
                className="btn btn-user font-weight-medium dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div className="position-relative ml-3 user-circle-component"></div>
                <span className="username"> Alejandro Oslovski </span>
                <span
                  className="d-inline-block text-center position-relative"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={`Ud. tiene ${honorariosPendientesCount} órdenes de pago pendientes`}
                >
                  <BiUserCircle
                    style={{
                      fontSize: "2rem",
                      cursor: "pointer",
                      color: "white",
                      marginRight: "5px",
                    }}
                  />
                  {honorariosPendientesCount > 0 ? (
                    <span
                      className="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ top: 5 }}
                    >
                      {honorariosPendientesCount}
                      <span className="visually-hidden">
                        Ud. no tiene órdenes de pago pendientes
                      </span>
                    </span>
                  ) : (
                    <span
                      className="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ top: 5 }}
                    >
                      0
                      <span className="visually-hidden">
                        Ud. no tiene ninguna órden de pago pendiente
                      </span>
                    </span>
                  )}
                </span>
              </button>
              <div
                className="dropdown-user dropdown-menu pt-4 mr-3"
                aria-labelledby="dropdownMenu"
              >
                <div
                  className="dropdown-item text-center text-secondary mb-2 pt-2"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100px"
                    height="100px"
                    fill="currentColor"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                  <div className="font-weight-bold text-no-wrap mt-2">
                    Alejandro Oslovski
                  </div>
                  <div className="text-muted">@wilson</div>
                  <div className="text-muted text-center mt-3">
                    <span className="badge badge-pill rounded-5 text-dark-emphasis badge-light border border-dark px-5 py-2">
                      Perfil Hospital
                    </span>
                  </div>
                </div>
                <div className="dropdown-divider mt-4" />
                <div
                  className="dropdown-item text-secondary text-center py-3"
                  type="button"
                >
                  Centro De Alta Complejidad Cardiovascular Presidente Juan
                  Domingo Peron
                </div>
                <div className="dropdown-divider mb-2" />
                <div className="dropdown-item text-center" type="button">
                  <a
                    id="closeSession"
                    className="btn btn-danger close-session w-50"
                    href="/cucaibabonif/trunk/public/index.php/logout"
                    data-url="/cucaibabonif/trunk/public/index.php/logout"
                  >
                    Salir
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </nav>
    </header>
  );
}

export default Header;
