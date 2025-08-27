export const validateUserRegistration = (req, res, next) => {
    const { username, email, password } = req.body;

    const errors = [];

    if (!username || username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateTask = (req, res, next) => {
    const { title, description, status, due_date } = req.body;

    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    }

    if (title && title.trim().length > 100) {
        errors.push('Title must be less than 100 characters');
    }

    if (description && description.length > 500) {
        errors.push('Description must be less than 500 characters');
    }

    if (status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        errors.push('Status must be one of: pending, in_progress, completed, cancelled');
    }

    if (due_date) {
        const dueDate = new Date(due_date);
        if (isNaN(dueDate.getTime())) {
            errors.push('Invalid due date format');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};
