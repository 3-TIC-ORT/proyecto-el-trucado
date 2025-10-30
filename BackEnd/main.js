import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic"
startServer(3000)

subscribePOSTEvent("enviarPuntosBack", (data) => {
    guardarPuntos(data.puntosNos, data.puntosEllos)
})

function guardarPuntos(puntosGuardadosNos,puntosGuardadosEllos){
if (puntosGuardadosEllos >= 1){
    fs.writeFileSync("puntos.json",JSON.stringify({ ellos: puntosGuardadosEllos, nosotros: puntosGuardadosNos }, null, 2))      
console.log(`El console log funciona y tiene ${puntosGuardadosEllos} puntos`)}

console.log(`No hace falta if, nosotros tenemos ${puntosGuardadosNos} puntos`)
}