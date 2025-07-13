const Router = require('express');
const router = new Router;
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const moviesController = require('../controllers/moviesController');
const inputValidation = require('../middlewares/inputValidation');
const {body, query} = require('express-validator');

const movieValidation =[
    body('title').trim().isLength({min: 1, max: 200})
        .withMessage('No title provided'),
    body('year').isInt({min: 1888, max:new Date().getFullYear()})
        .withMessage('Please provide a valid year from 1888 to current year'),
    body('format').trim().isIn(['DVD', 'Blu-ray', 'VHS'])
        .withMessage('Please provide a valid format from list: DVD, Blu-ray, VHS'),
    body('actors').trim().isArray({min: 1, max: 50})
        .withMessage('Please provide at least one actor'),
    body('actors.*').trim().isLength({min: 1, max: 100})
        .notEmpty().withMessage('Actor name cannot be empty')
        .isString().matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ'’.\- ]+$/u)
        .withMessage('Actor name contains invalid characters')
];
const queryListValidation = [
    query('offset')
        .optional()
        .isInt({ min: 1 }).withMessage('Offset must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 100'),
    query('sort')
        .optional()
        .isIn(['id', 'year', 'title']).withMessage('Please provide a valid format from list: id, year, title'),
    query('order')
        .optional()
        .isIn(['ASC', 'DESC']).withMessage('Order must be ASC or DESC'),
    query('search')
        .optional()
        .isLength({ max: 100 }).withMessage('Search query too long'),
    query('title')
        .optional()
        .isLength({ max: 100 }).withMessage('Title query too long'),
    query('actor')
        .optional()
        .isLength({ max: 100 }).withMessage('Actor query too long'),
];

router.post('/import', upload.single('movies'), moviesController.importMovies);
router.post('/', ...movieValidation, inputValidation, moviesController.createNewMovie);
router.get('/:id',moviesController.getOneMovie);
router.patch('/:id', ...movieValidation, inputValidation, moviesController.updateMovie);
router.delete('/:id',moviesController.deleteMovie);
router.get('/',...queryListValidation, inputValidation, moviesController.getAllMovies);

module.exports = router;