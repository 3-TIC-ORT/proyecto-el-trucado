connect2Server()

//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {} // Guarda puntos acumulados por id

//Parte donde se encarga de guardar los puntos del juego
GuardarPuntos("NOS", 15)
GuardarPuntos("ELLOS", 12)


//Genera un numero aleatorio (0 - 9) para definir al modificador, no se repite
let ModificadoresUtilizados = []
function GeneradorModificadores(){
    let NmrModificador = Math.floor(Math.random() * 10)
    if (ModificadoresUtilizados.includes(NmrModificador)){
        return GeneradorModificadores()
    }
    else{
        ModificadoresUtilizados.push(NmrModificador)
        return NmrModificador
    } 
}

//Todos los modificadores, puede cambiar
let Modificadores = [
    { nombre: "Camaleón", descripcion: "Transforma una carta en todos los palos (solo envido)", valor: 3},
    { nombre: "Ascenso", descripcion: "Una carta específica tiene +1 de jerarquía contra otras", valor: 1 },
    { nombre: "Gemelo", descripcion: "Cambia un carta por otra a elección.", valor: 2 },
    { nombre: "Milipilli", descripcion: "Transforma una cartas a ORO", valor: 2 },
    { nombre: "Al palo", descripcion: "Transforma una cartas a BASTO", valor: 1 },
    { nombre: "La Puntita", descripcion: "Transforma una cartas a ESPADA", valor: 3 },
    { nombre: "La Tercera", descripcion: "Transforma una cartas a COPA", valor: 1 },
    { nombre: "TNT", descripcion: "Saca 2 cartas del mazo", valor: 1 },
    { nombre: "Reyes", descripcion: "Las figuras cuentan como +5 en envido en vez de +0", valor: 5 },
    { nombre: "Ebullición", descripcion: "2% de que la carta que tire el bot tenga jerarquia 0", valor: 2}
]

//Modificadores a comprar
let Venta1 = document.getElementById("Venta1")
let Venta2 = document.getElementById("Venta2")
let Venta3 = document.getElementById("Venta3")

//Los modificadores de cada venta
let Modificador1 = GeneradorModificadores()
let Modificador2 = GeneradorModificadores()
let Modificador3 = GeneradorModificadores()

//Les pone imagenes del modificador respectivo
Venta1.style.backgroundImage = "url('Imagenes/" + Modificadores[Modificador1].nombre + ".png')"
Venta1.style.backgroundSize = "cover"
Venta2.style.backgroundImage = "url('Imagenes/" + Modificadores[Modificador2].nombre + ".png')"
Venta2.style.backgroundSize = "cover"
Venta3.style.backgroundImage = "url('Imagenes/" + Modificadores[Modificador3].nombre + ".png')"
Venta3.style.backgroundSize = "cover"

//Las decripción de cada modificador
let Descripcion = document.getElementById("Descripcion")
let Titulo = document.getElementById("Titulo")
let Valor = document.getElementById("Valor")

//Cuando se pasa el mouse se muestra la descripción
Venta1.addEventListener("mouseover", function(){
    Descripcion.textContent = Modificadores[Modificador1].descripcion
    Titulo.textContent = Modificadores[Modificador1].nombre
    Valor.textContent = "Valor: " + Modificadores[Modificador1].valor
})
Venta2.addEventListener("mouseover", function(){
    Descripcion.textContent = Modificadores[Modificador2].descripcion
    Titulo.textContent = Modificadores[Modificador2].nombre
    Valor.textContent = "Valor: " + Modificadores[Modificador2].valor
})
Venta3.addEventListener("mouseover", function(){
    Descripcion.textContent = Modificadores[Modificador3].descripcion
    Titulo.textContent = Modificadores[Modificador3].nombre
    Valor.textContent = "Valor: " + Modificadores[Modificador3].valor
})

//Cuando se saca el mouse se saca la descripción
Venta1.addEventListener("mouseout", function(){
    Descripcion.textContent = ""
    Titulo.textContent = ""
    Valor.textContent = ""
})
Venta2.addEventListener("mouseout", function(){
    Descripcion.textContent = ""
    Titulo.textContent = ""
    Valor.textContent = ""
})
Venta3.addEventListener("mouseout", function(){
    Descripcion.textContent = ""
    Titulo.textContent = ""
    Valor.textContent = ""
})

let SaldoInsuficiente = document.getElementById("SaldoInsuficiente")

Venta1.addEventListener("click", function(){
    if (Modificadores[Modificador1].valor <= puntosAcumulados["NOS"]){
        TarotCompradas(Modificador1, Modificadores[Modificador1].valor)
        Venta1.classList.add("Oculto")
    }
    else{
        SaldoInsuficiente.style.display =  'block'
        setTimeout(function() {
            SaldoInsuficiente.style.display =  'none'
        }, 1000)
    }
})
Venta2.addEventListener("click", function(){
    if (Modificadores[Modificador2].valor <= puntosAcumulados["NOS"]){
        TarotCompradas(Modificador2, Modificadores[Modificador2].valor)
        Venta2.classList.add("Oculto")
    }
    else{
        SaldoInsuficiente.style.display =  'block'
        setTimeout(function() {
            SaldoInsuficiente.style.display =  'none'
        }, 1000)
    }
})
Venta3.addEventListener("click", function(){
    if (Modificadores[Modificador3].valor <= puntosAcumulados["NOS"]){
        TarotCompradas(Modificador3, Modificadores[Modificador3].valor)
        Venta3.classList.add("Oculto")
    }
    else{
        SaldoInsuficiente.style.display =  'block'
        setTimeout(function() {
            SaldoInsuficiente.style.display =  'none'
        }, 1000)
    }
})




let TarotObtenidas = document.getElementById("TarotObtenidas")
//Tirar Cartas en Orden y pone imagenes de la respectiva carta
function TarotCompradas(Tarot, Valor) {
    //Las tarot que tenes
    Tarot1 = document.getElementById("Tarot1") 
    Tarot2 = document.getElementById("Tarot2") 
    Tarot3 = document.getElementById("Tarot3") 

    // Obtenemos los estilos computados de cada carta
    let estilo1 = window.getComputedStyle(Tarot1)
    let estilo2 = window.getComputedStyle(Tarot2)
    let estilo3 = window.getComputedStyle(Tarot3)

    //Revisa si tienen imagenes
    if (estilo1.display !== 'none') {
        if (estilo2.display !== 'none') {
            if (estilo3.display !== 'none') {
                // Los tres tienen imagen, no pasa nada
                console.log("Ya compraste 3 cartas") //opcional
            }
            else{
                Tarot3.style.backgroundImage = "url('Imagenes/" + Modificadores[Tarot].nombre + ".png')"
                Tarot3.style.backgroundSize = "cover"
                Tarot3.classList.remove("Oculto")
                TarotObtenidas.textContent = " 3 / 3 "
                GuardarPuntos("NOS", -Valor)
                ValorTarot3 = Valor - 1
            }
        } 
        else{
            Tarot2.style.backgroundImage = "url('Imagenes/" + Modificadores[Tarot].nombre + ".png')"
            Tarot2.style.backgroundSize = "cover"
            Tarot2.classList.remove("Oculto")
            TarotObtenidas.textContent = " 2 / 3 "
            GuardarPuntos("NOS", -Valor)
            ValorTarot2 = Valor - 1
        }
    }
    else{
        Tarot1.style.backgroundImage = "url('Imagenes/" + Modificadores[Tarot].nombre + ".png')"
        Tarot1.style.backgroundSize = "cover"
        Tarot1.classList.remove("Oculto")
        TarotObtenidas.textContent = " 1 / 3 "
        GuardarPuntos("NOS", -Valor)
        ValorTarot1 = Valor - 1
    }
}


let Vender = document.getElementById("Vender")

let Tarot1Selected = false
Tarot1.addEventListener("click", function(){
    if (Tarot1Selected === false){
    Tarot1.classList.remove("Propiedad")
    Tarot1.classList.add("PropiedadSeleccionada")
    Tarot1Selected = true
    Vender.classList.remove("Oculto")


    Tarot2Selected = false
    Tarot2.classList.add("Propiedad")
    Tarot2.classList.remove("PropiedadSeleccionada")

    Tarot3Selected = false
    Tarot3.classList.add("Propiedad")
    Tarot3.classList.remove("PropiedadSeleccionada")
    }
    else if (Tarot1Selected === true){
        Tarot1.classList.add("Propiedad")
        Tarot1.classList.remove("PropiedadSeleccionada")
        Tarot1Selected = false
        Vender.classList.add("Oculto")
        }
})

let Tarot2Selected = false
Tarot2.addEventListener("click", function(){
    if (Tarot2Selected === false){
    Tarot2.classList.remove("Propiedad")
    Tarot2.classList.add("PropiedadSeleccionada")
    Tarot2Selected = true
    Vender.classList.remove("Oculto")


    Tarot1Selected = false
    Tarot1.classList.add("Propiedad")
    Tarot1.classList.remove("PropiedadSeleccionada")

    Tarot3Selected = false
    Tarot3.classList.add("Propiedad")
    Tarot3.classList.remove("PropiedadSeleccionada")
    }
    else if (Tarot2Selected === true){
        Tarot2.classList.add("Propiedad")
        Tarot2.classList.remove("PropiedadSeleccionada")
        Tarot2Selected = false
        Vender.classList.add("Oculto")
        }
})

let Tarot3Selected = false
Tarot3.addEventListener("click", function(){
    if (Tarot3Selected === false){
    Tarot3.classList.remove("Propiedad")
    Tarot3.classList.add("PropiedadSeleccionada")
    Tarot3Selected = true
    Vender.classList.remove("Oculto")


    Tarot1Selected = false
    Tarot1.classList.add("Propiedad")
    Tarot1.classList.remove("PropiedadSeleccionada")

    Tarot2Selected = false
    Tarot2.classList.add("Propiedad")
    Tarot2.classList.remove("PropiedadSeleccionada")
    }
    else if (Tarot3Selected === true){
        Tarot3.classList.add("Propiedad")
        Tarot3.classList.remove("PropiedadSeleccionada")
        Tarot3Selected = false
        Vender.classList.add("Oculto")
        }
})

//Boton vender
Vender.addEventListener("click", function(){
    if (Tarot1Selected === true){
        Tarot1.classList.add("Oculto")
        GuardarPuntos("NOS", ValorTarot1)
        Tarot1Selected = false
        Vender.classList.add("Oculto")
    }
    else if (Tarot2Selected === true){
        Tarot2.classList.add("Oculto")
        GuardarPuntos("NOS", ValorTarot2)
        Tarot2Selected = false
        Vender.classList.add("Oculto")
    }
    else if (Tarot3Selected === true){
        Tarot3.classList.add("Oculto")
        GuardarPuntos("NOS", ValorTarot3)
        Tarot3Selected = false
        Vender.classList.add("Oculto")
    }
})



let FinalizarCompra = document.getElementById("FinalizarCompra")
FinalizarCompra.addEventListener("click", function(){
    window.location.href = "../Pantalla Juego/Trucado.html"
})



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
    let resto = puntos

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