require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Attempting to connect with family: 4...');
        const conn = await mongoose.connect(uri, {
            family: 4,
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
};

testConnection();
