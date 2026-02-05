const db = require('../models');
const { Op } = require('sequelize');

async function updateCoffeeCups() {
    try {
        // Target IDs provided by user
        const targetIds = [344, 347, 348, 349, 350, 352, 64, 29, 345, 3];

        console.log(`Processing update for ${targetIds.length} Coffee Cups...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'COFFEE CUP',
                price: 18000,
                category: 'Kitchen',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_COFFEE_CUPS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateCoffeeCups();
