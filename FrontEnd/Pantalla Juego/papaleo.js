//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {}; // Guarda puntos acumulados por id

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

//Función que resetea todos los valores de la ronda y llama a crearmazo()
function resetearRonda() {
    N_ganadas = 0
    E_ganadas = 0
    cartastiradas = 0
    cartastiro = 0
    CartaCentroN1 = null
    CartaCentroN2 = null
    CartaCentroN3 = null
    CartaCentroE1 = null
    CartaCentroE2 = null
    CartaCentroE3 = null
    rondaCentro = 1

    // Ocultar cartas del centro
    for (let i = 1; i <= 3; i++) {
        document.getElementById("CCN" + i).style.backgroundImage = "none"
        document.getElementById("CCN" + i).style.visibility = "hidden"
        document.getElementById("CCE" + i).style.backgroundImage = "none"
        document.getElementById("CCE" + i).style.visibility = "hidden"
    }

    // Mostrar nuevamente las cartas de jugador y bot
    for (let i = 1; i <= 10; i++) {
        let carta = document.getElementById("carta" + i)
        carta.classList.remove("oculto")
    }

    crearmazo()
    turno = TurnoAzar()
    TXTurno.textContent = "Turno: " + turno
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

crearmazo()

//Cartas Centro Nosotros
let CartaCentroN1 = null
let CartaCentroN2 = null
let CartaCentroN3 = null

//Cartas Centro Ellos
let CartaCentroE1 = null
let CartaCentroE2 = null
let CartaCentroE3 = null



//Tirar solo 3 Cartas Nosotros
let cartastiradas = 0

//Función que iguala a las cartas del centro a las que se tiran
function guardarCartaCentro(carta, jugador) { //N = NOSOTROS, E = ELLOS
    if (jugador === "N"){
        if (cartastiradas === 1){
            CartaCentroN1 = { ...carta }
        }
        else if (cartastiradas === 2){
            CartaCentroN2 = { ...carta }
        }
        else if (cartastiradas === 3){
            CartaCentroN3 = { ...carta }
        }
    }
    else if (jugador === "E"){
        if (cartastiro === 1){
            CartaCentroE1 = { ...carta }
        }
        else if (cartastiro === 2){
            CartaCentroE2 = { ...carta }
        }
        else if (cartastiro === 3){
            CartaCentroE3 = { ...carta }
        }
    }
}

//Elige quien empieza al azar, 1/2
function TurnoAzar(){
    Nturno = Math.floor(Math.random() * 2) + 1
    if (Nturno === 1){
        Cturno = "Jugador"
    }
    else{
        Cturno = "Bot"
    }
    return (Cturno)
}

let turno = TurnoAzar()
//Texto que dice turno
let TXTurno = document.getElementById("Turno")
TXTurno.textContent = "Turno: " + turno

//Función que revisa y prepara la comparación de cartas
let rondaCentro = 1  // 1 = revisa N1/E1, 2 = revisa N2/E2, 3 = revisa N3/E3
function verificarCartas() {
    if (rondaCentro === 1 && CartaCentroN1 && CartaCentroE1) {
        CompararCartas(CartaCentroN1, CartaCentroE1)
        CartaCentroN1 = null
        CartaCentroE1 = null
        rondaCentro = 2
    }
    else if (rondaCentro === 2 && CartaCentroN2 && CartaCentroE2) {
        CompararCartas(CartaCentroN2, CartaCentroE2)
        CartaCentroN2 = null
        CartaCentroE2 = null
        rondaCentro = 3
    }
    else if (rondaCentro === 3 && CartaCentroN3 && CartaCentroE3) {
        CompararCartas(CartaCentroN3, CartaCentroE3)
        CartaCentroN3 = null
        CartaCentroE3 = null
        rondaCentro = 1 // vuelve a la primera ronda
    }
    else{
        cambiarTurno()
    }
}

//Función que dice que carta ganó
let N_ganadas = 0
let E_ganadas = 0
function CompararCartas(carta1, carta2){ //Carta1 si o si es nustra carta, y carta 2 es la carta de ellos
    if (carta1.jerarquia > carta2.jerarquia){
        turno = "Jugador"
        TXTurno.textContent = "Turno: Jugador"
        N_ganadas++
    }
    else if (carta2.jerarquia > carta1.jerarquia){
        turno = "Bot"
        TXTurno.textContent = "Turno: Bot"
        E_ganadas++
    }
    else if (carta1.jerarquia = carta2.jerarquia){
        E_ganadas = E_ganadas + 0.5
        N_ganadas = N_ganadas + 0.5
        cambiarTurno()
    }
    setTimeout(function() {
        if (N_ganadas == E_ganadas == 1.5){
            alert ("Empate")
            resetearRonda()
        }
        else if (N_ganadas >= 1.5){
            alert("Gana Nosotros")
            GuardarPuntos("NOS", 15)
            resetearRonda()
        }
        else if (E_ganadas >= 1.5){
            alert("Gana Bot")
            GuardarPuntos("ELLOS", 15)
            resetearRonda()
        }
      }, 500)
    
    
}



//Cambia el turno
function cambiarTurno(){ //Se encarga de cambiar de turno al tirar una carta
    if (turno === "Jugador") {
        turno = "Bot"
    } else {
        turno = "Jugador"
    }
    TXTurno.textContent = "Turno: " + turno
}


    click1 = document.getElementById("carta1")
    click1.addEventListener("click", function(){
        if (turno === "Jugador"){
            cartastiradas++
            if (cartastiradas <= 3){
                click1.classList.add("oculto")
                CartasCentro("N", carta1.numero, carta1.palo, carta1)
                guardarCartaCentro(carta1, "N")
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
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
                verificarCartas()
            }
        }
    })


//Parte Enc argada de Sumar Puntos
//Llamar a esta función para agregar puntos y sumarlos
function GuardarPuntos(id, sumar) { //
    if (!puntosAcumulados[id]) {
        puntosAcumulados[id] = 0
    }
    puntosAcumulados[id] += sumar
    sumarPuntos(id, puntosAcumulados[id])
    if (puntosAcumulados[id] >= 30){
        setTimeout(function() {
            location.reload()
        }, 1000)
        
    }
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
