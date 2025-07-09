const Router = require('express')
const router = new Router
const moviesRouter = require('./moviesRouter')
const usersRouter = require('./usersRouter')
const sessionsRouter = require('./sessionsRouter')
const authCheck = require('../middlewares/authCheck')

router.use('/users', usersRouter)
router.use('/movies', authCheck, moviesRouter)
router.use('/sessions', sessionsRouter)



module.exports = router