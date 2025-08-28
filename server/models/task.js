const { getDb } = require("../config/db");
const { ObjectId } = require("mongodb");

class Task {
    static async getCollection() {
        const db = await getDb();
        const collection = db.collection('tasks');
        return collection;
    }

    static async create(req, res, next) {
        try {
            const collection = await this.getCollection();
            const { title, description, status, due_date } = req.body;

            const taskData = {
                title,
                description,
                status: status || 'pending',
                due_date: new Date(due_date),
                userId: new ObjectId(req.user._id),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await collection.insertOne(taskData);
            
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                task: { ...taskData, _id: result.insertedId }
            });
        } catch (error) {
            next(error);
        }
    }

    static async findAll(req, res, next) {
        try {
            const collection = await this.getCollection();
            const { page = 1, limit = 10, status, due_date, search } = req.query;
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Build query
            let query = { userId: new ObjectId(req.user._id) };

            // Add status filter
            if (status) {
                query.status = status;
            }

            // Add due date filter
            if (due_date) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (due_date === 'overdue') {
                    query.due_date = { $lt: today };
                } else if (due_date === 'today') {
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    query.due_date = { $gte: today, $lt: tomorrow };
                } else if (due_date === 'upcoming') {
                    query.due_date = { $gte: today };
                }
            }

            // Add search filter
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const tasks = await collection
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .toArray();

            const total = await collection.countDocuments(query);

            res.status(200).json({
                success: true,
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async findById(req, res, next) {
        try {
            const collection = await this.getCollection();
            const task = await collection.findOne({
                _id: new ObjectId(req.params.id),
                userId: new ObjectId(req.user._id)
            });

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                success: true,
                task
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const collection = await this.getCollection();
            const { title, description, status, due_date } = req.body;

            const updateData = {
                updatedAt: new Date()
            };

            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (status !== undefined) updateData.status = status;
            if (due_date !== undefined) updateData.due_date = new Date(due_date);

            const result = await collection.findOneAndUpdate(
                {
                    _id: new ObjectId(req.params.id),
                    userId: new ObjectId(req.user._id)
                },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result.value) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                task: result.value
            });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const collection = await this.getCollection();
            const result = await collection.findOneAndDelete({
                _id: new ObjectId(req.params.id),
                userId: new ObjectId(req.user._id)
            });

            if (!result.value) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
                task: result.value
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Task;