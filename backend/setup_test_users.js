const db = require('./models');
const bcrypt = require('bcryptjs');

async function setupTestUsers() {
    try {
        let admin = await db.User.findOne({ where: { role: 'admin' } });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admin = await db.User.create({
                email: 'admin@shop.rw',
                password: hashedPassword,
                name: 'Shop Admin',
                role: 'admin'
            });
            console.log('Created new admin user: admin@shop.rw / admin123');
        } else {
            console.log(`Existing Admin found: ${admin.email}`);
            console.log('Use password associated with this email or "admin123" if you remember creating it.');
        }

        let user = await db.User.findOne({ where: { role: 'user' } });
        if (!user) {
            const hashedPassword = await bcrypt.hash('user123', 10);
            user = await db.User.create({
                email: 'testuser@gmail.com',
                password: hashedPassword,
                name: 'Test Customer',
                role: 'user'
            });
            console.log('Created new regular user: testuser@gmail.com / user123');
        } else {
            console.log(`Existing User found: ${user.email}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

setupTestUsers();
