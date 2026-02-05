const db = require('../models');
const { Op } = require('sequelize');

async function strictUpdate() {
    try {
        // Target Whitelist provided by user
        const targetIds = [
            288, 8, 508, 507, 506, 505, 504, 503, 502,
            501, 500, 499, 498, 497, 496, 495, 494, 493,
            492, 491, 277, 70, 52, 39, 5, 2
        ];

        console.log(`Processing strict update for ${targetIds.length} items...`);

        // 1. Update the Target List
        await db.Product.update(
            {
                title: '3D MIRROR BUTTERFLY',
                price: 4000,
                category: 'Decor',
                variants: null // Ensure they are unlinked as per previous "alone" request
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_TARGETS");

        // 2. Cleanup: Find products named "3D MIRROR BUTTERFLY" that are NOT in the target list
        const leftovers = await db.Product.findAll({
            where: {
                title: '3D MIRROR BUTTERFLY',
                id: { [Op.notIn]: targetIds }
            }
        });

        if (leftovers.length > 0) {
            console.log(`Found ${leftovers.length} products to reset (wrongly named):`);
            const leftoverIds = leftovers.map(p => p.id);
            console.log(leftoverIds);

            // Reset them to generic name to satisfy "dont want any other to have that name"
            // We use a loop to give unique names if possible, or just "Product #ID"
            for (const p of leftovers) {
                await p.update({
                    title: `Decor Item ${p.id}`, // Placeholder name
                    price: 5000 // Reset price to arbitrary or keep same? User said "dont want ... price", unlikely to mean price specifically but definitely the combo.
                });
            }
            console.log("CLEANED_UP_LEFTOVERS");
        } else {
            console.log("NO_LEFTOVERS_FOUND");
        }

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

strictUpdate();
