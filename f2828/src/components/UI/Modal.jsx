import React from "react";

//Modal que se utiliza en los componentes: Ver-Ordenes, RowExpandedComponent, Liquidaciones

const Modal = ({
  title,
  referenceID,
  children,
  customFooter,
  size = "modal-lg",
  handleClose,
  isStatic,
}) => {
  return (
    <div
      className={`modal fade ${size}`}
      id={`${referenceID}`}
      tabIndex="-1"
      aria-labelledby={`${referenceID}`}
      aria-hidden="true"
      data-bs-backdrop={isStatic && "static"}
    >
      <div className="modal-dialog modalPersonalizado">
        <div className="modal-content bg-white">
          <div className="modal-header" style={{ border: "none" }}>
            <div className="modulo">
              <h6 style={{ color: "#5dade2" }}>{title.toUpperCase()}</h6>
            </div>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose ?? null}
            ></button>
          </div>

          <div className="modal-body">{children} </div>

          {!customFooter && (
            <div className="modal-footer" style={{ border: "none" }}>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose ?? null}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
