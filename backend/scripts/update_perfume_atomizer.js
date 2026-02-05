const db = require('../models');
const { Op } = require('sequelize');

async function updatePerfumeAtomizers() {
    try {
        // Target IDs provided by user (parsed from string)
        const targetIds = [
            32, 45, 46, 61, 81, 90, 113, 106, 36, 66, 124,
            438, 441, 439, 440, 442, 443, 444, 445, 446,
            447, 448, 449
        ];
        // Note: 441 was listed twice, Set will handle unique if desired but array duplicates in 'where in' are fine.

        console.log(`Processing update for ${targetIds.length} Perfume Atomizers...`);

        // Update the Target List
        await db.Product.update(
            {
                title: 'PERFUME ATOMIZER',
                price: 5000,
                category: 'Beauty',
                variants: null
            },
            { where: { id: targetIds } }
        );
        console.log("UPDATED_PERFUME_ATOMIZERS");

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updatePerfumeAtomizers();
