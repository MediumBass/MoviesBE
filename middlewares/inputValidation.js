const {validationResult} = require('express-validator');
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            value: err.value,
            msg: err.msg,
        }));
        return res.status(400).json({errors:formattedErrors});
    }else{
        next();
    }
};