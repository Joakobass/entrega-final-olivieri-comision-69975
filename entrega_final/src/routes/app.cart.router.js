import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const router = Router();
const cartMgr = new CartManager();

router.get("/cart/:cid", async (req, res)=>{
    const { cid } = req.params;

    const cart = await cartMgr.getCartById(cid);

    res.render("cart", { title: "Carrito", cart: cart.products });
});

export default router;