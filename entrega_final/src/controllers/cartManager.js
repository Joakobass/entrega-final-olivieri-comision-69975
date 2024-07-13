import CartModel from "../models/api.carts.model.js";
import ProductManager from "./productManager.js";
import mongoDB from "../config/mongoose.config.js";

//import FileSystem from "../utils/fileSystem.js";

const productMgr = new ProductManager();

class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    getAllCarts = async () => {
        try {
            const carts = await this.#cartModel.find();
            return carts;
        } catch (error) {
            throw new Error("Hubo un problema con el servidor");
        }
    };

    getCartById = async (id) => {

        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error("El ID no es valido");
            }

            const cartFound = await this.#cartModel.findById(id);

            if (!cartFound) {
                throw new Error("No se encuentra el carrito");
            }

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    createCart = async () => {

        try {
            const cart = new CartModel({ products: [] });
            await cart.save();
            console.log(cart);
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }

    };

    addProductToCart = async (idCart, idProduct) => {
        try {
            if (!mongoDB.isValidID(idCart) || !mongoDB.isValidID(idProduct)) {
                throw new Error("El ID no es valido");
            }

            const cartFound = await this.#cartModel.findById(idCart);
            const productFound = await productMgr.getOneProductById(idProduct);

            if(!cartFound){
                throw new Error("No se encuentra el carrito");
            }
            if(!productFound){
                throw new Error("No se encuentra el producto");
            }

            const productInCart = cartFound.products.find( (product) => product._id.toString() === idProduct.toString());

            console.log("productInCart:", productInCart);
            if(productFound){
                productInCart.quantity++;
            } else {

                cartFound.products.push({ _id: idProduct, quantity: 1 });
            }

            cartFound.save();

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // #getCarts = async () => {

    //     const cartsJSON = await this.#FileSystem.read();

    //     return cartsJSON;
    // };

    // #createCart = async (newCart) => {
    //     const carts = await this.#getCarts();

    //     carts.push(newCart);

    //     this.#FileSystem.write(carts);

    // };

    // #generateID = async () => {
    //     const carts = await this.cartsConsult();
    //     let idMajor = 0;

    //     carts.forEach((cart) => {
    //         if (cart.id > idMajor) {
    //             idMajor = cart.id;
    //         }
    //     });

    //     return idMajor + 1;
    // };

    // addCart = async (products) => {

    //     const addedProducts = products.map((product) => [{ id: product.id, quantity: 1 }]);

    //     const cart = {
    //         id: await this.#generateID(),
    //         products: addedProducts.flat(),
    //     };

    //     await this.#createCart(cart);
    // };

    // updateCart = async (updatedCart) => {
    //     const carts = await this.#getCarts();
    //     const index = carts.findIndex(
    //         (cart) => cart.id === updatedCart.id,
    //     );

    //     carts[index] = updatedCart;

    //     this.#FileSystem.write(carts);

    // };

    // cartsConsult = async () => {
    //     const carts = await this.#getCarts();

    //     return carts;
    // };
}

export default CartManager;