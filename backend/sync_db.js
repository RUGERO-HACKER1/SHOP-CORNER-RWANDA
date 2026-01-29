const db = require('./models');

const sync = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected...');
        // alter: true adds missing columns without dropping tables
        await db.sequelize.sync({ alter: true });
        console.log('Database synced successfully (Alter).');

        // AUTO-SEED if needed
        const seed = require('./seed');
        await seed();

        process.exit();
    } catch (err) {
        console.error('Sync error:', err);
        process.exit(1);
    }
};

sync();
