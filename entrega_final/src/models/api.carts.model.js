import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const productSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number },
}, { versionKey: false });

const cartSchema = new Schema({
    products: [productSchema],
}, { versionKey: false });

cartSchema.pre(/^find/, function(next){
    this.populate("products");
    next();
});

const CartModel = model(cartsCollection, cartSchema);

export default CartModel;