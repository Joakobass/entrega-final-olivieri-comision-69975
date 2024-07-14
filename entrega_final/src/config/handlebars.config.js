import handlebars from "express-handlebars";
import paths from "../utils/paths.js";

const config = (server) => {

    const hbs = handlebars.create({
        helpers: {
            getProp: (obj, prop) => {
                const props = prop.split(".");
                return props.reduce((acc, curr) => acc && acc[curr], obj);
            },
            multiply: (a, b) => a * b,
            getTotal: (cart) => {
                let total = 0;
                cart.forEach((item) => {
                    const price = item.product.price;
                    const quantity = item.quantity;
                    total += price * quantity;
                });
                return total;
            },
        },
    });

    server.engine("handlebars", hbs.engine);
    server.set("views", paths.views);
    server.set("view engine", "handlebars");
};

export default {
    config,
};