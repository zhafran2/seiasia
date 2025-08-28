const { getDb } = require('./config/db');

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        const db = await getDb();
        console.log('✅ MongoDB connection successful!');
        console.log('Database name:', db.databaseName);
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();

