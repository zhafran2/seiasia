import { getDb } from "../config/db";
import { hashPassword, comparePass } from "../helpers/bcrypt.js";
import { signToken } from "../helpers/jwt.js";

export default class User {
    static async getCollection() {
        const db = await getDb();
        const collection = db.collection('users');
        return collection;
    }

    static async register(req, res, next) {
        try {
            const collection = await this.getCollection();
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await collection.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists'
                });
            }

            // Hash password
            const hashedPassword = hashPassword(password);

            // Create user object
            const userData = {
                username,
                email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const result = await collection.insertOne(userData);
            
            // Return user without password
            const { password: _, ...userWithoutPassword } = userData;
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: { ...userWithoutPassword, _id: result.insertedId }
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const collection = await this.getCollection();
            const { email, password } = req.body;

            // Find user by email
            const user = await collection.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Check password
            const isValidPassword = comparePass(password, user.password);

            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT token
            const token = signToken({
                userId: user._id,
                email: user.email,
                username: user.username
            });

            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            next(error);
        }
    }

    static async findById(userId) {
        try {
            const collection = await this.getCollection();
            const user = await collection.findOne({ _id: userId });
            
            if (!user) {
                throw new Error('User not found');
            }

            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const collection = await this.getCollection();
            const user = await collection.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }
}