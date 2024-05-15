import { useQuery } from "@tanstack/react-query";
import { CredencialesAPI } from "../api/CredencialesAPI";

const getCredenciales = async () => {
  const { data } = await CredencialesAPI.get("/");
  return data;
};

export const useCredencial = () => {
  const credencialesQuery = useQuery({
    queryKey: ["credenciales"],
    queryFn: () => getCredenciales(),
  });

  return {
    credencialesQuery,
  };
};
