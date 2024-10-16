const AppError = require("../utils/AppError")

function sendErrorProd(error, res) {
    if (!error.isOperational) {
        console.error('ERROR 💥:', err);

        // Log the error for debugging purposes
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });

    } else {
        return res.status(error.status).json({
            status: error.status,
            message: error.message
        })
    }

}


function sendErrorDev(error, res) {
    return res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    })
}


exports.globalError = (err, req, res, next) => {
    // SETTING DEFAULT VALUES
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // ERROR FOR DEVELOPMENT
    if (process.env.NODE_ENV === "Development") {
        return sendErrorDev(err, res)
    }

    // ERROR FOR PRODUCTION
    if (process.env.NODE_ENV = "Production") {
        return sendErrorProd(err, res)
    }

}