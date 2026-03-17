require('dotenv').config();
const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const res = await mongoose.connection.db.collection('projects').updateMany(
            { category: 'Vehicle Sourcing' },
            { $set: { 'metadata.type': 'SUVs' } }
        );
        console.log('Fixed DB successfully!', res);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
