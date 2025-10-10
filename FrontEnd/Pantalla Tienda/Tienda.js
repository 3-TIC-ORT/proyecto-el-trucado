//Variable que sirve para la función de agregar puntos
let puntosAcumulados = {}; // Guarda puntos acumulados por id

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
    { nombre: "Ascenso", descripcion: "Una carta específica tiene +1 de jerarquía contra otras (no en envido)", valor: 1 },
    { nombre: "Gemelo", descripcion: "Cambia un carta por otra a elección.", valor: 2 },
    { nombre: "Milipili", descripcion: "Transforma dos cartas a ORO", valor: 2 },
    { nombre: "Al palo", descripcion: "Transforma dos cartas a BASTO", valor: 1 },
    { nombre: "La Puntita", descripcion: "Transforma dos cartas a ESPADA", valor: 2 },
    { nombre: "La Tercera", descripcion: "Transforma dos cartas a COPA", valor: 1 },
    { nombre: "TNT", descripcion: "Saca 2 cartas del mazo", valor: 1 },
    { nombre: "Reyes", descripcion: "Las figuras cuentan como +5 en envido en vez de +0", valor: 4 },
    { nombre: "Ebullición", descripcion: "2% de que la carta que tire el bot tenga jerarquia 0", valor: 2}
]

let Venta1 = document.getElementById("Venta1")
let Venta2 = document.getElementById("Venta2")
let Venta3 = document.getElementById("Venta3")

let Modificador1 = GeneradorModificadores()
let Modificador2 = GeneradorModificadores()
let Modificador3 = GeneradorModificadores()

Venta1.textContent = Modificadores[Modificador1].nombre
Venta2.textContent = Modificadores[Modificador2].nombre
Venta3.textContent = Modificadores[Modificador3].nombre

let Descripcion = document.getElementById("Descripcion")
let Titulo = document.getElementById("Titulo")
let Valor = document.getElementById("Valor")

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