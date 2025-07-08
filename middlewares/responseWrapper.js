module.exports = (req, res, next) => {
    res.sendSuccess = (data, statusCode = 200) => {
        if (!data) {
            return  res.status(statusCode).json({
                status: 1,
            });
        }
        return  res.status(statusCode).json({
            data,
            status: 1,
        });
    };
    next();
};