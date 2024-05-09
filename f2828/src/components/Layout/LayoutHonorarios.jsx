import { Outlet } from "react-router-dom";

function LayoutHonorarios() {
  return (
    <>
      <main style={{ background: "#f7f7f7" }} className="container p-4">
        <Outlet />
        <br />
      </main>
    </>
  );
}

export default LayoutHonorarios;
