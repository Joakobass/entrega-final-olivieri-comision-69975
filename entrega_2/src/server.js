import express from "express";
import handlebars from "./config/handlebars.config.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import paths from "./utils/paths.js";
import viewsRouter from "./routes/views.router.js";
import serverSocket from "./config/socket.config.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Ruta estática
server.use(express.static(paths.public));

// Enrutadores
server.use("/", viewsRouter);
server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

// Configuración Handlebars
handlebars.config(server);

// Rutas inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>");
});

// Errores internos
server.use((error, req, res) => {
    return res.status(500).send("<h1>Error 500</h1><h3>Se ha generado un error en el servidor</h3>");
});

// Oyente de peticiones
const serverHTTP = server.listen(PORT, () => {
    console.log(`Servidor en http://${HOST}:${PORT}`) ;
});

// Configuracion websocket
serverSocket.config(serverHTTP);