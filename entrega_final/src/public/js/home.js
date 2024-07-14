const addBtns = document.querySelectorAll(".add-btn");

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
                    console.log(idCart);
                    fetch(`/api/carts/${idCart}/product/${idProduct}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("success: ", data);
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
                .then((data) => {
                    console.log("success: ", data);
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