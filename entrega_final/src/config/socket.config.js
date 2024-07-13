
import ProductManager from "../controllers/productManager.js";
import { Server } from "socket.io";
import url from "url";

let serverIO = null;

const config = (serverHTTP) => {

    const productMgr = new ProductManager();

    serverIO = new Server(serverHTTP);

    console.log("Servidor conectado");

    serverIO.on("connection", async (socket) => {

        console.log("Se conecto el cliente " + socket.id);

        const queryParams = url.parse(socket.handshake.headers.referer, true).query;
        const products = await productMgr.getAllProductsWithFilters(queryParams);

        serverIO.emit("products-list", { products });

        socket.on("product-delete", async (data) => {

            const productFound = await productMgr.getOneProductById(data.productId);

            if(productFound){
                productMgr.deleteOneProduct(data.productId);
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