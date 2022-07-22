/*
Poder ver el precio final del carrito  
Darle la posibilidad al usuario de pagar en cuotas
Agregar un botón en el nav para cambiar los precios de los games a dólares o pesos
Que se sumen los totales de los precios al carrito
Mostrar el price final del carrito
*/

//Agregar funcionalidad de agregar el precio en pesos

//  VARIABLES

const cart = document.querySelector(".cart");
const emptyCart = document.querySelector(".cancel-buy-btn");
const gamesList = document.querySelector(".games");
const addCartBtn = document.querySelectorAll(".add-cart");
const emptyCartBtn = document.querySelector(".empty-cart-btn");
const confirmBuyBtn = document.querySelector(".confirm-buy-btn");
const result = document.querySelector(".result");
let articlesCart = [];

class Videogame {
    constructor(title, category, price, id) {
        this.title = title;
        this.category = category;
        this.price = price;
        this.id = id;    
    }
}

const arrayGames = [
    new Videogame("Resident Evil Village", "Horror", 4299, 1),
    new Videogame("Gta V", "Action - Open World", 1199, 2), 
    new Videogame("Assasin's Creed Origins", "Action - Open World", 5299, 3), 
    new Videogame("The Sims 4", "Simulation", 3599, 4), 
    new Videogame("Battlefield 2042", "FPS - Action", 111899, 5), 
    new Videogame("Elden Ring", "Open World - Souls Style", 6899, 6), 
    new Videogame("Dying Light 2: Stay Human", "Zombies - Action", 5199, 7), 
    new Videogame("The Quarry", "Drama", 5999, 8) 
]

/*
en esta función se cargan todos los eventListeners
*/

cargarEventListener()
function cargarEventListener() {
    // add to cart
    gamesList.addEventListener("click", addGame)
    // delete from cart
    cart.addEventListener("click", deleteGame)
    // empty cart
    emptyCartBtn.addEventListener("click", () => {
        articlesCart = [];
        cleanHTML()
    })
    confirmBuyBtn.addEventListener("click", gamesPrices)
}

// FUNCIONES 
/*
esta función llama a la función readGameData, que esta agrega un producto al array y al html por consiguiente mediante callbacks
*/
function addGame(e) {
    e.preventDefault();
    showCart()

    if (e.target.classList.contains("add-cart")) {
        const id = parseInt(e.target.getAttribute("id"));
        const found = arrayGames.find(game => {
            return game.id === id
        });
        console.log(found);
        readGameData(found);
    }
}

// esta función elimina un producto del carrito html y del array de productos

function deleteGame(e) {
    e.preventDefault();

    if (e.target.classList.contains("delete-game")) {
        const gameID = e.target.getAttribute("id");

        articlesCart = articlesCart.filter((game) => game.id !== gameID);

        cartHTML();
    }
}

// esta función lee la info del producto, define si existe o no en el carrito
// si existe le modifica la cantidad, si no llama a la función cartHTML

function readGameData(game) {
    const gameInfo = {
        name: game.title,
        category: game.category,
        price: game.price,
        id: game.id,
        cuantity: 1
    }
    const exist = articlesCart.some((game) => game.id === gameInfo.id);
    if (exist) {
        const games = articlesCart.map((game) => {
            if (game.id === gameInfo.id) {
                game.cuantity++;
                return game;
            } else {
                return game;
            }
        })
        articlesCart = [...games];
    } else {
        articlesCart = [...articlesCart, gameInfo]
    }
    cartHTML()
}

// hacer una función que me saque todos los precios de los juegos que tiene el carrito y me cree
// un nuevo array con esos items

function gamesPrices() {
    console.log(articlesCart.reduce((acc,el) => {
        return acc + el.price 
    }, 0))
}


// esta función limpia el html primero y después recorre el array de productos creando un nuevo div por cada producto que querramos agregar
// en el que le muestra sus propiedades y agrega un botón para poder eliminar ese producto posteriormente

function cartHTML() {

    cleanHTML()

    articlesCart.forEach((game) => {
        const div = document.createElement("div");
        div.classList.add("game")
        div.innerHTML = `
        <h4>Nombre: ${game.name}</h4>
        <p>Categría: ${game.category}</p>
        <p>Precio: ${game.price}</p>
        <p>Cantidad: ${game.cuantity}</p>
        <button class="delete-game" id="${game.id}">X</button>
        `
        cart.appendChild(div)
    })
}

// muestra el carrito, que inicialmente está oculto

function showCart() {
    cart.classList.add("cart-style")
}

function cleanHTML() {
    cart.innerHTML = "";
}









