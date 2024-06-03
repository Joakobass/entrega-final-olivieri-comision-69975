import fs from 'fs';
import path from 'path';

class ProductManager {
	#rutaArchivoProductsJSON;

	constructor() {
		this.#rutaArchivoProductsJSON = path.join('src/files', 'products.json');
	}

	#obtenerProductos = async () => {
		if (!fs.existsSync(this.#rutaArchivoProductsJSON)) {
			await fs.promises.writeFile(this.#rutaArchivoProductsJSON, '[]');
		}

		const productosJSON = await fs.promises.readFile(
			this.#rutaArchivoProductsJSON,
			'utf8'
		);

		return JSON.parse(productosJSON);
	};

	#crearProducto = async (productoNuevo) => {
		const productos = await this.#obtenerProductos();

		productos.push(productoNuevo);

		const productosActualizadosJSON = JSON.stringify(productos, null, '\t');
		await fs.promises.writeFile(
			this.#rutaArchivoProductsJSON,
			productosActualizadosJSON
		);
	};

	#generarId = async () => {
		const productos = await this.consultarProductos();
		let idMayor = 0;

		productos.forEach((producto) => {
			if (producto.id > idMayor) {
				idMayor = producto.id;
			}
		});

		return idMayor + 1;
	};

	agregarProducto = async (
		title,
		description,
		code,
		price,
		stock,
		category,
		thumbnail
	) => {
		const product = {
			id: await this.#generarId(),
			title,
			description,
			code,
			price,
			status: true,
			stock,
			category,
			thumbnail: [thumbnail].flat()
		};
		await this.#crearProducto(product);
	};

	actualizarProducto = async (productoActualizado) => {
		const productos = await this.#obtenerProductos();
		const indice = productos.findIndex(
			(producto) => producto.id === productoActualizado.id
		);

		productos[indice] = productoActualizado;

		const productosActualizadosJSON = JSON.stringify(productos, null, '\t');
		await fs.promises.writeFile(
			this.#rutaArchivoProductsJSON,
			productosActualizadosJSON
		);
	};

	borrarProducto = async (productoABorrar) => {
		const productos = await this.#obtenerProductos();
		const indice = productos.findIndex(
			(producto) => producto.id === productoABorrar.id
		);

		productos.splice(indice, 1);

		const productosActualizadosJSON = JSON.stringify(productos, null, '\t');
		await fs.promises.writeFile(
			this.#rutaArchivoProductsJSON,
			productosActualizadosJSON
		);
	};

	consultarProductos = async () => {
		const productos = await this.#obtenerProductos();

		return productos;
	};
}

export default ProductManager;
