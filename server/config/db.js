const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/seiasia';
const client = new MongoClient(uri);

let db = null;

async function connect() {
    try {
        await client.connect();
        db = client.db('SEIASIA');
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

async function getDb() {
    if (!db) {
        await connect();
    }
    return db;
}

module.exports = { getDb };

