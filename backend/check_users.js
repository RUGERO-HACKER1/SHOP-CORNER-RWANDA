const db = require('./models');

async function checkUsers() {
    try {
        const users = await db.User.findAll({
            attributes: ['id', 'email', 'name', 'role']
        });
        console.log('--- USER LIST ---');
        console.table(users.map(u => u.toJSON()));
        process.exit(0);
    } catch (err) {
        console.error('Error fetching users:', err);
        process.exit(1);
    }
}

checkUsers();
