import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db = null 
function connect () {
    client.connect()
  db= client.db('SEIASIA');
    
}

export function getDb() {
    if (!db) {
        connect()
    }

    return db;
}