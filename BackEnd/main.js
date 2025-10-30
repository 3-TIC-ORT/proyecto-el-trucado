import fs, { readFileSync } from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic"
startServer(3000)

subscribePOSTEvent("enviarPuntosBack", (data) => {
    guardarPuntos(data.puntosNos, data.puntosEllos, data.CantidadTienda)
})


subscribeGETEvent("pedirPuntos", (data) => {
    try {
        let infoJson = JSON.parse(fs.readFileSync("puntos.json", "utf-8"))
        
        return {
          ok: true,
          infoJson
        }
    }
    catch {
        return { ok: false }
    }
})


function guardarPuntos(puntosGuardadosNos,puntosGuardadosEllos, CantidadTienda){
if (puntosGuardadosEllos >= 1){
    fs.writeFileSync("puntos.json",JSON.stringify({ ellos: puntosGuardadosEllos, nosotros: puntosGuardadosNos, PuntosTienda: CantidadTienda}, null, 2))
    }
 console.log("se ejecuto guardar puntos")
}


