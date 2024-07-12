//Accesibilidad
document.querySelector("#aumentarFuente").addEventListener("click", ()=>{  
    ajustarFuente(1);
});
document.querySelector("#reducirFuente").addEventListener("click", ()=>{   
    ajustarFuente(-1);  
});
document.querySelector("#escalaGrises").addEventListener("click", escalaGrises);
document.querySelector("#altoContraste").addEventListener("click", altoContraste);
document.querySelector("#reset").addEventListener("click", restablecerTodo);


function ajustarFuente(cambio) {

    let elementos = document.querySelectorAll("body *:not(#accesibilidad *)");

    elementos.forEach(function(elem){

        let estilo = window.getComputedStyle(elem) //getComputedStyle() pilla el estilo del elemento
        let fontSize = parseFloat(estilo.fontSize) //se pasa a float para que no sea String
        console.log(fontSize);
        elem.style.fontSize = fontSize + cambio + 'px';
    })
}
function escalaGrises(){    

    document.body.classList.add("grayscale");
}
function altoContraste(){

    document.body.classList.add("dark-theme");
}
function restablecerTodo(){

    let elementos = document.querySelectorAll("body *");

    elementos.forEach(function(elem){

        elem.style.fontSize = "";
    })

    document.body.classList.remove("dark-theme");
    document.body.classList.remove("grayscale");

}


//////////
//Cámara//
//////////
let videoElement = document.querySelector("#camara");
let botonTomarFoto = document.querySelector("#tomar-foto");
let botonBorrarTodo = document.querySelector("#borrar-todo");
let galeriaDeFotos = document.querySelector("#galeria");

//Solicitar acceso a la cámara
navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{ videoElement.srcObject=stream})
.catch(error=>{
    alert("tu no mete cabra saramambiche")
});

//declaración del contador de fotos para generar el ID y poder borrar o descargar la que queramos 
let contadorIDfotos = tomarIDproximaFoto();

//cuando se haga click en tomar foto, se genera un canvas de tipo 2d, con las coordenada x,y de la imagen que se está transmitiendo de la cámara
botonTomarFoto.addEventListener("click", ()=>{

    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const contex = canvas.getContext("2d");
    //dibuja con los datos anteriores
    contex.drawImage(videoElement,0,0,canvas.width,canvas.height);

    galeriaDeFotos.appendChild(canvas)

    //convertir el canvas a base 64

})






function tomarIDproximaFoto() {

}