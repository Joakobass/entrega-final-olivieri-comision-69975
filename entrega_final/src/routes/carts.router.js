import { Router } from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/productManager.js";

const cartsMgr = new CartManager();
const products = new ProductManager();
const router = Router();

router.get("/:cid", async (req, res) => {

    try {
        const { cid } = req.params;
        const cart = await cartsMgr.getCartById(cid);
        res.status(200).json({ status: true, payload: cart });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

router.post("/", async (req, res) => {

    try {
        const cart = cartsMgr.createCart();
        res.status(201).json({ status: true, payload: cart });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const cart = await cartsMgr.addProductToCart(cid, pid);
    res.status(200).json({ status: true, payload: cart });

    // if (!searchedCart) {
    //     return res.status(404).send({ status: "no existe el carrito buscado" });
    // }

    // const searchedProduct = searchedCart.products.find(
    //     (product) => product.id === Number(pid),
    // );
    // if (!searchedProduct) {
    //     searchedCart.products.push({ id: Number(pid), quantity: 1 });
    //     cartsMgr.updateCart(searchedCart);
    //     return res.status(200).send({
    //         status: "success",
    //         message: "se ha agregado un producto al carrito buscado",
    //     });
    // } else {
    //     searchedProduct.quantity++;
    //     cartsMgr.updateCart(searchedCart);
    //     return res
    //         .status(201)
    //         .send({
    //             status: "success",
    //             message: "Se ha actualizado un carrito",
    //         });
    // }
});

export default router;