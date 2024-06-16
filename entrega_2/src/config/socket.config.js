import ProductManager from "../controllers/productManager.js";
import { Server } from "socket.io";

let serverIO = null;

const config = (serverHTTP) => {

    const productMgr = new ProductManager();

    serverIO = new Server(serverHTTP);

    console.log("Servidor conectado");

    serverIO.on("connection", async (socket) => {

        console.log("Se conecto el cliente " + socket.id);

        const products = await productMgr.productsConsult();

        serverIO.emit("products-list", { products });

        socket.on("product-delete", (data) => {
            const searchedProduct = products.find((product) => Number(product.id) === Number(data.productId));

            if(searchedProduct){
                productMgr.deleteProduct(searchedProduct);
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente");
        });
    });
};

const updateProductsList = (products) => {

    if(serverIO){

        serverIO.emit("products-list", { products });

    }
};

export default { config, updateProductsList };