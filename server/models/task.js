import { getDb } from "../config/db";


export default class Task {
    static getCollection() {
        const db = getDb()
        const collection = db.collection('tasks')
        return collection
    }
}