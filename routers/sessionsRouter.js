const Router = require('express');
const sessionsController = require('../controllers/sessionsController');
const router = new Router;

router.post('/',sessionsController.loginUser);


module.exports = router;