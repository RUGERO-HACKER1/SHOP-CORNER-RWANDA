const db = require('../models');
const { Op } = require('sequelize');

async function updateIphoneCovers() {
    try {
        // Target IDs provided by user
        const targetIds = [
            68, 510, 511, 512, 513, 514, 515,
            516, 517, 518, 519, 4, 298, 7
        ];

        console.log(`Processing update for ${targetIds.length} iPhone Covers...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'IPHONE PHONE COVER',
                price: 12000,
                category: 'Electronics', // or 'Accessories'
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_IPHONE_COVERS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateIphoneCovers();
