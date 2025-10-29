//Funcionalidad de los botones
let Volver = document.getElementById("Volver")
Volver.addEventListener("click", function(){
    window.location.href = "../Pantalla Principal/Inicio.html"
})

let MenuPrincipal = document.querySelectorAll(".MenuPrincipal")
MenuPrincipal.forEach(boton => {
    boton.addEventListener("click", function(){
        window.location.href = "../Pantalla Principal/Inicio.html"
    })
})

let PlayAgain = document.querySelectorAll(".PlayAgain")
PlayAgain.forEach(boton => {
    boton.addEventListener("click", function(){
        location.reload()    
    })
})


//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {
    NOS: 0,
    ELLOS: 0
} // Guarda puntos acumulados por id

// Array global para guardar las cartas que el bot ya tiró en esta mano
let cartasUsadasBot = []


//Cargar cartas tarot de la pantalla tienda (Joaquin), si no hay = ""
let Modificador1 = "1"
let Modificador2 = "5"
let Modificador3 = "4"

//Revisa si esta el modificador de reyes
let ReyesEnvido  = false
if (Modificador1 === "8" || Modificador2 === "8" || Modificador3 === "8"){
    ReyesEnvido = true
}


//Función crear carta Aleatoria, numero del 1 - 12 y un palo random
function crearcarta() {
    let numero = Math.floor(Math.random() * 12) + 1
    let numeropalo = Math.floor(Math.random() * 4) + 1
    let palo
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

//Función para poner Imagenes a Cartas dependiendo de su numero y palo
function identificar_cartas (idcarta, numero, palo){
    document.getElementById(idcarta).style.backgroundImage = "url('IMAGENES/" + numero + palo + ".png')"
    document.getElementById(idcarta).style.backgroundSize = "cover"
}

//Función que resetea valores y llama a crearmazo() para empezar la partida de nuevo
function resetearRonda() {
    //Todos los valores vuelven a original, 0
    N_ganadas = 0
    E_ganadas = 0
    empatadas = 0
    cartastiradas = 0
    cartastiro = 0
    //Cartas del centro se vacian
    CartaCentroN1 = null
    CartaCentroN2 = null
    CartaCentroN3 = null
    CartaCentroE1 = null
    CartaCentroE2 = null
    CartaCentroE3 = null
    //La ronda vuelve a 1
    rondaCentro = 1

    //si se canto el truco/retruco/vale cuatro se resetean
    PuntosTruco = false
    PuntosRetruco = false
    PuntosValeCuatro = false

    BotonesVoluntad.style.display = "none"


    //Se resetea las cartas que tiro el bot
    cartasUsadasBot = []

    // Ocultar cartas del centro
    for (let i = 1; i <= 3; i++) {
        document.getElementById("CCN" + i).style.backgroundImage = "none"
        document.getElementById("CCN" + i).style.visibility = "hidden"
        document.getElementById("CCE" + i).style.backgroundImage = "none"
        document.getElementById("CCE" + i).style.visibility = "hidden"
    }

    // Mostrar nuevamente las cartas de los 2 jugadores
    for (let i = 1; i <= 10; i++) {
        let carta = document.getElementById("carta" + i)
        if (carta) {
            carta.classList.remove("oculto")
        }
    }

    //Devuelve el boton de truco a lo normal
    truco.textContent = "TRUCO"
    truco.classList.remove("PalabrasLargas")
    truco.classList.remove("PalabrasLargas-NH")
    truco.classList.remove("PalabrasExtraLargas")
    truco.classList.remove("PalabrasExtraLargas-NH")
    truco.classList.add("BarraInferiorBTN")

    //Varialbe necesarias para el funcionamiento de la barra inferior
    BotonEnvido = false
    EnvidoEnvido = 0
    Regresar = false
    Cant_Envido = 0


// Turno entre partidas intermitente
turno = turnoF 

// Preparar el turno del siguiente por si se necesita después
turnoF = (turno === "Jugador") ? "Bot" : "Jugador"


    //Crea el mazo nuevo, cambia el texto del turno y actualiza los botones
    crearmazo()
    TXTurno.textContent = "Turno: " + turno
    actualizarBoton()

    //Se verifica si es momento de la tienda
    VerificarTienda()

    // Si toca al bot empezar la nueva mano, que juegue la primer carta
if (turno === "Bot") {
  // un pequeño delay para que se vea la UI del nuevo mazo antes de jugar
  setTimeout(() => {
    CartaBot();
  }, 600);
}
}

//Función que crea las 10 cartas y les pone imagenes solo a las nuestras
let cartas = []
function crearmazo(){
    //Array donde se guardan cada carta
    cartas = []
    for (let i = 1; i <= 10; i++) {
        //Crea las cartas para cada carta
        let nuevaCarta = crearcarta()
        
        for (let j = 0; j < cartas.length; j++){
            while ( nuevaCarta.numero === cartas[j].numero && nuevaCarta.palo === cartas[j].palo){
                nuevaCarta = crearcarta()
                j = 0
            }
                
        }
        cartas.push(nuevaCarta)

        //Se conoce su jerarquia y su valor envido desde el principio
        let estatscartas = EVNR(nuevaCarta.numero, nuevaCarta.palo)
        nuevaCarta.valorenvido = estatscartas.valorenvido
        nuevaCarta.jerarquia = estatscartas.jerarquia

        // Cambiar a 5 para que cartas bot no tengan imagens (10 --> 5)
        if (i <= 5){
            identificar_cartas("carta" + i, nuevaCarta.numero, nuevaCarta.palo)
        }
    }

//Cartas Nuestras (carta1 - 5)
carta1 = cartas[0]
carta2 = cartas[1]
carta3 = cartas[2]
carta4 = cartas[3]
carta5 = cartas[4]
//Se calcula el envido de jugador
EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)

//Cartas Bot (carta6 - 10)
carta6 = cartas[5]
carta7 = cartas[6]
carta8 = cartas[7]
carta9 = cartas[8]
carta10 = cartas[9]
//Se calcula el envido de bot
EnvidoBot = calcularEnvido(carta6, carta7, carta8, carta9, carta10)
}

//Función que calcular el envido dependiendo de las 5 cartas que entra
function calcularEnvido(carta1, carta2, carta3, carta4, carta5){
    //Se guardan las cartas y un array para los palos
    let Cartas = [carta1, carta2, carta3, carta4, carta5]
    let palos = {}
  
    Cartas.forEach(carta => {
        if (!palos[carta.palo]) palos[carta.palo] = []
        palos[carta.palo].push(carta.valorenvido)
    })
  
    let envidoMaximo = 0
  
    for (let palo in palos){
        let grupo = palos[palo]
  
        if (grupo.length >= 3) {
            grupo.sort((a, b) => b - a)
            let suma = grupo[0] + grupo[1] + grupo[2] + 20
            if (suma > envidoMaximo) envidoMaximo = suma
  
        }
        else if (grupo.length === 2) {
            let suma = grupo[0] + grupo[1]
            if (suma > envidoMaximo) envidoMaximo = suma
        }
        else{
            let valor = grupo[0]
            if (valor > envidoMaximo) envidoMaximo = valor
        }
    }
  
    let EnvidoJugador = envidoMaximo
    return EnvidoJugador
}
  

//Tirar Cartas en Orden y pone imagenes de la respectiva carta
function CartasCentro(quien, numero, palo) { 
//quien (N = Nuestras Carta Centro, E = Carta Ellos Centro)
    let CartasCentro1 = document.getElementById("CC" + quien + "1")
    let CartasCentro2 = document.getElementById("CC" + quien + "2")
    let CartasCentro3 = document.getElementById("CC" + quien + "3")
    let estatscartas
    //Revisa si ya tienen imagenes y si tiene le pone a las que no tienen imagenes
    if (CartasCentro1.style.backgroundImage != "" && CartasCentro1.style.backgroundImage != "none") {
        if (CartasCentro2.style.backgroundImage != "" && CartasCentro2.style.backgroundImage != "none") {
            if (CartasCentro3.style.backgroundImage != "" && CartasCentro3.style.backgroundImage != "none") {
                // Los tres tienen imagen, no pasa nada
                console.log("Ya tiraste 3 cartas") //opcional
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

//Establecer el valor Envido y Jerárquico dependiendo de la carta
function EVNR(numero, palo){
    let valorenvido = 0
    if (numero >= 10) {
        if (ReyesEnvido === true){  //Si se tiene modificador valen mas
            valorenvido = 5
        }
        else if (ReyesEnvido === false){
            valorenvido = 0 // Los 10 11 y 12 valen 0
        }
    } else {
        valorenvido = numero // del 1 al 9 valen su número
    }
    //Variable para saber el orden jerárquico
    let jerarquia = 0

    if (numero == 1 && palo == "espada"){ //Ancho de Espada
        jerarquia = 20
    }
    else if (numero == 1 && palo == "basto"){ //Ancho de Basto
        jerarquia = 19
    }
    else if (numero == 9 && palo == "espada"){ //9 de Espada
        jerarquia = 18
    }
    else if (numero == 9 && palo == "oro"){ //9 de Oro
        jerarquia = 17
    }
    else if (numero == 8 && palo == "espada"){ //8 de Espada
        jerarquia = 16
    }
    else if (numero == 8 && palo == "oro"){ //8 de Oro
        jerarquia = 15
    }
    else if (numero == 7 && palo == "espada"){ //7 de Espada
        jerarquia = 14
    }
    else if (numero == 7 && palo == "oro"){ //7 de Oro
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

    return { valorenvido: valorenvido, jerarquia: jerarquia }
}

//Crea el mazo para crear la primer mano, no preguntes porque esta aca
crearmazo()

//Cartas Centro Nosotros
let CartaCentroN1 = null
let CartaCentroN2 = null
let CartaCentroN3 = null

//Cartas Centro Ellos
let CartaCentroE1 = null
let CartaCentroE2 = null
let CartaCentroE3 = null


//Función que iguala a las cartas del centro a las que se tiran
function guardarCartaCentro(carta, jugador) { //N = NOSOTROS, E = ELLOS
    //para el jugador
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
    //para el bot
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

//Turno de la siguiente partida
let turnoF
if (turno === "Jugador"){
    turnoF = "Bot"
}
else if (turno === "Bot"){
    turnoF = "Jugador"
}

//Texto que dice turno
let TXTurno = document.getElementById("Turno")
TXTurno.textContent = "Turno: " + turno

//Función que revisa y prepara la comparación de cartas
let rondaCentro = 1  // 1 = revisa N1/E1, 2 = revisa N2/E2, 3 = revisa N3/E3
function verificarCartas() {
    //Si las dos cartas del centro tienen imagenes se llama para que las comparen
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
let ganadorUltimaMano = null
let N_ganadas = 0
let E_ganadas = 0
let empatadas = 0

//Mulltiplicador si se canta truco
let multiplicador = 1
function CompararCartas(carta1, carta2){ //Carta1 si o si es nustra carta, y carta 2 es la carta de ellos
    
    //Capa de seguridad para encontrar errores con el bot
    if (!carta1.jerarquia || !carta2.jerarquia) {
        console.error("ERROR: alguna carta no tiene jerarquía:", carta1, carta2)
        return
      }
      
    
    //Compara las 2 cartas que recibe para determinar la ganadora
    if (carta1.jerarquia > carta2.jerarquia){ //Gana jugador
        ganadorUltimaMano = "Jugador"
        turno = "Jugador"
        TXTurno.textContent = "Turno: Jugador"
        N_ganadas = N_ganadas + 1.5
        
    }
    else if (carta2.jerarquia > carta1.jerarquia){ //Gana bot
        ganadorUltimaMano = "Bot"
        turno = "Bot"
        TXTurno.textContent = "Turno: Bot"
        E_ganadas = E_ganadas + 1.5 
    }
    else if (carta1.jerarquia === carta2.jerarquia){ //Empate
        E_ganadas = E_ganadas + 0.5
        N_ganadas = N_ganadas + 0.5
        empatadas++
        cambiarTurno()
    }
    //Actualiza el boton para activarlo si es el caso
    actualizarBoton()
    
    if ( (N_ganadas < 2) && (E_ganadas < 2) && (empatadas < 3) ) {
  if (turno === "Bot") {
    // Le damos un pequeño delay para ver la animación antes de que juegue
    setTimeout(() => {
      CartaBot();
    }, 500);
  }
}
  if (PuntosValeCuatro) multiplicador = 4
    else if (PuntosRetruco) multiplicador = 3
    else if (PuntosTruco) multiplicador = 2

    //Revisa si ya se gano la mano y se suman los puntos
    setTimeout(function() {
        if (empatadas === 3){
            resetearRonda()
        }
        else if (N_ganadas >= 2){
            GuardarPuntos("NOS", 1 * multiplicador)
            resetearRonda()
        }
        else if (E_ganadas >= 2){
            GuardarPuntos("ELLOS", 1 * multiplicador)
            resetearRonda()
        }
    }
      , 500) //Delay para verlo mejor 
}

//Cambia el turno al contrario
function cambiarTurno(){ //Se encarga de cambiar de turno al tirar una carta
    if (turno === "Jugador") {
        turno = "Bot"
        CartaBot()
    } else {
        turno = "Jugador"
    }
    TXTurno.textContent = "Turno: " + turno
    actualizarBoton()
}

//Tirar solo 3 Cartas Nosotros
let cartastiradas = 0

click1 = document.getElementById("carta1") 
click1.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click1.classList.add("oculto") 
            CartasCentro("N", carta1.numero, carta1.palo) 
            guardarCartaCentro(carta1, "N") 
            verificarCartas() 
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "6"){
                carta1.palo = Modificadores[ModificadorTocado].categoria
                identificar_cartas("carta1", carta1.numero, carta1.palo)
                estatscartas = EVNR(carta1.numero, carta1.palo)
                carta1.valorenvido = estatscartas.valorenvido
                carta1.jerarquia = estatscartas.jerarquia

                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""

                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }
            else if (ModificadorTocado === "1"){
                carta1.jerarquia++
            }
        }
    } 
}) 
click2 = document.getElementById("carta2") 
click2.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click2.classList.add("oculto") 
            CartasCentro("N", carta2.numero, carta2.palo) 
            guardarCartaCentro(carta2, "N") 
            verificarCartas() 
            }      
        }
        else{
            carta2.palo = Modificadores[ModificadorTocado].categoria
            identificar_cartas("carta2", carta2.numero, carta2.palo)
            estatscartas = EVNR(carta2.numero, carta2.palo)
            carta2.valorenvido = estatscartas.valorenvido
            carta2.jerarquia = estatscartas.jerarquia

            document.getElementById(TarotSeleccionada).classList.add("oculto")
            TarotSeleccionada = ""

            EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
            actualizarBoton()
        }
    } 
})
click3 = document.getElementById("carta3") 
click3.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click3.classList.add("oculto") 
            CartasCentro("N", carta3.numero, carta3.palo) 
            guardarCartaCentro(carta3, "N") 
            verificarCartas() 
            }      
        }
        else{
            carta3.palo = Modificadores[ModificadorTocado].categoria
            identificar_cartas("carta3", carta3.numero, carta3.palo)
            estatscartas = EVNR(carta3.numero, carta3.palo)
            carta3.valorenvido = estatscartas.valorenvido
            carta3.jerarquia = estatscartas.jerarquia

            document.getElementById(TarotSeleccionada).classList.add("oculto")
            TarotSeleccionada = ""

            EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
            actualizarBoton()
        }
    } 
})
click4 = document.getElementById("carta4") 
click4.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click4.classList.add("oculto") 
            CartasCentro("N", carta4.numero, carta4.palo) 
            guardarCartaCentro(carta4, "N") 
            verificarCartas() 
            }      
        }
        else{
            carta4.palo = Modificadores[ModificadorTocado].categoria
            identificar_cartas("carta4", carta4.numero, carta4.palo)
            estatscartas = EVNR(carta4.numero, carta4.palo)
            carta4.valorenvido = estatscartas.valorenvido
            carta4.jerarquia = estatscartas.jerarquia

            document.getElementById(TarotSeleccionada).classList.add("oculto")
            TarotSeleccionada = ""

            EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
            actualizarBoton()
        }
    } 
})
click5 = document.getElementById("carta5") 
click5.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click5.classList.add("oculto") 
            CartasCentro("N", carta5.numero, carta5.palo) 
            guardarCartaCentro(carta5, "N") 
            verificarCartas() 
            }      
        }
        else{
            carta5.palo = Modificadores[ModificadorTocado].categoria
            identificar_cartas("carta5", carta5.numero, carta5.palo)
            estatscartas = EVNR(carta5.numero, carta5.palo)
            carta5.valorenvido = estatscartas.valorenvido
            carta5.jerarquia = estatscartas.jerarquia

            document.getElementById(TarotSeleccionada).classList.add("oculto")
            TarotSeleccionada = ""

            EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
            actualizarBoton()
        }
    } 
})

let BotonesVoluntad = document.getElementById("BotonesVoluntad")
let BotonesVoluntadBlock = false
//funcion para que el bot cante truco
function BotCantaTruco(){
            
    // Crea variable para fijarse si canta truco/retruco/valecuatro
    let ValorJerarquia = 0
    let ValorAleatorio = Math.random()
    
    //bucle para fijarse el valor de jerarquia de la mano del bot
    for (let i = 0; i < CartasBot.length; i++){
        ValorJerarquia = ValorJerarquia + CartasBot[i].jerarquia
    }
    
    //Jerarquia total: 394
    //Jerarquia promedio: 8,2
    if (PuntosTruco === false && PuntosRetruco === false){
        if (ValorJerarquia < 41 && ValorAleatorio < 0.1){ //mano promedio
            console.log("TRUCO")
            PuntosTruco = true
            PuntosRetruco = false
            PuntosValeCuatro = false
            truco.textContent = "RETRUCO"
            truco.classList.add("PalabrasLargas")
            envido.classList.add("BarraInferiorBTN-NH")
            flor.classList.add("BarraInferiorBTN-NH")
            mazo.classList.add("BarraInferiorBTN-NH")
            BotonesVoluntad.style.display = "flex"
            BotonesVoluntadBlock = true
            MostrarMensajeBot(true, "Truco")
        }
        else if (ValorJerarquia > 41 && ValorAleatorio < 0.6){
            console.log("TRUCO")
            PuntosTruco = true
            PuntosRetruco = false
            PuntosValeCuatro = false
            truco.textContent = "RETRUCO"
            truco.classList.add("PalabrasLargas")
            envido.classList.add("BarraInferiorBTN-NH")
            flor.classList.add("BarraInferiorBTN-NH")
            mazo.classList.add("BarraInferiorBTN-NH")
            BotonesVoluntad.style.display = "flex"
            BotonesVoluntadBlock = true
            MostrarMensajeBot(true, "Truco")
        }
    }
}

//Botones de v0luntad
let quiero = document.getElementById("QUIERO")
let noquiero = document.getElementById("NOQUIERO")

noquiero.addEventListener("click", function(){
    console.log("Jugador: No Quiero")
    multiplicador = 1
    if (PuntosValeCuatro) multiplicador = 3
    else if (PuntosRetruco) multiplicador = 2
    else if (PuntosTruco) multiplicador = 1
    setTimeout(function() {
        resetearRonda()
        GuardarPuntos("ELLOS", 1 * multiplicador)
    }, 750)
    BotonesVoluntadBlock = false
    MostrarMensajeBot(false, "")
})

quiero.addEventListener("click", function(){
    BotonesVoluntad.style.display = "none"
    console.log("Jugador: Quiero")
    BotonesVoluntadBlock = false
    MostrarMensajeBot(false, "")
})



//Cartas del BOT
//Tirar solo 3 cartas bot
let cartastiro = 0


let CartasBot = []

//Funcion que para que el BOT tire cartas, (todavia se esta diseñando) 
function CartaBot() {
    if (turno === "Bot") {

        // Array con las 5 cartas del bot
    CartasBot = [carta6, carta7, carta8, carta9, carta10]
    
    //se fija si puede cantar truco
    setTimeout(() => {
        if (cartastiro >= 1 && cartastiradas >= 1){
            BotCantaTruco()
        }
     }, 1500)
    
      // Filtra las que todavía no usó
      let CartasDisponiblesBot = CartasBot.filter((_, i) => !cartasUsadasBot.includes(i))
  
      // Elige una carta aleatoria entre las disponibles
      let cartaElegida = CartasDisponiblesBot[Math.floor(Math.random() * CartasDisponiblesBot.length)]
        
      // Guarda el índice real de esa carta
      let indiceReal = CartasBot.indexOf(cartaElegida)
      cartasUsadasBot.push(indiceReal) // la marca como usada
  
      // Simula que el bot “piensa” 800ms
      setTimeout(() => {
        cartastiro++
        // Oculta la carta jugada del bot
        let indiceCartaReal = indiceReal + 6 // carta6 → índice 0
        document.getElementById("carta" + indiceCartaReal).classList.add("oculto")
  
        // La pone en el centro visualmente
        CartasCentro("E", cartaElegida.numero, cartaElegida.palo)
  
        // La guarda como carta jugada
        guardarCartaCentro(cartaElegida, "E")

        // Verifica si hay que comparar
        verificarCartas()
      }, 800)
    }
  }  

  if(turno === "Bot"){
  CartaBot()
  }
  



//Easter Egg sigma
let MazoIMG = document.getElementById("Mazo")
let EasterEgg = document.getElementById("TEXTO")

//Botones de la Barra Inferior
let truco = document.getElementById("truco")
let envido = document.getElementById("envido")
let flor = document.getElementById("flor")
let mazo = document.getElementById("irmazo")
actualizarBoton()

//Varialbe necesarias para el funcionamiento de la barra inferior
let BotonEnvido = false
let EnvidoEnvido = 0
let Regresar = false
let Cant_Envido = 0
let PuntosEnvidos 

let PuntosTruco = false
let PuntosRetruco = false
let PuntosValeCuatro = false

//Boton truco
truco.addEventListener("click", function(){
    GloboTexto.style.display = "none"
    BotonesVoluntadBlock = false
    
    setTimeout(function() {
        //Cuando se toca el boton TRUCO
        if (Regresar === false){
            if (PuntosTruco === false && PuntosRetruco === false){
                truco.textContent = "RETRUCO"
                truco.classList.remove("BarraInferiorBTN")
                truco.classList.add("PalabrasLargas")
                truco.classList.add("PalabrasLargas-NH")
                envido.classList.add("BarraInferiorBTN-NH")
                PuntosTruco = true
                PuntosRetruco = false
                PuntosValeCuatro = false
            }
            else if (PuntosTruco === true){
                truco.textContent = "VALE CUATRO"
                truco.classList.add("PalabrasExtraLargas")
                truco.classList.add("PalabrasExtraLargas-NH")
                truco.classList.remove("PalabrasLargas")
                PuntosTruco = false
                PuntosRetruco = true
                PuntosValeCuatro = false
                BotonesVoluntad.style.display = "none"
            }
            else if (PuntosRetruco === true){
                truco.classList.add("PalabrasExtraLargas-NH")
                PuntosTruco = false
                PuntosRetruco = false
                PuntosValeCuatro = true
                BotonesVoluntad.style.display = "none"
            }
        }
        //Cuando se toca el boton REGRESAR
        else if (Regresar === true){
            flor.textContent = "FLOR"
            flor.classList.remove("PalabrasLargas")
            flor.classList.add("BarraInferiorBTN")
            actualizarBoton()

            Regresar = false
            BotonEnvido = false

            truco.textContent = "TRUCO"
            truco.classList.remove("PalabrasLargas")
            truco.classList.remove("PalabrasLargas-NH")
            truco.classList.add("BarraInferiorBTN")

            envido.classList.remove("BarraInferiorBTN-NH")
            mazo.style.display = 'block'
        }
    }, 500)
})

//Boton envido
envido.addEventListener("click", function(){
    setTimeout(function() {
        //Se toca el boton ENVIDO, entra al menu envido
        if (BotonEnvido === false){    
            truco.textContent = "REGRESAR"
            truco.classList.add("PalabrasLargas")
            truco.classList.remove("BarraInferiorBTN")
            truco.classList.remove("PalabrasLargas-NH")

            flor.textContent = "REAL ENVIDO"
            flor.classList.add("PalabrasLargas")
            flor.classList.remove("BarraInferiorBTN")
            flor.classList.remove("BarraInferiorBTN-NH")
            
            //Ocultar boton mazo
            mazo.style.display = 'none'
            Regresar = true
            BotonEnvido = true

            if (Cant_Envido >= 2) {
                envido.classList.add("BarraInferiorBTN-NH")
            }
        }
        //Se toca envido para cantarlo
        else if (BotonEnvido === true){
            if (Cant_Envido < 2){
                alert ("Envido")

                flor.textContent = "FLOR"
                flor.classList.remove("PalabrasLargas")
                flor.classList.remove("BarraInferiorBTN")
                flor.classList.add("BarraInferiorBTN-NH")

                Regresar = false
                BotonEnvido = false
                Cant_Envido++

                truco.textContent = "TRUCO"
                truco.classList.remove("PalabrasLargas")
                truco.classList.remove("PalabrasLargas-NH")
                truco.classList.add("BarraInferiorBTN")
                 
                envido.classList.remove("BarraInferiorBTN-NH")
                envido.classList.remove("PalabrasLargas")

                //Mostrar boton mazo
                mazo.style.display = 'block'
            }
        }
    }, 500)
})

//Boton flor
flor.addEventListener("click", function(){
    //Se toca el boton REAL ENVIDO
    if (BotonEnvido === true){
        alert ("Real Envido")

        flor.textContent = "FLOR"
        flor.classList.remove("PalabrasLargas")
        flor.classList.remove("BarraInferiorBTN")
        flor.classList.add("BarraInferiorBTN-NH")

        Regresar = false
        BotonEnvido = false
        envido.classList.add("BarraInferiorBTN-NH")

        truco.textContent = "TRUCO"
        truco.classList.remove("PalabrasLargas")
        truco.classList.remove("PalabrasLargas-NH")
        truco.classList.add("BarraInferiorBTN")

        //Mostrar boton mazo
        mazo.style.display = 'block'
    }
    else if (BotonEnvido === false){
        alert ("Flor")
        GuardarPuntos("NOS", 5)
        flor.classList.add("BarraInferiorBTN-NH")
        envido.classList.add("BarraInferiorBTN-NH")
    }
})

//Boton mazo
mazo.addEventListener("click", function(){
    if (turno === "Jugador"){
        if (cartastiradas === 0 && cartastiro === 0){
            GuardarPuntos("ELLOS", 2)
        } else {
            GuardarPuntos("ELLOS", 1)
        }
        setTimeout(function() {
            resetearRonda()
        }, 500)
    }
})



//Función que actualiza la posición del mazo dependiendo del turno
function actualizarMazo(){
    if (turnoF === "Jugador"){
        MazoIMG.classList.add("M_P1")
        EasterEgg.classList.add("T_P1")

        MazoIMG.classList.remove("M_P2")
        EasterEgg.classList.remove("T_P2")
    }
    else if (turnoF === "Bot"){
        MazoIMG.classList.add("M_P2")
        EasterEgg.classList.add("T_P2")

        MazoIMG.classList.remove("M_P1")
        EasterEgg.classList.remove("T_P1")
    }
}
// Según el turno habilita o inhabilita el uso de los botones
function actualizarBoton(){
    if (turno === "Bot"){
        truco.classList.remove("BarraInferiorBTN")
        envido.classList.remove("BarraInferiorBTN")
        flor.classList.remove("BarraInferiorBTN")
        mazo.classList.remove("BarraInferiorBTN")

        truco.classList.add("BarraInferiorBTN-NH")
        envido.classList.add("BarraInferiorBTN-NH")
        flor.classList.add("BarraInferiorBTN-NH")
        mazo.classList.add("BarraInferiorBTN-NH")
    }
    else if (turno === "Jugador"){
        truco.classList.add("BarraInferiorBTN")
        envido.classList.add("BarraInferiorBTN")
        flor.classList.add("BarraInferiorBTN")
        mazo.classList.add("BarraInferiorBTN")

        truco.classList.remove("BarraInferiorBTN-NH")
        envido.classList.remove("BarraInferiorBTN-NH")
        flor.classList.remove("BarraInferiorBTN-NH")
        mazo.classList.remove("BarraInferiorBTN-NH")
    }
    
    actualizarMazo()

    //Envido desactivado si ya se tiro una carta
    if (cartastiradas > 0){
        envido.classList.add("BarraInferiorBTN-NH")
    }

    
    // Flor habilitada solo si todas las cartas son del mismo palo y aún no tiraste
if (carta1.palo === carta2.palo && carta1.palo === carta3.palo && carta1.palo === carta4.palo && carta1.palo === carta5.palo && cartastiradas === 0 && turno === "Jugador"){
    flor.classList.remove("BarraInferiorBTN-NH")
    flor.classList.add("BarraInferiorBTN")
} else {
    flor.classList.remove("BarraInferiorBTN")
    flor.classList.add("BarraInferiorBTN-NH")
}
}

function MostrarMensajeBot(Mostrar, Mensaje){
    let GloboTexto = document.getElementById("GloboTexto")
    let MensajeTexto = document.getElementById("TextoCantado")

    
    if (Mostrar === true){
        GloboTexto.style.display = "flex"
        MensajeTexto.textContent = Mensaje
    }
    else if(Mostrar === false){
        GloboTexto.style.display = "none"
        MensajeTexto.textContent = ""
    }
}

//Cantidad de tiendas en la partida
let CantidadTienda = 0
//Funcion que se encarga de llevar a la pantalla tienda
function VerificarTienda(){

    if (CantidadTienda === 0 && (puntosAcumulados["NOS"] >= 5 || puntosAcumulados["ELLOS"] >= 5)){
        window.location.href = "../Pantalla Tienda/Tienda.html"
        CantidadTienda++
        postEvent("enviarPuntosBack", (data) => {
            let puntos = puntosAcumulados["ELLOS"]
        })
    }
    else if (CantidadTienda === 1 && (puntosAcumulados["NOS"] >= 15 || puntosAcumulados["ELLOS"] >= 15)){
        window.location.href = "../Pantalla Tienda/Tienda.html"
        CantidadTienda++
    }
    else if (CantidadTienda === 2 && (puntosAcumulados["NOS"] >= 25 || puntosAcumulados["ELLOS"] >= 25)){
        window.location.href = "../Pantalla Tienda/Tienda.html"
        CantidadTienda++
    }
}


//Todos los modificadores, puede cambiar
let Modificadores = [
    { nombre: "Camaleón", descripcion: "Transforma una carta en todos los palos (solo envido)", valor: 3},
    { nombre: "Ascenso", descripcion: "Una carta específica tiene +1 de jerarquía contra otras", valor: 1 },
    { nombre: "Gemelo", descripcion: "Cambia un carta por otra a elección.", valor: 2 },
    { nombre: "Milipilli", descripcion: "Transforma una cartas a ORO", valor: 2, categoria: "oro"},
    { nombre: "Al palo", descripcion: "Transforma una cartas a BASTO", valor: 1, categoria: "basto" },
    { nombre: "La Puntita", descripcion: "Transforma una cartas a ESPADA", valor: 3, categoria: "espada" },
    { nombre: "La Tercera", descripcion: "Transforma una cartas a COPA", valor: 1, categoria: "copa" },
    { nombre: "TNT", descripcion: "Saca 2 cartas del mazo", valor: 1 },
    { nombre: "Reyes", descripcion: "Las figuras cuentan como +5 en envido en vez de +0", valor: 5 },
    { nombre: "Ebullición", descripcion: "2% de que la carta que tire el bot tenga jerarquia 0", valor: 2}
]

function PonerTarot(Tarot, idCarta){
    document.getElementById(idCarta).style.backgroundImage = "url('../Pantalla Tienda/Imagenes/" + Tarot + ".png')"
    document.getElementById(idCarta).style.backgroundSize = "cover"
}

PonerTarot(Modificadores[Modificador1].nombre, "Tarot1")
PonerTarot(Modificadores[Modificador2].nombre, "Tarot2")
PonerTarot(Modificadores[Modificador3].nombre, "Tarot3")


let Tarot1 = document.getElementById("Tarot1")
let Tarot2 = document.getElementById("Tarot2")
let Tarot3 = document.getElementById("Tarot3")

let TarotSeleccionada = ""
let ModificadorTocado

let Tarot1Selected = false
Tarot1.addEventListener("click", function(){
    if (Modificador1 !== "8"){
        if (Tarot1Selected === false){
            Tarot1.classList.remove("Tarot")
            Tarot1.classList.add("TarotSeleccionada")
            Tarot1Selected = true

            TarotSeleccionada = "Tarot1"
            ModificadorTocado = Modificador1

            Tarot2Selected = false
            Tarot2.classList.add("Tarot")
            Tarot2.classList.remove("TarotSeleccionada")

            Tarot3Selected = false
            Tarot3.classList.add("Tarot")
            Tarot3.classList.remove("TarotSeleccionada")
        }
        else if (Tarot1Selected === true){
            Tarot1.classList.add("Tarot")
            Tarot1.classList.remove("TarotSeleccionada")
            Tarot1Selected = false

            TarotSeleccionada = ""
        }
    }
})

let Tarot2Selected = false
Tarot2.addEventListener("click", function(){
    if (Modificador2 !== "8"){
        if (Tarot2Selected === false){
            Tarot2.classList.remove("Tarot")
            Tarot2.classList.add("TarotSeleccionada")
            Tarot2Selected = true

            TarotSeleccionada = "Tarot2"
            ModificadorTocado = Modificador2

            Tarot1Selected = false
            Tarot1.classList.add("Tarot")
            Tarot1.classList.remove("TarotSeleccionada")

            Tarot3Selected = false
            Tarot3.classList.add("Tarot")
            Tarot3.classList.remove("TarotSeleccionada")
        }
        else if (Tarot2Selected === true){
            Tarot2.classList.add("Tarot")
            Tarot2.classList.remove("TarotSeleccionada")
            Tarot2Selected = false

            TarotSeleccionada = ""
        }
    }
})

let Tarot3Selected = false
Tarot3.addEventListener("click", function(){
    if (Modificador3 !== "8"){
        if (Tarot3Selected === false){
            Tarot3.classList.remove("Tarot")
            Tarot3.classList.add("TarotSeleccionada")
            Tarot3Selected = true

            TarotSeleccionada = "Tarot3"
            ModificadorTocado = Modificador3

            Tarot1Selected = false
            Tarot1.classList.add("Tarot")
            Tarot1.classList.remove("TarotSeleccionada")

            Tarot2Selected = false
            Tarot2.classList.add("Tarot")
            Tarot2.classList.remove("TarotSeleccionada")
        }
        else if (Tarot3Selected === true){
            Tarot3.classList.add("Tarot")
            Tarot3.classList.remove("TarotSeleccionada")
            Tarot3Selected = false

            TarotSeleccionada = ""
        }
    }
})




let DERROTA = document.getElementById("DERROTA")
let VICTORIA = document.getElementById("VICTORIA")

let PuntosHechos = document.getElementById("PuntosHechos")
let PuntosBot = document.getElementById("PuntosBot")

//Parte Enc argada de Sumar Puntos
//Llamar a esta función para agregar puntos y sumarlos
function GuardarPuntos(id, sumar) { //
    
    puntosAcumulados[id] = sumar + puntosAcumulados[id]
    sumarPuntos(id, puntosAcumulados[id])
    if (puntosAcumulados[id] >= 30){
        setTimeout(function(){
            if (id === "NOS"){
                PuntosBot.textContent = "Puntos del Bot: " + puntosAcumulados["ELLOS"]
                VICTORIA.style.display = "flex"
            }
            else if (id === "ELLOS"){
                PuntosHechos.textContent = "Puntos Hechos: " + puntosAcumulados["NOS"]
                DERROTA.style.display = "flex"
            }
        }, 1500)
       
    }
}
//Función que se encarga de sumar puntos, pero no debe llamarsela directamente
function sumarPuntos(idcarta, puntos) {
    let imagenTransparente = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBgfsCyBYAAAAASUVORK5CYII="
    let img = [
        document.getElementById(idcarta + "1"),
        document.getElementById(idcarta + "2"),
        document.getElementById(idcarta + "3"),
        document.getElementById(idcarta + "4"),
        document.getElementById(idcarta + "5"),
        document.getElementById(idcarta + "6"),
    ]
    let resto = puntos

    for (let i = 0; i < 6; i++) {
        if (resto >= 5){
            img[i].src = "IMAGENES/Fosforo5.png"
            resto = resto - 5
        }
        else if (resto > 0){
            img[i].src = "IMAGENES/Fosforo" + resto + ".png"
            resto = 0
        }
        else{
            img[i].src = imagenTransparente
        }
    }
}