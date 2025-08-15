//Función crear carta Aleatoria
function crearcarta() {
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

//Función para poner Imagenes a Cartas
function identificar_cartas (idcarta, numero, palo){
    document.getElementById(idcarta).style.backgroundImage = "url('IMAGENES/" + numero + palo + ".png')"
    document.getElementById(idcarta).style.backgroundSize = "cover"
}

//Función que crea las 10 cartas y les pone imagenes
function crearmazo(){
//Crear cartas no repetidas y asignar imagen solo a las nustras
let cartas = []
for (let i = 1; i <= 10; i++) {
    let nuevaCarta = crearcarta()
    // Evitar cartas Repetidas
    while (cartas.some(c => c.numero == nuevaCarta.numero && c.palo == nuevaCarta.palo)) {
        nuevaCarta = crearcarta()
    }
    cartas.push(nuevaCarta)
    // Cambiar a 5 para que cartas bot no tengan imagens (10 --> 5)
    if (i <= 10){
        identificar_cartas("carta" + i, nuevaCarta.numero, nuevaCarta.palo)
    }
}

//Cartas Nuestras (carta1 - 5)
carta1 = cartas[0]
carta2 = cartas[1]
carta3 = cartas[2]
carta4 = cartas[3]
carta5 = cartas[4]

//Cartas Bot (carta6 - 10)
carta6 = cartas[5]
carta7 = cartas[6]
carta8 = cartas[7]
carta9 = cartas[8]
carta10 = cartas[9]
}

//Tirar Cartas en Orden
function CartasCentro(quien, numero, palo, cartax) { //quien (N = Nuestras Carta Centro, E = Carta Ellos Centro)
    let CartasCentro1 = document.getElementById("CC" + quien + "1")
    let CartasCentro2 = document.getElementById("CC" + quien + "2")
    let CartasCentro3 = document.getElementById("CC" + quien + "3")
    let estatscartas
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
    estatscartas = EVNR(cartax.numero, cartax.palo)
    cartax.valorenvido = estatscartas.valorenvido
    cartax.jerarquia = estatscartas.jerarquia
}

//Establecer el valor Envido y Jerárquico
function EVNR(numero, palo){
    let valorenvido = 0
    if (numero >= 10) {
        valorenvido = 0 // Los 10 11 y 12 valen 0, por ahora
    } else {
        valorenvido = numero // del 1 al 7 valen su número
    }

    let jerarquia = 0
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

    return { valorenvido: valorenvido, jerarquia: jerarquia };
}



//Cartas Centro Nosotros
let CartaCentroN1 = null
let CartaCentroN2 = null
let CartaCentroN3 = null

//Cartas Centro Ellos
let CartaCentroE1 = null
let CartaCentroE2 = null
let CartaCentroE3 = null

crearmazo()

//Tirar solo 3 Cartas Nosotros
let cartastiradas = 0

//Función que iguala a las cartas del centro a las que se tiran
function guardarCartaCentro(carta, jugador) { //N = NOSOTROS, E = ELLOS
    if (jugador === "N"){
        if (cartastiradas === 1){
            CartaCentroN1 = { ...carta }
            alert(CartaCentroN1.numero + " de " + CartaCentroN1.palo + " con una jerarquia de " + CartaCentroN1.jerarquia + " y valor de envido de " + CartaCentroN1.valorenvido)
        }
        else if (cartastiradas === 2){
            CartaCentroN2 = { ...carta }
            alert(CartaCentroN2.numero + " de " + CartaCentroN2.palo + " con una jerarquia de " + CartaCentroN2.jerarquia + " y valor de envido de " + CartaCentroN2.valorenvido)
        }
        else if (cartastiradas === 3){
            CartaCentroN3 = { ...carta }
            alert(CartaCentroN3.numero + " de " + CartaCentroN3.palo + " con una jerarquia de " + CartaCentroN3.jerarquia + " y valor de envido de " + CartaCentroN3.valorenvido)
        }
    }
    else if (jugador === "E"){
        if (cartastiro === 1){
            CartaCentroE1 = { ...carta }
            alert(CartaCentroE1.numero + " de " + CartaCentroE1.palo + " con una jerarquia de " + CartaCentroE1.jerarquia + " y valor de envido de " + CartaCentroE1.valorenvido)
        }
        else if (cartastiro === 2){
            CartaCentroE2 = { ...carta }
            alert(CartaCentroE2.numero + " de " + CartaCentroE2.palo + " con una jerarquia de " + CartaCentroE2.jerarquia + " y valor de envido de " + CartaCentroE2.valorenvido)
        }
        else if (cartastiro === 3){
            CartaCentroE3 = { ...carta }
            alert(CartaCentroE3.numero + " de " + CartaCentroE3.palo + " con una jerarquia de " + CartaCentroE3.jerarquia + " y valor de envido de " + CartaCentroE3.valorenvido)
        }
    }
}

//Solo tirar en tu turno
let turno = "Jugador"
function cambiarTurno(){ //Se encarga de cambiar de turno al tirar una carta
    if (turno === "Jugador") {
        turno = "Bot"
    } else {
        turno = "Jugador"
    }
    alert("Turno: " + turno)
}


    click1 = document.getElementById("carta1")
    click1.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click1.classList.add("oculto")
                CartasCentro("N", carta1.numero, carta1.palo, carta1)
                guardarCartaCentro(carta1, "N")
                cambiarTurno()
            }
        }
    })
    click2 = document.getElementById("carta2")
    click2.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click2.classList.add("oculto")
                CartasCentro("N", carta2.numero, carta2.palo, carta2)
                guardarCartaCentro(carta2, "N")
                cambiarTurno()
            }
        }
    })
    click3 = document.getElementById("carta3")
    click3.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click3.classList.add("oculto")
                CartasCentro("N", carta3.numero, carta3.palo, carta3)
                guardarCartaCentro(carta3, "N")
                cambiarTurno()
            }
        }
    })
    click4 = document.getElementById("carta4")
    click4.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click4.classList.add("oculto")
                CartasCentro("N", carta4.numero, carta4.palo, carta4)
                guardarCartaCentro(carta4, "N")
                cambiarTurno()
            }
        }
    })
    click5 = document.getElementById("carta5")
    click5.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click5.classList.add("oculto")
                CartasCentro("N", carta5.numero, carta5.palo, carta5)
                guardarCartaCentro(carta5, "N")
                cambiarTurno()
            }
        }
    })



//Tirar solo 3 Cartas BOT
let cartastiro = 0
  
    click6 = document.getElementById("carta6")
    click6.addEventListener("click", function(){
        if (turno === "Bot"){
            cartastiro++
            if (cartastiro <= 3){
                click6.classList.add("oculto")
                CartasCentro("E", carta6.numero, carta6.palo, carta6)
                guardarCartaCentro(carta6, "E")
                cambiarTurno()
            }
        }
    })
    click7 = document.getElementById("carta7")
    click7.addEventListener("click", function(){
        if (turno === "Bot"){
            cartastiro++
            if (cartastiro <= 3){
                click7.classList.add("oculto")
                CartasCentro("E", carta7.numero, carta7.palo, carta7)
                guardarCartaCentro(carta7, "E")
                cambiarTurno()
            }
        }
    })
    click8 = document.getElementById("carta8")
    click8.addEventListener("click", function(){
        if (turno === "Bot"){
            cartastiro++
            if (cartastiro <= 3){
                click8.classList.add("oculto")
                CartasCentro("E", carta8.numero, carta8.palo, carta8)
                guardarCartaCentro(carta8, "E")
                cambiarTurno()
            }
        }
    })
    click9 = document.getElementById("carta9")
    click9.addEventListener("click", function(){
        if (turno === "Bot"){
            cartastiro++
            if (cartastiro <= 3){
                click9.classList.add("oculto")
                CartasCentro("E", carta9.numero, carta9.palo, carta9)
                guardarCartaCentro(carta9, "E")
                cambiarTurno()
            }
        }
    })
    click10 = document.getElementById("carta10")
    click10.addEventListener("click", function(){
        if (turno === "Bot"){
            cartastiro++
            if (cartastiro <= 3){
                click10.classList.add("oculto")
                CartasCentro("E", carta10.numero, carta10.palo, carta10)
                guardarCartaCentro(carta10, "E" )
                cambiarTurno()
            }
        }
    })


//Parte Enc argada de Sumar Puntos
let puntosAcumulados = {} //Guarda puntos para despues sumarlos
if (!puntosAcumulados[id]) {
    puntosAcumulados[id] = 0
}
    puntosAcumulados[id] += sumar
    sumarPuntos(id, puntosAcumulados[id])

//Función que suma puntos y pone im agenes
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
