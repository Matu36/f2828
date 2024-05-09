import React, { useEffect, useState } from "react";
import { useModulos } from "../hooks/useModulos";
import { AiOutlinePlus } from "react-icons/ai";
import Select from "react-select";
import "../assets/styles/select2.css";
import NumberFormatter from "../utils/NumberFormatter";

//Componente para agregar Función al agente

const PostHonorarios = ({
  disabled,
  handleModuloId,
  handleClick,
  ...props
}) => {
  const {
    refetchModulosActivos: refetch,
    dataModulosActivos: data,
    loadingModulosActivos: isLoading,
    fetchedModulosActivos: isFetched,
  } = props;
  // const { data, isLoading, isFetched, refetch } =
  //   useModulos(operativoId).modulosActivosQuery;
  const [options, setOptions] = useState([
    { value: "0|0", label: "Elegí una opción" },
  ]);
  useEffect(() => {
    if (!isLoading) {
      typeof data == "object" &&
        setOptions([
          ...options,
          ...data.map((m) => ({
            value: `${m.id}|${m.valor}`,
            label: m.descripcion,
          })),
        ]);
    }
  }, [isFetched, isLoading]);

  const [funcionesAsignadas, setFuncionesAsignadas] = useState({});

  useEffect(() => {
    if (!isLoading && isFetched) {
      if (data && data.length > 0) {
        const nuevasOpciones = [
          { value: "0|0", label: "Elegí una opción" },
          ...data.map((m) => ({
            value: `${m.id}|${m.valor}`,
            label: m.descripcion,
          })),
        ];

        // Filtra las funciones ya asignadas para evitar duplicados
        const funcionesFiltradas = nuevasOpciones.filter(
          (opcion) => !funcionesAsignadas[opcion.value]
        );

        setOptions(funcionesFiltradas);
      }
    }
  }, [isFetched, isLoading, funcionesAsignadas, data]);

  const [value, setValue] = useState(0);
  const [selectValue, setSelectValue] = useState("0|0");
  const [auxValue, setAuxValue] = useState({
    value: "0|0",
    label: "Elegí una opción",
  });
  const handleChange = (e) => {
    let arrayValue = e.value.split("|");
    setAuxValue(e);
    setSelectValue(e.value);
    setValue(arrayValue[1]);
    handleModuloId(Number(arrayValue[0]));
  };

  const handleCreateClick = () => {
    if (value == 0) {
      alert("Se tiene que elegir un modulo");
      return;
    }
    setOptions((prevOptions) =>
      prevOptions.filter((option) => option.value !== auxValue.value)
    );
    setSelectValue("0|0");
    setAuxValue({
      value: "0|0",
      label: "Elegí una opción",
    });
    setValue(0);
    handleModuloId(Number(0));
    handleClick();
  };

  return (
    <div className="mt-5">
      <div
        className="d-flex align-items-center justify-content-between w-100 gap-2 rounded border p-5"
        style={{
          backgroundColor: "#edede9",
          boxShadow: "0px 0px 18px -28px rgba(0,0,0,0.2)",
          flexDirection: window.innerWidth < 1000 ? "column" : "row",
        }}
      >
        <div className="mb-3" style={{ width: "60%" }}>
          <label htmlFor="funcionSelect" className="form-label fw-bold">
            Seleccionar Función
          </label>
          <Select
            options={options}
            classNames={{ container: () => "select2-container" }}
            placeholder="Seleccioné una opción"
            onChange={handleChange}
            noOptionsMessage={() => "No hay ningún modulo disponible"}
            aria-label="Default select example"
            isDisabled={disabled}
            value={auxValue}
            classNamePrefix="select2"
          />
        </div>
        <div className="mb-3 w-20">
          <label htmlFor="valorModuloDisabled" className="form-label fw-bold">
            Valor
          </label>
          <input
            className="form-control"
            type="text"
            id="valorModuloDisabled"
            value={`$ ${NumberFormatter(Number(value))}`}
            aria-label="Disabled Valor modulo"
            disabled
          />
        </div>
        <div className="mb-3 d-flex flex-column w-30">
          <label className="form-label fw-bold" htmlFor="buttonAddModulo">
            Agregar
          </label>
          <button
            id="buttonAddModulo"
            type="button"
            className="btn btn-guardar"
            disabled={value == 0}
            onClick={() => {
              handleCreateClick();
              refetch();
            }}
          >
            <AiOutlinePlus />
          </button>
         
        </div>
       
      </div>
      <hr className="hrstyle2"/>
    </div>
  );
};

export default PostHonorarios;
