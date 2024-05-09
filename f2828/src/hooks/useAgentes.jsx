import { useQuery } from "@tanstack/react-query";
import { AgentesAPI } from "../api/AgentesAPI";
import { useLocation } from "react-router-dom";

// Función para obtener agentes según el operativo
const getAgentes = async (operativoId) => {
  if (!operativoId) {
    // Obtener todos los agentes
    const { data } = await AgentesAPI.get("/");

    return data;
  }
  if (operativoId) {
    // Obtener agentes disponibles para el operativo
    const { data } = await AgentesAPI.get(`/disponibles/${operativoId}`);

    return data;
  }
};

// Función para obtener detalles de un agente por ID
const getAgenteById = async (id) => {
  const { data } = await AgentesAPI.get(`/${id}`);
  return data;
};

// Consulta para obtener todos los agentes
export const useAgentes = (operativoId = 0, agenteId = 0) => {
  const location = useLocation();
  const agentesQuery = useQuery({
    queryKey: ["agentes"],
    queryFn: () => getAgentes(),
    enabled: location.pathname.includes("agentes"),
  });

  // Consulta para obtener agentes disponibles según el operativo
  const agentesDisponiblesQuery = useQuery({
    queryKey: ["agentes-disponibles", { operativoId }],
    queryFn: () => getAgentes(operativoId),
    enabled: operativoId != 0,
  });

  // Consulta para obtener detalles de un agente por ID
  const agenteQuery = useQuery({
    queryKey: ["agente", { agenteId }],
    queryFn: () => getAgenteById(agenteId),
    enabled: agenteId != 0,
  });

  return {
    agentesQuery,
    agentesDisponiblesQuery,
    agenteQuery,
  };
};
