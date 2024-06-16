import { Router } from "express";

import ProductManager from "../controllers/productManager.js";

const router = Router();
const productsMgr = new ProductManager();

router.get("/home", async (req, res)=>{

    const products = await productsMgr.productsConsult();

    res.render("home", { title: "Productos", products });
});

router.get("/realtimeproducts", (req, res)=>{

    res.render("realTimeProducts", { title: "Productos con Websocket" });
});

export default router;