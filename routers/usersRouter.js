const Router = require('express');
const router = new Router;
const userController = require('../controllers/userController');
const {body} = require('express-validator');
const inputValidation = require('../middlewares/inputValidation');

const userValidation = [
    body('email').trim().isEmail()
        .withMessage('Please provide a valid email'),
    body('password').trim().isLength({min: 1, max: 20})
        .withMessage('Please provide a valid password'),
    body('name').trim().isLength({min: 1, max: 20})
        .withMessage('Please provide a valid name')
];

router.post('/', ...userValidation, inputValidation, userController.createUser);

module.exports = router;