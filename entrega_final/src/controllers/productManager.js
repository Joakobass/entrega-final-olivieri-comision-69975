import ProductModel from "../models/api.products.model.js";
//import FileSystem from "../utils/fileSystem.js";
import serverIO from "../config/socket.config.js";
import mongoDB from "../config/mongoose.config.js";

class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;

    }

    getAllProductsWithFilters = async (paramFilters) => {

        try {
            const $and = [];

            if (paramFilters?.category) $and.push({ category:  paramFilters.category });
            if (paramFilters?.status) $and.push({ status:  paramFilters.status });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { price: 1 },
                desc: { price: -1 },
            };

            const paginationOptions = {
                limit: paramFilters.limit ?? 10,
                page: paramFilters.page ?? 1,
                sort: sort[paramFilters?.sort] ?? {},
                lean: true,
            };

            const productsFound = await this.#productModel.paginate(filters, paginationOptions);
            return productsFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getAllProducts = async () => {
        try {
            const products = await this.#productModel.find();
            return products;
        } catch (error) {
            throw new Error("Hubo un problema con el servidor");
        }
    };

    getOneProductById = async (id) => {

        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error("El ID no es valido");
            }

            const productFound = await this.#productModel.findById(id);

            if (!productFound) {
                throw new Error("No se encuentra el producto");
            }

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    insertOneProduct = async (data) => {

        try {
            const newProduct = new ProductModel(data);

            await newProduct.save();
            serverIO.updateProductsList(await this.getAllProducts());
            return newProduct;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    updateOneProduct = async (id, data) => {

        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error("El ID no es valido");
            }

            const productFound = await this.#productModel.findByIdAndUpdate(id, data);

            if (!productFound) {
                throw new Error("No se encuentra el producto");
            }

            productFound.save();
            serverIO.updateProductsList(await this.getAllProducts());

            return productFound;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    deleteOneProduct = async (id) => {

        try {
            if (!mongoDB.isValidID(id)) {
                throw new Error("El ID no es valido");
            }

            const productFound = await this.#productModel.findById(id);

            if (!productFound) {
                throw new Error("No se encuentra el producto");
            }

            await this.#productModel.findByIdAndDelete(id);

            serverIO.updateProductsList(await this.getAllProducts());

            return productFound;

        } catch (error) {
            throw new Error(error.message);
        }
    };

}

export default ProductManager;