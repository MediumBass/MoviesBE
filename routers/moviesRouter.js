const Router = require('express');
const router = new Router;
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const moviesController = require('../controllers/moviesController');

router.post('/import',upload.single('movies'), moviesController.importMovies);
router.post('/', moviesController.createNewMovie);
router.get('/:id',moviesController.getOneMovie);
router.patch('/:id',moviesController.updateMovie);
router.delete('/:id',moviesController.deleteMovie);
router.get('/',moviesController.getAllMovies);

module.exports = router;