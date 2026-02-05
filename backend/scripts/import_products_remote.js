const db = require('../models');
const fs = require('fs');
const path = require('path');

async function importProducts() {
    try {
        const backupPath = path.join(__dirname, '../products_backup.json');
        if (!fs.existsSync(backupPath)) {
            console.error('Backup file not found:', backupPath);
            return;
        }

        const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`Found ${data.length} products to import. Wiping existing products for clean sync...`);

        // NUKE OPTION: Clear table to ensure exact match
        try {
            await db.Product.destroy({ where: {}, truncate: false }); // truncate:true sometimes fails with FKs, delete with where {} is safer sometimes or cascade
            // If FK issues, we might need to disable constraints or just acknowledge it.
            // However, if we want to KEEP correct count, destruction is best.
            console.log("Old products cleared.");
        } catch (err) {
            console.error("Could not clear products (likely used in orders):", err.message);
            console.log("Attempting upsert instead...");
        }

        let count = 0;
        let updatedCount = 0;
        for (const p of data) {
            // Remove ID if present to let DB auto-increment generate new ones (or keep if we want to try preserving)
            // Ideally we preserve IDs? LOCAL IDs might clash with REMOTE IDs.
            // But if we wiped, we can try to re-use IDs if they are in backup?
            // "p" comes from export, which usually includes IDs? 
            // My export script captured: title, description... (did I match IDs?)
            // Export script: title, description, price, originalPrice, category, sizes, image, images, imageHash, stockQuantity, variants
            // NO IDs were exported. So new IDs will be generated.

            // Standard Create (since we wiped)
            // If wipe failed, this will duplicate. So let's stick to findOrCreate logic BUT fix the mystery bug
            // Actually, findOrCreate is safer if wipe fails.

            const [product, created] = await db.Product.findOrCreate({
                where: { title: p.title },
                defaults: p
            });

            if (created) {
                count++;
            } else {
                await product.update(p);
                updatedCount++;
            }
        }

        console.log(`Import complete. Created ${count} new, Updated ${updatedCount} existing products.`);

        const finalCount = await db.Product.count();
        console.log(`FINAL DATABASE COUNT: ${finalCount} products.`);
    } catch (e) {
        console.error('Import error:', e);
    }
}

module.exports = importProducts;

if (require.main === module) {
    importProducts().then(() => {
        try { db.sequelize.close(); } catch (e) { }
    });
}
