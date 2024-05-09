import axios from "axios";

//Conexion con el backend a la ruta de modulos con las credenciales en true para
//establecer la seguridad con symfony y los metodos GET, PUT Y POST para evitar problemas de CORS. (Se configura en symfony el paquete NELMIOS)

export const ModulosValorAPI = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/modulo-valor`,
    withCredentials: true,
    mode: "cors",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'allow_methods': ["GET", "POST", "PUT"],
        "Access-Control-Allow-Credentials": true
    }
})
