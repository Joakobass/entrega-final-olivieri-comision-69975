const addBtns = document.querySelectorAll(".add-btn");
const cartBtn = document.querySelector("#go-cart-btn");

//Logica para ir al carrito en uso
cartBtn.addEventListener("click", (event) => {
    const cartId = localStorage.getItem("cartId");
    if(!cartId){
        return Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            title: "No hay carrito con productos",
            icon: "error",
        });
    }
    event.target.href = `http://localhost:8080/cart/${cartId}`;
});

//Logica para  agregar el producto al carrito desde el boton "Agregar al carrito"
addBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
        const idProduct = event.target.getAttribute("data-id");
        const cartId = localStorage.getItem("cartId");
        if(!cartId){
            fetch("/api/carts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then(async (cart) => {
                    const idCart = cart.payload._id;
                    localStorage.setItem("cartId", idCart);

                    fetch(`/api/carts/${idCart}/product/${idProduct}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",

                        },
                    })
                        .then((response) => response.json())
                        .then(() => {

                            Swal.fire({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                title: "Se ha agregado el producto al carrito",
                                icon: "success",
                            });
                        });
                });
        } else {

            fetch(`/api/carts/${cartId}/product/${idProduct}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
            })
                .then((response) => response.json())
                .then(() => {

                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        title: "Se ha agregado el producto al carrito",
                        icon: "success",
                    });
                });
        }

    });
});