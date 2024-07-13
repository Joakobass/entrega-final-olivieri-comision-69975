import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
    title: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    code: { type: Number, unique: true, required: true },
    price: { type: Number, min: 10, max: 100000, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, min: 1, required: true },
    thumbnail: { type: String, required: true },
}, { versionKey: false });

productSchema.plugin(paginate);

const ProductModel = model(productCollection, productSchema);

export default ProductModel;