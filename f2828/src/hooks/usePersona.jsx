import { useQuery } from "@tanstack/react-query";
import { PersonasAPI } from "../api/PersonasAPI";

// Función para obtener información de una persona por DNI
const getPersonaByDNI = async (dni) => {
  const { data } = await PersonasAPI.get(`/${dni}`);

  return data;
};

export const usePersona = (dni = 0, clicked = false) => {
  const personaQuery = useQuery({
    // Consulta para obtener información de la persona
    queryKey: ["persona", dni],
    queryFn: () => getPersonaByDNI(dni),
    enabled: dni != 0 && clicked,
  });

  return {
    personaQuery,
  };
};
