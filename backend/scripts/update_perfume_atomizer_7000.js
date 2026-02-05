const db = require('../models');
const { Op } = require('sequelize');

async function updatePerfumeAtomizers7000() {
    try {
        // Target IDs provided by user
        const targetIds = [13, 95, 431, 432, 433, 434, 435, 436, 437, 1];

        console.log(`Processing update for ${targetIds.length} Perfume Atomizers (7000 RWF)...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'PERFUME ATOMIZER',
                price: 7000,
                category: 'Beauty',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_PERFUME_ATOMIZERS_7000");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updatePerfumeAtomizers7000();
