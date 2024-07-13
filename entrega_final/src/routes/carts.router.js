import { Router } from "express";
import CartManager from "../controllers/cartManager.js";
//import ProductManager from "../controllers/productManager.js";

const cartsMgr = new CartManager();
//const products = new ProductManager();
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

router.get("/", async (req, res) => {
    try {
        const carts = await cartsMgr.getAllCarts();
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });

    }
});

router.post("/", async (req, res) => {

    try {
        const cart = cartsMgr.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsMgr.addProductToCart(cid, pid);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartsMgr.deleteProductFromCart(cid, pid);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

export default router;