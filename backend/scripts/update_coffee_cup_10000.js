const db = require('../models');
const { Op } = require('sequelize');

async function updateCoffeeCups10000() {
    try {
        // Target IDs provided by user
        const targetIds = [
            22, 50, 107, 111, 94,
            386, 387, 388, 389, 390, 391, 392, 394, 395, 396, 398,
            161
        ];

        console.log(`Processing update for ${targetIds.length} Coffee Cups (10000 RWF)...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'COFFEE CUP',
                price: 10000,
                category: 'Kitchen',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_COFFEE_CUPS_10000");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateCoffeeCups10000();
