/*
Poder ver el precio final del carrito  
Agregar la funcionalidad de poder subir o bajar la cantidad de un producto
Darle la posibilidad al usuario de pagar en cuotas
Agregar un botón en el nav para cambiar los precios de los games a dólares o pesos
Que se sumen los totales de los precios al carrito
Mostrar el price final del carrito
*/

//Agregar funcionalidad de agregar el precio en pesos

//  VARIABLES
// cargamos las variables
const carrito = document.querySelector(".cart");
const cancelarCompraBtn = document.querySelector(".cancel-buy-btn");
const listaDeJuegos = document.querySelector(".games");
const añadirAlCarritoBtn = document.querySelectorAll(".add-cart");
const vaciarCarritoBtn = document.querySelector(".empty-cart-btn");
const confirmarCompraBtn = document.querySelector(".confirm-buy-btn");
const main = document.querySelector("#main");
const resultadoTotal = document.querySelector(".resultadoTotal")
let articulosDelCarrito = [];

//la clase de los objetos que vamos a crear
class Videojuego {
    constructor(nombre, categoria, precio, id) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.id = id;    
    }
}
// array de los objetos 
const arrayDeJuegos = [
    new Videojuego("Resident Evil Village", "Terror", 4299, 1),
    new Videojuego("Gta V", "Acción - Mundo Abierto", 1199, 2), 
    new Videojuego("Assasin's Creed Origins", "Acción - Mundo Abierto", 5299, 3), 
    new Videojuego("The Sims 4", "Simulación", 3599, 4), 
    new Videojuego("Battlefield 2042", "FPS - Acción", 111899, 5), 
    new Videojuego("Elden Ring", "Mundo Abierto - Tipo Souls", 6899, 6), 
    new Videojuego("Dying Light 2: Stay Human", "Zombies - Acción", 5199, 7), 
    new Videojuego("The Quarry", "Drama", 5999, 8) 
]

//
verificarEstadoDelCarrito()
// cargan todos los eventListeners

cargarEventListener()
function cargarEventListener() {
    // add to cart
    listaDeJuegos.addEventListener("click", añadirJuegoAlCarrito)
    // delete from cart
    carrito.addEventListener("click", eliminarJuegoDelCarrito)
    // empty cart
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosDelCarrito = [];
        limpiarHTML()
    })
}

// FUNCIONES 

//esta función llama a la función readGameData, que esta agrega un producto al array y al html por consiguiente mediante callbacks

function añadirJuegoAlCarrito(e) {
    e.preventDefault();
    mostrarCarrito()

    if (e.target.classList.contains("add-cart")) {
        const id = parseInt(e.target.getAttribute("id"));
        const juegoSeleccionado = arrayDeJuegos.find(juego => {
            return juego.id === id
        });
        leerDatosDelJuego(juegoSeleccionado);
        agregarAlLocalStorage(juegoSeleccionado);
    }
    sumarPrecios()
}

// esta función elimina un producto del carrito html y del array de productos

function eliminarJuegoDelCarrito(e) {
    e.preventDefault();

    if (e.target.classList.contains("delete-game")) {
        const juegoID = parseInt(e.target.getAttribute("id"));
        const carritoDelLocalStorage = verificarLocalStorage();
        const nombreDelJuego = carritoDelLocalStorage.find(juego => juego.id === juegoID).nombre
        console.log(`${nombreDelJuego} ha sido eliminado del localStorage y del carrito`);
        const arrayNuevo = carritoDelLocalStorage.filter(juego => juego.id !== juegoID);
        const arrayDeLocalStorage = JSON.stringify(arrayNuevo);
        localStorage.setItem("carrito", arrayDeLocalStorage);
        articulosDelCarrito = articulosDelCarrito.filter((juego) => juego.id !== juegoID);
        carritoHTML();
    }
}

function verificarLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito ? console.log("hay productos almacenados en el local storage") : localStorage.setItem("carrito", carrito);
    return carrito
}

function verificarEstadoDelCarrito() {
    
}

function agregarAlLocalStorage(juego) {
    const arrayDelLocalStorage = verificarLocalStorage()
    arrayDelLocalStorage.push(juego);
    console.log(`${juego.nombre} ha sido agregado al carrito y al localStorage`);
    const output = JSON.stringify(arrayDelLocalStorage);
    localStorage.setItem("carrito", output);
}


// esta función lee la info del producto, define si existe o no en el carrito
// si existe le modifica la cantidad, si no llama a la función cartHTML

function leerDatosDelJuego(juego) {
    const infoDelJuego = {
        nombre: juego.nombre,
        categoria: juego.categoria,
        precio: juego.precio,
        id: juego.id,
        cantidad: 1
    }
    const existe = articulosDelCarrito.some((juego) => juego.id === infoDelJuego.id);
    if (existe) {
        const juegos = articulosDelCarrito.map((juego) => {
            if (juego.id === infoDelJuego.id) {
                juego.cantidad++;
                return juego;
            } else {
                return juego;
            }
        })
        articulosDelCarrito = [...juegos];
    } else {
        articulosDelCarrito = [...articulosDelCarrito, infoDelJuego]
    }
    carritoHTML()
}

// hacer una función que me saque todos los precios de los juegos que tiene el carrito y me cree
// un nuevo array con esos items

function sumarPrecios() {
    const resultado = articulosDelCarrito.reduce((acc,game) => {
        return acc = acc + (game.price * game.cuantity)
    }, 0);
    resultadoTotal.textContent = resultado;
}



// esta función limpia el html primero y después recorre el array de productos creando un nuevo div por cada producto que querramos agregar
// en el que le muestra sus propiedades y agrega un botón para poder eliminar ese producto posteriormente

function carritoHTML() {

    limpiarHTML()

    articulosDelCarrito.forEach((juego) => {
        const div = document.createElement("div");
        div.classList.add("juego")
        div.innerHTML = `
        <h4>Nombre: ${juego.nombre}</h4>
        <p>Categría: ${juego.categoria}</p>
        <p>Precio: $${juego.precio}</p>
        <p>Cantidad: ${juego.cantidad}</p>
        <button class="delete-game" id="${juego.id}">X</button>
        `
        carrito.appendChild(div)
    })
}

// muestra el carrito, que inicialmente está oculto

function mostrarCarrito() {
    carrito.classList.add("cart-style")
}

function limpiarHTML() {
    carrito.innerHTML = "";
}









