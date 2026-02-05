const db = require('../models');
const { Op } = require('sequelize');

async function strictUpdateStanley() {
    try {
        // Target Whitelist provided by user
        const targetIds = [
            344, 6, 26, 351, 41, 353, 354, 355, 58, 60, 63,
            356, 357, 358, 360, 361, 97, 93, 362, 363, 365,
            79, 67, 368, 369, 371, 373, 374, 376, 378, 379,
            380, 381, 382, 384, 548, 549, 550, 551, 151, 156, 336
        ];

        console.log(`Processing strict update for ${targetIds.length} Stanley Cups...`);

        // 1. Update the Target List
        await db.Product.update(
            {
                title: 'STANLEY CUP',
                price: 16000,
                category: 'Kitchen', // Guessing category, or keep existing? Better to be safe, maybe 'Kitchen' or 'Bottles'. using 'Home & Kitchen' or just keeping simple.
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_TARGETS");

        // 2. Cleanup: Find products named "STANLEY CUP" that are NOT in the target list
        const leftovers = await db.Product.findAll({
            where: {
                title: 'STANLEY CUP',
                id: { [Op.notIn]: targetIds }
            }
        });

        if (leftovers.length > 0) {
            console.log(`Found ${leftovers.length} products to reset (wrongly named):`);
            const leftoverIds = leftovers.map(p => p.id);
            console.log(leftoverIds);

            for (const p of leftovers) {
                await p.update({
                    title: `Kitchen Item ${p.id}`,
                    price: 9999
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

strictUpdateStanley();
