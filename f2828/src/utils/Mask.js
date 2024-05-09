
//Escribe el CUIL en formato xx-xxxxxxxx-x
export function MaskCuil(value){
    return value && value.replace(/^(\d{2})(\d{8})(\d{1}).*/, '$1-$2-$3');
}

export function MaskMoneda(value) {
    if(value){
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d)(\d{2})$/, "$1.$2");
        return value
    } 
}