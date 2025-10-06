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