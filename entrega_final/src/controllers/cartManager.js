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

            const productInCart = cartFound.products.find( (product) => product.product.toString() === idProduct.toString());

            if(productInCart){
                productInCart.quantity++;
            } else {

                cartFound.products.push({ product: idProduct, quantity: 1 });
            }

            cartFound.save();

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteProductFromCart = async (idCart, idProduct) => {
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

            const index = cartFound.products.findIndex( (product) => product._id.toString() === idProduct.toString());
            const productInCart = cartFound.products.find( (product) => product._id.toString() === idProduct.toString());

            if(productInCart.quantity > 1){
                productInCart.quantity--;
            } else {
                cartFound.products.splice(index, 1);
            }

            cartFound.save();
            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateCart = async (idCart, updatedProducts) => {

        try {

            const updatedCart = await this.#cartModel.findByIdAndUpdate(idCart, updatedProducts, { new: true });

            if(!updatedCart){
                throw new Error("no existe el carrito buscado");
            }

            return updatedCart;

        } catch (error) {
            throw new Error(error.message);
        }
    };
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