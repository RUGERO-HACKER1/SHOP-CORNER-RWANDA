const db = require('../models');
const { Op } = require('sequelize');

async function updateMiniFans() {
    try {
        // Target IDs provided by user
        const targetIds = [11, 27, 424, 425, 426, 427, 428, 429, 430];

        console.log(`Processing update for ${targetIds.length} Mini Fans...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'MINI FAN',
                price: 5000,
                category: 'Electronics', // or 'Home', assuming electronics for fan
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_MINI_FANS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateMiniFans();
