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

            const productInCart = cartFound.products.find( (product) => product.product._id.toString() === idProduct.toString());

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

            const index = cartFound.products.findIndex( (product) => product.product._id.toString() === idProduct.toString());

            if(index !== -1){

                if(cartFound.products[index].quantity > 1){
                    cartFound.products[index].quantity--;
                } else {
                    cartFound.products.splice(index, 1);
                }
            }

            cartFound.save();
            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateCart = async (idCart, updatedProducts) => {

        try {
            const cartToUpdate = await this.#cartModel.findById(idCart);

            if(!cartToUpdate){
                throw new Error("no existe el carrito buscado");
            }

            cartToUpdate.products = updatedProducts.products;

            cartToUpdate.save();
            return cartToUpdate;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateProductQuantity = async (idCart, idProduct, quantity) =>{
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

            const productInCart = cartFound.products.find( (product) => product.product._id.toString() === productFound._id.toString());

            productInCart.quantity += Number(quantity);

            cartFound.save();

            return cartFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    emptyCart = async (idCart) => {
        try {
            if (!mongoDB.isValidID(idCart)) {
                throw new Error("El ID no es valido");
            }

            const cartFound = await this.#cartModel.findById(idCart);

            cartFound.products = [];

            cartFound.save();

            return cartFound;

        } catch (error) {
            throw new Error(error.message);
        }
    };

}

export default CartManager;