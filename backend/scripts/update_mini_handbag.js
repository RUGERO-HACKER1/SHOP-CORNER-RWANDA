const db = require('../models');
const { Op } = require('sequelize');

async function updateMiniHandbags() {
    try {
        // Target IDs provided by user
        const targetIds = [
            16, 25, 43, 47, 48, 65, 73, 77, 84, 96,
            98, 99, 101, 103, 104, 109, 14, 92, 62, 75,
            80, 248, 232, 450, 451, 452, 453, 454, 455,
            456, 457, 458, 459, 460, 264, 461, 462, 463,
            464, 465, 466, 467, 468, 469, 470, 471, 472,
            473, 474, 475, 476, 477, 478, 479, 480, 481,
            482, 483, 484, 485, 486, 487, 488, 489, 490
        ];

        console.log(`Processing update for ${targetIds.length} Mini Handbags...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'MINI HANDBAG / MINI PURSE',
                price: 22000,
                category: 'Fashion',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_MINI_HANDBAGS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateMiniHandbags();
