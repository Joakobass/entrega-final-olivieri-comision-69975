const addBtns = document.querySelectorAll(".add-btn");

//Logica para  agregar el producto al carrito desde el boton
addBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        const idProduct = event.target.getAttribute("data-id");
        console.log(idProduct);

        fetch("/api/carts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then(async (cart) => {
                const idCart = cart.payload._id;
                console.log(idCart);
                fetch(`/api/carts/${idCart}/product/${idProduct}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => console.log("success: ", data));
            });

    });
});