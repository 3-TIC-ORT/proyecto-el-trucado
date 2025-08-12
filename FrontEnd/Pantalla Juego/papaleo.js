//Función crear carta Aleatoria
function crearcarta () {
    numero = Math.floor(Math.random() * 12) + 1
    numeropalo = Math.floor(Math.random() * 4) + 1
    if (numeropalo == 1){
        palo = "espada"
    }
    else if (numeropalo == 2){
        palo = "basto"
    }
    else if (numeropalo == 3){
        palo = "oro"
    }
    else if (numeropalo == 4) {
        palo = "copa"
    }
    return { numero, palo }
}

//Poner Imagenes a Cartas
function identificar_cartas (idcarta, numero, palo){
    document.getElementById(idcarta).style.backgroundImage = "url('IMAGENES/" + numero + palo + ".png')"
    document.getElementById(idcarta).style.backgroundSize = "cover"
}


//Crear cartas no repetidas y asignar imagen solo a las nustras
let cartas = []
for (let i = 1; i <= 10; i++) {
    let nuevaCarta = crearcarta()
    // Mientras haya repetición con alguna carta ya creada
    while (cartas.some(c => c.numero == nuevaCarta.numero && c.palo == nuevaCarta.palo)) {
        nuevaCarta = crearcarta()
    }
    cartas.push(nuevaCarta)
    // Cambiar a 5 para que cartas bot no tengan imagens (10 --> 5)
    if (i <= 10){
        identificar_cartas("carta" + i, nuevaCarta.numero, nuevaCarta.palo)
    }
}

//Cartas Nuestras
let carta1 = cartas[0]
let carta2 = cartas[1]
let carta3 = cartas[2]
let carta4 = cartas[3]
let carta5 = cartas[4]

//Cartas Bot
let carta6 = cartas[5]
let carta7 = cartas[6]
let carta8 = cartas[7]
let carta9 = cartas[8]
let carta10 = cartas[9]




//Tirar Cartas en Orden
function CartasCentro(quien, numero, palo) { //quien (N = Nuestras Carta Centro, E = Carta Ellos Centro)
    let CartasCentro1 = document.getElementById("CC" + quien + "1")
    let CartasCentro2 = document.getElementById("CC" + quien + "2")
    let CartasCentro3 = document.getElementById("CC" + quien + "3")
    if (CartasCentro1.style.backgroundImage != "" && CartasCentro1.style.backgroundImage != "none") {
        if (CartasCentro2.style.backgroundImage != "" && CartasCentro2.style.backgroundImage != "none") {
            if (CartasCentro3.style.backgroundImage != "" && CartasCentro3.style.backgroundImage != "none") {
                // Los tres tienen imagen
            } else {
                identificar_cartas("CC" + quien + "3", numero, palo)
                document.getElementById("CC" + quien + "3").style.visibility = "visible"
            }
        } else {
            identificar_cartas("CC" + quien + "2", numero, palo)
            document.getElementById("CC" + quien + "2").style.visibility = "visible"
        }
    } else {
        identificar_cartas("CC" + quien + "1", numero, palo)
        document.getElementById("CC" + quien + "1").style.visibility = "visible"
    }
}

//Establecer el valor Envido y Jerárquico
function EVNR(numero, palo){
    valorenvido
    if (numero >= 10) {
        valorenvido = 0 // Los 10 11 y 12 valen 0, por ahora
    } else {
        valorenvido = numero // del 1 al 7 valen su número
    }

    jerarquia = 0
    if (numero == 1 && palo == "espada"){
        jerarquia = 20
    }
    else if (numero == 1 && palo == "basto"){
        jerarquia = 19
    }
    else if (numero == 9 && palo == "espada"){
        jerarquia = 18
    }
    else if (numero == 9 && palo == "oro"){
        jerarquia = 17
    }
    else if (numero == 8 && palo == "espada"){
        jerarquia = 16
    }
    else if (numero == 8 && palo == "oro"){
        jerarquia = 15
    }
    else if (numero == 7 && palo == "espada"){
        jerarquia = 14
    }
    else if (numero == 7 && palo == "oro"){
        jerarquia = 13
    }
    else if (numero == 3){
        jerarquia = 12
    }
    else if (numero == 2){
        jerarquia = 11
    }
    else if (numero == 1 && (palo == "oro" || palo == "copa")){
        jerarquia = 10
    }
    else if (numero == 12){
        jerarquia = 9
    }
    else if (numero == 11){
        jerarquia = 8
    }
    else if (numero == 10){
        jerarquia = 7
    }
    else if (numero == 9 && (palo == "basto" || palo == "copa")){
        jerarquia = 6
    }
    else if (numero == 8 && (palo == "basto" || palo == "copa")){
        jerarquia = 5
    }
    else if (numero == 7 && (palo == "basto" || palo == "copa")){
        jerarquia = 4
    }
    else if (numero == 6){
        jerarquia = 3
    }
    else if (numero == 5){
        jerarquia = 2
    }
    else if (numero == 4){
        jerarquia = 1
    }

    return(valorenvido, jerarquia)
}


//Tirar solo 3 Cartas Nosotros
let cartastiradas = 0

click1 = document.getElementById("carta1")
click1.addEventListener("click", function(){
    cartastiradas = cartastiradas + 1
    if (cartastiradas < 4){
        click1.classList.add("oculto")
        CartasCentro("N", carta1.numero, carta1.palo)
    }
})
click2 = document.getElementById("carta2")
click2.addEventListener("click", function(){
    cartastiradas = cartastiradas + 1
    if (cartastiradas < 4){
    click2.classList.add("oculto")
    CartasCentro("N", carta2.numero, carta2.palo)
    }
})
click3 = document.getElementById("carta3")
click3.addEventListener("click", function(){
    cartastiradas = cartastiradas + 1
    if (cartastiradas < 4){
    click3.classList.add("oculto")
    CartasCentro("N", carta3.numero, carta3.palo)
    }
})
click4 = document.getElementById("carta4")
click4.addEventListener("click", function(){
    cartastiradas = cartastiradas + 1
    if (cartastiradas < 4){
    click4.classList.add("oculto")
    CartasCentro("N", carta4.numero, carta4.palo)
    }
})
click5 = document.getElementById("carta5")
click5.addEventListener("click", function(){
    cartastiradas = cartastiradas + 1
    if (cartastiradas < 4){
    click5.classList.add("oculto")
    CartasCentro("N", carta5.numero, carta5.palo)
    }
})


//Tirar solo 3 Cartas BOT
let cartastiro = 0

click6 = document.getElementById("carta6")
click6.addEventListener("click", function(){
    cartastiro = cartastiro + 1
    if (cartastiro < 4){
        click6.classList.add("oculto")
        CartasCentro("E", carta6.numero, carta6.palo)
    }
})
click7 = document.getElementById("carta7")
click7.addEventListener("click", function(){
    cartastiro = cartastiro + 1
    if (cartastiro < 4){
    click7.classList.add("oculto")
    CartasCentro("E", carta7.numero, carta7.palo)
    }
})
click8 = document.getElementById("carta8")
click8.addEventListener("click", function(){
    cartastiro = cartastiro + 1
    if (cartastiro < 4){
    click8.classList.add("oculto")
    CartasCentro("E", carta8.numero, carta8.palo)
    }
})
click9 = document.getElementById("carta9")
click9.addEventListener("click", function(){
    cartastiro = cartastiro + 1
    if (cartastiro < 4){
    click9.classList.add("oculto")
    CartasCentro("E", carta9.numero, carta9.palo)
    }
})
click10 = document.getElementById("carta10")
click10.addEventListener("click", function(){
    cartastiro = cartastiro + 1
    if (cartastiro < 4){
    click10.classList.add("oculto")
    CartasCentro("E", carta10.numero, carta10.palo)
    }
})



//Parte Encargada de Sumar Puntos
let puntosAcumulados = {}
if (!puntosAcumulados[id]) {
    puntosAcumulados[id] = 0
}
    puntosAcumulados[id] += sumar
    sumarPuntos(id, puntosAcumulados[id])

function sumarPuntos(idcarta, sumar){ //el idcarta "NOS" es nuestro puntaje y "ELLOS" es el puntaje del bot
    let puntos = 0
    puntos = puntos + sumar
    imagenTransparente = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBgfsCyBYAAAAASUVORK5CYII="

    let img1 = document.getElementById(idcarta + "1")
    let img2 = document.getElementById(idcarta + "2")
    let img3 = document.getElementById(idcarta + "3")
    let img4 = document.getElementById(idcarta + "4")
    let img5 = document.getElementById(idcarta + "5")
    let img6 = document.getElementById(idcarta + "6")

    if (puntos > 30) {
        img6.src = "IMAGENES/Fosforo5.png"
    }
    
        let resto = puntos

        // Imagen1
        if (resto >= 5){
            img1.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        } 
        else if (resto > 0){
            img1.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else{
            img1.src = imagenTransparente
        }

        // Imagen 2
        if (resto >= 5) {
            img2.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0) {
            img2.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else {
            img2.src = imagenTransparente
        }

        // Imagen 3
        if (resto >= 5) {
            img3.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0) {
            img3.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else {
            img3.src = imagenTransparente
        }

        // Imagen 4
        if (resto >= 5) {
            img4.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0) {
            img4.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else {
            img4.src = imagenTransparente
        }

        // Imagen 5
        if (resto >= 5) {
            img5.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0) {
            img5.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else {
            img5.src = imagenTransparente
        }

        // Imagen 6
        if (resto >= 5) {
            img6.src = "IMAGENES/Fosforo5.png"
            resto -= 5
        }
        else if (resto > 0) {
            img6.src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else {
            img6.src = imagenTransparente
        }
    

}