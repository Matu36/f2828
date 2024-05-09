import axios from "axios";

//Conexion con el backend a la ruta de ordenes de pago con las credenciales en true para
//establecer la seguridad con symfony y el metodo GET para evitar problemas de CORS. (Se configura en symfony el paquete NELMIOS)

export const OrdenesDePagoAPI = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/ordenesdepago`,
    withCredentials: true,
    mode: "cors",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'allow_methods': ["GET", "DELETE"],
        "Access-Control-Allow-Credentials": true
    }
})