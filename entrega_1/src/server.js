import express from 'express';
import handlebars from "express-handlebars";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import paths from './utils/paths.js';

const server = express();
const PORT = 8080;
const HOST = 'localhost';

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.engine("handlebars", handlebars.engine());
server.set("views", paths.views);
server.set("view engine", "handlebars");

server.use("/api/public", express.static(paths.public))

server.use('/api/products', productsRouter);
server.use('/api/carts', cartsRouter);

server.use('*', (req, res) => {
	return res.status(404).send({ error: 'Recurso no encontardo' });
});

server.listen(PORT, () => {
	console.log(`Servidor en http://${HOST}:${PORT}`);
});
