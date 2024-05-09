export default function(value){
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}