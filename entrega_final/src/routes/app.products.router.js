import { Router } from "express";

import ProductManager from "../controllers/productManager.js";

const router = Router();
const productsMgr = new ProductManager();

router.get("/products", async (req, res)=>{

    const products = await productsMgr.getAllProductsWithFilters(req.query);
    const sort = req.query.sort;
    const limit = req.query.limit;

    res.render("products", { title: "Productos", products, sort, limit });
});

router.get("/realtimeproducts", async (req, res)=>{

    res.render("realTimeProducts", { title: "Productos con Websocket" });
});

export default router;