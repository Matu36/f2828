import axios from "axios";

//Conexion con el backend a la ruta de honorarios con las credenciales en true para
//establecer la seguridad con symfony y los metodos GET, PUT, DELETE Y POST para evitar problemas de CORS. (Se configura en symfony el paquete NELMIOS)

export const HonorariosAPI = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/honorarios`,
    withCredentials: true,
    mode: "cors",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'allow_methods': ["GET", "POST", "DELETE", "PUT"],
        "Access-Control-Allow-Credentials": true
    }
})
