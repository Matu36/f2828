import React, { useState } from "react";

const useToast = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, [2000]);
  };

  return { show, setShow, handleShow };
};

export default useToast;
