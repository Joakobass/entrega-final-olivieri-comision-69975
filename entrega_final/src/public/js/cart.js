const checkoutBtn = document.querySelector(".checkout-btn");

checkoutBtn.addEventListener("click", () => {
    localStorage.clear();

    Swal.fire({
        title: "Gracias por tu compra!",
        text: "Hace click para volver a los productos",
        icon: "success",
    })
        .then((result) => {
            if(result.isConfirmed){
                window.location.href = "http://localhost:8080/products";
            }
        });
});