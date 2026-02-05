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
            await db.Product.destroy({ where: {}, truncate: false });
            console.log("Old products cleared.");
        } catch (err) {
            console.error("Could not clear products (likely used in orders):", err.message);
        }

        console.log("Bulk creating products (duplicates included)...");

        try {
            const createdProducts = await db.Product.bulkCreate(data);
            console.log(`Import complete. Bulk created ${createdProducts.length} products.`);
        } catch (err) {
            console.error("Bulk create failed, trying fallback loop:", err.message);
            // Fallback: create one by one
            let count = 0;
            for (const p of data) {
                try {
                    await db.Product.create(p);
                    count++;
                } catch (e) { console.error("Create error:", e.message); }
            }
            console.log(`Fallback create: ${count} products.`);
        }

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
