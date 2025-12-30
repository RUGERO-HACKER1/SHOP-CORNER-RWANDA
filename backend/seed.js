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
        const products = [
            {
                title: 'Floral Print Flare Dress',
                description: 'Elegant V-neck floral print dress suitable for summer parties.',
                price: 18.99,
                originalPrice: 24.99,
                image: 'https://res.cloudinary.com/dgyuzutq1/image/upload/v1/samples/people/smiling-man?_a=BAAAROB6', // Using default Cloudinary sample for stability
                category: 'Dresses',
                sizes: ['S', 'M', 'L']
            },
            {
                title: 'Solid Rib-Knit Crop Top',
                description: 'Basic rib-knit crop top matching directly with high-waist jeans.',
                price: 5.99,
                originalPrice: 8.00,
                image: 'https://res.cloudinary.com/dgyuzutq1/image/upload/v1/samples/people/kitchen-bar.jpg',
                category: 'Tops',
                sizes: ['XS', 'S', 'M', 'L']
            },
            {
                title: 'High Waist Ripped Skinny Jeans',
                description: 'Stretchy skinny jeans with trendy ripped details.',
                price: 22.49,
                originalPrice: 28.00,
                image: 'https://res.cloudinary.com/dgyuzutq1/image/upload/v1/samples/ecommerce/shoes.png',
                category: 'Bottoms',
                sizes: ['XS', 'S', 'M', 'L', 'XL']
            },
            // ... Adding more to reach ~20 items mock
        ];

        // Generate more products algorithmically for volume
        const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
        for (let i = 0; i < 17; i++) {
            products.push({
                title: `Trendy Item #${i + 1}`,
                description: `This is a high quality product description for item ${i + 1}.`,
                price: parseFloat((10 + Math.random() * 50).toFixed(2)),
                originalPrice: parseFloat((60 + Math.random() * 20).toFixed(2)),
                image: `https://placehold.co/400x500/pink/white?text=Front+${i + 1}`,
                category: categories[Math.floor(Math.random() * categories.length)],
                sizes: ['S', 'M', 'L']
            });
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
