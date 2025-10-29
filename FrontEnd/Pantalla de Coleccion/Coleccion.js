const botonAbrir = document.getElementById('mostrarPantalla');
const botonCerrar = document.getElementById('cerrarPantalla');
const pantalla = document.getElementById('pantallaEmergente');

botonAbrir.onclick = () => pantalla.style.display = 'flex';
botonCerrar.onclick = () => pantalla.style.display = 'none';

//Todos los modificadores, puede cambiar
let Modificadores = [
    { nombre: "Camaleón", descripcion: "Transforma una carta en todos los palos (solo envido)", valor: 3},
    { nombre: "Ascenso", descripcion: "Una carta específica tiene +1 de jerarquía contra otras", valor: 1 },
    { nombre: "Gemelo", descripcion: "Cambia un carta por otra a elección.", valor: 2 },
    { nombre: "Milipilli", descripcion: "Transforma una cartas a ORO", valor: 2 },
    { nombre: "Al palo", descripcion: "Transforma una cartas a BASTO", valor: 1 },
    { nombre: "La Puntita", descripcion: "Transforma una cartas a ESPADA", valor: 2 },
    { nombre: "La Tercera", descripcion: "Transforma una cartas a COPA", valor: 1 },
    { nombre: "TNT", descripcion: "Saca 2 cartas del mazo", valor: 1 },
    { nombre: "Reyes", descripcion: "Las figuras cuentan como +5 en envido en vez de +0", valor: 4 },
    { nombre: "Ebullición", descripcion: "2% de que la carta que tire el bot tenga jerarquia 0", valor: 2}
]

