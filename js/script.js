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
    alert("Ninguna cámara detectada")
});

//declaración del contador de fotos para generar el ID y poder borrar o descargar la que queramos 
let contadorIDfotos = getNextPhoto();

//cuando se haga click en tomar foto, se genera un canvas de tipo 2d, con las coordenada x,y de la imagen que se está transmitiendo de la cámara
botonTomarFoto.addEventListener("click", ()=>{

    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const contex = canvas.getContext("2d");
    //dibuja con los datos anteriores
    contex.drawImage(videoElement,0,0,canvas.width,canvas.height);

    

    //convertir el canvas a base 64
    let dataUrl = canvas.toDataURL("image/jpeg" , 0.9); //Convierte el canva a JPEG con la ruta que se va a establecer con el ID
    let photoID = contadorIDfotos++;
    guardarFoto({id:photoID, dataUrl}); //mapa con ID y ruta. Para guardar en localStorage del navegador
    setNextPhoto(contadorIDfotos); //se pasa el valor del contador de foto a la funcion que crea la nueva foto
})


function guardarFoto(photo, isPhotoLoad=false) {

    //crear el contenedor para los botones de la foto
    let photoContainer = document.createElement("div");
    photoContainer.className="photo-container";

    //2 maneras de introducir la ID
    // photoContainer.setAttribute("id",photoID)
    photoContainer.dataset.id=photo.id;

    //Crear img
    let img = new Image(); //Variable de tipo objeto e imagen
    img.src=photo.dataUrl;
    img.className="photo";

    //Crear contenedor de botones
    let contenedorBotones = document.createElement("div");
    contenedorBotones.className = "container-buttons";

    //creamos el boton de eliminar
    let eliminarPhoto=document.createElement("button");
    eliminarPhoto.className = "boton-eliminar";
    eliminarPhoto.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
    eliminarPhoto.addEventListener("click",()=>{

        eliminar(photo.id);
    })

    //creamos el boton de descargar
    let descargarPhoto=document.createElement("button");
    descargarPhoto.className = "boton-descargar";
    descargarPhoto.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>`;
    descargarPhoto.addEventListener("click",()=>{

        descargar(photo.dataUrl, `photo-${(photo.id + 1)}.jpg`);
    })


    //adjuntar a los hijos
    galeriaDeFotos.appendChild(photoContainer);
    photoContainer.appendChild(img);
    photoContainer.appendChild(contenedorBotones);
    contenedorBotones.appendChild(descargarPhoto);
    contenedorBotones.appendChild(eliminarPhoto);

    if(!isPhotoLoad) {
        let fotos = JSON.parse(localStorage.getItem("fotos")) || [];
        fotos.push(photo);
        localStorage.setItem("fotos",JSON.stringify(fotos));
    }
}
function eliminar(id) {

    //eliminar de la vista
    let divEliminar = document.querySelector(`.photo-container[data-id="${id}"]`);
    if (divEliminar) {

        galeriaDeFotos.removeChild(divEliminar);

    }
    //eliminar del localStorage, se leen todas las fotos que están guardadas y se filtra el que es igual a la ID que se busca
    let fotos = JSON.parse(localStorage.getItem("fotos")) || []; // || [] -> si en fotos no existe nada o es nulo, devuelve array vacío
    fotos = fotos.filter(photo=>photo.id != id);
    localStorage.setItem("fotos", JSON.stringify(fotos));
}

function descargar(dataUrl,filename) {

    let elemento = document.createElement("a");
    elemento.href = dataUrl;
    elemento.download = filename;
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);

}

botonBorrarTodo.addEventListener("click", ()=> {

    localStorage.removeItem("fotos");
    contadorIDFotos=0;
    setNextPhoto(contadorIDfotos=0)
    while(galeriaDeFotos.firstChild) {
        
        galeriaDeFotos.removeChild(galeriaDeFotos.firstChild);
    }
})

function getNextPhoto(){

    return parseInt(localStorage.getItem("contadorIDfotos")) || 0;
}

function setNextPhoto(id){

    localStorage.setItem("contadorIDfotos",id.toString());
}



//Cuando carga la página, recupera todas las fotos - ....
//funcion que lee el localStorage y muestra las fotos almacenadas
let fotosGuardadas = JSON.parse(localStorage.getItem("fotos")) || [];
fotosGuardadas.forEach(element => {

    guardarFoto(element, true);
})