import { getDb } from "../config/db";


export default class User {
    static getCollection() {
        const db = getDb()
        const collection = db.collection('users')
        return collection
    }
    static async register(payload) {
        const collection = this.getCollection()
        const {username,email,password}= payload
        await collection.insertOne(payload)
        return `You have Successfully registered`
    }
}