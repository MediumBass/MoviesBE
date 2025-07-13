module.exports = class HttpError extends Error {
    constructor(message, statusCode = 500, value = null) {
        super(message);
        this.statusCode = statusCode;
        this.value = value;
        Error.captureStackTrace(this, this.constructor);
    }
};