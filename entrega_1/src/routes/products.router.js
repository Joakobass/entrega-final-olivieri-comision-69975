import { Router } from "express";
import ProductManager from "../utils/productManager.js";

const articulos = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    const productos = await articulos.consultarProductos();

    if (!productos || productos.length === 0) {
        return res.status(400).send({
            status: "error",
            message: "no hay productos en la lista",
        });
    }
    if (!limit) {
        return res.status(200).send(productos);
    }

    if (isNaN(Number(limit)) || Number(limit) <= 0) {
        return res.status(400).send({
            status: "error",
            message: "el limite debe ser un numero positivo",
        });
    }

    const productosLimitados = productos.slice(0, limit);

    res.send(productosLimitados);
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productos = await articulos.consultarProductos();
    const productoBuscado = productos.find(
        (producto) => producto.id === Number(pid),
    );

    if (!productoBuscado) {
        return res
            .status(400)
            .send({ status: "no existe el producto buscado" });
    }

    res.status(200).send(productoBuscado);
});

router.post("/", async (req, res) => {

    const { title, description, code, price, stock, category, thumbnail } =
		req.body;

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

    articulos.agregarProducto(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
    );

    return res
        .status(201)
        .send({ status: "success", message: "Se ha agregado un producto" });
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnail } =
		req.body;
    const productos = await articulos.consultarProductos();

    const productoBuscado = productos.find(
        (producto) => producto.id === Number(pid),
    );

    if (!productoBuscado) {
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
    const statusProducto = productoBuscado.status;

    const productoActualizado = {
        id: Number(pid),
        title,
        description,
        code,
        price,
        status: statusProducto,
        stock,
        category,
        thumbnail,
    };

    articulos.actualizarProducto(productoActualizado);

    res.status(200).send({ status: "success", message: "producto modificado" });
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const productos = await articulos.consultarProductos();
    const productoABorrar = productos.find(
        (producto) => producto.id === Number(pid),
    );

    if (!productoABorrar) {
        return res
            .status(400)
            .send({ status: "error", message: "Producto no encontrado" });
    }

    articulos.borrarProducto(productoABorrar);

    res.status(200).send({ status: "success", message: "producto eliminado" });
});

export default router;