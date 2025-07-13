const Router = require('express');
const sessionsController = require('../controllers/sessionsController');
const router = new Router;
const inputValidation = require('../middlewares/inputValidation');
const {body} = require('express-validator');

const sessionValidation = [
    body('email').trim().isEmail()
        .withMessage('Please provide a valid email'),
    body('password').trim().isLength({min: 1, max: 20})
        .withMessage('Please provide a valid password')
];

router.post('/', ...sessionValidation, inputValidation, sessionsController.loginUser);


module.exports = router;