import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
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

export async function getDb() {
    if (!db) {
        await connect();
    }
    return db;
}

export async function closeConnection() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}