const db = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected...');

        await db.sequelize.sync({ force: true });
        console.log('Database synced.');

        // Create Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        await db.User.create({
            name: 'Admin User',
            email: 'admin@shein.com',
            password: adminPassword,
            role: 'admin'
        });
        console.log('Admin User Created: admin@shein.com / admin123');

        // Products Data
        const fs = require('fs');
        const path = require('path');
        const productsDir = path.join(__dirname, '../frontend/public/products');

        let imageFiles = [];
        try {
            imageFiles = fs.readdirSync(productsDir).filter(file =>
                file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.webp')
            );
        } catch (err) {
            console.warn('Could not find products directory, using fallbacks if available.');
        }

        const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes', 'Bags'];
        const productTitles = [
            'Vintage Floral Maxi', 'Silk Satin Blouse', 'High-Waist Denim', 'Double-Breasted Blazer',
            'Leather Crossbody', 'Canvas Sneakers', 'Knit Oversized Sweater', 'Pleated Midi Skirt',
            'Boho Chic Sandals', 'Quilted Puffer Jacket', 'Classic White Tee', 'Wide Leg Trousers'
        ];

        const products = [];

        if (imageFiles.length > 0) {
            imageFiles.forEach((file, index) => {
                const category = categories[index % categories.length];
                const baseTitle = productTitles[index % productTitles.length];
                const sizes = ['S', 'M', 'L', 'XL'];
                const stockQuantity = Math.floor(Math.random() * 50) + 10;

                // Create sample variants
                const variants = sizes.map(size => ({
                    size,
                    color: index % 2 === 0 ? 'Black' : 'White',
                    stock: Math.floor(stockQuantity / sizes.length)
                }));

                products.push({
                    title: `${baseTitle} ${index + 1}`,
                    description: `Premium quality ${category.toLowerCase()} item featuring modern design and comfortable fit. Perfect for everyday wear or special occasions.`,
                    price: Math.floor(5000 + Math.random() * 45000),
                    originalPrice: Math.floor(60000 + Math.random() * 20000),
                    image: `/products/${file}`,
                    category: category,
                    sizes: sizes,
                    stockQuantity: stockQuantity,
                    variants: variants
                });
            });
        } else {
            // Fallback for development
            for (let i = 0; i < 20; i++) {
                products.push({
                    title: `Trendy Item #${i + 1}`,
                    description: `This is a high quality product description for item ${i + 1}.`,
                    price: parseFloat((10 + Math.random() * 50).toFixed(2)),
                    originalPrice: parseFloat((60 + Math.random() * 20).toFixed(2)),
                    image: `https://placehold.co/400x500/pink/white?text=Product+${i + 1}`,
                    category: categories[Math.floor(Math.random() * categories.length)],
                    sizes: ['S', 'M', 'L']
                });
            }
        }

        await db.Product.bulkCreate(products);
        console.log(`${products.length} Products seeded successfully.`);
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
