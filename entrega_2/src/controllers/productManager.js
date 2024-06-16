
import FileSystem from "../utils/fileSystem.js";
import serverIO from "../config/socket.config.js";

class ProductManager {
    #filename;
    #FileSystem;

    constructor() {
        this.#filename = "products.json";
        this.#FileSystem = new FileSystem(this.#filename);
    }

    #getProducts = async () => {

        const productsJSON = await this.#FileSystem.read();

        return productsJSON;
    };

    #createProduct = async (newProduct) => {
        const products = await this.#getProducts();

        products.push(newProduct);

        this.#FileSystem.write(products);

        serverIO.updateProductsList(products);

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

    addProduct = async (title, description, code, price, stock, category, thumbnail) => {

        if (!title ||!description ||!code ||!price ||!stock ||!category ||!thumbnail) {
            throw new Error("Datos incompletos");
        }

        const product = {
            id: await this.#generateID(),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnail: thumbnail,
        };

        await this.#createProduct(product);

    };

    updateProduct = async (updatedProduct) => {
        const products = await this.#getProducts();
        const index = products.findIndex(
            (product) => product.id === updatedProduct.id,
        );

        products[index] = updatedProduct;

        this.#FileSystem.write(products);
    };

    deleteProduct = async (deletedProduct) => {
        const products = await this.#getProducts();
        const index = products.findIndex(
            (product) => product.id === deletedProduct.id,
        );

        products.splice(index, 1);

        this.#FileSystem.write(products);
        serverIO.updateProductsList(products);

    };

    productsConsult = async () => {
        const products = await this.#getProducts();

        return products;
    };
}

export default ProductManager;