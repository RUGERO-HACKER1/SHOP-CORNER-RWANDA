const db = require('../models');
const { Op } = require('sequelize');

async function updateMiniBlenders() {
    try {
        // Target IDs provided by user
        const targetIds = [
            18, 38, 57, 78, 181, 112, 175,
            399, 400, 401, 402, 403, 404, 405,
            406, 407, 408, 409, 410, 411, 412
        ];

        console.log(`Processing update for ${targetIds.length} Mini Blenders...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'MINI BLENDER',
                price: 20000,
                category: 'Kitchen',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_MINI_BLENDERS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateMiniBlenders();
