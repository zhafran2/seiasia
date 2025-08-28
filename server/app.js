const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { requestLogger } = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
