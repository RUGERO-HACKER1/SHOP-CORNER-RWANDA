const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = require('../models');

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../../mr');
const DEST_DIR = path.resolve(__dirname, '../../frontend/public/products');
const DB_CONNECT_RETRIES = 5;

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    console.log(`Creating destination directory: ${DEST_DIR}`);
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const importProducts = async () => {
    try {
        console.log('Starting product import...');

        // Read files from source directory
        const files = fs.readdirSync(SOURCE_DIR).filter(file => {
            return /\.(jpg|jpeg|png|webp)$/i.test(file);
        });

        console.log(`Found ${files.length} images in ${SOURCE_DIR}`);

        if (files.length === 0) {
            console.log('No images found. Exiting.');
            process.exit(0);
        }

        // Product Metadata Generators
        const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes', 'Bags'];
        const adjectives = ['Modern', 'Elegant', 'Casual', 'Chic', 'Urban', 'Classic', 'Trendy', 'Stylish', 'Premium', 'Exclusive'];

        const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const getRandomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

        let addedCount = 0;
        let skippedCount = 0;

        for (const [index, file] of files.entries()) {
            const sourcePath = path.join(SOURCE_DIR, file);

            // Generate a safe unique filename to avoid overwrites if names clash
            // We keep the original extension
            const ext = path.extname(file);
            const cleanName = path.basename(file, ext).replace(/[^a-zA-Z0-9]/g, '_');
            const newFileName = `mr_${cleanName}_${index}${ext}`;
            const destPath = path.join(DEST_DIR, newFileName);

            // Copy file
            // Using copyFileSync to be simple and synchronous for this script
            try {
                fs.copyFileSync(sourcePath, destPath);
            } catch (err) {
                console.error(`Failed to copy ${file}:`, err.message);
                continue;
            }

            const category = getRandomElement(categories);
            const adjective = getRandomElement(adjectives);

            // Construct Product Data
            const productData = {
                title: `${adjective} ${category} ${index + 1}`,
                description: `A ${adjective.toLowerCase()} addition to your wardrobe. Perfect for any occasion in Kigali. High quality material and comfortable fit.`,
                price: getRandomPrice(15000, 85000),
                originalPrice: Math.random() > 0.7 ? getRandomPrice(90000, 120000) : null, // 30% chance of being on sale
                image: `/products/${newFileName}`,
                category: category,
                sizes: ['S', 'M', 'L', 'XL'], // Standard sizes
                stockQuantity: getRandomPrice(5, 100), // Random stock
                imageHash: null // Will be auto-filled by system later if needed
            };

            // Database Insertion
            // We use findOrCreate to avoid duplicate entries if script is run multiple times
            // However, since we generate new filenames with indices, unique constraint might be tricky 
            // if we run it again with same files but different generated names.
            // For now, we trust the 'mr_' prefix and index.

            // Actually, let's just create. If we want idempotency on a second run, we'd need a way to track source files.
            // Given the user just wants to "add" them, simple creation is likely fine. 
            // To be safer against re-runs, we could check if a product with this specific image path exists.

            const existing = await db.Product.findOne({ where: { image: productData.image } });

            if (!existing) {
                await db.Product.create(productData);
                console.log(`[+] Added: ${productData.title}`);
                addedCount++;
            } else {
                console.log(`[~] Skipped (Exists): ${productData.title}`);
                skippedCount++;
            }
        }

        console.log(`\nImport Complete!`);
        console.log(`Added: ${addedCount}`);
        console.log(`Skipped: ${skippedCount}`);
        console.log(`Total Scanned: ${files.length}`);

    } catch (err) {
        console.error('Fatal Error during import:', err);
    }
};

// Connect and Run
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connected.');
        return importProducts();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })
    .finally(() => {
        // Allow time for pending logs/operations if any (though unlikely with await)
        setTimeout(() => process.exit(), 1000);
    });
