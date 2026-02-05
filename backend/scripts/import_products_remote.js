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
        console.log(`Found ${data.length} products to import.`);

        let count = 0;
        for (const p of data) {
            // Check for duplicate by image or title to avoid overwriting unique IDs differently
            const [product, created] = await db.Product.findOrCreate({
                where: { title: p.title }, // Use title as unique key for this sync
                defaults: p
            });

            if (created) {
                count++;
            } else {
                // Optional: Update existing?
                // await product.update(p);
            }
        }

        console.log(`Import complete. Added ${count} new products.`);
    } catch (e) {
        console.error('Import error:', e);
    }
    // Do NOT close here if running as module in server
}

module.exports = importProducts;

if (require.main === module) {
    importProducts().then(() => {
        try { db.sequelize.close(); } catch (e) { }
    });
}
