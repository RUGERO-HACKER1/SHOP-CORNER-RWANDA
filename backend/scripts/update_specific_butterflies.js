const db = require('../models');

async function updateSpecificList() {
    try {
        // IDs provided by user
        const rawIds = [
            288, 8, 508, 507, 506, 505, 504, 503, 502,
            501, 500, 499, 498, 497, 496, 495, 494, 493,
            492, 491, 277, 70, 52, 39, 5, 2
        ];

        // Dedup and sort
        const ids = [...new Set(rawIds)].sort((a, b) => a - b);

        console.log(`Updating ${ids.length} products...`);
        console.log(`IDs: ${ids.join(', ')}`);

        // Update Title, Price, and Link them all together
        await db.Product.update(
            {
                title: '3D MIRROR BUTTERFLY',
                price: 4000,
                category: 'Decor',
                variants: ids // Link them all as a group
            },
            { where: { id: ids } }
        );

        console.log("UPDATE_SUCCESSFUL");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateSpecificList();
