const db = require('../models');
const { Op } = require('sequelize');

async function updateBodyScrubs() {
    try {
        // Target IDs provided by user
        const targetIds = [
            12, 19, 20, 69, 87,
            520, 521, 522, 523, 524,
            525, 526, 527, 528, 529, 530
        ];

        console.log(`Processing update for ${targetIds.length} Body Scrubs...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'BODY SCRUB',
                price: 6000,
                category: 'Beauty',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_BODY_SCRUBS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateBodyScrubs();
