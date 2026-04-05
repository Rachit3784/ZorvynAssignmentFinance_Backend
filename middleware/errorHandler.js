import fs from 'fs';
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    fs.appendFileSync('error.log', new Date().toISOString() + ': ' + err.stack + '\n');
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value entered',
            error: Object.keys(err.keyValue)
        });
    }

    // Mongoose CastError (invalid ObjectId format)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Resource not found. Invalid: ${err.path}`
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
};
