const db = require('../models');
const { Op } = require('sequelize');

async function updateHairBands() {
    try {
        // Target IDs provided by user
        const targetIds = [
            28, 72, 192,
            414, 415, 416, 417, 418,
            419, 420, 421, 422, 423
        ];

        console.log(`Processing update for ${targetIds.length} Hair Bands...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'HAIR BAND',
                price: 5000,
                category: 'Accessories',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_HAIR_BANDS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateHairBands();
