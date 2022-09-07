document.querySelector(".bars__menu").addEventListener("click", animatedBars);

var line1__bars = document.querySelector(".line1__bars-menu");
var line2__bars = document.querySelector(".line2__bars-menu");
var line3__bars = document.querySelector(".line3__bars-menu");
var desplegable = document.querySelector(".menu__desplegable")

var mostrar = true;

function animatedBars(){
    line1__bars.classList.toggle("activeline1__bars-menu");
    line2__bars.classList.toggle("activeline2__bars-menu");
    line3__bars.classList.toggle("activeline3__bars-menu");
    desplegable.classList.toggle("activemenu__desplegable");
}

let productList = [];
let carrito = [];
let total = 0;

function add(productId, price){

    const product = productList.find(p => p.id === id);
    product.stock--;

    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById('checkout').innerHTML = `Pagar $${total}`
    displayProducts();
}

async function pay(){
        const productList = await (await fetch("/api/pay",{
        method: "post",
        body: JSON.stringify(carrito),
        headers: {
            "Content-Type": "application/json"
        }
    })).json();

    // window.alert(products.join(", \n"));
}

//-----

function displayProducts(){
    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})" >Agregar</button>`

        if(p.stock <= 0){
            buttonHTML = `<button disabled class="button-add" onclick="add(${p.id}, ${p.price})" >Sin Stock</button>`
        }

        productsHTML +=
        `<div class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" alt="">
            <h1>${p.price}</h1>
            ${buttonHTML}
        </div>`
    });
    document.getElementById('page-content').innerHTML = productsHTML
}

window.onload = async() => {
    
    productList = await (await fetch("/api/products")).json();
    console.log(productList)
    displayProducts();
}