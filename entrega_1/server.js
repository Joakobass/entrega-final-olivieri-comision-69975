import express from 'express';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const server = express();
const PORT = 8080;
const HOST = 'localhost';

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use('/api/products', productsRouter);
server.use('/api/carts', cartsRouter);

server.use('*', (req, res) => {
	return res.status(404).send({ error: 'Recurso no encontardo' });
});

server.listen(PORT, () => {
	console.log(`Servidor en http://${HOST}:${PORT}`);
});
