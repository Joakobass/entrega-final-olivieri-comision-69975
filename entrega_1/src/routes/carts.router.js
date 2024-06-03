import { Router } from 'express';
import CartManager from '../utils/cartManager.js';
import ProductManager from '../utils/productManager.js';

const carros = new CartManager();
const productos = new ProductManager();
const router = Router();


router.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	const carritos = await carros.consultarCarritos();
	const carritoBuscado = carritos.find(
		(carrito) => carrito.id === Number(cid)
	);

	if (!carritoBuscado) {
		return res.status(400).send({ status: 'no existe el carrito buscado' });
	}

	res.status(200).send(carritoBuscado.products);
});

router.post('/', async (req, res) => {
	const productosAAgregar = await productos.consultarProductos();
	if (!productosAAgregar || productosAAgregar.length === 0) {
		return res.status(400).send({
			status: 'error',
			message: 'No hay productos que agregar al carrito',
		});
	}
	carros.agregarCarrito(productosAAgregar);

	return res
		.status(201)
		.send({ status: 'success', message: 'Se ha creado un carrito' });
});

router.post('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const carritos = await carros.consultarCarritos();
	const carritoBuscado = carritos.find(
		(carrito) => carrito.id === Number(cid)
	);

	if (!carritoBuscado) {
		return res.status(400).send({ status: 'no existe el carrito buscado' });
	}

	const productoBuscado = carritoBuscado.products.find(
		(producto) => producto.id === Number(pid)
	);
	if (!productoBuscado) {
		carritoBuscado.products.push({ id: Number(pid), quantity: 1 });
		carros.actualizarCarrito(carritoBuscado);
		return res.status(200).send({
			status: 'success',
			message: 'se ha agregado un producto al carrito buscado',
		});
	} else {
		productoBuscado.quantity++;
		carros.actualizarCarrito(carritoBuscado);
		return res
			.status(201)
			.send({
				status: 'success',
				message: 'Se ha actualizado un carrito',
			});
	}
});

export default router;
