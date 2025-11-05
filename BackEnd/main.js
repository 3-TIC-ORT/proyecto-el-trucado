import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic"
startServer(3000)

subscribePOSTEvent("enviarPuntosBack", (data) => {
    guardarPuntos(data.puntosNos, data.puntosEllos, data.CantidadTienda)
})

subscribePOSTEvent("enviarModificadoresBack", (data) => {
  fs.writeFileSync("modificadores.json",JSON.stringify({Modificador1: data.Modificador1, Modificador2: data.Modificador2, Modificador3: data.Modificador3}, null, 2))
})

subscribeGETEvent("pedirPuntos", () => {
    try {
      const infoJSON = JSON.parse(fs.readFileSync("./puntos.json", "utf-8"))
      return { ok: true, infoJSON }
    } catch {
      return { ok: false }
    }
  })
  
subscribeGETEvent("pedirMods", () => {
  try {
    let infoModsJSON = JSON.parse(fs.readFileSync("./modificadores.json", "utf-8"))
    return {ok:true, infoModsJSON}
  } catch {
    return {ok: false}
  }
})

function guardarPuntos(puntosGuardadosNos,puntosGuardadosEllos, CantidadTienda){

fs.writeFileSync("puntos.json",JSON.stringify({ ellos: puntosGuardadosEllos, nosotros: puntosGuardadosNos, PuntosTienda: CantidadTienda}, null, 2))

 console.log("se ejecuto guardar puntos")
}


