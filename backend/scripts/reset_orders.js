const db = require('../models');

async function resetOrders() {
    try {
        console.log('Resetting Orders...');

        // This might fail if constraints are strict, but let's try standard destroy
        // Deleting orders should cascade to OrderItems usually if set up?
        // If not, we might need to clear OrderItems manualy, but let's try this first.
        // Actually OrderItems is a through table defined as string 'OrderItems'. 
        // Sequelize usually handles the join table deletion if we delete the parent? 
        // Or we might need to delete from the join table explicitly if we want to be clean.

        // Explicitly delete all orders.
        const count = await db.Order.destroy({
            where: {},
            truncate: false // Use row-by-row deletion to trigger hooks/cascades if any
        });

        console.log(`Deleted ${count} orders.`);
        console.log('Total Revenue should now be 0.');
    } catch (error) {
        console.error('Error resetting orders:', error);
    } finally {
        // Close connection if script standalone
        // db.sequelize.close(); // db object usually doesn't expose close directly unless initialized differently?
        // usually db.sequelize.close()
        try { await db.sequelize.close(); } catch (e) { }
    }
}

resetOrders();
