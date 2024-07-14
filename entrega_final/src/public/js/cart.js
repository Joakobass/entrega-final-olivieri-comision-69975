const checkoutBtn = document.querySelector(".checkout-btn");

checkoutBtn.addEventListener("click", () => {
    localStorage.clear();

    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success",
    })
        .then((result) => {
            if(result.isConfirmed){
                window.location.href = "http://localhost:8080/products";
            }
        });
});