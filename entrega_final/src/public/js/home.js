const socket = io();

const createProductCard = (product) => {
    return `<div class="product-card">
                <img src=${product.thumbnail} alt="Producto">
                <div class="info">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <p>Categoria: ${product.category}</p>
                    <p>En stock: ${product.stock} u.</p>
                    <div class="price">$ ${product.price}</div>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            </div>`;
};

const productContainer = document.querySelector(".product-container");

socket.on("connect", () => {
    console.log("Conectado al server");
});

socket.on("products-list", (data) => {
    const productsList = data.products.docs ?? [];

    productContainer.innerHTML = "";

    // Carga de productos
    productsList.forEach( (product) => {
        productContainer.innerHTML += createProductCard(product);
    });

    // Se agrega a cada boton Eliminar el evento de click para borrar productos
    const deleteBtns = document.querySelectorAll(".delete-btn");

    deleteBtns.forEach((button) => {
        button.addEventListener("click", (event) => {

            const productId = event.target.getAttribute("data-id");

            socket.emit("product-delete", { productId });

        });
    });

});