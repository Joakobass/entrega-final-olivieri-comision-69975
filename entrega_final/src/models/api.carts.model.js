import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, require: true } }],
}, { versionKey: false });

cartSchema.pre(/^find/, function(next){

    this.populate("products.product");
    next();
});

const CartModel = model(cartsCollection, cartSchema);

export default CartModel;