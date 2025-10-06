//Funcionalidad de los botones
let Volver = document.getElementById("Volver")
Volver.addEventListener("click", function(){
    window.location.href = "../Pantalla Principal/Inicio.html"
})
let MenuPrincipal = document.getElementById("MenuPrincipal")
MenuPrincipal.addEventListener("click", function(){
    window.location.href = "../Pantalla Principal/Inicio.html"
})
let PlayAgain = document.getElementById("PlayAgain")
PlayAgain.addEventListener("click", function(){
    location.reload()
})



//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {}; // Guarda puntos acumulados por id

// Array global para guardar las cartas que el bot ya tiró en esta mano
let cartasUsadasBot = []

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
    truco.classList.add("BarraInferiorBTN")

    //Varialbe necesarias para el funcionamiento de la barra inferior
    BotonEnvido = false
    EnvidoEnvido = 0
    Regresar = false
    Cant_Envido = 0


    //El turno se intercala entre rondas
    turno = turnoF
    turnoF = (turnoF === "Jugador") ? "Bot" : "Jugador"

    //Crea el mazo nuevo, cambia el texto del turno y actualiza los botones
    crearmazo()
    TXTurno.textContent = "Turno: " + turno
    actualizarBoton()
}

//Función que crea las 10 cartas y les pone imagenes solo a las nuestras
let cartas = []
function crearmazo(){
    //Array donde se guardan cada carta
    cartas = []
    for (let i = 1; i <= 10; i++) {
        //Crea las cartas para cada carta
        let nuevaCarta = crearcarta()
        
        // Evitar cartas Repetidas
        while (cartas.some(c => c.numero == nuevaCarta.numero && c.palo == nuevaCarta.palo)) {
            nuevaCarta = crearcarta()
        }
        cartas.push(nuevaCarta)

        //Se conoce su jerarquia y su valor envido desde el principio
        let estatscartas = EVNR(nuevaCarta.numero, nuevaCarta.palo)
        nuevaCarta.valorenvido = estatscartas.valorenvido
        nuevaCarta.jerarquia = estatscartas.jerarquia

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
function CartasCentro(quien, numero, palo, cartax) { 
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
        valorenvido = 0 // Los 10 11 y 12 valen 0, por ahora :)
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

    return { valorenvido: valorenvido, jerarquia: jerarquia };
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
let N_ganadas = 0
let E_ganadas = 0
let empatadas = 0
function CompararCartas(carta1, carta2){ //Carta1 si o si es nustra carta, y carta 2 es la carta de ellos
    //Compara las 2 cartas que recibe para determinar la ganadora
    if (carta1.jerarquia > carta2.jerarquia){ //Gana jugador
        turno = "Jugador"
        TXTurno.textContent = "Turno: Jugador"
        N_ganadas = N_ganadas + 1.5
    }
    else if (carta2.jerarquia > carta1.jerarquia){ //Gana bot
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
    
    //Revisa si ya se gano la mano y se suman los puntos
    setTimeout(function() {
        if (empatadas === 3){
            resetearRonda()
        }
        else if (N_ganadas >= 2){
            GuardarPuntos("NOS", 1)
            resetearRonda()
        }
        else if (E_ganadas >= 2){
            GuardarPuntos("ELLOS", 1)
            resetearRonda()
        }
      }, 500) //Delay para verlo mejor 
}

//Cambia el turno al contrario
function cambiarTurno(){ //Se encarga de cambiar de turno al tirar una carta
    if (turno === "Jugador") {
        turno = "Bot"
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
    if (turno === "Jugador"){ cartastiradas++ 
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

//Cartas del BOT

//Tirar solo 3 cartas bot
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




//Funcion que selecciona numero random para que el BOT tire cartas aleatorias, PROTOTIPO
function CartaBot(){
    // Repetir hasta encontrar una carta que no haya usado
    let NumeroBot
    do {
        NumeroBot = Math.floor(Math.random() * 5) + 6   // valores 6 a 10
    }
    while (cartasUsadasBot.includes(NumeroBot))
    
    // Guardar la carta como usada
    cartasUsadasBot.push(NumeroBot)
    
    //Tirar la carta con la función
    TirarCartasBot(NumeroBot)
}
//Tirar cartas del Bot
function TirarCartasBot (numerocarta){ //Del 6 y al 10 orden de izquierda a derecha
    setTimeout(function() {
        click = document.getElementById("carta" + numerocarta)
        cartastiro++
        if (click){
            click.classList.add("oculto")
        }
        let BotID = numerocarta - 1
        let cartaX = cartas[BotID]
        CartasCentro("E", cartaX.numero, cartaX.palo, cartaX)
        guardarCartaCentro(cartaX, "E")
        verificarCartas()
    }, 1000)  
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

//Boton truco
truco.addEventListener("click", function(){
    setTimeout(function() {
        //Cuando se toca el boton TRUCO
        if (Regresar === false){
            truco.textContent = "RETRUCO"
            truco.classList.add("PalabrasLargas")
            truco.classList.add("PalabrasLargas-NH")
            envido.classList.add("BarraInferiorBTN-NH")
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


let DERROTA = document.getElementById("DERROTA")

//Parte Enc argada de Sumar Puntos
//Llamar a esta función para agregar puntos y sumarlos
function GuardarPuntos(id, sumar) { //
    if (!puntosAcumulados[id]) {
        puntosAcumulados[id] = 0
    }
    puntosAcumulados[id] += sumar
    sumarPuntos(id, puntosAcumulados[id])
    if (puntosAcumulados[id] >= 1){
        setTimeout(function(){
            if (id === "NOS"){
                alert("Has ganado")
                location.reload()
            }
            else if (id === "ELLOS"){
                DERROTA.style.display = "flex"
            }
        }, 500)
       
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