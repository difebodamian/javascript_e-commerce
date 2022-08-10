/*
Darle la posibilidad al usuario de pagar en cuotas
agregar una opcion de poner en modo oscuro

*/

//  VARIABLES

const carrito = document.querySelector(".tbody");
const listaDeJuegos = document.querySelector(".games");
const vaciarCarritoBtn = document.querySelector(".empty-cart-btn");
const confirmarCompraBtn = document.querySelector(".confirm-buy-btn");
const resultadoTotal = document.querySelector(".resultadoTotal");
const inputNombre = document.querySelector("#nombre");
const inputEmail = document.querySelector("#email");
const inputContraseña = document.querySelector("#password");
const botonForm = document.querySelector(".form_button");
const contenedorFormulario = document.querySelector(".form-container");
const cerrarSesionBtn = document.querySelector(".cerrar-sesion");
const catalogo = document.querySelector(".games");
const cambiarMoneda = document.querySelector(".cambiar-moneda");
const botonPesos = document.querySelector(".pesos");
const botonDolares = document.querySelector(".dolares");
let articulosDelCarrito = [];
let listaDeObjetos = [];
let listaDePreciosPesos = [];
let listaDePreciosDolares = [];
let pesos = true;
let dolares = false;
const selectPesos = document.querySelector(".selectPesos");
const selectDolares = document.querySelector(".selectDolares");
const filtroTerror = document.querySelector("#terror");
const filtros = document.querySelector(".filtros-categoria");
const valor_1 = document.querySelector(".valor-1");
const valor_2 = document.querySelector(".valor-2");
const valor_3 = document.querySelector(".valor-3");
const valor_4 = document.querySelector(".valor-4");
const valor_5 = document.querySelector(".valor-5");
const valor_6 = document.querySelector(".valor-6");
const valor_7 = document.querySelector(".valor-7");
const valor_8 = document.querySelector(".valor-8");



// verificaciones

cargarCatalogo()
verificarEstadoDelCarrito();
verificarSesionIniciada();

// cargar los event listeners

cargarEventListener()
function cargarEventListener() {
    // añadir juego al carrito
    listaDeJuegos.addEventListener("click", añadirJuegoAlCarrito);
    // remover juego del carrito
    carrito.addEventListener("click", eliminarJuegoDelCarrito);
    // modificar la cantidad de juegos
    carrito.addEventListener("click", modificarCantidad);
    // confirmar compra
    confirmarCompraBtn.addEventListener("click", confirmarCompra)
    // vaciarCarrito
    vaciarCarritoBtn.addEventListener("click", vaciarCarritoSweetAlert);
    // enviar formulario
    botonForm.addEventListener("click", formulario)
    // cerrar sesión
    cerrarSesionBtn.addEventListener("click", cerrarSesion);
    // cambiar a dolares
    botonDolares.addEventListener("click", cambiarPreciosADolares);
    // camiar a pesos
    botonPesos.addEventListener("click", cambiarPreciosAPesos);
    // filtros por categorías
    filtros.addEventListener("change", filtrarPorCategoria)
    // filtrar precios en pesos
    selectPesos.addEventListener("change", filtrarPorPreciosPesos);
    // filtrar precios en dólares
    selectDolares.addEventListener("change", filtrarPorPreciosDolares);
}


function filtrarPorCategoria(e) {
    const id = e.target.id;
    const idMinuscula = id.toLowerCase();
    const idSinGuiones = idMinuscula.replace("-", " ");
    const juegosFiltrados = listaDeObjetos.filter((el) => {
        const categoriaLength = el.categoria.length;
        if (categoriaLength > 2) {
            return el.categoria === idSinGuiones
        } else if (categoriaLength <= 2) {
            if (el.categoria[0] === idSinGuiones) {
                return el.categoria[0] === idSinGuiones
            } else if (el.categoria[1] === idSinGuiones) {
                return el.categoria[1] === idSinGuiones
            }
        } 
    })
    listaDeObjetos = juegosFiltrados;
    pintarListaDeObjetos()
}

// función que toma los datos que ingresa el usuario

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

// se agregar en un objeto los datos que ingresó el usuario en el formulario

function usuario(nombre,email,contraseña) {
    const usuario = {
        nombre: nombre,
        email: email,
        contraseña: contraseña
    }
    agregarUsuarioAlLocalStorage(usuario)
}

// se agrega el usuario al local storage

function agregarUsuarioAlLocalStorage(usuario) {
    const usuarioNuevo = JSON.stringify(usuario);
    localStorage.setItem("user", usuarioNuevo);
    ocultarFormulario();
    mostrarBotonDeCerrarSesion();
    toastifyIniciarSesion(usuario);
}

// funciones para manipular la visibilidad del formulario y el botón para cerrar sesión

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

// función que verifica si hay un usuario existente y lo elimina

function cerrarSesion() {
    ocultarBotonCerrarSesion();
    mostrarFormulario();
    const user = localStorage.getItem("user");
    const usuario = JSON.parse(user);
    toastifyCerrarSesion(usuario)
    user & localStorage.removeItem("user");
}

// verifica si hay un usuario registrado en el local storage

function verificarSesionIniciada() {
    const usuarioExistente = localStorage.getItem("user");
    const usuario = JSON.parse(usuarioExistente);
    usuarioExistente & ocultarFormulario();
    usuarioExistente & mostrarBotonDeCerrarSesion();
}

// FUNCIONES 

// esta función, mediante callbacks, agrega un juego al carrito y al local storage

function añadirJuegoAlCarrito(e) {
    e.preventDefault();
    mostrarCarrito()
    
    if (e.target.classList.contains("add-cart")) {
        const id = parseInt(e.target.getAttribute("id"));
        const juegoSeleccionado = listaDeObjetos.find(juego => {
            return juego.id === id
        });
        leerDatosDelJuego(juegoSeleccionado);
        agregarAlLocalStorage(juegoSeleccionado);
        toastifyAgregar(juegoSeleccionado);
    }
}

// esta función elimina un producto del carrito y del local storage, y modifica el precio total

function eliminarJuegoDelCarrito(e) {
    e.preventDefault();
    
    if (e.target.classList.contains("delete-game")) {
        const juegoID = parseInt(e.target.getAttribute("id"));
        const carritoDelLocalStorage = verificarLocalStorage();
        const juegoSeleccionado = carritoDelLocalStorage.find(juego => juegoID === juego.id)
        const arrayNuevo = carritoDelLocalStorage.filter(juego => juego.id !== juegoID);
        const arrayDeLocalStorage = JSON.stringify(arrayNuevo);
        localStorage.setItem("carrito", arrayDeLocalStorage);
        articulosDelCarrito = articulosDelCarrito.filter((juego) => juego.id !== juegoID);
        carritoHTML();
        toastifyEliminar(juegoSeleccionado);
    }
    sumarPrecios()
}

// modifica la cantidad de juegos en el carrito mediante los botones + y -

function modificarCantidad(e) {
    e.preventDefault(); 
    const clase = e.target.classList;
    if (clase.contains("aumentar-cantidad")) {
        const juegoID = parseInt(e.target.getAttribute("id")); 
        const juegoSeleccionado = listaDeObjetos.find(juego => {
            return juego.id === juegoID
        });
        leerDatosDelJuego(juegoSeleccionado);
        agregarAlLocalStorage(juegoSeleccionado);
        toastifyAgregar(juegoSeleccionado)
    } else if (clase.contains("reducir-cantidad")) {
        const juegoID = parseInt(e.target.getAttribute("id"));
        const juego = articulosDelCarrito.find((juego) => juego.id === juegoID);
        const carritoDelLocalStorage = verificarLocalStorage();
        const arrayNuevo = carritoDelLocalStorage.filter(juego => juego.id !== juegoID);
        const arrayDeLocalStorage = JSON.stringify(arrayNuevo);
        localStorage.setItem("carrito", arrayDeLocalStorage);
        toastifyEliminar(juego)
        juego.cantidad--;
        if (juego.cantidad === 0) {
            articulosDelCarrito = articulosDelCarrito.filter((juego) => juego.id !== juegoID);
            carritoHTML();
        }
    }
    actualizarCarrito()
}

// verifica si hay un carrito existente en el local storage, si no hay lo crea y lo setea

function verificarLocalStorage() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito ? console.log("hay productos almacenados en el local storage") : localStorage.setItem("carrito", carrito);
    return carrito
}

// verifica si hay juegos agregados en el carrito del local storage, si hay los muestra

function verificarEstadoDelCarrito() {
    const carrito = verificarLocalStorage();
    mostrarCarrito();
    carrito.forEach(juego => {
        leerDatosDelJuego(juego)
    })
}

// agrega un juego al local storage

function agregarAlLocalStorage(juego) {
    const arrayDelLocalStorage = verificarLocalStorage()
    arrayDelLocalStorage.push(juego);
    const output = JSON.stringify(arrayDelLocalStorage);
    localStorage.setItem("carrito", output);
}


// esta función lee la info del producto, define si existe o no en el carrito
// si existe le modifica la cantidad, si no lo agrega al carrito

function leerDatosDelJuego(juego) {
    const infoDelJuego = {
        img: juego.img,
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

// sumar los precios del carrito y lo muestra en pantalla

function sumarPrecios() {
    const resultado = articulosDelCarrito.reduce((acc,juego) => {
        return acc = acc + (juego.precio * juego.cantidad)
    }, 0);
    resultadoTotal.textContent = "$" + resultado.toFixed(2);
}

// agrega un div por cada juego que se agrega al carrito

function carritoHTML() {
    
    limpiarHTML()
    
    articulosDelCarrito.forEach((juego) => {
        const row = document.createElement("tr");
        row.classList.add("juego")
        row.innerHTML = `
        <td><img src="${juego.img}" width="100px"></td>
        <td>${juego.nombre}</td>
        <td>${juego.categoria}</td>
        <td>$${juego.precio}</td>
        <td>${juego.cantidad}</td>
        <td class="aumentar-cantidad" id="${juego.id}">+</td>
        <td class="reducir-cantidad" id="${juego.id}">-</td>
        <td class="delete-game" id="${juego.id}">Eliminar</td>
        `
        carrito.appendChild(row);
    })
}

// muestra el carrito, que inicialmente está oculto

function mostrarCarrito() {
    carrito.classList.add("cart-style")
}

// vacía el html del carrito

function limpiarHTML() {
    carrito.innerHTML = "";
}

// actualiza el carrito y su precio

function actualizarCarrito() {
    carritoHTML();
    sumarPrecios();
}

// llama a los productos que están en el local storage y los vuelve a setear vacíos, vacía el carrito de html y lo actualiza

function vaciarCarrito() {
    let localStorageArray = JSON.parse(localStorage.getItem("carrito"));
    localStorageArray = [];
    const nuevoLocalStorage = JSON.stringify(localStorageArray);
    localStorage.setItem("carrito", nuevoLocalStorage)
    articulosDelCarrito = [];
    limpiarHTML();
    actualizarCarrito()
}

// LIBRERIAS    

// uso de la librería sweet alert para vaciar el carrito

function confirmarCompra() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Quieres comprar este carrito?',
        text: "Es tu última oportunidad para redimirte!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, quiero comprarlo',
        cancelButtonText: 'No, me arrepentí!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
              'Listo!',
            'Compra realizada',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
          ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu compra ha sido cancelada',
            'error'
          )
        }
      })
      vaciarCarrito()
      
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

function cambiarADolares() {
    Swal.fire('No te recomiendo convertir a dólares, no te deprimas!')
}

// toast para indicar que agregué un juego al carrito

function toastifyAgregar(juego) {
    Toastify({
        text: `Has agregado ${juego.nombre} a tu carrito`,
        duration: 3000,
        destination: "#carrito",
        newWindow: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

// toast para indicar que elimino un juego del carrito

function toastifyEliminar(juego) {
    Toastify({
        text: `Has eliminado ${juego.nombre} de tu carrito`,
        duration: 3000,
        destination: "#carrito",
        newWindow: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

function toastifyIniciarSesion(usuario) {
    Toastify({
        text: `Bienvenido ${usuario.nombre}`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    }

function toastifyCerrarSesion(usuario) {
    Toastify({
        text: `${usuario.nombre} ha cerrado sesión`,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

// USO DEL FETCH

function cargarCatalogo() {
    borrarCatalogo();
    fetch("./js/dataPesos.json")
    .then((res) => res.json())
    .then((data) => {
        data.juegos.forEach((juego) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
                        <img class="img" src="${juego.img}" alt="">
                        <h3 class="title">${juego.nombre}</h3>
                        <span class="category">${juego.categoria}</span>
                        <span class="price precioDelJuego">$${juego.precio}</span>
                        <button class="button add-cart" id="${juego.id}">Add to cart</button>`;
            catalogo.appendChild(div)
        })
        cargarListaDeJuegosPesos();
    })
}
function mostrarBotonPesos() {
    const pesos = cambiarMoneda.firstElementChild;
    pesos.classList.remove("none")
}
function mostrarBotonDolares() {
    const dolares = cambiarMoneda.lastElementChild;
    dolares.classList.remove("none")
}
function ocultarBotonDolares() {
    const dolares = cambiarMoneda.lastElementChild;
    dolares.classList.add("none")
}
function ocultarBotonPesos() {
    const pesos = cambiarMoneda.firstElementChild;
    pesos.classList.add("none")
}

function pintarListaDeObjetos() {
    catalogo.innerHTML = "";
    listaDeObjetos.forEach((juego) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
                    <img class="img" src="${juego.img}" alt="">
                    <h3 class="title">${juego.nombre}</h3>
                    <span class="category">${juego.categoria}</span>
                    <span class="price precioDelJuego">$${juego.precio}</span>
                    <button class="button add-cart" id="${juego.id}">Add to cart</button>`;
        catalogo.appendChild(div)
    })
}

function cambiarPreciosADolares() {
    cambiarADolares();
    ocultarSelectPesos();
    mostrarSelectDolares();
    borrarCatalogo();
    fetch("./js/dataDolares.json")
    .then((res) => res.json())
    .then((data) => {
        data.juegos.forEach((juego) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
                        <img class="img" src="${juego.img}" alt="">
                        <h3 class="title">${juego.nombre}</h3>
                        <span class="category">${juego.categoria}</span>
                        <span class="price precioDelJuego">$${juego.precio}</span>
                        <button class="button add-cart" id="${juego.id}">Add to cart</button>`;
            catalogo.appendChild(div)
        })
        cargarListaDeJuegosDolares()
    })
}

function cambiarPreciosAPesos() {
    ocultarSelectDolares();
    mostrarSelectPesos();
    borrarCatalogo();
    fetch("./js/dataPesos.json")
    .then((res) => res.json())
    .then((data) => {
        data.juegos.forEach((juego) => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
            <img class="img" src="${juego.img}" alt="">
                        <h3 class="title">${juego.nombre}</h3>
                        <span class="category">${juego.categoria}</span>
                        <span class="price precioDelJuego">$${juego.precio}</span>
                        <button class="button add-cart" id="${juego.id}">Add to cart</button>`;
            catalogo.appendChild(div)
        })
        cargarListaDeJuegosPesos()
    })
}

function borrarCatalogo() {
    catalogo.innerHTML = ""
}

function cargarListaDeJuegosDolares() {
    listaDeObjetos = [];
    fetch("./js/dataDolares.json")
    .then((res) => res.json())
    .then((data) => {
        data.juegos.forEach((juego) => listaDeObjetos.push(juego))
    });
    dolares = true;
    pesos = false;
    dolares & mostrarBotonPesos();
    dolares & ocultarBotonDolares();
}

function cargarListaDeJuegosPesos() {
    listaDeObjetos = [];
    fetch("./js/dataPesos.json")
    .then((res) => res.json())
    .then((data) => {
        data.juegos.forEach((juego) => listaDeObjetos.push(juego))
    });
    dolares = false;
    pesos = true;
    pesos & ocultarBotonPesos();
    pesos & mostrarBotonDolares();
}

//  FILTROS

function filtrarPorPreciosPesos(e) {
    const valor = e.target.value;
    if (pesos === true && dolares === false) {
        if (valor === valor_1.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 2000
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_2.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 5000
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_3.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 7000
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_4.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 10000
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        }
        cargarListaDeJuegosPesos();
    } else {console.log("error")}
}

function filtrarPorPreciosDolares(e) {
    const valor = e.target.value;
    if (pesos === false && dolares === true) {
        if (valor === valor_5.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 10
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_6.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 15
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_7.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 20
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        } else if (valor === valor_8.value) {
            const filtro = listaDeObjetos.filter((el) => {
                return el.precio < 30
            })
            listaDeObjetos = filtro;
            borrarCatalogo();
            filtrarElementos();
        }
        cargarListaDeJuegosDolares();
    } else {console.log("error")}
}

function ocultarSelectPesos() {
    selectPesos.classList.add("none");
}
function mostrarSelectPesos() {
    selectPesos.classList.remove("none");
}
function ocultarSelectDolares() {
    selectDolares.classList.add("none");
}
function mostrarSelectDolares() {
    selectDolares.classList.remove("none");
}

function filtrarElementos() {
    listaDeObjetos.forEach((juego) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
                    <img class="img" src="${juego.img}" alt="">
                    <h3 class="title">${juego.nombre}</h3>
                    <span class="category">${juego.categoria}</span>
                    <span class="price precioDelJuego">$${juego.precio}</span>
                    <button class="button add-cart" id="${juego.id}">Add to cart</button>`;
        catalogo.appendChild(div)
    })
}

