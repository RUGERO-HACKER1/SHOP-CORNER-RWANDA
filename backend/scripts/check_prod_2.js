const db = require('../models');

async function checkProduct() {
    try {
        const product = await db.Product.findByPk(2);
        if (product) {
            console.log("PRODUCT_FOUND:");
            console.log(JSON.stringify(product.toJSON(), null, 2));
        } else {
            console.log("PRODUCT_NOT_FOUND");
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

checkProduct();
