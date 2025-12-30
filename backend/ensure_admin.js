const db = require('./models');
const bcrypt = require('bcryptjs');

const ensureAdmin = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected...');

        const email = 'admin@shein.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.User.findOne({ where: { email } });

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            await user.save();
            console.log('Admin user updated.');
        } else {
            await db.User.create({
                name: 'Admin User',
                email: email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created.');
        }
        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

ensureAdmin();
