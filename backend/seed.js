const db = require('./models');
const bcrypt = require('bcryptjs');

const imageFiles = [
    "1688_image_share_00fd72eb0b77844eaebd4c1f1e5486f5.jpg.jpeg",
    "1688_image_share_0640a7086ecfb46bef6070992e12f32a.jpg.jpeg",
    "1688_image_share_077da0a9225e1f657bfa92fede15526a.jpg.jpeg",
    "1688_image_share_08be20a33e3de81f897b9a1e6ac44eb3.jpg.jpeg",
    "1688_image_share_0eadaa09a3780d4865e884512dd8a763.jpg.jpeg",
    "1688_image_share_0f2565000bdfaa140f46fa3cfa2d1f4b.jpg.jpeg",
    "1688_image_share_106e1631e02d6e9b50eed28f374e79d7.jpg.jpeg",
    "1688_image_share_13741cf1be340ca6f56ae6cb3359260d.jpg.jpeg",
    "1688_image_share_1447c9a341d4a0cb37663efd88317881.jpg.jpeg",
    "1688_image_share_144b3ea5ca27c00115258a41e7d1d82a.jpg.jpeg",
    "1688_image_share_177e205382cdd5390bdc6be5a8283dc6.jpg.jpeg",
    "1688_image_share_1ea23752a1751fa69f5f14fb8bcdc372.jpg.jpeg",
    "1688_image_share_20548b73f93f19c8de51051be13d6d37.jpg.jpeg",
    "1688_image_share_21008c3d11d735f7272f240f2492314d.jpg.jpeg",
    "1688_image_share_2ab43c500b06fccdd56dcf110a974d86.jpg.jpeg",
    "1688_image_share_2d0052f29b77663c3c0e50732b977ef5.jpg.jpeg",
    "1688_image_share_2e3cc81580bfcb8279568b944c915398.jpg.jpeg",
    "1688_image_share_30e46861dda54c2504cabb9826b01901.jpg.jpeg",
    "1688_image_share_3b04ad8a2ffd638d432292fb58b6b481.jpg.jpeg",
    "1688_image_share_3cc73f2c1b54d0e5823553608b03a2eb.jpg.jpeg",
    "1688_image_share_42b89e05b94646e2b8d09ad2df4d8169.jpg.jpeg",
    "1688_image_share_482229dd806849a82df5192c3c86bf42.jpg.jpeg",
    "1688_image_share_49bfb92beb1dbc19987224aef7d9bfb0.jpg.jpeg",
    "1688_image_share_4af8f200f95d522b231a6553d2b6b2cc.jpg.jpeg",
    "1688_image_share_4d5a3fa7e9a129630acf036dab082882.jpg.jpeg",
    "1688_image_share_4f049e07ccd2984ff705087e25058bd9.jpg.jpeg",
    "1688_image_share_4f91acf2562394436e3cf645140adc12.jpg.jpeg",
    "1688_image_share_5576e5c2cae783e8ac4346e4b24aa396.jpg.jpeg",
    "1688_image_share_55d91e9c5f1b04073fdf51000cfe844a.jpg.jpeg",
    "1688_image_share_5634ef0b9ea2c8ab063f100bae7204e9.jpg.jpeg",
    "1688_image_share_58303c8cdef2b16d9a6099f1fe9899c7.jpg.jpeg",
    "1688_image_share_5b6d4fcdd093af066d028854fb7fb7b9.jpg.jpeg",
    "1688_image_share_65bdade5c6e656e36499d2f1535e61e6.jpg.jpeg",
    "1688_image_share_6ae7d6fa07bac115f0bdf9d7746af88f.jpg.jpeg",
    "1688_image_share_6e56c5ed7b66ce85f4782242118ecaa0.jpg.jpeg",
    "1688_image_share_6f3ae1e8078d1141c6dd2621e66b8296.jpg.jpeg",
    "1688_image_share_73e9c606f8fc0dcc1d2c750215cacc19.jpg.jpeg",
    "1688_image_share_760487f770c73018220af25777cd5573.jpg.jpeg",
    "1688_image_share_81ab078f26e086dba46e415a1d321a55.jpg.jpeg",
    "1688_image_share_81ff2095f11be380e09335fb89006324.jpg.jpeg",
    "1688_image_share_84555ba7e4e4218b5cd58aa22b47fa4b.jpg.jpeg",
    "1688_image_share_8677af4042f1d2ed4ea51d277dbae5df.jpg.jpeg",
    "1688_image_share_8ba26617bd163dc909d9f03a42325c97.jpg.jpeg",
    "1688_image_share_8dea628a447fb32828bd0ecc1985ec84.jpg.jpeg",
    "1688_image_share_916cc354cee52c32fb5cc0c1addd55f5.jpg.jpeg",
    "1688_image_share_994b8aea2ae913bc70a8b6ec5785f2d1.jpg.jpeg",
    "1688_image_share_9a82728d63744baffb630c2a5109787f.jpg.jpeg",
    "1688_image_share_9ee372628fe60c5f91a12c8161a61774.jpg.jpeg",
    "1688_image_share_b07e4136b3523cf3642532e47b0988ca.jpg.jpeg",
    "1688_image_share_b182b0aa770399fb835a8e7254bc4b0a.jpg.jpeg",
    "1688_image_share_b5d6f9316351f96534f6e6cd65c34348.jpg.jpeg",
    "1688_image_share_b82c0acf3235544a4ec530540118fae9.jpg.jpeg",
    "1688_image_share_bdf91f6d3bf39444f8e775d3bb168ffb.jpg.jpeg",
    "1688_image_share_c09c0fba404349d3604443ece620d742.jpg.jpeg",
    "1688_image_share_c0d7b9b38c3ffd57b7169b3f1b5d459b.jpg.jpeg",
    "1688_image_share_c608065312c559d7c929d49f35d7e66c.jpg.jpeg",
    "1688_image_share_c727a9583ebd28ec7245dab668cf8ff9.jpg.jpeg",
    "1688_image_share_caa795750a7bc450ce2a389bf50175cf.jpg.jpeg",
    "1688_image_share_d54e6dada75b78d0a3bf617e440a46d4.jpg.jpeg",
    "1688_image_share_d6a98d1789a252213822d4c8499d61b9.jpg.jpeg",
    "1688_image_share_da1114dbdcc0f52beb4a671c1709d514.jpg.jpeg",
    "1688_image_share_dc21c900476ef09fce833976481046bf.jpg.jpeg",
    "1688_image_share_dcd884ada6d279ac6885f228b470a9d1.jpg.jpeg",
    "1688_image_share_de4864d9aa6a3ad6d656f154c617d89c.jpg.jpeg",
    "1688_image_share_de584e563d5e3c3456458ce15c9f28da.jpg.jpeg",
    "1688_image_share_deae7e304f48f95be74a3cb37cf992c6.jpg.jpeg",
    "1688_image_share_e4ae7bfcb640726f9d70f6583465ed00.jpg.jpeg",
    "1688_image_share_e62f28e05049cc3aca1569b6d6ea9fc6.jpg.jpeg",
    "1688_image_share_e839cdd47a87b675cf93dec3e7e0b09e.jpg.jpeg",
    "1688_image_share_e993d2ca4a6c9856ea7b35beea759ce7.jpg.jpeg",
    "1688_image_share_f0ad6d6a09ba126a8686b2e5dffb2165.jpg.jpeg",
    "1688_image_share_f3d77ded1a1c2acca1a8178ec429e607.jpg.jpeg",
    "1688_image_share_f48dfea0630bb291eecceeb0329ef247.jpg.jpeg",
    "1688_image_share_f536206a2b99f88be229f0e776d10c2e.jpg.jpeg"
];

const seed = async () => {
    try {
        console.log('Seeding process started...');

        // CHECK: Don't seed if products already exist (preserve production data)
        const productCount = await db.Product.count();
        if (productCount > 10) {
            console.log(`Database already has ${productCount} products. Skipping seed.`);
            return;
        }

        console.log('Product count low. Seeding initial data...');

        // Create Admin User if not exists
        const adminEmail = 'admin@shein.com';
        const existingAdmin = await db.User.findOne({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const adminPassword = await bcrypt.hash('admin123', 10);
            await db.User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Admin User Created');
        } else {
            console.log('Admin user already exists.');
        }

        const categories = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes', 'Bags'];
        const productTitles = [
            'Kigali Everyday Tee', 'Nyamirambo Street Hoodie', 'Weekend Market Jeans', 'Downtown Polo Shirt',
            'Evening Date Dress', 'Classic Leather Tote', 'City Walk Sneakers', 'Soft Lounge Joggers',
            'Sunday Brunch Shirt', 'Rainy Season Jacket', 'Smart Office Trousers', 'Holiday Party Top'
        ];

        const products = [];

        imageFiles.forEach((file, index) => {
            const category = categories[index % categories.length];
            const baseTitle = productTitles[index % productTitles.length];
            const sizes = [];
            const stockQuantity = Math.floor(Math.random() * 50) + 10;

            products.push({
                title: `${baseTitle} #${index + 1}`,
                description: `Modern ${category.toLowerCase()} piece designed for Kigali lifestyle – easy to style, comfortable all day, and perfect for both city walks and special events.`,
                price: Math.floor(15000 + Math.random() * 65000),
                originalPrice: null,
                image: `/products/${file}`,
                category: category,
                sizes: sizes,
                stockQuantity: stockQuantity,
                variants: []
            });
        });

        // SMART SEED: Loop and ensure each product exists (Idempotent)
        console.log(`Checking/Seeding ${products.length} products...`);

        let addedCount = 0;
        for (const p of products) {
            const [product, created] = await db.Product.findOrCreate({
                where: { image: p.image }, // Check by unique image filename to avoid dupes
                defaults: p
            });
            if (created) addedCount++;
        }

        console.log(`Seeding complete. Added ${addedCount} new products. Total should be ${products.length}.`);
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

module.exports = seed;

if (require.main === module) {
    db.sequelize.sync({ alter: true }).then(seed).then(() => process.exit());
}
