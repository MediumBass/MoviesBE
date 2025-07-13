function errorHandler(err, req, res) {
    const value = err.value || 'Unknown error';
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ errors: [ {'value':value,'msg':err.message}] });
}

module.exports = errorHandler;