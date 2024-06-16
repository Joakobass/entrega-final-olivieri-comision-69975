import { Router } from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/productManager.js";

const cartsMgr = new CartManager();
const products = new ProductManager();
const router = Router();

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const carts = await cartsMgr.cartsConsult();
    const searchedCart = carts.find(
        (cart) => cart.id === Number(cid),
    );

    if (!searchedCart) {
        return res.status(400).send({ status: "no existe el carrito buscado" });
    }

    res.status(200).send(searchedCart.products);
});

router.post("/", async (req, res) => {
    const productsToAdd = await products.productsConsult();
    if (!productsToAdd || productsToAdd.length === 0) {
        return res.status(400).send({
            status: "error",
            message: "No hay productos que agregar al carrito",
        });
    }
    cartsMgr.addCart(productsToAdd);

    return res
        .status(201)
        .send({ status: "success", message: "Se ha creado un carrito" });
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const carts = await cartsMgr.cartsConsult();
    const searchedCart = carts.find(
        (cart) => cart.id === Number(cid),
    );

    if (!searchedCart) {
        return res.status(400).send({ status: "no existe el carrito buscado" });
    }

    const searchedProduct = searchedCart.products.find(
        (product) => product.id === Number(pid),
    );
    if (!searchedProduct) {
        searchedCart.products.push({ id: Number(pid), quantity: 1 });
        cartsMgr.updateCart(searchedCart);
        return res.status(200).send({
            status: "success",
            message: "se ha agregado un producto al carrito buscado",
        });
    } else {
        searchedProduct.quantity++;
        cartsMgr.updateCart(searchedCart);
        return res
            .status(201)
            .send({
                status: "success",
                message: "Se ha actualizado un carrito",
            });
    }
});

export default router;