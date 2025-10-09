//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {}; // Guarda puntos acumulados por id



//Llamar a esta función para agregar puntos y sumarlos
function GuardarPuntos(id, sumar) { //
    if (!puntosAcumulados[id]) {
        puntosAcumulados[id] = 0
    }
    puntosAcumulados[id] += sumar
    sumarPuntos(id, puntosAcumulados[id])
}
//Función que se encarga de sumar puntos, pero no debe llamarsela directamente
function sumarPuntos(idcarta, puntos) {
    let imagenTransparente = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBgfsCyBYAAAAASUVORK5CYII="
    let imgs = [
        document.getElementById(idcarta + "1"),
        document.getElementById(idcarta + "2"),
        document.getElementById(idcarta + "3"),
        document.getElementById(idcarta + "4"),
        document.getElementById(idcarta + "5"),
        document.getElementById(idcarta + "6"),
    ]
    let resto = puntos;

    for (let i = 0; i < 6; i++) {
        if (resto >= 5){
            imgs[i].src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0){
            imgs[i].src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else{
            imgs[i].src = imagenTransparente
        }
    }
}