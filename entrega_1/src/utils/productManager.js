import fs from "fs";
// import path from "path";
import FileSystem from "../utils/fileSystem.js";

class ProductManager {
    #filename;
    #FileSystem;

    constructor() {
        this.#filename = "products.json";
        this.#FileSystem = new FileSystem(this.#filename);
    }

    #getProducts = async () => {
        if (!fs.existsSync(this.#filename)) {
            await this.#FileSystem.write([]);
        }

        const productsJSON = this.#FileSystem.read();

        return productsJSON;
    };

    #createProduct = async (newProduct) => {
        const products = await this.#getProducts();

        products.push(newProduct);

        this.#FileSystem.write(products);

    };

    #generateID = async () => {
        const products = await this.productsConsult();
        let idMajor = 0;

        products.forEach((product) => {
            if (product.id > idMajor) {
                idMajor = product.id;
            }
        });

        return idMajor + 1;
    };

    addProduct = async (
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
    ) => {
        const product = {
            id: await this.#generateID(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail: [thumbnail].flat(),
        };
        await this.#createProduct(product);
    };

    updateProduct = async (updatedProduct) => {
        const products = await this.#getProducts();
        const index = products.findIndex(
            (product) => product.id === updatedProduct.id,
        );

        products[index] = updatedProduct;

        this.#FileSystem().write(products);
    };

    deleteProduct = async (deletedProduct) => {
        const products = await this.#getProducts();
        const index = products.findIndex(
            (product) => product.id === deletedProduct.id,
        );

        products.splice(index, 1);

        this.#FileSystem.write(products);

    };

    productsConsult = async () => {
        const products = await this.#getProducts();

        return products;
    };
}

export default ProductManager;