import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const productMgr = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    const products = await productMgr.productsConsult();

    if (!products || products.length === 0) {
        return res.status(400).send({
            status: "error",
            message: "no hay productos en la lista",
        });
    }
    if (!limit) {
        return res.status(200).send(products);
    }

    if (isNaN(Number(limit)) || Number(limit) < 0) {
        return res.status(400).send({
            status: "error",
            message: "el limite debe ser un numero positivo",
        });
    }

    const limitedProducts = products.slice(0, limit);

    res.send(limitedProducts);
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await productMgr.productsConsult();
    const searchedProduct = products.find(
        (product) => product.id === Number(pid),
    );

    if (!searchedProduct) {
        return res
            .status(400)
            .send({ status: "no existe el producto buscado" });
    }

    res.status(200).send(searchedProduct);
});

router.post("/", async (req, res) => {

    const { title, description, code, price, stock, category, thumbnail } =
		req.body;

    productMgr.addProduct(title, description, code, price, stock, category, thumbnail);

    res.status(201).redirect("http://localhost:8080/realtimeproducts");
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnail } =
		req.body;
    const products = await productMgr.productsConsult();

    const searchedProduct = products.find(
        (product) => product.id === Number(pid),
    );

    if (!searchedProduct) {
        return res
            .status(400)
            .send({ status: "error", message: "Producto no encontrado" });
    }

    if (
        !title ||
		!description ||
		!code ||
		!price ||
		!stock ||
		!category ||
		!thumbnail
    ) {
        return res
            .status(400)
            .send({ status: "error", message: "Datos incompletos" });
    }

    const updatedProduct = {
        id: Number(pid),
        title,
        description,
        code,
        price,
        status: searchedProduct.status,
        stock,
        category,
        thumbnail,
    };

    productMgr.updateProduct(updatedProduct);

    res.status(200).send({ status: "success", message: "producto modificado" });
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await productMgr.productsConsult();
    const productToDelete = products.find(
        (product) => product.id === Number(pid),
    );

    if (!productToDelete) {
        return res
            .status(400)
            .send({ status: "error", message: "Producto no encontrado" });
    }

    productMgr.deleteProduct(productToDelete);

    res.status(200).send({ status: "success", message: "producto eliminado" });
});

export default router;