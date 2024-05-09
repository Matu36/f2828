const obtenerMesYAño = (fecha) => {
  const fechaObj = new Date(fecha);
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const año = fechaObj.getFullYear();
  return `${mes}/${año}`;
};

function formatFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  if (!isNaN(fecha.getTime())) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return fecha.toLocaleDateString(undefined, options);
  }
  return "Fecha inválida";
}

export { obtenerMesYAño, formatFecha };
