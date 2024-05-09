import React from "react";
import useToast from "../../hooks/useToast";

const Toast = ({ msg }) => {
  const { setShow, show } = useToast();

  return (
    <div className="position-fixed bottom-0 end-0 p-3">
      <div
        id="liveToast"
        className={`toast ${
          show ? "showToast" : "hideToast"
        } d-flex align-items-center justify-content-between px-3 text-bg-primary`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-body">
          <strong className="me-auto">{msg}</strong>
        </div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => setShow(false)}
        ></button>
      </div>
    </div>
  );
};

export default Toast;
