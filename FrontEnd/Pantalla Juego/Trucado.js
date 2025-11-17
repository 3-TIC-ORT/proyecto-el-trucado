connect2Server()

//Multiplicador para cada cantidad de puntos de truco
let PuntosTruco = false
let PuntosRetruco = false
let PuntosValeCuatro = false
let ultimoCantadorTruco = null
let Cant_Envido = 0
let EnvidoLock = false // bloquea cualquier nuevo canto de envido/real una vez concluida la secuencia
// Flags para gestión de Envido/Real
let RealAfterEnvido = false // true si Real fue cantado después de un Envido
let ultimoCantadorEnvido = null // "Bot" o "Jugador"
//Varialbe necesarias para el funcionamiento de la barra inferior
let BotonEnvido = false
let EnvidoEnvido = 0
let Regresar = false
let PuntosEnvidos 


//Todos los modificadores, puede cambiar
let Modificadores = [
    { nombre: "Camaleón"},
    { nombre: "Ascenso"},
    { nombre: "Milipilli", categoria: "oro"},
    { nombre: "Al palo", categoria: "basto" },
    { nombre: "La Puntita", categoria: "espada" },
    { nombre: "La Tercera", categoria: "copa" },
    { nombre: "Reyes",}
]

//Cantidad de tiendas en la partida
let CantidadTienda = 0
//Cada vez que se entra a la pagina se pide al back los puntos
window.addEventListener("load", () => {
    getEvent("pedirPuntos", (ans) => {
        if (ans?.ok) {
            GuardarPuntos("ELLOS", ans.infoJSON.ellos)
            GuardarPuntos("NOS", ans.infoJSON.nosotros)
            CantidadTienda = ans.infoJSON.PuntosTienda
            TarotCompradas = ans.infoJSON.modificadoresComprados
          console.log("Info recibida:", ans.infoJSON)
        } else {
          console.log("Error al recibir puntos")
        }
      })
    getEvent("pedirMods", (ans) => {
        if (ans?.ok){
            Modificador1 = ans.infoModsJSON.Modificador1
            Modificador2 = ans.infoModsJSON.Modificador2
            Modificador3 = ans.infoModsJSON.Modificador3
            
//Las tres tarot que podes usar
if (Modificador1){
    PonerTarot(Modificadores[Modificador1].nombre, "Tarot1")
}
if (Modificador2){
    PonerTarot(Modificadores[Modificador2].nombre, "Tarot2")
}
if (Modificador3){
    PonerTarot(Modificadores[Modificador3].nombre, "Tarot3")
}
            console.log(`Modificadores recibidos: ${ans.infoModsJSON}`)
        } else {
            console.log("Error al recibir modificadores")
        }
    })
})
//Funcionalidad de los botones
let Volver = document.getElementById("Volver")
Volver.addEventListener("click", function(){
        puntosAcumulados["ELLOS"] = 0
        puntosAcumulados["NOS"] = 0
        CantidadTienda = 0
        Modificador1 = ""
        Modificador2 = ""
        Modificador3 = ""
        console.log("Datos enviados:", {Modificador1, Modificador2, Modificador3})
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1, Modificador2, Modificador3})
     
    window.location.href = "../Pantalla Principal/Inicio.html"
})

//Boton para volver al menu principal
let MenuPrincipal = document.querySelectorAll(".MenuPrincipal")
MenuPrincipal.forEach(boton => {
    boton.addEventListener("click", function(){
        puntosAcumulados["ELLOS"] = 0
        puntosAcumulados["NOS"] = 0
        CantidadTienda = 0
        Modificador1 = ""
        Modificador2 = ""
        Modificador3 = ""
        console.log("Datos enviados:", {Modificador1, Modificador2, Modificador3})
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1, Modificador2, Modificador3})
        window.location.href = "../Pantalla Principal/Inicio.html"
    })
})

//Boton para volver a jugar
let PlayAgain = document.querySelectorAll(".PlayAgain")
PlayAgain.forEach(boton => {
    boton.addEventListener("click", function(){
    //micro funcion resetear partida, br patapin
    if (puntosAcumulados["NOS"] >= 30 || puntosAcumulados["ELLOS"] >= 30){
        puntosAcumulados["ELLOS"] = 0
        puntosAcumulados["NOS"] = 0
        CantidadTienda = 0
        Modificador1 = ""
        Modificador2 = ""
        Modificador3 = ""
        TarotCompradas = 0
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1, Modificador2, Modificador3})
    }
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

//Array para guardar las cartas del bot
let CartasBot = []

//Cargar cartas tarot de la pantalla tienda (Joaquin), si no hay = ""
let Modificador1 = ""
let Modificador2 = ""
let Modificador3 = ""

//Revisa si esta el modificador de reyes
let ReyesEnvido  = false
if (Modificador1 === "6" || Modificador2 === "6" || Modificador3 === "6"){
    ReyesEnvido = true
}


//Función crear carta Aleatoria, numero del 1 - 12 y un palo random
function crearcarta(){
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
    else if (numeropalo == 4){
        palo = "copa"
    }
    return { numero, palo }
}

//Función para poner Imagenes a Cartas dependiendo de su numero y palo
function identificar_cartas (idcarta, numero, palo){
    document.getElementById(idcarta).style.backgroundImage = "url('IMAGENES/" + numero + palo + ".png')"
    document.getElementById(idcarta).style.backgroundSize = "cover"
}

//Función que resetea valores y llama a crearmazo() para empezar la ronda de nuevo
function resetearRonda(){

    //no reinicia ronda si ya termino partida
    if ( !(puntosAcumulados["NOS"] >= 30) && !(puntosAcumulados["ELLOS"] >= 30)){
        ultimoCantadorTruco = null
        //Se verifica si es momento de la tienda
        VerificarTienda()

        //Se saca mensaje en caso bug y se oculta
        MostrarMensajeBot(false, "")
        BotonesVoluntad.style.display = "none"
        BotonesVoluntadBlock = false

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
        multiplicador = 1

        //en caso de bug, se oculta los botones de voluntad
        BotonesVoluntad.style.display = "none"


        //Se resetea las cartas que tiro el bot
        cartasUsadasBot = []

        // Ocultar cartas del centro
        for (let i = 1; i <= 3; i++){
            document.getElementById("CCN" + i).style.backgroundImage = "none"
            document.getElementById("CCN" + i).style.visibility = "hidden"
            document.getElementById("CCN" + i).classList.remove("CartaReversa")
            document.getElementById("CCE" + i).style.backgroundImage = "none"
            document.getElementById("CCE" + i).style.visibility = "hidden"
        }

        // Mostrar nuevamente las cartas de los 2 jugadores
        for (let i = 1; i <= 10; i++){
            let carta = document.getElementById("carta" + i)
            if (carta){
                carta.classList.remove("oculto")
                if (i <= 5){
                    carta.classList.remove("CartaReversa")
                }
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
    PuntosEnvidos = 0
    EnvidoLock = false
    RealAfterEnvido = false
    ultimoCantadorEnvido = null

        //Se reinician las jeraquias
        CantidadJeraquia1 = 0
        CantidadJeraquia2 = 0
        CantidadJeraquia3 = 0
        CantidadJeraquia4 = 0
        CantidadJeraquia5 = 0

        // Turno entre partidas intermitente
        turno = turnoF 

        // Preparar el turno del siguiente por si se necesita después
        if (turnoF === "Bot"){
            turnoF = "Jugador"
        }
        else if (turnoF === "Jugador"){
            turnoF = "Bot"
        }


        //Crea el mazo nuevo, cambia el texto del turno y actualiza los botones
        crearmazo()
        TXTurno.textContent = "Turno: " + turno
        actualizarBoton()

        

        // Si toca al bot empezar la nueva mano, que juegue la primer carta
        if (turno === "Bot"){
            // un pequeño delay para que se vea la UI del nuevo mazo antes de jugar
            setTimeout(() => {
                CartaBot()
            }, 1000)
        }
        
    }

}

//Función que crea las 10 cartas y les pone imagenes solo a las nuestras
let cartas = []
function crearmazo(){
    //Array donde se guardan cada carta
    cartas = []

    //Se repite para cada carta
    for (let i = 1; i <= 10; i++){
        //Crea las cartas con la funcion
        let nuevaCarta = crearcarta()
        
        //Revisa si ya fue creada
        for (let j = 0; j < cartas.length; j++){
            while ( nuevaCarta.numero === cartas[j].numero && nuevaCarta.palo === cartas[j].palo){
                //si ya fue creada se vuelve a revisar con otra
                nuevaCarta = crearcarta()
                j = 0
            }
                
        }
        //al final se marca como ya usada
        cartas.push(nuevaCarta)

        //Se conoce su jerarquia y su valor envido desde el principio
        let estatscartas = EVNR(nuevaCarta.numero, nuevaCarta.palo)
        nuevaCarta.valorenvido = estatscartas.valorenvido
        nuevaCarta.jerarquia = estatscartas.jerarquia

        // Cambiar a 5 para que cartas bot no tengan imagens (10 --> 5)
        //les pone imagenes
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

//Las 5 cartas del bot
CartasBot = [carta6, carta7, carta8, carta9, carta10]
}

// Función que calcular el envido dependiendo de las 5 cartas que entra
function calcularEnvido(carta1, carta2, carta3, carta4, carta5){

    //Mete a las cartas en un array
    let CartasEnvido = [carta1, carta2, carta3, carta4, carta5]

    //inicializa un array para guardar las cartas de cada palo
    let palos = [
        [], //espada
        [], //oro
        [], //basto
        []  //copa
    ]

    //Reparte las cartas dependiendo del palo
    for (let i = 0; i < 5; i++){
        //si es camaleon, cuenta para todos los palos
        if (CartasEnvido[i].camaleon === true){
            palos[0].push(CartasEnvido[i].valorenvido)
            palos[1].push(CartasEnvido[i].valorenvido)
            palos[2].push(CartasEnvido[i].valorenvido)
            palos[3].push(CartasEnvido[i].valorenvido)
        }
        //si no se guarda en su palo
        else if (CartasEnvido[i].palo === "espada"){
            palos[0].push(CartasEnvido[i].valorenvido)
        }
        else if (CartasEnvido[i].palo === "oro"){
            palos[1].push(CartasEnvido[i].valorenvido)
        }
        else if (CartasEnvido[i].palo === "basto"){
            palos[2].push(CartasEnvido[i].valorenvido)
        }
        else if (CartasEnvido[i].palo === "copa"){
            palos[3].push(CartasEnvido[i].valorenvido)
        }
    }

    //inicializa las variable que calculan el tanto
    let EnvidoMaximo = 0
    let EnvidoActual = 0

    //recorre los cuatro palos
    for (let i = 0; i < 4; i++){
        //reincia la variable del envido
        EnvidoActual = 0

        //en caso de ser mas de 3 cartas, se le suma 20
        if (palos[i].length >= 3){
            EnvidoActual = EnvidoActual + 20
        }

        //recorre todos los palos y suma sus valores envido
        for (let j = 0; j < palos[i].length; j++){
            EnvidoActual = EnvidoActual + palos[i][j]
        }

        //si el envido del palo es mayor que el 
        if (EnvidoActual > EnvidoMaximo){
            EnvidoMaximo = EnvidoActual
        }
    }

    return (EnvidoMaximo)
}

  
//Tirar Cartas en Orden y pone imagenes de la respectiva carta
function CartasCentro(quien, numero, palo, carta){ 
//quien (N = Nuestras Carta Centro, E = Carta Ellos Centro)

    let CartasCentro1 = document.getElementById("CC" + quien + "1")
    let CartasCentro2 = document.getElementById("CC" + quien + "2")
    let CartasCentro3 = document.getElementById("CC" + quien + "3")

    //Revisa si ya tienen imagenes y si tiene le pone a las que no tienen imagenes
    if (CartasCentro1.style.backgroundImage != "" && CartasCentro1.style.backgroundImage != "none"){
        if (CartasCentro2.style.backgroundImage != "" && CartasCentro2.style.backgroundImage != "none"){
            if (CartasCentro3.style.backgroundImage != "" && CartasCentro3.style.backgroundImage != "none"){
                // Los tres tienen imagen, no pasa nada
                console.log("Ya tiraste 3 cartas") //opcional
            }
            else{
                identificar_cartas("CC" + quien + "3", numero, palo)
                document.getElementById("CC" + quien + "3").style.visibility = "visible"
            }
        }
        else{
            identificar_cartas("CC" + quien + "2", numero, palo)
            document.getElementById("CC" + quien + "2").style.visibility = "visible"
        }
    }
    else{
        identificar_cartas("CC" + quien + "1", numero, palo)
        document.getElementById("CC" + quien + "1").style.visibility = "visible"
        if (carta.camaleon){
            document.getElementById("CC" + quien + "1").classList.add("CartaReversa")
        }
    }
}

//Establecer el valor Envido y Jerárquico dependiendo de la carta
function EVNR(numero, palo){
    let valorenvido = 0

    //revisa si son figuras
    if (numero >= 10){
        if (ReyesEnvido === true){  //Si se tiene modificador valen mas (+5)
            valorenvido = 5
        }
        else if (ReyesEnvido === false){
            valorenvido = 0 // Los 10 11 y 12 valen 0
        }
    }
    else{
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
    else if (numero == 3){ //los 3
        jerarquia = 12
    }
    else if (numero == 2){ //los 2
        jerarquia = 11
    }
    else if (numero == 1 && (palo == "oro" || palo == "copa")){ //anchos falsos
        jerarquia = 10
    }
    else if (numero == 12){ //los 12
        jerarquia = 9
    }
    else if (numero == 11){ //los 11
        jerarquia = 8
    }
    else if (numero == 10){ //los 10
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

//Crea el mazo para crear la primer mano, no pregunten porque esta aca
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
function guardarCartaCentro(carta, jugador){ //N = NOSOTROS, E = ELLOS
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
function verificarCartas(){
    //Si las dos cartas del centro tienen imagenes se llama para que las comparen
    if (rondaCentro === 1 && CartaCentroN1 && CartaCentroE1){  
        CompararCartas(CartaCentroN1, CartaCentroE1)
        CartaCentroN1 = null
        CartaCentroE1 = null
        rondaCentro = 2
    }
    else if (rondaCentro === 2 && CartaCentroN2 && CartaCentroE2){
        CompararCartas(CartaCentroN2, CartaCentroE2)
        CartaCentroN2 = null
        CartaCentroE2 = null
        rondaCentro = 3
    }
    else if (rondaCentro === 3 && CartaCentroN3 && CartaCentroE3){
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
    if (!carta1.jerarquia || !carta2.jerarquia){
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
    
    if ( (N_ganadas < 2) && (E_ganadas < 2) && (empatadas < 3) ){
        if (turno === "Bot"){
            // Le damos un pequeño delay para ver la animación antes de que juegue
            setTimeout(() => {
                CartaBot()
            }, 500)
        }
    }
    if (PuntosValeCuatro) multiplicador = 4
    else if (PuntosRetruco) multiplicador = 3
    else if (PuntosTruco) multiplicador = 2

    //Revisa si ya se gano la mano y se suman los puntos
        setTimeout(function(){
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
        }, 1000) //Delay para verlo mejor 
}

//Cambia el turno al contrario
function cambiarTurno(){ //Se encarga de cambiar de turno al tirar una carta
    if (turno === "Jugador"){
        turno = "Bot"
    // no ejecutar CartaBot si recién tiró (previene canto tardío)
    if (cartastiro < 3){
        CartaBot()
    }
    }
    else{
        turno = "Jugador"
    }
    TXTurno.textContent = "Turno: " + turno
    actualizarBoton()
}


//Cantidad de jerarquía por carta
//seguro esta al pedo, lo pidió joaquin
let CantidadJeraquia1 = 0
let CantidadJeraquia2 = 0
let CantidadJeraquia3 = 0
let CantidadJeraquia4 = 0
let CantidadJeraquia5 = 0


//Display de ascensos cada carta
let ascenso1 = document.getElementById("ascenso1")
let ascenso2 = document.getElementById("ascenso2")
let ascenso3 = document.getElementById("ascenso3")
let ascenso4 = document.getElementById("ascenso4")
let ascenso5 = document.getElementById("ascenso5")


//Las 5 cartas del jugador, con sus clicks

//Tirar solo 3 Cartas Nosotros
let cartastiradas = 0

click1 = document.getElementById("carta1") 
click1.addEventListener("click", function(){ 
    if (turno === "Jugador" && !BotonesVoluntadBlock){ 
        if (!TarotSeleccionada){
            cartastiradas++ 
            if (cartastiradas <= 3){ 
            click1.classList.add("oculto") 
            CartasCentro("N", carta1.numero, carta1.palo, carta1) 
            guardarCartaCentro(carta1, "N") 
            verificarCartas()
            ascenso1.classList.add("Oculto") 
            click1.classList.remove("CartaReversa")
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "2"){
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
                CantidadJeraquia1++
                ascenso1.classList.remove("Oculto")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                ascenso1.textContent = "+ " + CantidadJeraquia1 + " Jerarquía"
            }
            else if (ModificadorTocado === "0"){
                click1.classList.add("CartaReversa")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                carta1.camaleon = true
                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }

            if (ModificadorTocado === Modificador1){
                Modificador1 = ""
            }
            else if (ModificadorTocado === Modificador2){
                Modificador2 = ""
            }
            else if (ModificadorTocado === Modificador3){
                Modificador3 = ""
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
            CartasCentro("N", carta2.numero, carta2.palo, carta2) 
            guardarCartaCentro(carta2, "N") 
            verificarCartas() 
            ascenso2.classList.add("Oculto") 
            click2.classList.remove("CartaReversa")
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "2"){
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
            else if (ModificadorTocado === "1"){
                carta2.jerarquia++
                CantidadJeraquia2++
                ascenso2.classList.remove("Oculto")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                ascenso2.textContent = "+ " + CantidadJeraquia2 + " Jerarquía"
            }
            else if (ModificadorTocado === "0"){
                click2.classList.add("CartaReversa")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                carta2.camaleon = true
                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }

            if (ModificadorTocado === Modificador1){
                Modificador1 = ""
            }
            else if (ModificadorTocado === Modificador2){
                Modificador2 = ""
            }
            else if (ModificadorTocado === Modificador3){
                Modificador3 = ""
            }
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
            CartasCentro("N", carta3.numero, carta3.palo, carta3) 
            guardarCartaCentro(carta3, "N") 
            verificarCartas() 
            ascenso3.classList.add("Oculto") 
            click3.classList.remove("CartaReversa")
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "2"){
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
            else if (ModificadorTocado === "1"){
                carta3.jerarquia++
                CantidadJeraquia3++
                ascenso3.classList.remove("Oculto")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                ascenso3.textContent = "+ " + CantidadJeraquia3 + " Jerarquía"
            }
            else if (ModificadorTocado === "0"){
                click3.classList.add("CartaReversa")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                carta3.camaleon = true
                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }

            if (ModificadorTocado === Modificador1){
                Modificador1 = ""
            }
            else if (ModificadorTocado === Modificador2){
                Modificador2 = ""
            }
            else if (ModificadorTocado === Modificador3){
                Modificador3 = ""
            }
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
            CartasCentro("N", carta4.numero, carta4.palo, carta4) 
            guardarCartaCentro(carta4, "N") 
            verificarCartas()
            ascenso4.classList.add("Oculto")  
            click4.classList.remove("CartaReversa")
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "2"){
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
            else if (ModificadorTocado === "1"){
                carta4.jerarquia++
                CantidadJeraquia4++
                ascenso4.classList.remove("Oculto")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                ascenso4.textContent = "+ " + CantidadJeraquia4 + " Jerarquía"
            }
            else if (ModificadorTocado === "0"){
                click4.classList.add("CartaReversa")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                carta4.camaleon = true
                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }

            if (ModificadorTocado === Modificador1){
                Modificador1 = ""
            }
            else if (ModificadorTocado === Modificador2){
                Modificador2 = ""
            }
            else if (ModificadorTocado === Modificador3){
                Modificador3 = ""
            }
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
            CartasCentro("N", carta5.numero, carta5.palo, carta5) 
            guardarCartaCentro(carta5, "N") 
            verificarCartas() 
            ascenso5.classList.add("Oculto") 
            click5.classList.remove("CartaReversa")
            }      
        }
        else{
            if (ModificadorTocado === "3" || ModificadorTocado === "4" || ModificadorTocado === "5" || ModificadorTocado === "2"){
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
            else if (ModificadorTocado === "1"){
                carta5.jerarquia++
                CantidadJeraquia5++
                ascenso5.classList.remove("Oculto")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                ascenso5.textContent = "+ " + CantidadJeraquia5 + " Jerarquía"
            }
            else if (ModificadorTocado === "0"){
                click5.classList.add("CartaReversa")
                document.getElementById(TarotSeleccionada).classList.add("oculto")
                TarotSeleccionada = ""
                carta5.camaleon = true
                EnvidoJugador = calcularEnvido(carta1, carta2, carta3, carta4, carta5)
                actualizarBoton()
            }

            if (ModificadorTocado === Modificador1){
                Modificador1 = ""
            }
            else if (ModificadorTocado === Modificador2){
                Modificador2 = ""
            }
            else if (ModificadorTocado === Modificador3){
                Modificador3 = ""
            }
        }
    } 
})

let mate = document.getElementById("Mate")
let mateClicks = 0
let mateTocado = false
mate.addEventListener("click", () => {
mateClicks++
let mateRandom = Math.random()
    if (mateClicks === 3){
        MostrarMensajeBot(true, "Deja de tocar el mate, no rompas")
    }
    else if (mateRandom <= 0.25){
        MostrarMensajeBot(true, "No toques el mate")
        mateTocado = true
    }
    else if (mateTocado && mateRandom <= 0.5 && mateRandom > .25){
        MostrarMensajeBot(true, "No lo toques bb   ͡° ͜ʖ ͡° ")
    }
    else {
        MostrarMensajeBot(false, "")
    }
})

function BotCantaEnvido(){
    // Decide si el bot canta Envido / Real Envido.
    // Condiciones básicas: no cantar si ya se tiró alguna carta o si la UI está bloqueada
    if (cartastiradas > 0) return false
    if (BotonesVoluntadBlock) return false
    if (EnvidoLock) return false // ya se cantó en esta mano
    // evita que el mismo lado cante dos veces seguidas
    if (ultimoCantadorEnvido === "Bot") return false

    let valorEnvido = EnvidoBot || 0
    let aleatorio = Math.random()

    // Si ya hubo un canto de envido (Cant_Envido === 1), intentar subir a Real Envido en manos buenas
    if (Cant_Envido === 1){
        if (valorEnvido >= 28 && aleatorio < 0.5){
            // Canta Real Envido
            setTimeout(() => {
                MostrarMensajeBot(true, "Real Envido")
                BotonesVoluntadBlock = true
                BotonesVoluntad.style.display = "flex"
                // Marcar que hubo otro canto de envido
                // Si ya había un envido, este Real se suma al anterior
                Cant_Envido++
                RealAfterEnvido = true
                ultimoCantadorEnvido = "Bot"
                // Al llegar a 2, cerrar la posibilidad de futuros envidos en esta mano
                EnvidoLock = true
                // Deshabilitar botones inferiores mientras se responde (no permitir elevar)
                envido.classList.add("BarraInferiorBTN-NH")
                flor.classList.add("BarraInferiorBTN-NH")
                mazo.style.display = 'none'
                PuntosEnvidos = 2 // 2 = Real Envido (convención simple)
            }, 800)
            return true
        }
        return false
    }

    // algoritmo para cantar Envido: mayor valor => mayor probabilidad
    // valorEnvido típico: 0-33. Ajusta probabilidades razonables.
    if ((valorEnvido >= 31) ||
        (valorEnvido >= 27 && aleatorio < 0.9) ||
        (valorEnvido >= 23 && aleatorio < 0.6) ||
        (valorEnvido >= 20 && aleatorio < 0.3) ||
        (aleatorio < 0.03)) { // probabilidad chica de mentir con envido bajo

        setTimeout(() => {
            MostrarMensajeBot(true, "Envido")
            BotonesVoluntadBlock = true
            BotonesVoluntad.style.display = "flex"
            Cant_Envido++
            RealAfterEnvido = false
            ultimoCantadorEnvido = "Bot"
            // Mostrar el mismo menú de Envido que aparece cuando el jugador abre Envido
            truco.textContent = "REGRESAR"
            truco.classList.add("PalabrasLargas")
            truco.classList.remove("BarraInferiorBTN")
            truco.classList.remove("PalabrasLargas-NH")

            flor.textContent = "REAL ENVIDO"
            flor.classList.add("PalabrasLargas")
            flor.classList.remove("BarraInferiorBTN")
            flor.classList.remove("BarraInferiorBTN-NH")

            // Ocultar mazo y marcar estado de menú
            mazo.style.display = 'none'
            Regresar = true
            BotonEnvido = true

            // Deshabilitar el botón de Envido para evitar recantos del mismo jugador
            envido.classList.add("BarraInferiorBTN-NH")

            PuntosEnvidos = 1 // 1 = Envido
        }, 800)

        return true
    }

    return false
}


//el div de los botones de quiero y no quiero
let BotonesVoluntad = document.getElementById("BotonesVoluntad")
let BotonesVoluntadBlock = false
let trucoCantado = false

//funcion para que el bot cante truco
function BotCantaTruco(){
            
    // Crea variable para fijarse si canta truco/retruco/valecuatro
    let ValorJerarquia = 0
    let ValorAleatorio = Math.random()
    
    if (ultimoCantadorTruco === "Bot") return false // si el bot fue el ultimo en cantar truco, no canta
    if (BotonesVoluntadBlock) return false          // si los botones están activos, no canta
    if (BotonesVoluntad.style.display === 'flex') return false   // si se están mostrando, no canta
    if (trucoCantado) return false                  // si ya cantó y espera respuesta
    
    //bucle para fijarse el valor de jerarquia de la mano del bot
    for (let i = 0; i < CartasBot.length; i++){
        ValorJerarquia = ValorJerarquia + CartasBot[i].jerarquia
    }
    
    let SonidoTruco = new Audio("Sonidos/Truco.mp3")  // Creas el objeto Audio con la ruta
    let SonidoReTruco = new Audio("Sonidos/ReTruco.mp3")  // Creas el objeto Audio con la ruta
    let SonidoValeTruco = new Audio("Sonidos/ValeCuatro.mp3")  // Creas el objeto Audio con la ruta
    let SonidoNoquiero = new Audio("Sonidos/NoQuiero.mp3")
    let SonidoQuiero = new Audio("Sonidos/Quiero.mp3")


    //Jerarquia total: 394
    //Jerarquia promedio: 8,2
    //Jerarquia de mano promedio: 41
    if (!PuntosTruco  && !PuntosRetruco  && !PuntosValeCuatro){
        if ( (ValorJerarquia < 41 && ValorAleatorio < 0.1) || (ValorJerarquia > 41 && ValorAleatorio < 0.4) ){ //mano promedio
            SonidoTruco.play()  // Reproduce el sonido
            BotonesVoluntadBlock = true
            trucoCantado = true
            setTimeout(() => {
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
                MostrarMensajeBot(true, "Truco")
                ultimoCantadorTruco = "Bot"
              }, 1500)
            return true
        }
    }
    else if (PuntosTruco  && !PuntosRetruco  && !PuntosValeCuatro){
        if ( (ValorJerarquia < 61 && ValorAleatorio < 0.05) || (ValorJerarquia > 61 && ValorAleatorio > 0.4) ){
            SonidoReTruco.play()
            trucoCantado = true
            BotonesVoluntadBlock = true
            setTimeout(() =>{
                console.log("RETRUCO")
                PuntosTruco = false
                PuntosRetruco = true
                PuntosValeCuatro = false
                truco.textContent = "Vale Cuatro"
                truco.classList.add("PalabrasExtraLargas")
                truco.classList.remove("PalabrasLargas-NH")
                truco.classList.remove("BarraInferiorBTN-NH")
                mazo.classList.add("BarraInferiorBTN-NH")
                BotonesVoluntad.style.display = "flex"
                MostrarMensajeBot(true, "Retruco")
                ultimoCantadorTruco = "Bot"
            },1500)
            return true
        }
    }
    else if (!PuntosTruco  && PuntosRetruco  && !PuntosValeCuatro){
        if ( (ValorJerarquia < 81 && ValorAleatorio < 0.01) || (ValorJerarquia > 81 && ValorAleatorio > 0.4) ){
            SonidoValeTruco.play()
            trucoCantado = true
            BotonesVoluntadBlock = true
            setTimeout(() =>{
                console.log("VALE CUATRO")
                PuntosTruco = false
                PuntosRetruco = false
                PuntosValeCuatro = true
                truco.classList.add("PalabrasExtraLargas-NH")
                mazo.classList.add("BarraInferiorBTN-NH")
                BotonesVoluntad.style.display = "flex"
                MostrarMensajeBot(true, "Vale Cuatro")
                ultimoCantadorTruco = "Bot"
            },1500)
            return true
        }
    }

    return false
}

//Botones de voluntad
let quiero = document.getElementById("QUIERO")
let noquiero = document.getElementById("NOQUIERO")

noquiero.addEventListener("click", function(){
    console.log("Jugador: No Quiero")
    // Si hay un canto de Envido pendiente, resolverlo aquí
    if (PuntosEnvidos){
        // Determinar quién cantó el envido
        let cantante = (ultimoCantadorEnvido === "Bot") ? "ELLOS" : "NOS"
        // Si es Real Envido
        if (PuntosEnvidos === 2){
            if (RealAfterEnvido){
                // Real fue cantado después de Envido -> rechazo da 2 puntos al cantante
                GuardarPuntos(cantante, 2)
            } else {
                // Real cantado primero -> rechazo da 1 punto
                GuardarPuntos(cantante, 1)
            }
        }
        else if (PuntosEnvidos === 1){
            // Rechazo de Envido simple -> 1 punto al cantante
            GuardarPuntos(cantante, 1)
        }

    // Limpiar estado de envido
    PuntosEnvidos = 0
    Cant_Envido = 0
    RealAfterEnvido = false
    ultimoCantadorEnvido = null
    EnvidoLock = true // bloquear nuevos cantos de envido esta mano
    BotonesVoluntadBlock = false
    BotonesVoluntad.style.display = "none"
    MostrarMensajeBot(false, "")
    // Restaurar UI inferior como si se apretó REGRESAR
    restoreEnvidoUI()
    return
    }

    // Si no es Envido, sigue la lógica de Truco (rechazo termina la mano)
    multiplicador = 1
    if (PuntosValeCuatro) multiplicador = 3
    else if (PuntosRetruco) multiplicador = 2
    else if (PuntosTruco) multiplicador = 1
    display = "none"
    setTimeout(function(){
        resetearRonda()
        GuardarPuntos("ELLOS", 1 * multiplicador)
    }, 750)
    BotonesVoluntadBlock = false
    MostrarMensajeBot(false, "")
})

quiero.addEventListener("click", function(){
    // Si hay un canto de Envido pendiente, resolver Envido
    if (PuntosEnvidos){
        console.log("Jugador: Quiero (Envido)")
        // Determinar puntos por tipo de envido
        let puntosARepartir = 0
        if (PuntosEnvidos === 1) puntosARepartir = 2 // Envido
        else if (PuntosEnvidos === 2){
            // Si Real fue cantado después de un Envido, el total posible es 5 (2 + 3)
            if (RealAfterEnvido) puntosARepartir = 5
            else puntosARepartir = 3
        }

        // Comparar Envidos: en empate gana quien empezó la ronda (turnoF)
        let ganadorEnvido = null
        if ((EnvidoBot || 0) > (EnvidoJugador || 0)){
            ganadorEnvido = "ELLOS"
        }
        else if ((EnvidoBot || 0) < (EnvidoJugador || 0)){
            ganadorEnvido = "NOS"
        }
        else {
            // Empate -> gana quien empezó la ronda (turnoF)
            ganadorEnvido = (turnoF === "Jugador") ? "NOS" : "ELLOS"
        }

        GuardarPuntos(ganadorEnvido, puntosARepartir)
    // Limpiar estado de envido
    PuntosEnvidos = 0
    Cant_Envido = 0
    RealAfterEnvido = false
    ultimoCantadorEnvido = null
    EnvidoLock = true // bloquear nuevos cantos de envido esta mano
    BotonesVoluntadBlock = false
    BotonesVoluntad.style.display = "none"
    MostrarMensajeBot(false, "")
    // Restaurar UI inferior como si se apretó REGRESAR
    restoreEnvidoUI()
    // Si es el turno del bot, hacer que continúe jugando
    if (turno === "Bot"){
        CartaBot()
    }
    return
    }

    // Si no es Envido, seguir con Truco
    BotonesVoluntad.style.display = "none"
    console.log("Jugador: Quiero")
    BotonesVoluntadBlock = false
    trucoCantado = false
    MostrarMensajeBot(false, "")
    if (turno === "Bot"){
        CartaBot()
    }
})


//Cartas del BOT

//Tirar solo 3 cartas bot
let cartastiro = 0



function CartaBot() {
    // Si ya ha jugado una carta o el juego no está en curso, no hace nada
    if (cartastiro > 0 && ganadorUltimaMano === null) {
        return
    }

    // Solo tira carta si es su turno, no se terminó el juego y no está cantado nada
    if (turno === "Bot" && !(puntosAcumulados["NOS"] >= 30) && !(puntosAcumulados["ELLOS"] >= 30) && !BotonesVoluntadBlock) {
        
        // INTENTO DE CANTAR ANTES DE TIRAR: envido tiene prioridad si todavía no se tiró ninguna carta
        if (cartastiradas === 0 && cartastiro === 0){
            if (BotCantaEnvido()){
                // Bot cantó Envido y espera respuesta del jugador
                return
            }
        }

        // Intentar cantar truco si no cantó envido
        if (BotCantaTruco()) {
            // Bot ya inició canto y espera respuesta del jugador, no tirar carta ahora.
            return
        }

    // Elegir carta con criterio (no aleatorio)
    let indiceReal = elegirCartaBot()
    if (typeof indiceReal === 'undefined' || indiceReal === null) indiceReal = CartasBot.findIndex((_, i) => !cartasUsadasBot.includes(i))
    if (indiceReal === -1) indiceReal = 0
    let cartaElegida = CartasBot[indiceReal]
    cartasUsadasBot.push(indiceReal) // La marca como usada
    
        // Simula el tiempo de "pensamiento" del bot (800ms)
        setTimeout(() => {
            cartastiro++  // Incrementa el contador de cartas jugadas
            let indiceCartaReal = indiceReal + 6 // Ajusta el índice para el display visual
            document.getElementById("carta" + indiceCartaReal).classList.add("oculto")
    
            // La pone en el centro visualmente
            CartasCentro("E", cartaElegida.numero, cartaElegida.palo, cartaElegida)
    
            // La guarda como carta jugada
            guardarCartaCentro(cartaElegida, "E")

            // Verifica si hay que comparar
            verificarCartas()

            // Nota: la llamada a BotCantaTruco() después de tirar fue removida para evitar canto tardío.
        }, 800)
    }
}

if (turno === "Bot") {
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




//Boton truco
truco.addEventListener("click", function(){
    GloboTexto.style.display = "none"
    BotonesVoluntadBlock = false

    setTimeout(function(){
        //Cuando se toca el boton TRUCO
        if (Regresar === false){
            //evita que el jugador cante si fue el ultimo en cantar
            if (ultimoCantadorTruco === "Jugador") return
            if (PuntosTruco === false && PuntosRetruco === false){
                truco.textContent = "RETRUCO"
                truco.classList.remove("BarraInferiorBTN")
                truco.classList.add("PalabrasLargas")
                truco.classList.add("PalabrasLargas-NH")
                envido.classList.add("BarraInferiorBTN-NH")
                PuntosTruco = true
                PuntosRetruco = false
                PuntosValeCuatro = false
                ultimoCantadorTruco = "Jugador"
                // Simular respuesta del bot al Truco cantado por el jugador
                setTimeout(() => {
                    RespuestaDelBotParaTruco(1)
                }, 800)
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
                ultimoCantadorTruco = "Jugador"
                // Simular respuesta del bot al Retruco cantado por el jugador
                setTimeout(() => {
                    RespuestaDelBotParaTruco(2)
                }, 800)
            }
            else if (PuntosRetruco === true){
                truco.classList.add("PalabrasExtraLargas-NH")
                PuntosTruco = false
                PuntosRetruco = false
                PuntosValeCuatro = true
                BotonesVoluntad.style.display = "none"
                ultimoCantadorTruco = "Jugador"
                // Simular respuesta del bot al Vale Cuatro cantado por el jugador
                setTimeout(() => {
                    RespuestaDelBotParaTruco(3)
                }, 800)
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
    setTimeout(function(){
        // No permitir abrir/enviar envido si ya se completó la secuencia esta mano
        if (EnvidoLock) return
        // Evitar que el mismo jugador cante dos veces seguidas
        if (ultimoCantadorEnvido === "Jugador") return

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

            if (Cant_Envido >= 2){
                envido.classList.add("BarraInferiorBTN-NH")
            }
        }
        //Se toca envido para cantarlo
        else if (BotonEnvido === true){
            // Previene cantar si ya se cantó Real primero (Envido bloqueado)
            if (Cant_Envido < 2 && !EnvidoLock && ultimoCantadorEnvido !== "Jugador"){
                alert ("Envido")

                flor.textContent = "FLOR"
                flor.classList.remove("PalabrasLargas")
                flor.classList.remove("BarraInferiorBTN")
                flor.classList.add("BarraInferiorBTN-NH")

                Regresar = false
                BotonEnvido = false
                Cant_Envido++
                PuntosEnvidos = 1
                ultimoCantadorEnvido = "Jugador"
                RealAfterEnvido = false

                truco.textContent = "TRUCO"
                truco.classList.remove("PalabrasLargas")
                truco.classList.remove("PalabrasLargas-NH")
                truco.classList.add("BarraInferiorBTN")
                 
                envido.classList.remove("BarraInferiorBTN-NH")
                envido.classList.remove("PalabrasLargas")

                //Mostrar boton mazo
                mazo.style.display = 'block'
                // Simular respuesta del bot al Envido del jugador
                setTimeout(() => {
                    // evitar que el bot cante otras cosas mientras responde
                    BotonesVoluntadBlock = true
                    // algoritmo para decidir: No Quiero / Quiero / Real
                    let ale = Math.random()
                    let diff = (EnvidoBot || 0) - (EnvidoJugador || 0)
                    // Si la mano del bot es claramente mejor (un poquito de trampa 😈), puede subir a Real
                    if (diff >= 3 && ale < 0.45){
                        // Bot eleva a Real Envido
                        MostrarMensajeBot(true, "Real Envido")
                        PuntosEnvidos = 2
                        RealAfterEnvido = true
                        ultimoCantadorEnvido = "Bot"
                        // mostrar opciones al jugador para que responda
                        BotonesVoluntad.style.display = 'flex'
                        // ajustar UI inferior como cuando el bot canta Real
                        truco.textContent = "TRUCO"
                        truco.classList.remove("BarraInferiorBTN")
                        truco.classList.add("PalabrasLargas")
                        // bloquear envido para evitar recantos
                        envido.classList.add("BarraInferiorBTN-NH")
                    }
                    else if ( (diff >= 0 && ale < 0.75) || ale < 0.15){
                        // Bot acepta (QUIERO)
                        MostrarMensajeBot(true, "Quiero")
                        // decidir ganador del Envido ahora (2 puntos)
                        let ganador = null
                        if ((EnvidoBot || 0) > (EnvidoJugador || 0)) ganador = "ELLOS"
                        else if ((EnvidoBot || 0) < (EnvidoJugador || 0)) ganador = "NOS"
                        else ganador = (turnoF === "Jugador") ? "NOS" : "ELLOS"
                        GuardarPuntos(ganador, 2)
                        // limpiar y restaurar UI
                        PuntosEnvidos = 0
                        Cant_Envido = 0
                        RealAfterEnvido = false
                        ultimoCantadorEnvido = null
                        EnvidoLock = true
                        BotonesVoluntadBlock = false
                        MostrarMensajeBot(false, "")
                        restoreEnvidoUI()
                    }
                    else {
                        // Bot rechaza (NO QUIERO)
                        MostrarMensajeBot(true, "No Quiero")
                        // Mostrar "No Quiero" unos instantes antes de resolver para que el jugador lo vea
                        setTimeout(() => {
                            // jugador (cantante) recibe 1 punto
                            GuardarPuntos("NOS", 1)
                            // limpiar y restaurar UI
                            PuntosEnvidos = 0
                            Cant_Envido = 0
                            RealAfterEnvido = false
                            ultimoCantadorEnvido = null
                            EnvidoLock = true
                            BotonesVoluntadBlock = false
                            MostrarMensajeBot(false, "")
                            restoreEnvidoUI()
                        }, 900)
                    }
                }, 800)
            }
        }
    }, 500)
})

//Boton flor
flor.addEventListener("click", function(){
    //Permitir que el jugador eleve a Real cuando el bot cantó Envido (BotonesVoluntad visible)
    if (BotonesVoluntad.style.display === 'flex' && PuntosEnvidos === 1 && ultimoCantadorEnvido === "Bot" && !EnvidoLock){
        // El jugador canta Real en respuesta al Envido del bot
        PuntosEnvidos = 2
        RealAfterEnvido = true
        ultimoCantadorEnvido = "Jugador"
        EnvidoLock = true
        // ocultar temporalmente el panel y simular respuesta del bot
        BotonesVoluntad.style.display = "none"
        BotonesVoluntadBlock = true
        // pequeña pausa y decidir si el bot acepta el Real
        setTimeout(() => {
            let aceptacion
            if ((EnvidoBot || 0) >= (EnvidoJugador || 0)){
                aceptacion = (Math.random() < 0.85)
            } else {
                aceptacion = (Math.random() < 0.25)
            }
            if (aceptacion){
                // Bot acepta el Real -> mostrar mensaje y comparar puntos
                MostrarMensajeBot(true, "Quiero")
                setTimeout(() => {
                    let puntosARepartir = RealAfterEnvido ? 5 : 3
                    let ganador = null
                    if ((EnvidoBot || 0) > (EnvidoJugador || 0)) ganador = "ELLOS"
                    else if ((EnvidoBot || 0) < (EnvidoJugador || 0)) ganador = "NOS"
                    else ganador = (turnoF === "Jugador") ? "NOS" : "ELLOS"
                    GuardarPuntos(ganador, puntosARepartir)
                    // limpiar estado
                    PuntosEnvidos = 0
                    Cant_Envido = 0
                    RealAfterEnvido = false
                    ultimoCantadorEnvido = null
                    BotonesVoluntadBlock = false
                    MostrarMensajeBot(false, "")
                    // Restaurar UI inferior como si se hubiese presionado REGRESAR
                    restoreEnvidoUI()
                    // si es turno del bot, que continúe
                    if (turno === "Bot") CartaBot()
                }, 800)
            } else {
                // Bot rechaza el Real -> mostrar mensaje y asignar puntos al jugador
                MostrarMensajeBot(true, "No Quiero")
                setTimeout(() => {
                    GuardarPuntos("NOS", 2)
                    // limpiar estado
                    PuntosEnvidos = 0
                    Cant_Envido = 0
                    RealAfterEnvido = false
                    ultimoCantadorEnvido = null
                    BotonesVoluntadBlock = false
                    MostrarMensajeBot(false, "")
                    // Restaurar UI inferior como si se hubiese presionado REGRESAR
                    restoreEnvidoUI()
                    // si es turno del bot, que continúe
                    if (turno === "Bot") CartaBot()
                }, 800)
            }
        }, 800)
        return
    }

    //Se toca el boton REAL ENVIDO
    if (BotonEnvido === true){
        // Real Envido cantado por el jugador
        alert ("Real Envido")

        let prevCant = Cant_Envido
        flor.textContent = "FLOR"
        flor.classList.remove("PalabrasLargas")
        flor.classList.remove("BarraInferiorBTN")
        flor.classList.add("BarraInferiorBTN-NH")

        Regresar = false
        BotonEnvido = false
        // Bloquear el envido siguiente si se cantó Real (no se puede "elevar" después)
        if (prevCant >= 1){
            // Real después de Envido: suma (2+3)
            Cant_Envido++
            RealAfterEnvido = true
        } else {
            // Real primero: marcar para bloquear posteriores Envidos
            Cant_Envido = 2
            RealAfterEnvido = false
        }
        PuntosEnvidos = 2
        ultimoCantadorEnvido = "Jugador"

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
        if (PuntosValeCuatro) multiplicador = 4
        else if (PuntosRetruco) multiplicador = 3
        else if (PuntosTruco) multiplicador = 2

        if (multiplicador === 1){
            if (cartastiradas === 0 && cartastiro === 0){
                GuardarPuntos("ELLOS", 2)
            }
            else{
                GuardarPuntos("ELLOS", 1)
            }
        }
        else{
            GuardarPuntos("ELLOS", multiplicador * 1) 
        }
        setTimeout(function(){
                    resetearRonda()
            }, 1000)
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
        envido.classList.remove("BarraInferiorBTN")
    }

    // Envido desactivado si ya se cantó en esta mano o si está bloqueado por resolución
    // (evita que se cante dos veces seguidas y mantiene la UI consistente)
    if ( (typeof Cant_Envido !== 'undefined' && Cant_Envido > 0) || EnvidoLock ){
        envido.classList.add("BarraInferiorBTN-NH")
        envido.classList.remove("BarraInferiorBTN")
    } else {
        // Si no fue cantado, habilitar solo cuando corresponda (turno jugador y sin cartas tiradas)
        if (turno === "Jugador" && cartastiradas === 0 && !BotonEnvido){
            envido.classList.remove("BarraInferiorBTN-NH")
            envido.classList.add("BarraInferiorBTN")
        }
    }

    
    // Flor habilitada solo si todas las cartas son del mismo palo y aún no tiraste
    if ( ( (carta1.palo === carta2.palo) || carta1.camaleon || carta2.camaleon) && 
         ( (carta1.palo === carta3.palo) || carta1.camaleon || carta3.camaleon) &&
         ( (carta1.palo === carta4.palo) || carta1.camaleon || carta4.camaleon) && 
         ( (carta1.palo === carta5.palo) || carta1.camaleon || carta5.camaleon) && 
            cartastiradas === 0 && turno === "Jugador"){
        flor.classList.remove("BarraInferiorBTN-NH")
        flor.classList.add("BarraInferiorBTN")
    }
    else{
        flor.classList.remove("BarraInferiorBTN")
        flor.classList.add("BarraInferiorBTN-NH")
    }
}

let GloboTexto = document.getElementById("GloboTexto")

//Función que mustra lo que hace el bot, Mensaje es el mensaje a mostrar
function MostrarMensajeBot(Mostrar, Mensaje){ //Mostrar = true o Mostrar= false, indica si lo muestra o lo oculta
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

// Restaurar la UI inferior a su estado normal (como si se presionó REGRESAR)
function restoreEnvidoUI(){
    // Restaurar texto y clases de flor
    flor.textContent = "FLOR"
    flor.classList.remove("PalabrasLargas")
    flor.classList.remove("BarraInferiorBTN")
    flor.classList.add("BarraInferiorBTN-NH")

    // Reset del estado de menu
    Regresar = false
    BotonEnvido = false

    // Restaurar truco a su estado normal
    truco.textContent = "TRUCO"
    truco.classList.remove("PalabrasLargas")
    truco.classList.remove("PalabrasLargas-NH")
    truco.classList.remove("PalabrasExtraLargas")
    truco.classList.remove("PalabrasExtraLargas-NH")
    truco.classList.add("BarraInferiorBTN")

    // Reactivar boton envido y mostrar mazo
    envido.classList.remove("BarraInferiorBTN-NH")
    mazo.style.display = 'block'

    // Actualizar visuales en base al turno
    actualizarBoton()
}


//Funcion que se encarga de llevar a la pantalla tienda, si es el caso
function VerificarTienda(){

    if (CantidadTienda === 0 && (puntosAcumulados["NOS"] >= 5 || puntosAcumulados["ELLOS"] >= 5 )){
        CantidadTienda++
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1: Modificador1, Modificador2: Modificador2, Modificador3: Modificador3})
        window.location.href = "../Pantalla Tienda/Tienda.html"
        console.log("Enviando tienda...")
    }
    else if (CantidadTienda === 1 && (puntosAcumulados["NOS"] >= 15 || puntosAcumulados["ELLOS"] >= 15 )){
        CantidadTienda++
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1: Modificador1, Modificador2: Modificador2, Modificador3: Modificador3})
        window.location.href = "../Pantalla Tienda/Tienda.html"
    }
    else if (CantidadTienda === 2 && (puntosAcumulados["NOS"] >= 25)){
        CantidadTienda++
        postEvent("enviarPuntosBack", {puntosNos: puntosAcumulados["NOS"], puntosEllos: puntosAcumulados["ELLOS"], CantidadTienda: CantidadTienda, modificadoresComprados: TarotCompradas})
        postEvent("enviarModificadoresBack", {Modificador1: Modificador1, Modificador2: Modificador2, Modificador3: Modificador3})
        window.location.href = "../Pantalla Tienda/Tienda.html"
    }
}



//Pone imagenes a las tarot
function PonerTarot(Tarot, idCarta){
    document.getElementById(idCarta).style.backgroundImage = "url('../Pantalla Tienda/Imagenes/" + Tarot + ".png')"
    document.getElementById(idCarta).style.backgroundSize = "cover"
}



let Tarot1 = document.getElementById("Tarot1")
let Tarot2 = document.getElementById("Tarot2")
let Tarot3 = document.getElementById("Tarot3")

//Variables necesarias para el funcionamiento de los modificadores
let TarotSeleccionada = ""
let ModificadorTocado

let Tarot1Selected = false
Tarot1.addEventListener("click", function(){
    if (Modificador1 !== "6" && Modificador1){
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
    if (Modificador2 !== "6" && Modificador2){
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
    if (Modificador3 !== "6" && Modificador3){
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

let BotPierde = new Audio("Sonidos/BotPierde.mp3")  // Creas el objeto Audio con la ruta
let BotGana = new Audio("Sonidos/BotGana.mp3")  // Creas el objeto Audio con la ruta


//Parte Enc argada de Sumar Puntos
//Llamar a esta función para agregar puntos y sumarlos
function GuardarPuntos(id, sumar){ //
    
    puntosAcumulados[id] = sumar + puntosAcumulados[id]
    sumarPuntos(id, puntosAcumulados[id])

    setTimeout(function(){
        if (puntosAcumulados[id] >= 30){
                if (id === "NOS"){
                    BotPierde.play()
                    setTimeout(function(){
                        PuntosBot.textContent = "Puntos del Bot: " + puntosAcumulados["ELLOS"]
                        VICTORIA.style.display = "flex"
                        document.getElementById("Tarot" + id).textContent = "Cartas Tarot Compradas: " + TarotCompradas
                    }, 1500)
                }
                else if (id === "ELLOS"){
                    BotGana.play()
                    setTimeout(function(){
                        PuntosHechos.textContent = "Puntos Hechos: " + puntosAcumulados["NOS"]
                        DERROTA.style.display = "flex"
                        document.getElementById("Tarot" + id).textContent = "Cartas Tarot Compradas: " + TarotCompradas
                    }, 1500)
                }       
        }
    }, 3000)

}
//Función que se encarga de sumar puntos, pero no debe llamarsela directamente
function sumarPuntos(idcarta, puntos){
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

    for (let i = 0; i < 6; i++){
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

// Simula la respuesta del bot cuando el jugador canta Truco/Retruco/Vale Cuatro
// level: 1 = Truco, 2 = Retruco, 3 = Vale Cuatro
function RespuestaDelBotParaTruco(level){
    // No responder si ya hay un panel de voluntad activo o está bloqueado
    if (BotonesVoluntadBlock) return
    BotonesVoluntadBlock = true

    // Calcular jerarquía total de la mano del bot y cuántas cartas le quedan
    let ValorJerarquia = 0
    for (let i = 0; i < CartasBot.length; i++){
        ValorJerarquia += (CartasBot[i].jerarquia || 0)
    }
    let cartasRestantes = CartasBot.length - cartasUsadasBot.length

    // Factores adicionales: si quedan pocas cartas, el bot es más conservador
    let ale = Math.random()
    let accion = "aceptar"

    // Ajustar umbrales dinámicamente
    // baseline por carta: jerarquía media
    let media = (cartasRestantes > 0) ? (ValorJerarquia / (CartasBot.length)) : (ValorJerarquia / 5)
    // penalizar si pocas cartas
    let penalizacion = (cartasRestantes <= 1) ? 0.85 : (cartasRestantes === 2 ? 0.9 : 1)

    if (level === 1){ // Truco
        if (media * penalizacion > 18){
            if (ale < 0.65) accion = "subir"
            else if (ale < 0.98) accion = "aceptar"
            else accion = "rechazar"
        }
        else if (media * penalizacion > 12){
            if (ale < 0.25) accion = "subir"
            else if (ale < 0.9) accion = "aceptar"
            else accion = "rechazar"
        }
        else {
            if (ale < 0.05) accion = "subir"
            else if (ale < 0.35) accion = "aceptar"
            else accion = "rechazar"
        }
    }
    else if (level === 2){ // Retruco
        if (media * penalizacion > 20){
            if (ale < 0.45) accion = "subir"
            else if (ale < 0.9) accion = "aceptar"
            else accion = "rechazar"
        }
        else if (media * penalizacion > 14){
            if (ale < 0.12) accion = "subir"
            else if (ale < 0.75) accion = "aceptar"
            else accion = "rechazar"
        }
        else {
            if (ale < 0.03) accion = "subir"
            else if (ale < 0.3) accion = "aceptar"
            else accion = "rechazar"
        }
    }
    else if (level === 3){ // Vale Cuatro
        if (media * penalizacion > 22){
            if (ale < 0.95) accion = "aceptar"
            else accion = "rechazar"
        }
        else if (media * penalizacion > 16){
            if (ale < 0.7) accion = "aceptar"
            else accion = "rechazar"
        }
        else {
            if (ale < 0.25) accion = "aceptar"
            else accion = "rechazar"
        }
    }

    setTimeout(() => {
        if (accion === "rechazar"){
            // Bot dice NO QUIERO -> el cantante (Jugador) pierde y el bot gana los puntos
            MostrarMensajeBot(true, "No Quiero")
            // calcular multiplicador actual
            let multiplicadorLocal = 1
            if (PuntosValeCuatro) multiplicadorLocal = 3
            else if (PuntosRetruco) multiplicadorLocal = 2
            else if (PuntosTruco) multiplicadorLocal = 1

            // Mostrar el NO QUIERO un momento antes de resolver para que sea visible
            setTimeout(() => {
                resetearRonda()
                GuardarPuntos("ELLOS", 1 * multiplicadorLocal)
                BotonesVoluntadBlock = false
                MostrarMensajeBot(false, "")
            }, 900)
            return
        }

        if (accion === "aceptar"){
            // Bot dice QUIERO -> simplemente acepta y la partida continúa
            MostrarMensajeBot(true, "Quiero")
            setTimeout(() => {
                BotonesVoluntadBlock = false
                MostrarMensajeBot(false, "")
                // si era turno del bot, que juegue
                if (turno === "Bot") CartaBot()
            }, 500)
            return
        }

        if (accion === "subir"){
            // Bot eleva: si level 1 -> Retruco, si 2 -> Vale Cuatro
            if (level === 1){
                // Convertir a Retruco
                PuntosTruco = false
                PuntosRetruco = true
                PuntosValeCuatro = false
                truco.textContent = "VALE CUATRO"
                truco.classList.add("PalabrasExtraLargas")
                truco.classList.remove("PalabrasLargas-NH")
                truco.classList.remove("BarraInferiorBTN-NH")
                mazo.classList.add("BarraInferiorBTN-NH")
                BotonesVoluntad.style.display = "flex"
                MostrarMensajeBot(true, "Retruco")
                ultimoCantadorTruco = "Bot"
            }
            else if (level === 2){
                // Convertir a Vale Cuatro
                PuntosTruco = false
                PuntosRetruco = false
                PuntosValeCuatro = true
                truco.classList.add("PalabrasExtraLargas-NH")
                mazo.classList.add("BarraInferiorBTN-NH")
                BotonesVoluntad.style.display = "flex"
                MostrarMensajeBot(true, "Vale Cuatro")
                ultimoCantadorTruco = "Bot"
            }

            // Mantener el bloqueo visible para que el jugador tenga que responder
            // No liberar BotonesVoluntadBlock aquí; se dejará hasta que el jugador responda
            return
        }

    }, 800)
}

// Elige una carta del bot con criterio: intenta superar la carta rival si juega segundo,
// y si juega primero elige según la fuerza media de la mano para conservar o gastar.
function elegirCartaBot(){
    // índices disponibles
    let disponibles = []
    for (let i = 0; i < CartasBot.length; i++){
        if (!cartasUsadasBot.includes(i)) disponibles.push(i)
    }
    if (disponibles.length === 0) return 0

    // Determinar si el jugador ya puso carta en la ronda actual
    let objetivo = null
    if (rondaCentro === 1 && CartaCentroN1 && !CartaCentroE1) objetivo = CartaCentroN1
    else if (rondaCentro === 2 && CartaCentroN2 && !CartaCentroE2) objetivo = CartaCentroN2
    else if (rondaCentro === 3 && CartaCentroN3 && !CartaCentroE3) objetivo = CartaCentroN3

    // Si hay objetivo (jugador puso primero), intentar ganar con la carta más baja que lo supere
    if (objetivo){
        let ganadoras = disponibles.filter(i => (CartasBot[i].jerarquia || 0) > (objetivo.jerarquia || 0))
        if (ganadoras.length > 0){
            ganadoras.sort((a,b) => (CartasBot[a].jerarquia || 0) - (CartasBot[b].jerarquia || 0))
            // 10% de aleatoriedad entre las mejores
            if (Math.random() < 0.1 && ganadoras.length > 1) return ganadoras[Math.floor(Math.random()*Math.min(2, ganadoras.length))]
            return ganadoras[0]
        }
        // si no puede ganar, sacrificar la carta más baja
        disponibles.sort((a,b) => (CartasBot[a].jerarquia || 0) - (CartasBot[b].jerarquia || 0))
        return disponibles[0]
    }

    // Si el bot juega primero, decidir según fuerza media
    let suma = disponibles.reduce((s,i) => s + (CartasBot[i].jerarquia || 0), 0)
    let media = suma / disponibles.length

    // Fuerza alta: jugar una carta alta para buscar ganar
    if (media >= 20){
        disponibles.sort((a,b) => (CartasBot[b].jerarquia || 0) - (CartasBot[a].jerarquia || 0))
        // 20% probabilidad de guardar la máxima y jugar la segunda mejor
        if (disponibles.length > 1 && Math.random() < 0.2) return disponibles[1]
        return disponibles[0]
    }

    // Fuerza media: jugar carta intermedia
    if (media >= 12){
        disponibles.sort((a,b) => (CartasBot[b].jerarquia || 0) - (CartasBot[a].jerarquia || 0))
        return disponibles[Math.floor(disponibles.length/2)]
    }

    // Fuerza baja: sacrificar la carta más baja
    disponibles.sort((a,b) => (CartasBot[a].jerarquia || 0) - (CartasBot[b].jerarquia || 0))
    return disponibles[0]
}