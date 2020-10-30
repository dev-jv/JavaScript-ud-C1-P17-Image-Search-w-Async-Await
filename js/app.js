const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion')

const registrosPorPagina = 40; // a mostrar...
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e){
    
    e.preventDefault();

    const termino = document.querySelector('#termino').value;

    if(termino === ''){
        mostrarAlerta('Please enter a search term')
        return;
    }
    buscarImagenes();
}

function mostrarAlerta(mensaje){
    limpiarHTML();
    const alertaExistente = document.querySelector('.border-red-600');
    
    if(!alertaExistente){
        const alerta = document.createElement('p');
        alerta.classList.add('border', 'bg-red-600', 'border-red-600', 'text-white', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
            `;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2456);
    }
}

async function buscarImagenes(){
    const termino = document.querySelector('#termino').value;
    spinner();
    setTimeout( () => {
        const key = '18606097-b8840aa7f603ab11e55f47cdb';
        const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
        
        // fetch(url)
        //     .then(respuesta => respuesta.json())
        //     .then(resultado => {
        //         // console.log(resultado);
        //         totalPaginas = calcularPaginas(resultado.totalHits);
        //         console.log(totalPaginas);
        //         mostrarImagenes(resultado.hits);
        //     })

    try{
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
                console.log(totalPaginas);
                mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);
    }

    }, 5000);
}

function *crearPaginador(total) { // Generador que registrará la cantidad de elementos de acuerdo a las paginas
    for (let i =1; i <= total; i++){
        console.log(i);
        yield i; // registramos el valor
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina)); // redondears
}

function mostrarImagenes(imagenes){
    // console.log(imagenes);
    limpiarHTML();
    imagenes.forEach( imagen =>{
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src=" ${previewURL} ">
                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me gusta </span></p>
                    <p class="font-bold"> ${views} <span class="font-light"> Veces vista </span></p>

                    <a
                        class="block w-full bg-teal-500 hover:bg-pink-500 text-white uppercase font-bold text-center rounded mt-5 p-1"

                        href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                    >
                        Ver imagen
                    </a>
                </div>
            </div>
        </div>
        `
    })
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);
    // console.log(iterador.next());
    // console.log(iterador.next().value); // el valor del iterador
    // console.log(iterador.next().done); // Si ya llegó al final...
    while(true){
        const {value, done} = iterador.next();
        if(done) return;

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-transparent', 'hover:bg-black', 'hover:text-white', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-3', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    formulario.reset();
}

function spinner(){
    limpiarHTML();
    // resultado.classList.remove('flex')
    // resultado.classList.remove('flex-wrap')
    const spinner = document.createElement('div');
    spinner.classList.add('sk-folding-cube', 'hover:bg-orange-400')

    spinner.innerHTML=`
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
    `
    resultado.appendChild(spinner);
}

