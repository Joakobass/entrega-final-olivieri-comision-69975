import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const productMgr = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {

    try {
        const data = await productMgr.getAllProductsWithFilters(req.query);

        res.status(200).json({
            status: "succes",
            payload: data.docs,
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: data.hasPrevPage ? `http://localhost:8080/products?page=${data.prevPage}` : null,
            nextLink: data.hasNextPage ? `http://localhost:8080/products?page=${data.nextPage}` : null,

        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }

});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productFound = await productMgr.getOneProductById(pid);
        res.status(200).json({ status: true, payload: productFound });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

router.post("/", async (req, res) => {

    try {
        const newProduct = await productMgr.insertOneProduct(req.body);
        res.status(201).json({ status: true, payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productUpdated = await productMgr.updateOneProduct(pid);
        res.status(201).json({ status: true, payload: productUpdated });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

router.delete("/:pid", async (req, res) => {

    const { pid } = req.params;

    try {
        const productDeleted = await productMgr.deleteOneProduct(pid);
        res.status(200).json({ status: true, payload: productDeleted });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }

});

export default router;