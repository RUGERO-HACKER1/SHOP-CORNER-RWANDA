const db = require('../models');

async function updateAndCheck() {
    try {
        // Update #2
        await db.Product.update(
            { title: '3D MIRROR BUTTERFLY', price: 4000, category: 'Decor' },
            { where: { id: 2 } }
        );
        console.log("UPDATED_ID_2");

        // Check 3, 4, 5, 6
        const neighbors = await db.Product.findAll({
            where: { id: [3, 4, 5, 6, 7, 8, 9, 10] },
            attributes: ['id', 'title', 'price']
        });

        neighbors.forEach(p => console.log(`NEIGHBOR_${p.id}: ${p.title} (${p.price})`));

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

updateAndCheck();
