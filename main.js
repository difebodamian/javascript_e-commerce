/*
Poder ver el precio final del carrito  
Agregar la funcionalidad de poder subir o bajar la cantidad de un producto
Darle la posibilidad al usuario de pagar en cuotas
Agregar un botón en el nav para cambiar los precios de los games a dólares o pesos
Que se sumen los totales de los precios al carrito
Mostrar el price final del carrito
agreagar sweet alert cuando compre el carrito, y cuando quiera vaciarlo (dandole una opción de arrepentirse al usuario)}
toast para mensaje por cada juego que agregue al carrito
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
const resultadoTotal = document.querySelector(".resultadoTotal");
const aumentarCantidadBtn = document.querySelectorAll(".aumentar-cantidad");
const reducirCantidadBtn = document.querySelectorAll(".reducir-cantidad");
const inputNombre = document.querySelector("#nombre");
const inputEmail = document.querySelector("#email");
const inputContraseña = document.querySelector("#password");
const botonForm = document.querySelector(".form_button");
const contenedorFormulario = document.querySelector(".form-container");
const cerrarSesionBtn = document.querySelector(".cerrar-sesion");
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
verificarEstadoDelCarrito();
verificarSesionIniciada();
// cargan todos los eventListeners

cargarEventListener()
function cargarEventListener() {
    // añadir juego al carrito
    listaDeJuegos.addEventListener("click", añadirJuegoAlCarrito);
    // remover juego del carrito
    carrito.addEventListener("click", eliminarJuegoDelCarrito);
    // modificar la cantidad de juegos
    carrito.addEventListener("click", modificarCantidad);
    // vaciarCarrito
    vaciarCarritoBtn.addEventListener("click", vaciarCarritoSweetAlert);
    // enviar formulario
    botonForm.addEventListener("click", formulario)
    // cerrar sesión
    cerrarSesionBtn.addEventListener("click", cerrarSesion)
}

function formulario(e) {
    e.preventDefault();
    const nombre = inputNombre.value;
    nombre === "" && console.log("nombre inválido");
    const email = inputEmail.value;
    email === "" && console.log("email inválido");
    const contraseña = inputContraseña.value;
    contraseña === "" && console.log("contraseña inválido");
    (nombre,email,contraseña) ? usuario(nombre, email, contraseña) : console.log("error");
}

function usuario(nombre,email,contraseña) {
    const usuario = {
        nombre: nombre,
        email: email,
        contraseña: contraseña
    }
    agregarUsuarioAlLocalStorage(usuario)
}

function agregarUsuarioAlLocalStorage(usuario) {
    const usuarioNuevo = JSON.stringify(usuario);
    localStorage.setItem("user", usuarioNuevo);
    console.log(`${usuario.nombre} ha sido ingresado al local storage`);
    ocultarFormulario();
    mostrarBotonDeCerrarSesion();
}

function ocultarFormulario() {
    contenedorFormulario.classList.add("none");
}

function mostrarFormulario() {
    contenedorFormulario.classList.contains("none") & contenedorFormulario.classList.remove("none") 
}

function mostrarBotonDeCerrarSesion() {
    cerrarSesionBtn.classList.contains("none") & cerrarSesionBtn.classList.remove("none");
}

function ocultarBotonCerrarSesion() {
    cerrarSesionBtn.classList.add("none");
}

function cerrarSesion() {
    ocultarBotonCerrarSesion();
    mostrarFormulario();
    const user = localStorage.getItem("user");
    user & localStorage.removeItem("user");
    console.log("sesion cerrada");
}

function verificarSesionIniciada() {
    const usuarioExistente = localStorage.getItem("user");
    usuarioExistente & ocultarFormulario();
    usuarioExistente & mostrarBotonDeCerrarSesion();
}

// function agregarContraseñaAlLocalStorage

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
    sumarPrecios()
}


function modificarCantidad(e) {
    e.preventDefault(); 
    const clase = e.target.classList;
    if (clase.contains("aumentar-cantidad")) {
        const juegoID = parseInt(e.target.getAttribute("id")); 
        const juegoSeleccionado = arrayDeJuegos.find(juego => {
            return juego.id === juegoID
        });
        leerDatosDelJuego(juegoSeleccionado);
        agregarAlLocalStorage(juegoSeleccionado);
    } else if (clase.contains("reducir-cantidad")) {
        const juegoID = parseInt(e.target.getAttribute("id"));
        const juego = articulosDelCarrito.find((juego) => juego.id === juegoID);
        const carritoDelLocalStorage = verificarLocalStorage();
        const arrayNuevo = carritoDelLocalStorage.filter(juego => juego.id !== juegoID);
        const arrayDeLocalStorage = JSON.stringify(arrayNuevo);
        localStorage.setItem("carrito", arrayDeLocalStorage);
        juego.cantidad--;
        if (juego.cantidad === 0) {
            articulosDelCarrito = articulosDelCarrito.filter((juego) => juego.id !== juegoID);
            carritoHTML();
        }
    }
    actualizarCarrito()
}


function verificarLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito ? console.log("hay productos almacenados en el local storage") : localStorage.setItem("carrito", carrito);
    return carrito
}

function verificarEstadoDelCarrito() {
    const carrito = verificarLocalStorage();
    mostrarCarrito();
    carrito.forEach(juego => {
        leerDatosDelJuego(juego)
    })
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
    actualizarCarrito();
}

// hacer una función que me saque todos los precios de los juegos que tiene el carrito y me cree
// un nuevo array con esos items

function sumarPrecios() {
    const resultado = articulosDelCarrito.reduce((acc,juego) => {
        return acc = acc + (juego.precio * juego.cantidad)
    }, 0);
    resultadoTotal.textContent = "$" + resultado;
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
        <button class="aumentar-cantidad" id="${juego.id}">+</button>
        <button class="reducir-cantidad" id="${juego.id}">-</button>
        <button class="delete-game" id="${juego.id}">Eliminar</button>
        `
        carrito.appendChild(div);
    })
}

// muestra el carrito, que inicialmente está oculto

function mostrarCarrito() {
    carrito.classList.add("cart-style")
}

function limpiarHTML() {
    carrito.innerHTML = "";
}
function actualizarCarrito() {
    carritoHTML();
    sumarPrecios();
}

function vaciarCarrito() {
    let localStorageArray = JSON.parse(localStorage.getItem("carrito"));
    localStorageArray = [];
    const nuevoLocalStorage = JSON.stringify(localStorageArray);
    localStorage.setItem("carrito", nuevoLocalStorage)
    articulosDelCarrito = [];
    limpiarHTML();
    actualizarCarrito()
    console.log("Local Storage vacío");
}

function vaciarCarritoSweetAlert() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: "Seguro que quieres eliminar todos los elementos del carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Eliminado',
            'Su carrito ha sido eliminado con éxito',
            'success'
          )
          vaciarCarrito()
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Su carrito está a salvo',
            'error'
          )
        }
      })
}




