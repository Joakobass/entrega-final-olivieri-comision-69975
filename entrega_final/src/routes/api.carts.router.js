import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const cartsMgr = new CartManager();
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
        const cart = await cartsMgr.createCart();
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

router.delete("/:cid", async (req, res) => {

    try {
        const { cid } = req.params;

        const deletedCart = await cartsMgr.emptyCart(cid);
        res.status(201).json({ status: "success", payload: deletedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products, quantity } = req.body;
        const updatedProducts = { products, quantity };

        const updatedCart = await cartsMgr.updateCart(cid, updatedProducts);

        res.status(201).json({ status: "success", payload: updatedCart });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {

    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const product = await cartsMgr.updateProductQuantity(cid, pid, quantity);
    res.status(200).json({ status: "success", payload: product });
});

export default router;