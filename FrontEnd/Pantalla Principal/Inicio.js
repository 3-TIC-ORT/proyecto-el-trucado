//Boton que cambia el fondo
let cuadrado = document.getElementById("cuadrado")
let Fondo = false
cuadrado.addEventListener("click", function(){
    if (Fondo){
        document.body.style.backgroundImage = 'url("img/fondo2.png")'
        Fondo = false
    }
    else{
        document.body.style.backgroundImage = 'url("img/fondo.png")'
        Fondo = true
    }
})

let Jugar = document.getElementById("Jugar")
Jugar.addEventListener("click", function(){
    window.location.href = "../Pantalla Juego/Trucado.html"
})


// Pantalla emergente (Colección)
let Coleccion = document.getElementById("Colección");
let pantalla = document.getElementById("pantallaEmergente");
let cerrar = document.getElementById("cerrarPantalla");

// Inicialmente oculta
pantalla.style.display = "none";

// Mostrar pantalla al hacer clic en Colección
Coleccion.addEventListener("click", () => {
  pantalla.style.display = "flex"; // usa flex por tu CSS (.overlay usa justify/align)
});

// Cerrar al hacer clic en “Volver”
cerrar.addEventListener("click", () => {
  pantalla.style.display = "none";
});
