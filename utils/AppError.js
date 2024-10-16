class AppError extends Error {
    constructor(statusCode, message) {
        super(message)

        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith("4") ? "Not found" : 'failed'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}
module.exports = AppError;