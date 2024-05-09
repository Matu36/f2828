import axios from "axios";

//Conexion con el backend a la ruta de archivo de transferencia con las credenciales en true para
//establecer la seguridad con symfony y los metodos GET Y POST para evitar problemas de CORS. (Se configura en symfony el paquete NELMIOS)

export const ArchivoAPI = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/archivo`,
    withCredentials: true,
    mode: "cors",
    headers: {
        'Access-Control-Allow-Origin': '*',
        'allow_methods': ["GET", "POST"],
        "Access-Control-Allow-Credentials": true
    },
    
})
