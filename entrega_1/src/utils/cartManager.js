import fs from "fs";
import path from "path";

class CartManager {
    #rutaArchivoCartsJSON;

    constructor() {
        this.#rutaArchivoCartsJSON = path.join("src/files", "carts.json");
    }

    #obtenerCarritos = async () => {
        if (!fs.existsSync(this.#rutaArchivoCartsJSON)) {
            await fs.promises.writeFile(this.#rutaArchivoCartsJSON, "[]");
        }

        const carritosJSON = await fs.promises.readFile(
            this.#rutaArchivoCartsJSON,
            "utf8",
        );

        return JSON.parse(carritosJSON);
    };

    #crearCarrito = async (carritoNuevo) => {
        const carritos = await this.#obtenerCarritos();

        carritos.push(carritoNuevo);

        const carritosActualizadosJSON = JSON.stringify(carritos, null, "\t");
        await fs.promises.writeFile(
            this.#rutaArchivoCartsJSON,
            carritosActualizadosJSON,
        );
    };

    #generarId = async () => {
        const carritos = await this.consultarCarritos();
        let idMayor = 0;

        carritos.forEach((carrito) => {
            if (carrito.id > idMayor) {
                idMayor = carrito.id;
            }
        });

        return idMayor + 1;
    };

    agregarCarrito = async (productos) => {

        const productosAgregados = productos.map((producto) => [{ id: producto.id, quantity: 1 }]);

        const carrito = {
            id: await this.#generarId(),
            products: productosAgregados.flat(),
        };

        await this.#crearCarrito(carrito);
    };

    actualizarCarrito = async (carritoActualizado) => {
        const carritos = await this.#obtenerCarritos();
        const indice = carritos.findIndex(
            (carrito) => carrito.id === carritoActualizado.id,
        );

        carritos[indice] = carritoActualizado;

        const carritosActualizadosJSON = JSON.stringify(carritos, null, "\t");
        await fs.promises.writeFile(
            this.#rutaArchivoCartsJSON,
            carritosActualizadosJSON,
        );
    };

    consultarCarritos = async () => {
        const carritos = await this.#obtenerCarritos();

        return carritos;
    };
}

export default CartManager;