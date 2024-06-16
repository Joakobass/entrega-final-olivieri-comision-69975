
import FileSystem from "../utils/fileSystem.js";

class CartManager {
    #filename;
    #FileSystem;

    constructor() {
        this.#filename = "carts.json";
        this.#FileSystem = new FileSystem(this.#filename);
    }

    #getCarts = async () => {

        const cartsJSON = await this.#FileSystem.read();

        return cartsJSON;
    };

    #createCart = async (newCart) => {
        const carts = await this.#getCarts();

        carts.push(newCart);

        this.#FileSystem.write(carts);

    };

    #generateID = async () => {
        const carts = await this.cartsConsult();
        let idMajor = 0;

        carts.forEach((cart) => {
            if (cart.id > idMajor) {
                idMajor = cart.id;
            }
        });

        return idMajor + 1;
    };

    addCart = async (products) => {

        const addedProducts = products.map((product) => [{ id: product.id, quantity: 1 }]);

        const cart = {
            id: await this.#generateID(),
            products: addedProducts.flat(),
        };

        await this.#createCart(cart);
    };

    updateCart = async (updatedCart) => {
        const carts = await this.#getCarts();
        const index = carts.findIndex(
            (cart) => cart.id === updatedCart.id,
        );

        carts[index] = updatedCart;

        this.#FileSystem.write(carts);

    };

    cartsConsult = async () => {
        const carts = await this.#getCarts();

        return carts;
    };
}

export default CartManager;